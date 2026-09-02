import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { newId } from "../../common/id";
import { calculatePlatformFee } from "../../common/money";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderMetadata, OrderMetadataItem } from "./order-metadata";

interface LockedTicketTypeRow {
  id: string;
  event_id: string;
  quantity_sold: number;
  quantity_total: number;
  per_order_limit: number | null;
  price_minor: bigint;
  sale_starts_at: Date | null;
  sale_ends_at: Date | null;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly permissions: PermissionsService,
    private readonly audit: AuditService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: dto.eventId } });
      if (!event) throw new NotFoundException("Event not found");
      if (event.status !== "published") {
        throw new BadRequestException("This event is not currently on sale");
      }
      const now = new Date();
      if (now >= event.salesCloseAt) {
        throw new BadRequestException("Ticket sales have closed for this event");
      }

      const items: OrderMetadataItem[] = [];
      let subtotalMinor = 0n;

      for (const item of dto.items) {
        // Row-locked read-then-write to prevent oversell under concurrent checkout.
        // eslint-disable-next-line no-await-in-loop
        const rows = await tx.$queryRaw<LockedTicketTypeRow[]>(
          Prisma.sql`SELECT id, event_id, quantity_sold, quantity_total, per_order_limit, price_minor, sale_starts_at, sale_ends_at
                     FROM ticket_types WHERE id = ${item.ticketTypeId}::uuid FOR UPDATE`,
        );
        const row = rows[0];
        if (!row || row.event_id !== dto.eventId) {
          throw new NotFoundException(`Ticket type ${item.ticketTypeId} not found for this event`);
        }
        if (row.sale_starts_at && now < row.sale_starts_at) {
          throw new BadRequestException(`Sales have not started yet for one of the selected ticket types`);
        }
        if (row.sale_ends_at && now > row.sale_ends_at) {
          throw new BadRequestException(`Sales have ended for one of the selected ticket types`);
        }
        if (row.per_order_limit && item.quantity > row.per_order_limit) {
          throw new BadRequestException(
            `Max ${row.per_order_limit} tickets per order for one of the selected ticket types`,
          );
        }
        if (row.quantity_sold + item.quantity > row.quantity_total) {
          throw new BadRequestException(`Not enough tickets remaining for one of the selected ticket types`);
        }

        const recipients =
          item.recipients && item.recipients.length > 0
            ? item.recipients
            : Array.from({ length: item.quantity }, () => ({
                name: dto.buyerName,
                email: dto.buyerEmail,
                phone: dto.buyerPhone,
              }));
        if (recipients.length !== item.quantity) {
          throw new BadRequestException("Number of recipients must match the ticket quantity");
        }

        // eslint-disable-next-line no-await-in-loop
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { quantitySold: { increment: item.quantity } },
        });

        subtotalMinor += row.price_minor * BigInt(item.quantity);
        items.push({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          unitPriceMinor: row.price_minor.toString(),
          recipients,
        });
      }

      const fee = calculatePlatformFee(
        subtotalMinor,
        this.config.platformFeePercentBps,
        this.config.platformFeeFixedMinor,
      );
      const metadata: OrderMetadata = { items };

      return tx.order.create({
        data: {
          id: newId(),
          eventId: dto.eventId,
          buyerName: dto.buyerName,
          buyerEmail: dto.buyerEmail,
          buyerPhone: dto.buyerPhone,
          channel: dto.channel ?? "direct",
          subtotalMinor: fee.subtotalMinor,
          platformFeeMinor: fee.platformFeeMinor,
          totalMinor: fee.totalMinor,
          metadata: metadata as unknown as Prisma.InputJsonValue,
        },
      });
    });
  }

  async findOne(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tickets: { include: { ticketType: true } },
        transactions: true,
        event: { select: { id: true, title: true, startsAt: true, venueName: true } },
      },
    });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { buyerUserId: userId },
      orderBy: { createdAt: "desc" },
      include: { tickets: true, event: { select: { id: true, title: true, startsAt: true } } },
    });
  }

  async findMyTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { order: { buyerUserId: userId } },
      orderBy: { issuedAt: "desc" },
      include: { event: { select: { id: true, title: true, startsAt: true, venueName: true } }, ticketType: true },
    });
  }

  async listForOrganisation(organisationId: string, userId: string) {
    await this.permissions.assertMembership(userId, organisationId);
    return this.prisma.order.findMany({
      where: { event: { organisationId } },
      orderBy: { createdAt: "desc" },
      include: {
        event: { select: { id: true, title: true, startsAt: true, venueName: true } },
        tickets: { include: { ticketType: true } },
        transactions: true,
      },
    });
  }

  /**
   * Cancels a pending order: releases reserved inventory and marks the order
   * as cancelled. Paid orders must be refunded via WalletsService instead.
   */
  async cancelOrder(orderId: string, userId: string, reason?: string) {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { event: { select: { organisationId: true } } },
      });
      if (!order) throw new NotFoundException("Order not found");

      await this.permissions.assertMembership(userId, order.event.organisationId);

      if (order.status !== "pending") {
        throw new BadRequestException(
          `Cannot cancel an order in status "${order.status}". Paid orders should be refunded instead.`,
        );
      }

      const metadata = order.metadata as unknown as OrderMetadata | null;
      for (const item of metadata?.items ?? []) {
        // eslint-disable-next-line no-await-in-loop
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { quantitySold: { decrement: item.quantity } },
        });
      }

      await tx.order.update({ where: { id: orderId }, data: { status: "cancelled" } });

      await this.audit.log(
        {
          organisationId: order.event.organisationId,
          actorUserId: userId,
          action: "order.cancelled",
          entityType: "order",
          entityId: orderId,
          metadata: reason ? { reason } : undefined,
        },
        tx,
      );
    });

    return this.findOne(orderId);
  }

  /** Gives back reserved inventory for an order that never completed payment. Used by StaleOrderCron. */
  async releaseStaleOrder(orderId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order || order.status !== "pending") return;

      const metadata = order.metadata as unknown as OrderMetadata | null;
      for (const item of metadata?.items ?? []) {
        // eslint-disable-next-line no-await-in-loop
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { quantitySold: { decrement: item.quantity } },
        });
      }
      await tx.order.update({ where: { id: orderId }, data: { status: "failed" } });
    });
  }
}

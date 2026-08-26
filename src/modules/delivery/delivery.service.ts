import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { SigningService } from "../tickets/signing/signing.service";
import { TICKET_DELIVERY_QUEUE, TicketDeliveryJob } from "./delivery.constants";

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
    private readonly signingService: SigningService,
    @InjectQueue(TICKET_DELIVERY_QUEUE) private readonly queue: Queue<TicketDeliveryJob>,
  ) {}

  /** Queues the (email, for now) delivery of a single ticket. Channel defaults to email — see PRD §3.3. */
  async queueTicketEmail(
    ticketId: string,
    opts: { isResend?: boolean; resentBy?: string; resendReason?: string } = {},
  ): Promise<void> {
    const ticket = await this.prisma.ticket.findUniqueOrThrow({ where: { id: ticketId } });
    const delivery = await this.prisma.ticketDelivery.create({
      data: {
        id: newId(),
        ticketId,
        channel: "email",
        destination: ticket.recipientEmail,
        isResend: opts.isResend ?? false,
        resentBy: opts.resentBy,
        resendReason: opts.resendReason,
      },
    });
    await this.queue.add(
      "send",
      { ticketDeliveryId: delivery.id },
      { attempts: 5, backoff: { type: "exponential", delay: 5000 } },
    );
  }

  /** PRD §3.6: resend to an event's full customer list. */
  async resendAllForEvent(organisationId: string, eventId: string, actorUserId: string, reason?: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrderResendTicket);
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organisationId !== organisationId) throw new NotFoundException("Event not found");

    const tickets = await this.prisma.ticket.findMany({ where: { eventId, status: "valid" }, select: { id: true } });
    for (const ticket of tickets) {
      // eslint-disable-next-line no-await-in-loop
      await this.queueTicketEmail(ticket.id, { isResend: true, resentBy: actorUserId, resendReason: reason });
    }
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "ticket.resend_all",
      entityType: "event",
      entityId: eventId,
      metadata: { count: tickets.length, reason },
    });
    return { queued: tickets.length };
  }

  /** PRD §3.6: resend to individually selected / filtered tickets. */
  async resendSelected(organisationId: string, ticketIds: string[], actorUserId: string, reason?: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrderResendTicket);
    const tickets = await this.prisma.ticket.findMany({ where: { id: { in: ticketIds }, event: { organisationId } } });
    if (tickets.length !== ticketIds.length) {
      throw new NotFoundException("One or more tickets were not found in this organisation");
    }
    for (const ticket of tickets) {
      // eslint-disable-next-line no-await-in-loop
      await this.queueTicketEmail(ticket.id, { isResend: true, resentBy: actorUserId, resendReason: reason });
    }
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "ticket.resend_selected",
      entityType: "order",
      metadata: { ticketIds, reason },
    });
    return { queued: tickets.length };
  }

  /**
   * Explicit, audit-logged escape hatch for a genuinely compromised ticket
   * (integrity doc §8 decision 6) — NOT the default resend behaviour, which
   * always reuses the same QR.
   */
  async regenerateAndVoid(organisationId: string, ticketId: string, actorUserId: string, reason: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrderResendTicket);
    const oldTicket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (
      !oldTicket ||
      (await this.prisma.event.findUnique({ where: { id: oldTicket.eventId } }))?.organisationId !== organisationId
    ) {
      throw new NotFoundException("Ticket not found");
    }
    if (oldTicket.status !== "valid") {
      throw new BadRequestException(`Cannot regenerate a ticket in status "${oldTicket.status}"`);
    }

    const newTicket = await this.prisma.$transaction(async (tx) => {
      await tx.ticket.update({ where: { id: ticketId }, data: { status: "void" } });

      const newTicketId = newId();
      const issuedAt = new Date();
      const { qrCode, signature, signingKeyId } = await this.signingService.signTicket(
        newTicketId,
        oldTicket.eventId,
        issuedAt,
        tx,
      );
      return tx.ticket.create({
        data: {
          id: newTicketId,
          orderId: oldTicket.orderId,
          eventId: oldTicket.eventId,
          ticketTypeId: oldTicket.ticketTypeId,
          recipientName: oldTicket.recipientName,
          recipientEmail: oldTicket.recipientEmail,
          recipientPhone: oldTicket.recipientPhone,
          qrCode,
          signingKeyId,
          signature,
          issuedAt,
        },
      });
    });

    await this.queueTicketEmail(newTicket.id, { isResend: true, resentBy: actorUserId, resendReason: reason });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "ticket.regenerated_and_voided",
      entityType: "ticket",
      entityId: newTicket.id,
      metadata: { oldTicketId: ticketId, reason },
    });
    return newTicket;
  }
}

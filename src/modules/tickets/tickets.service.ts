import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Ticket } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { SigningService } from "./signing/signing.service";
import { newId } from "../../common/id";
import { OrderMetadata } from "../orders/order-metadata";

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly signingService: SigningService,
  ) {}

  /**
   * Ticket lifecycle step 1-2 (integrity doc §7): called once an order's
   * payment is confirmed. Creates + signs one Ticket row per recipient in
   * the order's staged metadata (split delivery, PRD §3.3).
   */
  async issueTicketsForOrder(orderId: string, tx: Prisma.TransactionClient = this.prisma): Promise<Ticket[]> {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
    const metadata = order.metadata as unknown as OrderMetadata | null;
    const tickets: Ticket[] = [];

    for (const item of metadata?.items ?? []) {
      for (const recipient of item.recipients) {
        const ticketId = newId();
        const issuedAt = new Date();
        // eslint-disable-next-line no-await-in-loop
        const { qrCode, signature, signingKeyId } = await this.signingService.signTicket(
          ticketId,
          order.eventId,
          issuedAt,
          tx,
        );
        // eslint-disable-next-line no-await-in-loop
        const ticket = await tx.ticket.create({
          data: {
            id: ticketId,
            orderId,
            eventId: order.eventId,
            ticketTypeId: item.ticketTypeId,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            recipientPhone: recipient.phone,
            qrCode,
            signingKeyId,
            signature,
            issuedAt,
          },
        });
        tickets.push(ticket);
      }
    }
    return tickets;
  }

  async findOne(ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: { select: { id: true, title: true, startsAt: true, venueName: true } }, ticketType: true },
    });
    if (!ticket) throw new NotFoundException("Ticket not found");
    return ticket;
  }
}

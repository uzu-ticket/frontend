import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PspProvider, PaymentMethod } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { TicketsService } from "../tickets/tickets.service";
import { WalletsService } from "../wallets/wallets.service";
import { DeliveryService } from "../delivery/delivery.service";
import { RealtimeEventBus } from "../realtime/realtime-event-bus.service";
import { PAYMENT_PROVIDER, PaymentProvider } from "./providers/payment-provider";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
    private readonly ticketsService: TicketsService,
    private readonly walletsService: WalletsService,
    private readonly deliveryService: DeliveryService,
    private readonly realtime: RealtimeEventBus,
  ) {}

  /** Free/RSVP orders (totalMinor 0n) skip the PSP entirely — see OrdersController.create. */
  async confirmFreeOrder(orderId: string): Promise<void> {
    return this.confirmPayment(orderId);
  }

  async initiateCheckout(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== "pending") {
      throw new BadRequestException(`Order is not payable in status "${order.status}"`);
    }

    return this.paymentProvider.initiate({
      reference: order.id,
      amountMinor: order.totalMinor,
      currency: order.currency,
      email: order.buyerEmail,
    });
  }

  /**
   * Idempotent: the conditional `order.status: pending -> paid` update only
   * succeeds once, so a replayed webhook (or a webhook racing the
   * reconciliation poll) is a safe no-op on the second delivery.
   */
  async confirmPayment(
    orderId: string,
    pspProvider?: PspProvider,
    pspReference?: string,
    paymentMethod?: PaymentMethod,
  ): Promise<void> {
    const newlyConfirmed = await this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.order.updateMany({
        where: { id: orderId, status: "pending" },
        data: { status: "paid" },
      });
      if (updateResult.count === 0) {
        return false; // already processed, or order never existed / wasn't pending
      }

      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { event: true } });

      await this.ticketsService.issueTicketsForOrder(orderId, tx);
      await this.walletsService.creditOrganisationWalletForOrder(
        {
          orderId,
          organisationId: order.event.organisationId,
          subtotalMinor: order.subtotalMinor,
          totalMinor: order.totalMinor,
          currency: order.currency,
          pspProvider,
          pspReference,
          paymentMethod,
        },
        tx,
      );
      return true;
    });

    if (!newlyConfirmed) {
      this.logger.log(`Ignored duplicate/late payment confirmation for order ${orderId}`);
      return;
    }

    const tickets = await this.prisma.ticket.findMany({ where: { orderId } });
    for (const ticket of tickets) {
      // eslint-disable-next-line no-await-in-loop
      await this.deliveryService.queueTicketEmail(ticket.id);
    }

    const order = await this.prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    // Feeds the live sales dashboard (PRD §3.5 "Real-time (<=5s latency)").
    await this.realtime.publish(`event.${order.eventId}.dashboard`, {
      type: "order.paid",
      orderId,
      totalMinor: order.totalMinor.toString(),
      channel: order.channel,
    });

    this.logger.log(`Order ${orderId} confirmed paid, ${tickets.length} ticket(s) issued and queued for delivery`);
  }
}

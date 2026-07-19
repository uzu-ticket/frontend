import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../prisma/prisma.service";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";
import { TICKET_DELIVERY_QUEUE, TicketDeliveryJob } from "./delivery.constants";

@Processor(TICKET_DELIVERY_QUEUE)
export class DeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(DeliveryProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
  ) {
    super();
  }

  async process(job: Job<TicketDeliveryJob>): Promise<void> {
    const delivery = await this.prisma.ticketDelivery.findUnique({
      where: { id: job.data.ticketDeliveryId },
      include: { ticket: { include: { event: true, ticketType: true } } },
    });
    if (!delivery) {
      this.logger.warn(`TicketDelivery ${job.data.ticketDeliveryId} vanished before processing`);
      return;
    }

    try {
      if (delivery.channel !== "email") {
        // SMS/WhatsApp: interface stub only, see providers/sms-whatsapp.stub.ts.
        throw new Error(`Delivery channel "${delivery.channel}" is not implemented yet`);
      }

      const { ticket } = delivery;
      const result = await this.notifications.sendEmail({
        to: delivery.destination,
        subject: `Your ticket for ${ticket.event.title}`,
        html: this.renderTicketEmail(ticket),
      });

      await this.prisma.ticketDelivery.update({
        where: { id: delivery.id },
        data: {
          status: delivery.isResend ? "resent" : "sent",
          providerMessageId: result.providerMessageId,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Delivery ${delivery.id} failed: ${(error as Error).message}`);
      await this.prisma.ticketDelivery.update({ where: { id: delivery.id }, data: { status: "failed" } });
      throw error; // let BullMQ retry per the queue's backoff policy
    }
  }

  private renderTicketEmail(ticket: {
    recipientName: string;
    qrCode: string;
    event: { title: string; startsAt: Date; venueName: string | null };
    ticketType: { name: string };
  }): string {
    return `
      <p>Hi ${ticket.recipientName},</p>
      <p>Here is your ticket for <strong>${ticket.event.title}</strong> (${ticket.ticketType.name}).</p>
      <p>${ticket.event.startsAt.toISOString()}${ticket.event.venueName ? ` — ${ticket.event.venueName}` : ""}</p>
      <p>Present this code at the gate:</p>
      <pre style="font-size:10px;word-break:break-all">${ticket.qrCode}</pre>
    `;
  }
}

import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";

const REMINDER_WINDOWS = [
  { hours: 24, action: "event.sales_close_reminder_24h" },
  { hours: 1, action: "event.sales_close_reminder_1h" },
];

/**
 * PRD §3.2 (US-EVT-1): sales close is where purchases stop and the ticket
 * manifest seals for offline scanner download. This sweep drives both
 * halves of that AC — the seal itself, and the 24h/1h organiser reminders.
 */
@Injectable()
export class EventLifecycleCron {
  private readonly logger = new Logger(EventLifecycleCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sealExpiredManifests(): Promise<void> {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: { status: "published", salesCloseAt: { lte: now }, manifestSealedAt: null },
    });

    for (const event of events) {
      // eslint-disable-next-line no-await-in-loop
      await this.prisma.event.update({
        where: { id: event.id },
        data: { status: "sales_closed", manifestVersion: { increment: 1 }, manifestSealedAt: now },
      });
      // eslint-disable-next-line no-await-in-loop
      await this.audit.log({
        organisationId: event.organisationId,
        action: "event.manifest_sealed",
        entityType: "event",
        entityId: event.id,
      });
      this.logger.log(`Sealed manifest for event ${event.id}`);
    }
  }

  /**
   * sales_closed -> live -> completed. `completed` is what the withdrawals
   * module's PayoutHoldReleaseCron watches for to release risk holds
   * (PRD §3.8: "held until event completion").
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async advanceLifecycleStatuses(): Promise<void> {
    const now = new Date();

    await this.prisma.event.updateMany({
      where: { status: "sales_closed", startsAt: { lte: now } },
      data: { status: "live" },
    });

    const liveEvents = await this.prisma.event.findMany({
      where: { status: "live" },
      select: { id: true, organisationId: true, startsAt: true, endsAt: true },
    });
    for (const event of liveEvents) {
      const completionTime = event.endsAt ?? event.startsAt;
      if (completionTime <= now) {
        // eslint-disable-next-line no-await-in-loop
        await this.prisma.event.update({ where: { id: event.id }, data: { status: "completed" } });
        // eslint-disable-next-line no-await-in-loop
        await this.audit.log({ organisationId: event.organisationId, action: "event.completed", entityType: "event", entityId: event.id });
      }
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendSalesCloseReminders(): Promise<void> {
    const now = Date.now();

    for (const window of REMINDER_WINDOWS) {
      const windowStart = new Date(now + (window.hours * 60 - 5) * 60_000);
      const windowEnd = new Date(now + (window.hours * 60 + 5) * 60_000);

      // eslint-disable-next-line no-await-in-loop
      const events = await this.prisma.event.findMany({
        where: { status: "published", salesCloseAt: { gte: windowStart, lte: windowEnd } },
        include: { organisation: true },
      });

      for (const event of events) {
        // eslint-disable-next-line no-await-in-loop
        const alreadySent = await this.prisma.auditLog.findFirst({
          where: { entityType: "event", entityId: event.id, action: window.action },
        });
        if (alreadySent) continue;

        // eslint-disable-next-line no-await-in-loop
        await this.notifications.sendEmail({
          to: event.organisation.contactEmail,
          subject: `Ticket sales close in ${window.hours}h — ${event.title}`,
          html: `<p>Ticket sales for <strong>${event.title}</strong> close in ${window.hours} hour(s), at ${event.salesCloseAt.toISOString()}.</p>`,
        });
        // eslint-disable-next-line no-await-in-loop
        await this.audit.log({
          organisationId: event.organisationId,
          action: window.action,
          entityType: "event",
          entityId: event.id,
        });
      }
    }
  }
}

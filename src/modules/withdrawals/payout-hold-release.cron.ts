import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";

/** PRD §3.8: risk holds release "until event completion" — see EventLifecycleCron for the completed transition. */
@Injectable()
export class PayoutHoldReleaseCron {
  private readonly logger = new Logger(PayoutHoldReleaseCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async releaseCompletedEventHolds(): Promise<void> {
    const holds = await this.prisma.payoutHold.findMany({
      where: { releasedAt: null, event: { status: "completed" } },
      include: { event: true },
    });

    for (const hold of holds) {
      // eslint-disable-next-line no-await-in-loop
      await this.prisma.$transaction(async (tx) => {
        await tx.wallet.updateMany({
          where: { organisationId: hold.organisationId, ownerType: "organisation" },
          data: { balanceMinor: { increment: hold.amountMinor }, heldMinor: { decrement: hold.amountMinor } },
        });
        await tx.payoutHold.update({ where: { id: hold.id }, data: { releasedAt: new Date() } });
        await this.audit.log(
          {
            organisationId: hold.organisationId,
            action: "wallet.risk_hold_released",
            entityType: "payout_hold",
            entityId: hold.id,
          },
          tx,
        );
      });
    }
    if (holds.length > 0) this.logger.log(`Released ${holds.length} payout hold(s)`);
  }
}

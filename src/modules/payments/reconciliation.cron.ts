import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { PAYMENT_PROVIDER, PaymentProvider } from "./providers/payment-provider";
import { PaymentsService } from "./payments.service";

/**
 * PRD §7.1 risk mitigation: "PSP webhook reliability during on-sale spikes
 * -> reconciliation polling + idempotent order processing." Catches orders
 * whose webhook never arrived (or arrived and was dropped) without waiting
 * for StaleOrderCron to give up and release the inventory.
 */
@Injectable()
export class PaymentReconciliationCron {
  private readonly logger = new Logger(PaymentReconciliationCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async reconcilePendingOrders(): Promise<void> {
    const now = Date.now();
    const oldEnough = new Date(now - 3 * 60_000);
    const staleTimeout = new Date(now - this.config.pendingOrderTimeoutMinutes * 60_000);

    const candidates = await this.prisma.order.findMany({
      where: { status: "pending", createdAt: { lte: oldEnough, gt: staleTimeout } },
      select: { id: true },
    });

    for (const order of candidates) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.paymentProvider.verify(order.id);
        if (result.status === "success") {
          // eslint-disable-next-line no-await-in-loop
          await this.paymentsService.confirmPayment(order.id, "paystack", order.id, result.paymentMethod);
          this.logger.log(`Reconciliation confirmed order ${order.id} via PSP verify`);
        }
      } catch (error) {
        this.logger.warn(`Reconciliation check failed for order ${order.id}: ${(error as Error).message}`);
      }
    }
  }
}

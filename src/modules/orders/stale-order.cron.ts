import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { OrdersService } from "./orders.service";

/**
 * Reservation-on-create (see OrdersService.createOrder) means an abandoned
 * checkout holds inventory hostage until released — this sweep is what
 * gives that inventory back.
 */
@Injectable()
export class StaleOrderCron {
  private readonly logger = new Logger(StaleOrderCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly ordersService: OrdersService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async releaseStaleOrders(): Promise<void> {
    const cutoff = new Date(Date.now() - this.config.pendingOrderTimeoutMinutes * 60_000);
    const stale = await this.prisma.order.findMany({
      where: { status: "pending", createdAt: { lt: cutoff } },
      select: { id: true },
    });
    for (const order of stale) {
      // eslint-disable-next-line no-await-in-loop
      await this.ordersService.releaseStaleOrder(order.id);
    }
    if (stale.length > 0) {
      this.logger.log(`Released ${stale.length} stale pending order(s)`);
    }
  }
}

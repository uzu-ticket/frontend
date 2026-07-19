import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { StaleOrderCron } from "./stale-order.cron";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  imports: [PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService, StaleOrderCron],
  exports: [OrdersService],
})
export class OrdersModule {}

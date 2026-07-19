import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaystackWebhookController } from "./webhook/paystack-webhook.controller";
import { PaymentsService } from "./payments.service";
import { PaymentReconciliationCron } from "./reconciliation.cron";
import { PAYMENT_PROVIDER } from "./providers/payment-provider";
import { PaystackProvider } from "./providers/paystack.provider";
import { TicketsModule } from "../tickets/tickets.module";
import { WalletsModule } from "../wallets/wallets.module";
import { DeliveryModule } from "../delivery/delivery.module";
import { WithdrawalsModule } from "../withdrawals/withdrawals.module";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [TicketsModule, WalletsModule, DeliveryModule, WithdrawalsModule, RealtimeModule],
  controllers: [PaymentsController, PaystackWebhookController],
  providers: [
    PaymentsService,
    PaymentReconciliationCron,
    { provide: PAYMENT_PROVIDER, useClass: PaystackProvider },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}

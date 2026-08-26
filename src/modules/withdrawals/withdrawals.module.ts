import { Module } from "@nestjs/common";
import { WithdrawalsController } from "./withdrawals.controller";
import { WithdrawalsService } from "./withdrawals.service";
import { PayoutHoldReleaseCron } from "./payout-hold-release.cron";
import { PAYOUT_PROVIDER } from "./providers/payout-provider";
import { PaystackPayoutProvider } from "./providers/paystack-payout.provider";
import { AuthModule } from "../auth/auth.module";
import { WalletsModule } from "../wallets/wallets.module";

@Module({
  imports: [AuthModule, WalletsModule],
  controllers: [WithdrawalsController],
  providers: [
    WithdrawalsService,
    PayoutHoldReleaseCron,
    { provide: PAYOUT_PROVIDER, useClass: PaystackPayoutProvider },
  ],
  exports: [WithdrawalsService],
})
export class WithdrawalsModule {}

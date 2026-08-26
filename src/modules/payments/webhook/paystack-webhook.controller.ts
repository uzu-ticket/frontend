import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Request } from "express";
import { createHmac, timingSafeEqual } from "crypto";
import { Public } from "../../../common/decorators/public.decorator";
import { AppConfigService } from "../../../config/app-config.service";
import { PaymentsService } from "../payments.service";
import { WithdrawalsService } from "../../withdrawals/withdrawals.service";

interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    currency: string;
    channel: string;
    status: string;
    reason?: string;
  };
}

@ApiExcludeController()
@Controller("webhooks/paystack")
export class PaystackWebhookController {
  constructor(
    private readonly config: AppConfigService,
    private readonly paymentsService: PaymentsService,
    private readonly withdrawalsService: WithdrawalsService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  async handle(@Req() req: RawBodyRequest<Request>, @Headers("x-paystack-signature") signature?: string) {
    if (!req.rawBody || !signature) {
      throw new BadRequestException("Missing signature");
    }

    const expected = createHmac("sha512", this.config.paystackSecretKey).update(req.rawBody).digest("hex");
    const expectedBuf = Buffer.from(expected, "utf8");
    const signatureBuf = Buffer.from(signature, "utf8");
    if (expectedBuf.length !== signatureBuf.length || !timingSafeEqual(expectedBuf, signatureBuf)) {
      throw new BadRequestException("Invalid signature");
    }

    const event = JSON.parse(req.rawBody.toString("utf8")) as PaystackWebhookEvent;

    if (event.event === "charge.success" && event.data.status === "success") {
      await this.paymentsService.confirmPayment(
        event.data.reference, // == order.id, see PaymentsService.initiateCheckout
        "paystack",
        event.data.reference,
        this.mapChannel(event.data.channel),
      );
    } else if (event.event === "transfer.success") {
      await this.withdrawalsService.confirmPayout(event.data.reference, true); // reference == withdrawal.id
    } else if (event.event === "transfer.failed" || event.event === "transfer.reversed") {
      await this.withdrawalsService.confirmPayout(event.data.reference, false, event.data.reason);
    }

    return { received: true };
  }

  private mapChannel(channel: string): "card" | "bank_transfer" | "ussd" | undefined {
    if (channel === "card") return "card";
    if (channel === "bank_transfer") return "bank_transfer";
    if (channel === "ussd") return "ussd";
    return undefined;
  }
}

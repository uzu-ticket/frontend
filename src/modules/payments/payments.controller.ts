import { Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { PaymentsService } from "./payments.service";

@ApiTags("payments")
@Controller("orders")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Guest checkout continues here after POST /orders — no auth required. */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(":orderId/checkout")
  initiateCheckout(@Param("orderId") orderId: string) {
    return this.paymentsService.initiateCheckout(orderId);
  }
}

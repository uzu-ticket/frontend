import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { WalletsService } from "./wallets.service";
import { RefundOrderDto } from "./dto/refund-order.dto";

@ApiTags("wallets")
@Controller("organisations/:organisationId")
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get("wallet")
  getBalance(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.walletsService.getBalance(organisationId, user.id);
  }

  @Get("wallet/transactions")
  getStatement(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.walletsService.getStatement(organisationId, user.id);
  }

  @Post("orders/:orderId/refund")
  refundOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("orderId") orderId: string,
    @Body() dto: RefundOrderDto,
  ) {
    return this.walletsService.refundOrder(organisationId, orderId, user.id, dto.reason);
  }
}

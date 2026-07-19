import { Body, Controller, Get, Header, Param, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { WithdrawalsService } from "./withdrawals.service";
import { RequestWithdrawalDto } from "./dto/request-withdrawal.dto";

@ApiTags("withdrawals")
@Controller("organisations/:organisationId/withdrawals")
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  request(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: RequestWithdrawalDto,
  ) {
    return this.withdrawalsService.requestWithdrawal(organisationId, user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.withdrawalsService.listForOrg(organisationId, user.id);
  }

  @Get("statement.csv")
  @Header("Content-Type", "text/csv")
  async statement(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const csv = await this.withdrawalsService.exportStatementCsv(organisationId, user.id);
    res.attachment("statement.csv");
    return csv;
  }

  @Get(":withdrawalId")
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("withdrawalId") withdrawalId: string,
  ) {
    return this.withdrawalsService.findOne(organisationId, withdrawalId, user.id);
  }
}

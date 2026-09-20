import { Controller, Get, Header, Param, Query, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@Controller("organisations/:organisationId")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("dashboard")
  getOrgRollup(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.dashboardService.getOrgRollup(organisationId, user.id);
  }

  @Get("events/:eventId/dashboard")
  getEventSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.dashboardService.getEventSummary(organisationId, eventId, user.id);
  }

  @Get("events/:eventId/dashboard/live")
  getEventDayMode(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.dashboardService.getEventDayMode(organisationId, eventId, user.id);
  }

  @Get("reports/sales")
  getSalesReport(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("channel") channel?: string,
  ) {
    return this.dashboardService.getSalesReport(organisationId, user.id, { from, to, channel });
  }

  @Get("reports/sales.csv")
  @Header("Content-Type", "text/csv")
  async exportSalesReport(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Query("channel") channel: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const csv = await this.dashboardService.exportSalesReportCsv(organisationId, user.id, { from, to, channel });
    res.attachment(`organisation-${organisationId}-sales.csv`);
    return csv;
  }

  @Get("events/:eventId/dashboard/export.csv")
  @Header("Content-Type", "text/csv")
  async exportCsv(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const csv = await this.dashboardService.exportEventSalesCsv(organisationId, eventId, user.id);
    res.attachment(`event-${eventId}-sales.csv`);
    return csv;
  }
}

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
  getOrgRollup(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Query("days") days?: string,
    @Query("upcomingTake") upcomingTake?: string,
    @Query("upcomingSkip") upcomingSkip?: string,
    @Query("activityTake") activityTake?: string,
    @Query("activitySkip") activitySkip?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 7;
    const uTake = upcomingTake ? parseInt(upcomingTake, 10) : 10;
    const uSkip = upcomingSkip ? parseInt(upcomingSkip, 10) : 0;
    const aTake = activityTake ? parseInt(activityTake, 10) : 10;
    const aSkip = activitySkip ? parseInt(activitySkip, 10) : 0;
    return this.dashboardService.getOrgRollup(organisationId, user.id, daysNum, uTake, uSkip, aTake, aSkip);
  }

  @Get("dashboard/upcoming-events")
  getUpcomingEvents(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Query("skip") skip?: string,
    @Query("take") take?: string,
  ) {
    const s = skip ? parseInt(skip, 10) : 0;
    const t = take ? parseInt(take, 10) : 10;
    return this.dashboardService.getUpcomingEvents(organisationId, user.id, s, t);
  }

  @Get("dashboard/activities")
  getActivities(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Query("skip") skip?: string,
    @Query("take") take?: string,
  ) {
    const s = skip ? parseInt(skip, 10) : 0;
    const t = take ? parseInt(take, 10) : 10;
    return this.dashboardService.getActivities(organisationId, user.id, s, t);
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

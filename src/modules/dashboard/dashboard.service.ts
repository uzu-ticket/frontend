import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { stringify } from "csv-stringify/sync";
import { PrismaService } from "../../prisma/prisma.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { minorToMajorString } from "../../common/money";

export interface OrgRollup {
  eventCount: number;
  grossRevenueMinor: bigint;
  ordersOverTime: { day: Date; orders: number; revenueMinor: bigint }[];
  upcomingEvents: {
    id: string;
    title: string;
    startsAt: Date;
    venueName: string | null;
    city: string | null;
    status: string;
  }[];
  recentActivities: {
    id: string;
    action: string;
    entityType: string | null;
    createdAt: Date;
    actorName: string | null;
  }[];
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService,
  ) {}

  /** PRD §3.5: tickets sold by type, gross revenue, orders over time, channel attribution, refunds. */
  async getEventSummary(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
    const event = await this.assertEvent(organisationId, eventId);

    const [ticketTypes, revenue, channelGroups, refundedCount, ordersOverTime] = await Promise.all([
      this.prisma.ticketType.findMany({
        where: { eventId },
        select: { id: true, name: true, priceMinor: true, quantitySold: true, quantityTotal: true },
      }),
      this.prisma.order.aggregate({ where: { eventId, status: "paid" }, _sum: { subtotalMinor: true }, _count: true }),
      this.prisma.order.groupBy({ by: ["channel"], where: { eventId, status: "paid" }, _count: true }),
      this.prisma.order.count({ where: { eventId, status: "refunded" } }),
      this.prisma.$queryRaw<{ day: Date; orders: bigint; revenue_minor: bigint }[]>`
        SELECT date_trunc('day', created_at) AS day, count(*)::bigint AS orders, sum(total_minor)::bigint AS revenue_minor
        FROM orders WHERE event_id = ${eventId}::uuid AND status = 'paid'
        GROUP BY 1 ORDER BY 1`,
    ]);

    return {
      eventId,
      eventTitle: event.title,
      eventStartsAt: event.startsAt,
      eventEndsAt: event.endsAt,
      eventVenueName: event.venueName,
      eventVenueAddress: event.venueAddress,
      eventCity: event.city,
      eventState: event.state,
      eventCountry: event.country,
      ticketsSoldByType: ticketTypes,
      grossRevenueMinor: revenue._sum.subtotalMinor ?? 0n,
      paidOrderCount: revenue._count,
      channelAttribution: Object.fromEntries(channelGroups.map((g) => [g.channel, g._count])),
      refundedOrderCount: refundedCount,
      ordersOverTime: ordersOverTime.map((r) => ({
        day: r.day,
        orders: Number(r.orders),
        revenueMinor: r.revenue_minor,
      })),
    };
  }

  async getOrgRollup(organisationId: string, userId: string): Promise<OrgRollup> {
    await this.permissions.assertMembership(userId, organisationId);
    const [events, revenue, ordersOverTime, upcomingEvents, recentActivities] = await Promise.all([
      this.prisma.event.count({ where: { organisationId } }),
      this.prisma.order.aggregate({
        where: { event: { organisationId }, status: "paid" },
        _sum: { subtotalMinor: true },
      }),
      this.prisma.$queryRaw<{ day: Date; orders: bigint; revenue_minor: bigint }[]>`
        SELECT date_trunc('day', o.created_at) AS day, count(*)::bigint AS orders, sum(o.total_minor)::bigint AS revenue_minor
        FROM orders o
        JOIN events e ON o.event_id = e.id
        WHERE e.organisation_id = ${organisationId}::uuid AND o.status = 'paid'
        GROUP BY 1 ORDER BY 1`,
      this.prisma.event.findMany({
        where: { organisationId, status: { in: ["published", "sales_closed", "live"] }, startsAt: { gt: new Date() } },
        select: { id: true, title: true, startsAt: true, venueName: true, city: true, status: true },
        orderBy: { startsAt: "asc" },
        take: 3,
      }),
      this.prisma.auditLog.findMany({
        where: { organisationId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, action: true, entityType: true, createdAt: true, actor: { select: { fullName: true } } },
      }),
    ]);

    return {
      eventCount: events,
      grossRevenueMinor: revenue._sum.subtotalMinor ?? 0n,
      ordersOverTime: ordersOverTime.map((r) => ({
        day: r.day,
        orders: Number(r.orders),
        revenueMinor: r.revenue_minor,
      })),
      upcomingEvents: upcomingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        startsAt: e.startsAt,
        venueName: e.venueName,
        city: e.city,
        status: e.status,
      })),
      recentActivities: recentActivities.map((a) => ({
        id: a.id,
        action: a.action,
        entityType: a.entityType,
        createdAt: a.createdAt,
        actorName: a.actor?.fullName ?? null,
      })),
    };
  }

  async getSalesReport(
    organisationId: string,
    userId: string,
    filters: { from?: string; to?: string; channel?: string } = {},
  ) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
    const orderFilter = {
      status: "paid" as const,
      ...(filters.from || filters.to
        ? {
            createdAt: {
              ...(filters.from ? { gte: new Date(filters.from) } : {}),
              ...(filters.to ? { lte: new Date(filters.to) } : {}),
            },
          }
        : {}),
      ...(filters.channel && filters.channel !== "all" ? { channel: filters.channel as "direct" } : {}),
    };
    const [events, salesOverTime, refunds] = await Promise.all([
      this.prisma.event.findMany({
        where: { organisationId },
        orderBy: { startsAt: "desc" },
        select: {
          id: true,
          title: true,
          startsAt: true,
          ticketTypes: { select: { quantitySold: true, priceMinor: true } },
          orders: { where: orderFilter, select: { id: true, subtotalMinor: true } },
        },
      }),
      this.prisma.$queryRaw<{ day: Date; orders: bigint; revenue_minor: bigint }[]>`
        SELECT date_trunc('day', o.created_at) AS day, count(*)::bigint AS orders, sum(o.subtotal_minor)::bigint AS revenue_minor
        FROM orders o JOIN events e ON o.event_id = e.id
        WHERE e.organisation_id = ${organisationId}::uuid AND o.status = 'paid'
          ${filters.from ? Prisma.sql`AND o.created_at >= ${new Date(filters.from)}` : Prisma.empty}
          ${filters.to ? Prisma.sql`AND o.created_at <= ${new Date(filters.to)}` : Prisma.empty}
          ${filters.channel && filters.channel !== "all" ? Prisma.sql`AND o.channel = ${filters.channel}` : Prisma.empty}
        GROUP BY 1 ORDER BY 1`,
      this.prisma.order.aggregate({
        where: { event: { organisationId }, ...orderFilter, status: "refunded" },
        _sum: { subtotalMinor: true },
      }),
    ]);
    const eventPerformance = events.map((event) => ({
      id: event.id,
      name: event.title,
      date: event.startsAt,
      ticketsSold: event.ticketTypes.reduce((sum, type) => sum + type.quantitySold, 0),
      orders: event.orders.length,
      grossRevenueMinor: event.orders.reduce((sum, order) => sum + order.subtotalMinor, 0n),
    }));
    const grossRevenueMinor = eventPerformance.reduce((sum, event) => sum + event.grossRevenueMinor, 0n);
    return {
      grossRevenueMinor,
      ticketsSold: eventPerformance.reduce((sum, event) => sum + event.ticketsSold, 0),
      orders: eventPerformance.reduce((sum, event) => sum + event.orders, 0),
      refundsMinor: refunds._sum.subtotalMinor ?? 0n,
      eventPerformance,
      salesOverTime: salesOverTime.map((row) => ({
        day: row.day,
        orders: Number(row.orders),
        revenueMinor: row.revenue_minor,
      })),
    };
  }

  async exportSalesReportCsv(
    organisationId: string,
    userId: string,
    filters: { from?: string; to?: string; channel?: string } = {},
  ): Promise<string> {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
    const report = await this.getSalesReport(organisationId, userId, filters);
    return stringify(
      report.eventPerformance.map((event) => ({
        event: event.name,
        date: event.date.toISOString(),
        tickets_sold: event.ticketsSold,
        orders: event.orders,
        gross_revenue_minor: event.grossRevenueMinor.toString(),
      })),
      { header: true },
    );
  }

  /** PRD §3.5 event-day mode: live scan count vs sold, gate throughput, duplicate-attempt alerts. */
  async getEventDayMode(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
    await this.assertEvent(organisationId, eventId);

    const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
    const [admittedCount, soldAgg, recentScanCount, duplicateAlerts] = await Promise.all([
      this.prisma.ticketScan.count({ where: { eventId, result: "admitted" } }),
      this.prisma.ticketType.aggregate({ where: { eventId }, _sum: { quantitySold: true } }),
      this.prisma.ticketScan.count({ where: { eventId, scannedAt: { gte: fiveMinAgo } } }),
      this.prisma.ticketScan.findMany({
        where: { eventId, isConflict: true },
        orderBy: { scannedAt: "desc" },
        take: 20,
        include: { scannerDevice: { select: { deviceLabel: true } } },
      }),
    ]);

    return {
      eventId,
      admittedCount,
      soldCount: soldAgg._sum.quantitySold ?? 0,
      gateThroughputLast5Min: recentScanCount,
      duplicateAlerts,
    };
  }

  async exportEventSalesCsv(organisationId: string, eventId: string, userId: string): Promise<string> {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
    const ticketTypes = await this.prisma.ticketType.findMany({ where: { eventId } });
    const rows = ticketTypes.map((t) => ({
      ticket_type: t.name,
      price: minorToMajorString(t.priceMinor, t.currency),
      quantity_sold: t.quantitySold,
      quantity_total: t.quantityTotal,
      gross_revenue: minorToMajorString(t.priceMinor * BigInt(t.quantitySold), t.currency),
    }));
    return stringify(rows, { header: true });
  }

  private async assertEvent(organisationId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organisationId !== organisationId) throw new NotFoundException("Event not found");
    return event;
  }
}

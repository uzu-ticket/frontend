import { Injectable, NotFoundException } from "@nestjs/common";
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

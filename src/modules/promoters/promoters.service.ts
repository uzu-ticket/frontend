import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { CreatePromoterLinkDto } from "./dto/create-promoter-link.dto";

@Injectable()
export class PromotersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService,
  ) {}

  private async assertOrgAccess(organisationId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
  }

  private formatRate(type: string, value: bigint): string {
    if (type === "percentage") {
      return `${Number(value)}%`;
    }

    const amount = Number(value) / 100;
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/ticket`;
  }

  private statusFromCommission(status: string): "Completed" | "Pending" | "Cancelled" {
    if (status === "paid") return "Completed";
    if (status === "accrued" || status === "payable") return "Pending";
    return "Cancelled";
  }

  private aggregateStatus(commissions: { status: string }[]): "Completed" | "Pending" | "Cancelled" {
    const active = commissions.filter((commission) => commission.status !== "reversed");

    if (active.length === 0) return "Cancelled";
    if (active.every((commission) => commission.status === "paid")) return "Completed";
    return "Pending";
  }

  private expiryDate(expiration: CreatePromoterLinkDto["expiration"], eventEndsAt: Date | null) {
    if (!expiration || expiration === "never") return null;
    if (expiration === "event-end") return eventEndsAt;

    const days = expiration === "7days" ? 7 : 30;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private mapLink(link: any) {
    return {
      id: link.id,
      code: link.code,
      clicks: link.clicks,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      event: {
        id: link.eventPromoter.event.id,
        title: link.eventPromoter.event.title,
        startsAt: link.eventPromoter.event.startsAt,
        endsAt: link.eventPromoter.event.endsAt,
        venueName: link.eventPromoter.event.venueName,
        venueAddress: link.eventPromoter.event.venueAddress,
        city: link.eventPromoter.event.city,
        state: link.eventPromoter.event.state,
        country: link.eventPromoter.event.country,
      },
      promoter: {
        name: link.eventPromoter.user.fullName || link.eventPromoter.user.email,
        email: link.eventPromoter.user.email,
      },
      commissionType: link.eventPromoter.commissionType === "fixed_per_ticket" ? "fixed" : "percentage",
      commissionValue:
        link.eventPromoter.commissionType === "fixed_per_ticket"
          ? Number(link.eventPromoter.commissionValue) / 100
          : Number(link.eventPromoter.commissionValue),
      ticketType: link.eventPromoter.ticketType?.name ?? "All ticket types",
    };
  }

  async createLink(organisationId: string, userId: string, dto: CreatePromoterLinkDto) {
    await this.assertOrgAccess(organisationId, userId);

    const event = await this.prisma.event.findFirst({
      where: { id: dto.eventId, organisationId },
      select: { id: true, startsAt: true, endsAt: true },
    });
    if (!event) throw new NotFoundException("Event not found");

    const commissionType = dto.commissionType === "fixed" ? "fixed_per_ticket" : "percentage";
    const commissionValue =
      commissionType === "fixed_per_ticket"
        ? BigInt(Math.round(dto.commissionValue * 100))
        : BigInt(Math.round(dto.commissionValue));
    const expiresAt = this.expiryDate(dto.expiration, event.endsAt);

    const link = await this.prisma.$transaction(async (tx) => {
      const eventPromoter = await tx.eventPromoter.upsert({
        where: { eventId_userId: { eventId: event.id, userId } },
        update: { status: "active", commissionType, commissionValue },
        create: {
          id: newId(),
          eventId: event.id,
          userId,
          invitedBy: userId,
          status: "active",
          commissionType,
          commissionValue,
        },
      });

      return tx.promoterLink.create({
        data: {
          id: newId(),
          eventPromoterId: eventPromoter.id,
          code: `p-${newId().replaceAll("-", "").slice(0, 12)}`,
          expiresAt,
        },
        include: {
          eventPromoter: {
            include: {
              event: {
                select: {
                  id: true,
                  title: true,
                  startsAt: true,
                  endsAt: true,
                  venueName: true,
                  venueAddress: true,
                  city: true,
                  state: true,
                  country: true,
                },
              },
              user: { select: { fullName: true, email: true } },
              ticketType: { select: { name: true } },
            },
          },
        },
      });
    });

    return this.mapLink(link);
  }

  async getLink(organisationId: string, userId: string, linkId: string) {
    await this.assertOrgAccess(organisationId, userId);

    const link = await this.prisma.promoterLink.findFirst({
      where: { id: linkId, eventPromoter: { event: { organisationId } } },
      include: {
        eventPromoter: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startsAt: true,
                endsAt: true,
                venueName: true,
                venueAddress: true,
                city: true,
                state: true,
                country: true,
              },
            },
            user: { select: { fullName: true, email: true } },
            ticketType: { select: { name: true } },
          },
        },
      },
    });

    if (!link) throw new NotFoundException("Promoter link not found");
    return this.mapLink(link);
  }

  async acceptInvitation(organisationId: string, userId: string, linkId: string) {
    const link = await this.prisma.promoterLink.findFirst({
      where: { id: linkId },
      include: { eventPromoter: true },
    });
    if (!link) throw new NotFoundException("Promoter link not found");

    await this.prisma.eventPromoter.update({
      where: { id: link.eventPromoterId },
      data: { status: "active" },
    });

    return { success: true, link: await this.getLink(organisationId, userId, linkId) };
  }

  async declineInvitation(organisationId: string, userId: string, linkId: string) {
    const link = await this.prisma.promoterLink.findFirst({
      where: { id: linkId },
      include: { eventPromoter: true },
    });
    if (!link) throw new NotFoundException("Promoter link not found");

    await this.prisma.eventPromoter.update({
      where: { id: link.eventPromoterId },
      data: { status: "suspended" },
    });

    return { success: true };
  }

  async getSummary(organisationId: string, userId: string) {
    await this.assertOrgAccess(organisationId, userId);

    const orgEvents = await this.prisma.event.findMany({
      where: { organisationId },
      select: { id: true },
    });
    const eventIds = orgEvents.map((e) => e.id);

    const orders = await this.prisma.order.findMany({
      where: {
        eventId: { in: eventIds },
        status: "paid",
      },
      select: {
        id: true,
        buyerEmail: true,
        promoterLinkId: true,
        createdAt: true,
        totalMinor: true,
      },
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const promoterOrders = orders.filter((o) => o.promoterLinkId !== null);
    const targetOrders = promoterOrders.length > 0 ? promoterOrders : orders;

    const buyerOrderMap = new Map<string, Date[]>();
    for (const order of targetOrders) {
      if (!order.buyerEmail) continue;
      const dates = buyerOrderMap.get(order.buyerEmail) || [];
      dates.push(order.createdAt);
      buyerOrderMap.set(order.buyerEmail, dates);
    }

    const totalCustomers = buyerOrderMap.size;
    let activeCustomers = 0;
    let newCustomers = 0;
    let duplicateCustomers = 0;

    for (const [, dates] of buyerOrderMap.entries()) {
      const hasRecentOrder = dates.some((d) => d >= thirtyDaysAgo);
      if (hasRecentOrder) activeCustomers++;

      const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      if (earliestDate >= thirtyDaysAgo) newCustomers++;

      if (dates.length > 1) duplicateCustomers++;
    }

    const eventPromoters = await this.prisma.eventPromoter.findMany({
      where: { event: { organisationId } },
      select: {
        commissions: {
          select: { amountMinor: true, status: true },
        },
      },
    });

    const totalCommissionEarnedMinorExcludingReversed = eventPromoters.reduce(
      (sum, promoter) =>
        sum +
        promoter.commissions
          .filter((commission) => commission.status !== "reversed")
          .reduce((inner, commission) => inner + (commission.amountMinor ?? 0n), 0n),
      0n,
    );

    const pendingMinor = eventPromoters.reduce(
      (sum, promoter) =>
        sum +
        promoter.commissions
          .filter((commission) => commission.status === "accrued" || commission.status === "payable")
          .reduce((inner, commission) => inner + (commission.amountMinor ?? 0n), 0n),
      0n,
    );

    const availableMinor = eventPromoters.reduce(
      (sum, promoter) =>
        sum +
        promoter.commissions
          .filter((commission) => commission.status === "payable")
          .reduce((inner, commission) => inner + (commission.amountMinor ?? 0n), 0n),
      0n,
    );

    const paidOutMinor = eventPromoters.reduce(
      (sum, promoter) =>
        sum +
        promoter.commissions
          .filter((commission) => commission.status === "paid")
          .reduce((inner, commission) => inner + (commission.amountMinor ?? 0n), 0n),
      0n,
    );

    return {
      totalCommissionEarnedMinor: Number(totalCommissionEarnedMinorExcludingReversed),
      pendingMinor: Number(pendingMinor),
      availableMinor: Number(availableMinor),
      paidOutMinor: Number(paidOutMinor),
      totalCustomers,
      activeCustomers,
      newCustomers,
      duplicateCustomers,
      totalCustomersTrend: totalCustomers > 0 ? "+12.4%" : "+0.0%",
      activeCustomersTrend: activeCustomers > 0 ? "+8.6%" : "+0.0%",
      newCustomersTrend: newCustomers > 0 ? "+5.2%" : "+0.0%",
      duplicateCustomersTrend: duplicateCustomers > 0 ? "+3.1%" : "+0.0%",
    };
  }

  async getPromoter(organisationId: string, userId: string, promoterId: string) {
    await this.assertOrgAccess(organisationId, userId);

    const promoter = (await this.prisma.eventPromoter.findFirst({
      where: { id: promoterId, event: { organisationId } },
      include: {
        event: { select: { id: true, title: true, startsAt: true, endsAt: true } },
        user: { select: { id: true, fullName: true, email: true } },
        ticketType: { select: { name: true } },
        links: { select: { id: true, code: true, clicks: true, expiresAt: true } },
        commissions: {
          include: {
            order: {
              select: {
                id: true,
                orderNumber: true,
                totalMinor: true,
                createdAt: true,
                buyerName: true,
                buyerEmail: true,
              },
            },
          },
        },
      },
    })) as any;

    if (!promoter) throw new NotFoundException("Promoter not found");

    const totalEarnedMinor = (promoter.commissions || []).reduce((sum: bigint, c: any) => sum + (c.amountMinor ?? 0n), 0n);
    const totalRevenueMinor = (promoter.commissions || []).reduce((sum: bigint, c: any) => sum + (c.order?.totalMinor ?? 0n), 0n);
    const ticketsSold = (promoter.commissions || []).length;
    const totalClicks = (promoter.links || []).reduce((sum: number, l: any) => sum + l.clicks, 0);
    const displayName = promoter.user?.fullName || promoter.user?.email || "Promoter";

    const nameParts = displayName.trim().split(" ");
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

    return {
      id: promoter.id,
      name: displayName,
      email: promoter.user?.email || "",
      initials,
      status: promoter.status === "active" ? "Active" : "Inactive",
      eventId: promoter.event?.id || "",
      event: promoter.event?.title || "",
      ticketsSold,
      commissionRate: this.formatRate(promoter.commissionType, promoter.commissionValue),
      commissionEarned: Number(totalEarnedMinor) / 100,
      revenue: Number(totalRevenueMinor) / 100,
      clicks: totalClicks,
      conversionRate: totalClicks > 0 ? `${((ticketsSold / totalClicks) * 100).toFixed(1)}%` : "0%",
      joinedAt: promoter.createdAt,
      links: (promoter.links || []).map((l: any) => ({
        id: l.id,
        code: l.code,
        url: `https://uzutickets.com/p/${l.code}`,
        clicks: l.clicks,
        expiresAt: l.expiresAt,
      })),
      commissions: (promoter.commissions || []).map((c: any) => ({
        id: c.id,
        orderId: c.order?.orderNumber || c.orderId,
        customerName: c.order?.buyerName || c.order?.buyerEmail || "Customer",
        amount: Number(c.amountMinor ?? 0n) / 100,
        revenue: Number(c.order?.totalMinor ?? 0n) / 100,
        status: this.statusFromCommission(c.status),
        createdAt: c.createdAt,
      })),
    };
  }

  async list(organisationId: string, userId: string) {
    await this.assertOrgAccess(organisationId, userId);

    const promoters = await this.prisma.eventPromoter.findMany({
      where: { event: { organisationId } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        event: { select: { id: true, title: true } },
        status: true,
        commissionType: true,
        commissionValue: true,
        ticketType: { select: { name: true } },
        user: { select: { fullName: true, email: true } },
        commissions: {
          select: {
            amountMinor: true,
            status: true,
            order: { select: { totalMinor: true } },
          },
        },
      },
    });

    return promoters.map((promoter) => {
      const amountMinor = promoter.commissions.reduce((sum, commission) => sum + (commission.amountMinor ?? 0n), 0n);
      const revenueMinor = promoter.commissions.reduce((sum, commission) => sum + (commission.order?.totalMinor ?? 0n), 0n);

      const ticketsSold = promoter.commissions.length || 0;
      const displayName = promoter.user?.fullName || promoter.user?.email || "Unknown promoter";

      const nameParts = displayName.trim().split(" ");
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : displayName.slice(0, 2).toUpperCase();

      return {
        id: promoter.id,
        eventId: promoter.event.id,
        event: promoter.event.title,
        ticketsSold,
        commissionRate: this.formatRate(promoter.commissionType, promoter.commissionValue),
        commissionEarned: Number(amountMinor) / 100,
        revenue: Number(revenueMinor) / 100,
        status: promoter.status === "active" ? "Active" : "Inactive",
        promoterName: displayName,
        initials,
        ticketTypeName: promoter.ticketType?.name ?? "All ticket types",
      };
    });
  }
}

import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { paginate, skipTake } from "../../common/pagination";
import { BrowseEventsDto } from "./dto/browse-events.dto";

const VISIBLE_STATUSES: Prisma.EventWhereInput["status"] = { in: ["published", "sales_closed", "live"] };

/**
 * Recommendations v1 per the M3 release-plan scope: location is the sole
 * ranking signal (geo-IP resolved client-side, `city` passed as a manual
 * override). Interest-blended ranking (PRD §3.4, full version) is M4 —
 * `UserInterest` data is already being captured (users module) so that
 * later ranking pass has what it needs without a schema change.
 */
@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async browseEvents(dto: BrowseEventsDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;

    const baseWhere: Prisma.EventWhereInput = {
      visibility: "public",
      status: VISIBLE_STATUSES,
      ...(dto.categoryId ? { categoryId: dto.categoryId } : {}),
      ...(dto.q ? { title: { contains: dto.q, mode: "insensitive" } } : {}),
    };

    const total = await this.prisma.event.count({ where: baseWhere });

    if (!dto.city) {
      const events = await this.prisma.event.findMany({
        where: baseWhere,
        orderBy: { startsAt: "asc" },
        include: { category: true, images: { where: { isCover: true }, take: 1 } },
        ...skipTake(page, pageSize),
      });
      return paginate(events, total, page, pageSize);
    }

    // Location-dominant ranking: city matches first, backfilled with the
    // rest. Exact only within a page — see module doc comment above.
    const cityMatches = await this.prisma.event.findMany({
      where: { ...baseWhere, city: dto.city },
      orderBy: { startsAt: "asc" },
      include: { category: true, images: { where: { isCover: true }, take: 1 } },
      ...skipTake(page, pageSize),
    });

    let events = cityMatches;
    if (cityMatches.length < pageSize) {
      const others = await this.prisma.event.findMany({
        where: { ...baseWhere, city: { not: dto.city } },
        orderBy: { startsAt: "asc" },
        include: { category: true, images: { where: { isCover: true }, take: 1 } },
        take: pageSize - cityMatches.length,
      });
      events = [...cityMatches, ...others];
    }

    return paginate(events, total, page, pageSize);
  }

  async getPublicEvent(eventId: string) {
    return this.prisma.event.findFirst({
      where: { id: eventId, status: VISIBLE_STATUSES },
      include: { category: true, images: true, ticketTypes: true, organisation: { select: { name: true, logoUrl: true } } },
    });
  }

  async follow(userId: string, eventId: string) {
    await this.prisma.eventFollow.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: {},
      create: { userId, eventId },
    });
    return { following: true };
  }

  async unfollow(userId: string, eventId: string) {
    await this.prisma.eventFollow.deleteMany({ where: { userId, eventId } });
    return { following: false };
  }

  async listFollowedEvents(userId: string) {
    const follows = await this.prisma.eventFollow.findMany({
      where: { userId },
      include: { event: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    });
    return follows.map((f) => f.event);
  }
}

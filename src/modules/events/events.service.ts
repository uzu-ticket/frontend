import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CreateTicketTypeDto, UpdateTicketTypeDto } from "./dto/ticket-type.dto";
import { AddEventImageDto } from "./dto/add-image.dto";

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
  ) {}

  async create(organisationId: string, userId: string, dto: CreateEventDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventCreate);

    if (new Date(dto.salesCloseAt) > new Date(dto.startsAt)) {
      throw new BadRequestException("Sales close time must be at or before the event start time");
    }

    const event = await this.prisma.event.create({
      data: {
        id: newId(),
        organisationId,
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility,
        scannerMeshMode: dto.scannerMeshMode,
        venueName: dto.venueName,
        venueAddress: dto.venueAddress,
        latitude: dto.latitude,
        longitude: dto.longitude,
        city: dto.city,
        startsAt: new Date(dto.startsAt),
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        salesCloseAt: new Date(dto.salesCloseAt),
        createdBy: userId,
      },
    });
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.created",
      entityType: "event",
      entityId: event.id,
    });
    return event;
  }

  async findAllForOrg(organisationId: string, userId: string) {
    await this.permissions.assertMembership(userId, organisationId);
    return this.prisma.event.findMany({
      where: { organisationId },
      orderBy: { startsAt: "desc" },
      include: { ticketTypes: true, category: true, images: true },
    });
  }

  async findOneForOrg(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertMembership(userId, organisationId);
    const event = await this.loadEventOrThrow(eventId, organisationId);
    return this.prisma.event.findUnique({
      where: { id: event.id },
      include: { ticketTypes: true, images: true, category: true, signingKeys: { where: { isActive: true } } },
    });
  }

  async update(organisationId: string, eventId: string, userId: string, dto: UpdateEventDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    const event = await this.loadEventOrThrow(eventId, organisationId);

    const newSalesCloseAt = dto.salesCloseAt ? new Date(dto.salesCloseAt) : event.salesCloseAt;
    const newStartsAt = dto.startsAt ? new Date(dto.startsAt) : event.startsAt;
    if (newSalesCloseAt > newStartsAt) {
      throw new BadRequestException("Sales close time must be at or before the event start time");
    }

    const salesCloseChanged = dto.salesCloseAt && newSalesCloseAt.getTime() !== event.salesCloseAt.getTime();
    const manifestAlreadyDownloaded = event.manifestSealedAt !== null;

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility,
        scannerMeshMode: dto.scannerMeshMode,
        venueName: dto.venueName,
        venueAddress: dto.venueAddress,
        latitude: dto.latitude,
        longitude: dto.longitude,
        city: dto.city,
        startsAt: dto.startsAt ? newStartsAt : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        salesCloseAt: newSalesCloseAt,
        // PRD §3.2: "edits after manifest download trigger forced re-sync of
        // scanner devices" — bumping the version makes every assigned
        // device's cached manifestVersionDownloaded stale on next poll.
        manifestVersion: salesCloseChanged && manifestAlreadyDownloaded ? { increment: 1 } : undefined,
      },
    });

    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.updated",
      entityType: "event",
      entityId: eventId,
      metadata: dto as Record<string, unknown>,
    });
    return updated;
  }

  async publish(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventPublish);
    const event = await this.loadEventOrThrow(eventId, organisationId);

    if (!["draft", "pending_kyb"].includes(event.status)) {
      throw new BadRequestException(`Event cannot be published from status "${event.status}"`);
    }

    const isPaid = await this.recomputeIsPaid(eventId);

    if (isPaid) {
      const org = await this.prisma.organisation.findUniqueOrThrow({ where: { id: organisationId } });
      if (org.kybStatus !== "verified") {
        const updated = await this.prisma.event.update({
          where: { id: eventId },
          data: { status: "pending_kyb" },
        });
        await this.audit.log({
          organisationId,
          actorUserId: userId,
          action: "event.publish_blocked_pending_kyb",
          entityType: "event",
          entityId: eventId,
        });
        return updated;
      }
    }

    const updated = await this.prisma.event.update({ where: { id: eventId }, data: { status: "published" } });
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.published",
      entityType: "event",
      entityId: eventId,
    });
    return updated;
  }

  async cancel(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    await this.loadEventOrThrow(eventId, organisationId);
    const updated = await this.prisma.event.update({ where: { id: eventId }, data: { status: "cancelled" } });
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.cancelled",
      entityType: "event",
      entityId: eventId,
    });
    return updated;
  }

  // --- Ticket types ---------------------------------------------------

  async addTicketType(organisationId: string, eventId: string, userId: string, dto: CreateTicketTypeDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    const event = await this.loadEventOrThrow(eventId, organisationId);

    await this.assertPaidGuardrail(event.id, organisationId, event.status, BigInt(dto.priceMinor));

    const ticketType = await this.prisma.ticketType.create({
      data: {
        id: newId(),
        eventId,
        name: dto.name,
        priceMinor: BigInt(dto.priceMinor),
        quantityTotal: dto.quantityTotal,
        perOrderLimit: dto.perOrderLimit,
        saleStartsAt: dto.saleStartsAt ? new Date(dto.saleStartsAt) : undefined,
        saleEndsAt: dto.saleEndsAt ? new Date(dto.saleEndsAt) : undefined,
      },
    });
    await this.recomputeIsPaid(eventId);
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.ticket_type_created",
      entityType: "ticket_type",
      entityId: ticketType.id,
    });
    return ticketType;
  }

  async updateTicketType(
    organisationId: string,
    eventId: string,
    ticketTypeId: string,
    userId: string,
    dto: UpdateTicketTypeDto,
  ) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    const event = await this.loadEventOrThrow(eventId, organisationId);
    const ticketType = await this.prisma.ticketType.findUnique({ where: { id: ticketTypeId } });
    if (!ticketType || ticketType.eventId !== eventId) {
      throw new NotFoundException("Ticket type not found");
    }

    if (dto.priceMinor !== undefined) {
      await this.assertPaidGuardrail(event.id, organisationId, event.status, BigInt(dto.priceMinor));
    }
    if (dto.quantityTotal !== undefined && dto.quantityTotal < ticketType.quantitySold) {
      throw new BadRequestException("New quantity cannot be lower than tickets already sold");
    }

    const updated = await this.prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        name: dto.name,
        priceMinor: dto.priceMinor !== undefined ? BigInt(dto.priceMinor) : undefined,
        quantityTotal: dto.quantityTotal,
        perOrderLimit: dto.perOrderLimit,
        saleStartsAt: dto.saleStartsAt ? new Date(dto.saleStartsAt) : undefined,
        saleEndsAt: dto.saleEndsAt ? new Date(dto.saleEndsAt) : undefined,
      },
    });
    await this.recomputeIsPaid(eventId);
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.ticket_type_updated",
      entityType: "ticket_type",
      entityId: ticketTypeId,
    });
    return updated;
  }

  async removeTicketType(organisationId: string, eventId: string, ticketTypeId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    await this.loadEventOrThrow(eventId, organisationId);
    const ticketType = await this.prisma.ticketType.findUnique({ where: { id: ticketTypeId } });
    if (!ticketType || ticketType.eventId !== eventId) {
      throw new NotFoundException("Ticket type not found");
    }
    if (ticketType.quantitySold > 0) {
      throw new BadRequestException("Cannot remove a ticket type with tickets already sold");
    }
    await this.prisma.ticketType.delete({ where: { id: ticketTypeId } });
    await this.recomputeIsPaid(eventId);
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "event.ticket_type_removed",
      entityType: "ticket_type",
      entityId: ticketTypeId,
    });
  }

  // --- Images -----------------------------------------------------------

  async addImage(organisationId: string, eventId: string, userId: string, dto: AddEventImageDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    await this.loadEventOrThrow(eventId, organisationId);
    return this.prisma.eventImage.create({
      data: { id: newId(), eventId, url: dto.url, position: dto.position ?? 0, isCover: dto.isCover ?? false },
    });
  }

  async removeImage(organisationId: string, eventId: string, imageId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    await this.loadEventOrThrow(eventId, organisationId);
    const image = await this.prisma.eventImage.findUnique({ where: { id: imageId } });
    if (!image || image.eventId !== eventId) {
      throw new NotFoundException("Image not found");
    }
    await this.prisma.eventImage.delete({ where: { id: imageId } });
  }

  // --- Categories (public) ----------------------------------------------

  listCategories() {
    return this.prisma.eventCategory.findMany({ orderBy: { name: "asc" } });
  }

  // --- Internals ----------------------------------------------------------

  private async loadEventOrThrow(eventId: string, organisationId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organisationId !== organisationId) {
      throw new NotFoundException("Event not found");
    }
    return event;
  }

  /** Recomputes events.is_paid from ticket_types and persists it. */
  private async recomputeIsPaid(eventId: string): Promise<boolean> {
    const priciest = await this.prisma.ticketType.findFirst({
      where: { eventId, priceMinor: { gt: 0n } },
      select: { id: true },
    });
    const isPaid = priciest !== null;
    await this.prisma.event.update({ where: { id: eventId }, data: { isPaid } });
    return isPaid;
  }

  /**
   * PRD §3.2 guardrail: adding/raising a priced ticket type on an already
   * PUBLISHED event requires verified KYB, same as the initial paid-publish
   * gate — the mutation itself is blocked rather than silently unpublishing
   * a live event.
   */
  private async assertPaidGuardrail(
    eventId: string,
    organisationId: string,
    eventStatus: string,
    newPriceMinor: bigint,
  ): Promise<void> {
    if (newPriceMinor <= 0n || eventStatus !== "published") {
      return;
    }
    const org = await this.prisma.organisation.findUniqueOrThrow({ where: { id: organisationId } });
    if (org.kybStatus !== "verified") {
      throw new ForbiddenException(
        "Cannot add a priced ticket type to a published event until the organisation's KYB is verified",
      );
    }
  }
}

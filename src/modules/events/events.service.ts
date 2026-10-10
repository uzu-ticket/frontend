import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import "multer";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { CreateEventDto } from "./dto/create-event.dto";
import { EventScheduleDto } from "./dto/event-schedule.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CreateTicketTypeDto, UpdateTicketTypeDto } from "./dto/ticket-type.dto";
import { AddEventImageDto } from "./dto/add-image.dto";
import { StorageService } from "../../common/storage/storage.service";
import { PresignEventUploadDto } from "./dto/presign-event-upload.dto";

function toScheduleDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function scheduleData(schedule: EventScheduleDto, position: number) {
  return {
    name: schedule.name.trim(),
    scheduleDate: toScheduleDate(schedule.dateObj),
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    position,
  };
}

function scheduleJson(slots?: EventScheduleDto[]): Prisma.InputJsonValue | undefined {
  if (!slots) return undefined;
  const values: Prisma.InputJsonObject[] = slots.map((schedule) => ({
    id: schedule.id ?? null,
    name: schedule.name,
    dateObj: schedule.dateObj ?? null,
    startTime: schedule.startTime ?? null,
    endTime: schedule.endTime ?? null,
  }));
  return values;
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
    private readonly storage: StorageService,
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
        country: dto.country,
        state: dto.state,
        eventSlot: dto.eventSlot,
        slots: scheduleJson(dto.slots),
        latitude: dto.latitude,
        longitude: dto.longitude,
        city: dto.city,
        startsAt: new Date(dto.startsAt),
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        salesCloseAt: new Date(dto.salesCloseAt),
        schedules: dto.slots?.length
          ? {
              create: dto.slots.map((schedule, position) => ({
                id: newId(),
                ...scheduleData(schedule, position),
              })),
            }
          : undefined,
        createdBy: userId,
      },
      include: { schedules: { orderBy: { position: "asc" } } },
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
      include: {
        ticketTypes: true,
        schedules: { orderBy: { position: "asc" } },
        category: true,
        images: true,
      },
    });
  }

  async findOneForOrg(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertMembership(userId, organisationId);
    const event = await this.loadEventOrThrow(eventId, organisationId);
    return this.prisma.event.findUnique({
      where: { id: event.id },
      include: {
        ticketTypes: true,
        schedules: { orderBy: { position: "asc" } },
        images: true,
        category: true,
        signingKeys: { where: { isActive: true } },
      },
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

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.slots !== undefined) {
        const existingSchedules = await tx.eventSchedule.findMany({
          where: { eventId },
          select: { id: true },
        });
        const existingIds = new Set(existingSchedules.map((schedule) => schedule.id));
        const requestedIds = new Set(dto.slots.flatMap((schedule) => (schedule.id ? [schedule.id] : [])));

        for (const [position, schedule] of dto.slots.entries()) {
          const data = scheduleData(schedule, position);
          if (schedule.id) {
            if (!existingIds.has(schedule.id)) {
              throw new BadRequestException("Schedule does not belong to this event");
            }
            await tx.eventSchedule.update({ where: { id: schedule.id }, data });
          } else {
            await tx.eventSchedule.create({
              data: { id: newId(), eventId, ...data },
            });
          }
        }

        const removedIds = [...existingIds].filter((id) => !requestedIds.has(id));
        if (removedIds.length) {
          const linkedTicketCount = await tx.ticketType.count({
            where: { eventId, scheduleId: { in: removedIds } },
          });
          if (linkedTicketCount) {
            throw new BadRequestException("Remove or reassign ticket types before deleting their schedule");
          }
          await tx.eventSchedule.deleteMany({
            where: { eventId, id: { in: removedIds } },
          });
        }
      }

      return tx.event.update({
        where: { id: eventId },
        data: {
          categoryId: dto.categoryId,
          title: dto.title,
          description: dto.description,
          visibility: dto.visibility,
          scannerMeshMode: dto.scannerMeshMode,
          venueName: dto.venueName,
          venueAddress: dto.venueAddress,
          country: dto.country,
          state: dto.state,
          eventSlot: dto.eventSlot,
          slots: scheduleJson(dto.slots),
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
        include: { schedules: { orderBy: { position: "asc" } } },
      });
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

    if (dto.perOrderLimit !== undefined && dto.perOrderLimit > dto.quantityTotal) {
      throw new BadRequestException("Per-order limit cannot exceed available quantity");
    }

    if (dto.scheduleId) {
      const schedule = await this.prisma.eventSchedule.findUnique({
        where: { id: dto.scheduleId },
        select: { eventId: true },
      });
      if (!schedule || schedule.eventId !== eventId) {
        throw new BadRequestException("Schedule does not belong to this event");
      }
    }

    await this.assertPaidGuardrail(event.id, organisationId, event.status, BigInt(dto.priceMinor));

    const ticketType = await this.prisma.ticketType.create({
      data: {
        id: newId(),
        eventId,
        scheduleId: dto.scheduleId,
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

    if (dto.scheduleId) {
      const schedule = await this.prisma.eventSchedule.findUnique({
        where: { id: dto.scheduleId },
        select: { eventId: true },
      });
      if (!schedule || schedule.eventId !== eventId) {
        throw new BadRequestException("Schedule does not belong to this event");
      }
    }

    if (dto.priceMinor !== undefined) {
      await this.assertPaidGuardrail(event.id, organisationId, event.status, BigInt(dto.priceMinor));
    }
    if (dto.quantityTotal !== undefined && dto.quantityTotal < ticketType.quantitySold) {
      throw new BadRequestException("New quantity cannot be lower than tickets already sold");
    }
    const nextQuantity = dto.quantityTotal ?? ticketType.quantityTotal;
    const nextPerOrderLimit = dto.perOrderLimit ?? ticketType.perOrderLimit;
    if (nextPerOrderLimit !== null && nextPerOrderLimit !== undefined && nextPerOrderLimit > nextQuantity) {
      throw new BadRequestException("Per-order limit cannot exceed available quantity");
    }

    const updated = await this.prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        name: dto.name,
        scheduleId: dto.scheduleId,
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

    if (dto.isCover) {
      await this.prisma.eventImage.updateMany({
        where: { eventId, isCover: true },
        data: { isCover: false },
      });
    }

    return this.prisma.eventImage.create({
      data: {
        id: newId(),
        eventId,
        url: dto.url,
        s3Key: dto.s3Key ?? null,
        position: dto.position ?? 0,
        isCover: dto.isCover ?? false,
      },
    });
  }

  /**
   * Generate a time-limited presigned GET URL for a specific event image.
   * Validates that the image belongs to the requested event/organisation before
   * signing, so no arbitrary S3 key can be signed by the client.
   */
  async presignImageView(
    organisationId: string,
    eventId: string,
    imageId: string,
    userId: string,
    expiresIn = 3600,
  ): Promise<{ url: string; expiresAt: string }> {
    await this.permissions.assertMembership(userId, organisationId);
    await this.loadEventOrThrow(eventId, organisationId);

    const image = await this.prisma.eventImage.findUnique({ where: { id: imageId } });
    if (!image || image.eventId !== eventId) {
      throw new NotFoundException("Image not found");
    }

    let key = image.s3Key;
    if (!key && image.url) {
      try {
        const parsed = new URL(image.url);
        const extracted = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
        const expectedPrefix = `events/${organisationId}/${eventId}/`;
        if (extracted.startsWith(expectedPrefix)) {
          key = extracted;
          // Persist the extracted key so subsequent requests don't need extraction
          await this.prisma.eventImage.update({
            where: { id: imageId },
            data: { s3Key: key },
          }).catch(() => {});
        }
      } catch {
        // Not a valid URL
      }
    }

    if (!key) {
      // Non-S3 image (e.g. external link) — return stored URL as-is
      return { url: image.url, expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString() };
    }

    const signedUrl = await this.storage.presignGetUrl(key, expiresIn);
    return {
      url: signedUrl,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    };
  }

  async uploadImage(organisationId: string, eventId: string, userId: string, file: Express.Multer.File) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    await this.loadEventOrThrow(eventId, organisationId);

    const url = await this.storage.uploadEventAsset(organisationId, eventId, "cover", file);

    return this.prisma.eventImage.create({
      data: {
        id: newId(),
        eventId,
        url,
        position: 0,
        isCover: true,
      },
    });
  }

  async presignUpload(organisationId: string, eventId: string, userId: string, dto: PresignEventUploadDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventEdit);
    await this.loadEventOrThrow(eventId, organisationId);
    return this.storage.presignEventAsset(
      organisationId,
      eventId,
      dto.assetType,
      dto.fileName,
      dto.contentType,
    );
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

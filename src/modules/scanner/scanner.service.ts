import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ScanResult, ScannerDevice, EventScannerAssignment, Event } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { RealtimeEventBus } from "../realtime/realtime-event-bus.service";
import { parseQrCode } from "../tickets/signing/qr-payload";
import { RegisterDeviceDto } from "./dto/register-device.dto";
import { OfflineScanItemDto } from "./dto/scan.dto";

@Injectable()
export class ScannerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
    private readonly realtime: RealtimeEventBus,
  ) {}

  // --- Device registration & assignment -----------------------------------

  async registerDevice(organisationId: string, userId: string, dto: RegisterDeviceDto): Promise<ScannerDevice> {
    await this.permissions.assertPermission(userId, organisationId, Permission.ScannerScan);
    return this.prisma.scannerDevice.create({
      data: {
        id: newId(),
        userId,
        organisationId,
        deviceLabel: dto.deviceLabel,
        deviceFingerprint: dto.deviceFingerprint,
      },
    });
  }

  async listDevices(organisationId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.ScannerAssignDevice);
    return this.prisma.scannerDevice.findMany({ where: { organisationId } });
  }

  async revokeDevice(organisationId: string, deviceId: string, actorUserId: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.ScannerAssignDevice);
    const device = await this.prisma.scannerDevice.findUnique({ where: { id: deviceId } });
    if (!device || device.organisationId !== organisationId) throw new NotFoundException("Device not found");

    const updated = await this.prisma.scannerDevice.update({ where: { id: deviceId }, data: { isRevoked: true } });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "scanner.device_revoked",
      entityType: "scanner_device",
      entityId: deviceId,
    });
    // "Revocation propagates to scanner devices on next sync" (PRD US-ORG-2) —
    // devices check isRevoked on every manifest/scan/sync call, and this also
    // lets any currently-connected realtime listener react immediately.
    await this.realtime.publish(`device.${deviceId}.revoked`, { deviceId });
    return updated;
  }

  async assignDeviceToEvent(organisationId: string, eventId: string, deviceId: string, actorUserId: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.ScannerAssignDevice);
    const [event, device] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: eventId } }),
      this.prisma.scannerDevice.findUnique({ where: { id: deviceId } }),
    ]);
    if (!event || event.organisationId !== organisationId) throw new NotFoundException("Event not found");
    if (!device || device.organisationId !== organisationId) throw new NotFoundException("Device not found");

    const assignment = await this.prisma.eventScannerAssignment.create({
      data: { id: newId(), eventId, scannerDeviceId: deviceId, assignedBy: actorUserId },
    });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "scanner.device_assigned",
      entityType: "event_scanner_assignment",
      entityId: assignment.id,
    });
    return assignment;
  }

  async listAssignments(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertMembership(userId, organisationId);
    return this.prisma.eventScannerAssignment.findMany({
      where: { eventId },
      include: { scannerDevice: true },
    });
  }

  // --- Manifest -------------------------------------------------------------

  async downloadManifest(organisationId: string, eventId: string, deviceId: string, userId: string, deviceMonotonicMs: number) {
    const { assignment, event } = await this.assertDeviceOwnerAndAssigned(organisationId, eventId, deviceId, userId);
    if (!event.manifestSealedAt) {
      throw new BadRequestException("Manifest is not sealed yet — wait until ticket sales close");
    }
    // PRD §3.9: "manifests auto-purge after event end + retention window."
    // There's no separate manifest blob to delete — it's generated on
    // demand from live ticket state — so purging is enforced here as a
    // hard cutoff on redownload/regeneration past the retention window.
    const retentionCutoff = event.endsAt ?? event.startsAt;
    const purgeAt = new Date(retentionCutoff.getTime() + this.config.manifestRetentionDays * 86_400_000);
    if (new Date() > purgeAt) {
      throw new BadRequestException("This event's manifest has passed its retention window and is no longer available");
    }

    const now = new Date();
    await this.prisma.eventScannerAssignment.update({
      where: { id: assignment.id },
      data: { manifestVersionDownloaded: event.manifestVersion, downloadedAt: now, monotonicOffsetMs: BigInt(deviceMonotonicMs) },
    });

    const [signingKeys, tickets] = await Promise.all([
      this.prisma.eventSigningKey.findMany({ where: { eventId }, select: { id: true, publicKey: true, isActive: true } }),
      this.prisma.ticket.findMany({ where: { eventId }, select: { id: true, ticketTypeId: true, status: true } }),
    ]);

    return {
      eventId,
      manifestVersion: event.manifestVersion,
      sealedAt: event.manifestSealedAt,
      serverTimeReference: now.toISOString(),
      // NFR note (PRD §4.3): full-manifest strategy per integrity doc §8
      // decision 5 — no gate-sharding. Fine at the target ~100k tickets;
      // revisit only if a mega-event (>250k) strains device memory.
      signingKeys: signingKeys.map((k) => ({ kid: k.id, publicKey: k.publicKey, isActive: k.isActive })),
      tickets,
    };
  }

  // --- Scanning ---------------------------------------------------------------

  async scanOnline(organisationId: string, eventId: string, deviceId: string, userId: string, qrCode: string) {
    await this.assertDeviceOwnerAndAssigned(organisationId, eventId, deviceId, userId);

    const final = await this.prisma.$transaction(async (tx) => {
      const outcome = await this.classifyScan(eventId, qrCode, tx);
      if (!outcome.ticketId) {
        // Unrecognised ticket id — ticket_scans.ticket_id is a required FK,
        // so there's nothing valid to attach a row to. Report and stop.
        return { ticketId: null, result: outcome.result, isConflict: false, scannedAt: new Date() };
      }

      const scan = await tx.ticketScan.create({
        data: {
          id: newId(),
          ticketId: outcome.ticketId,
          eventId,
          scannerDeviceId: deviceId,
          scannedBy: userId,
          mode: "online",
          result: outcome.result,
          scannedAt: new Date(),
        },
      });

      if (outcome.contend) {
        await this.reconcileTicket(outcome.ticketId, tx);
      }
      return tx.ticketScan.findUniqueOrThrow({ where: { id: scan.id } });
    });

    await this.realtime.publish(`event.${eventId}.scan`, {
      ticketId: final.ticketId,
      result: final.result,
      isConflict: final.isConflict,
      deviceId,
      scannedAt: final.scannedAt,
    });
    return final;
  }

  /** Batched upload of locally-recorded offline scans (integrity doc §7 step 7-8). */
  async syncOfflineScans(organisationId: string, eventId: string, deviceId: string, userId: string, scans: OfflineScanItemDto[]) {
    const { assignment } = await this.assertDeviceOwnerAndAssigned(organisationId, eventId, deviceId, userId);
    if (assignment.monotonicOffsetMs === null || !assignment.downloadedAt) {
      throw new BadRequestException("Device has not downloaded a manifest for this event yet — cannot translate scan times");
    }

    const results: { ticketId: string | null; result: ScanResult; isConflict: boolean }[] = [];

    for (const item of scans) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.prisma.$transaction(async (tx) => {
        const outcome = await this.classifyScan(eventId, item.qrCode, tx);
        if (!outcome.ticketId) {
          // Unrecognised ticket id — nothing valid to attach a scan row to.
          return { ticketId: null, result: outcome.result, isConflict: false };
        }

        const derivedWallClockMs =
          assignment.downloadedAt!.getTime() + (item.scannedAtMonotonicMs - Number(assignment.monotonicOffsetMs));

        const scan = await tx.ticketScan.create({
          data: {
            id: newId(),
            ticketId: outcome.ticketId,
            eventId,
            scannerDeviceId: deviceId,
            scannedBy: userId,
            mode: "offline",
            result: outcome.result,
            scannedAt: new Date(derivedWallClockMs),
            scannedAtMonotonicMs: BigInt(item.scannedAtMonotonicMs),
            syncedAt: new Date(),
          },
        });

        if (outcome.contend) {
          await this.reconcileTicket(outcome.ticketId, tx);
        }
        const final = await tx.ticketScan.findUniqueOrThrow({ where: { id: scan.id } });
        return { ticketId: outcome.ticketId, result: final.result, isConflict: final.isConflict };
      });
      results.push(result);
    }

    await this.prisma.scannerDevice.update({ where: { id: deviceId }, data: { lastSyncedAt: new Date() } });
    await this.realtime.publish(`event.${eventId}.scan_sync`, { deviceId, count: results.length });
    return { synced: results.length, results };
  }

  async getIntegrityReport(organisationId: string, eventId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.EventViewDashboard);
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organisationId !== organisationId) throw new NotFoundException("Event not found");

    const conflicts = await this.prisma.ticketScan.findMany({
      where: { eventId, isConflict: true },
      include: { ticket: true, scannerDevice: true },
      orderBy: { scannedAt: "asc" },
    });
    const totalScans = await this.prisma.ticketScan.count({ where: { eventId } });
    const admitted = await this.prisma.ticketScan.count({ where: { eventId, result: "admitted" } });

    return {
      eventId,
      totalScans,
      admitted,
      conflictCount: conflicts.length,
      conflicts,
    };
  }

  // --- Internals ----------------------------------------------------------

  private async assertDeviceOwnerAndAssigned(
    organisationId: string,
    eventId: string,
    deviceId: string,
    userId: string,
  ): Promise<{ device: ScannerDevice; assignment: EventScannerAssignment; event: Event }> {
    const device = await this.prisma.scannerDevice.findUnique({ where: { id: deviceId } });
    if (!device || device.organisationId !== organisationId) throw new NotFoundException("Device not found");
    if (device.userId !== userId) throw new ForbiddenException("This device is not registered to you");
    if (device.isRevoked) throw new ForbiddenException("This device has been revoked");

    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organisationId !== organisationId) throw new NotFoundException("Event not found");

    const assignment = await this.prisma.eventScannerAssignment.findUnique({
      where: { eventId_scannerDeviceId: { eventId, scannerDeviceId: deviceId } },
    });
    if (!assignment) throw new ForbiddenException("This device is not assigned to this event");

    return { device, assignment, event };
  }

  /**
   * Classifies a presented QR against server state. Byte-for-byte equality
   * against the stored ticket.qrCode is sufficient proof of authenticity —
   * only a validly Ed25519-signed payload could ever have been stored
   * there at issuance (SigningService), so there's no need to re-verify the
   * signature bytes again on this path. `contend: true` means the ticket is
   * a live candidate for first-scan-wins reconciliation.
   */
  private async classifyScan(
    eventId: string,
    qrCode: string,
    tx: Prisma.TransactionClient,
  ): Promise<{ ticketId: string | null; result: ScanResult; contend: boolean }> {
    let ticketId: string;
    try {
      ticketId = parseQrCode(qrCode).payload.tid;
    } catch {
      return { ticketId: null, result: "invalid", contend: false };
    }

    const ticket = await tx.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket || ticket.qrCode !== qrCode) {
      return { ticketId: ticket?.id ?? null, result: "invalid", contend: false };
    }
    if (ticket.eventId !== eventId) {
      return { ticketId: ticket.id, result: "wrong_event", contend: false };
    }
    if (ticket.status === "void" || ticket.status === "refunded") {
      return { ticketId: ticket.id, result: "invalid", contend: false };
    }
    return { ticketId: ticket.id, result: "admitted", contend: true };
  }

  /**
   * First-scan-wins (integrity doc §5.1.2, §8 decision 3): re-evaluates
   * every contending scan of this ticket by derived wall-clock time
   * (tie-broken by each device's stable sync ordinal) and (re)crowns the
   * earliest as the winner. A later-synced but earlier-scanned record can
   * flip an already-decided winner — that's the point of reconciliation.
   */
  private async reconcileTicket(ticketId: string, tx: Prisma.TransactionClient): Promise<void> {
    await tx.$queryRaw(Prisma.sql`SELECT id FROM tickets WHERE id = ${ticketId}::uuid FOR UPDATE`);

    const contenders = await tx.ticketScan.findMany({
      where: { ticketId, result: { in: ["admitted", "duplicate"] } },
      include: { scannerDevice: { select: { syncPriorityOrdinal: true } } },
    });
    if (contenders.length === 0) return;

    const sorted = [...contenders].sort((a, b) => {
      const diff = a.scannedAt.getTime() - b.scannedAt.getTime();
      if (diff !== 0) return diff;
      return a.scannerDevice.syncPriorityOrdinal - b.scannerDevice.syncPriorityOrdinal;
    });
    const [winner, ...losers] = sorted;

    if (winner.result !== "admitted" || winner.isConflict) {
      await tx.ticketScan.update({ where: { id: winner.id }, data: { result: "admitted", isConflict: false } });
    }
    for (const loser of losers) {
      if (loser.result !== "duplicate" || !loser.isConflict) {
        // eslint-disable-next-line no-await-in-loop
        await tx.ticketScan.update({ where: { id: loser.id }, data: { result: "duplicate", isConflict: true } });
      }
    }

    await tx.ticket.update({
      where: { id: ticketId },
      data: { status: "used", usedAt: winner.scannedAt, usedByScanId: winner.id },
    });
  }
}

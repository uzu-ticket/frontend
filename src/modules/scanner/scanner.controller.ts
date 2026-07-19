import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { ScannerService } from "./scanner.service";
import { RegisterDeviceDto } from "./dto/register-device.dto";
import { AssignDeviceDto } from "./dto/assign-device.dto";
import { ManifestRequestDto } from "./dto/manifest-request.dto";
import { OnlineScanDto, OfflineSyncDto } from "./dto/scan.dto";

@ApiTags("scanner")
@Controller("organisations/:organisationId")
export class ScannerController {
  constructor(private readonly scannerService: ScannerService) {}

  @Post("scanner/devices")
  registerDevice(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.scannerService.registerDevice(organisationId, user.id, dto);
  }

  @Get("scanner/devices")
  listDevices(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.scannerService.listDevices(organisationId, user.id);
  }

  @Post("scanner/devices/:deviceId/revoke")
  revokeDevice(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("deviceId") deviceId: string,
  ) {
    return this.scannerService.revokeDevice(organisationId, deviceId, user.id);
  }

  @Post("events/:eventId/scanner-assignments")
  assignDevice(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Body() dto: AssignDeviceDto,
  ) {
    return this.scannerService.assignDeviceToEvent(organisationId, eventId, dto.scannerDeviceId, user.id);
  }

  @Get("events/:eventId/scanner-assignments")
  listAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.scannerService.listAssignments(organisationId, eventId, user.id);
  }

  @Post("events/:eventId/scanner/devices/:deviceId/manifest")
  downloadManifest(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Param("deviceId") deviceId: string,
    @Body() dto: ManifestRequestDto,
  ) {
    return this.scannerService.downloadManifest(organisationId, eventId, deviceId, user.id, dto.deviceMonotonicMs);
  }

  @Post("events/:eventId/scanner/devices/:deviceId/scan")
  scanOnline(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Param("deviceId") deviceId: string,
    @Body() dto: OnlineScanDto,
  ) {
    return this.scannerService.scanOnline(organisationId, eventId, deviceId, user.id, dto.qrCode);
  }

  @Post("events/:eventId/scanner/devices/:deviceId/sync")
  syncOffline(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Param("deviceId") deviceId: string,
    @Body() dto: OfflineSyncDto,
  ) {
    return this.scannerService.syncOfflineScans(organisationId, eventId, deviceId, user.id, dto.scans);
  }

  @Get("events/:eventId/integrity-report")
  getIntegrityReport(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.scannerService.getIntegrityReport(organisationId, eventId, user.id);
  }
}

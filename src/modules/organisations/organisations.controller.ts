import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { PlatformAdminGuard } from "../../common/auth/platform-admin.guard";
import { Public } from "../../common/decorators/public.decorator";
import { OrganisationsService } from "./organisations.service";
import { CreateOrganisationDto } from "./dto/create-organisation.dto";
import { UpdateOrganisationDto } from "./dto/update-organisation.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { SubmitKybDto } from "./dto/submit-kyb.dto";
import { CacService } from "./cac.service";
import { IsOptional, IsString, Matches, MinLength } from "class-validator";
import { CAC_NUMBER_PATTERN, normalizeCacNumber } from "../../common/cac/cac-number";

class CacSearchDto {
  @IsString()
  @MinLength(4)
  @Matches(CAC_NUMBER_PATTERN, { message: "CAC number must start with RC, BN, or IT and contain 4 to 8 digits." })
  @Transform(({ value }) => (typeof value === "string" ? normalizeCacNumber(value) : value))
  searchTerm!: string;
}

class RejectKybDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags("organisations")
@Controller("organisations")
export class OrganisationsController {
  constructor(
    private readonly organisationsService: OrganisationsService,
    private readonly cac: CacService,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrganisationDto) {
    return this.organisationsService.create(user.id, dto);
  }

  @Get("mine")
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.organisationsService.findMine(user.id);
  }

  @Get("invitations/mine")
  findMyPendingInvites(@CurrentUser() user: AuthenticatedUser) {
    return this.organisationsService.findMyPendingInvites(user.id);
  }

  @Post("cac/search")
  searchCac(@Body() query: CacSearchDto) {
    return this.cac.search(normalizeCacNumber(query.searchTerm));
  }

  @Public()
  @Get("invitations/info/:memberId")
  getInviteInfo(@Param("memberId") memberId: string) {
    return this.organisationsService.getInviteInfo(memberId);
  }

  @Get(":organisationId")
  findOne(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.organisationsService.findOne(organisationId, user.id);
  }

  @Patch(":organisationId")
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: UpdateOrganisationDto,
  ) {
    return this.organisationsService.update(organisationId, user.id, dto);
  }

  @Post(":organisationId/uploads")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "logo", maxCount: 1 },
        { name: "cover", maxCount: 1 },
      ],
      {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_request, file, callback) => {
          callback(null, file.mimetype.startsWith("image/"));
        },
      },
    ),
  )
  uploadAssets(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    return this.organisationsService.uploadAssets(organisationId, user.id, files);
  }

  @Get(":organisationId/members")
  listMembers(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.organisationsService.listMembers(organisationId, user.id);
  }

  @Post(":organisationId/members")
  inviteMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: InviteMemberDto,
  ) {
    return this.organisationsService.inviteMember(organisationId, user.id, dto);
  }

  @Post(":organisationId/members/:memberId/accept")
  acceptInvite(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.organisationsService.acceptInvite(organisationId, memberId, user.id);
  }

  @Post(":organisationId/members/:memberId/decline")
  declineInvite(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.organisationsService.declineInvite(organisationId, memberId, user.id);
  }

  @Post(":organisationId/members/:memberId/revoke")
  revokeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.organisationsService.revokeMember(organisationId, memberId, user.id);
  }

  @Post(":organisationId/members/:memberId/resend")
  resendInvite(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.organisationsService.resendInvite(organisationId, memberId, user.id);
  }

  @Post(":organisationId/kyb")
  submitKyb(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: SubmitKybDto,
  ) {
    return this.organisationsService.submitKyb(organisationId, user.id, dto);
  }

  /** Internal platform-admin action — see PlatformAdminGuard. */
  @UseGuards(PlatformAdminGuard)
  @Post(":organisationId/kyb/approve")
  approveKyb(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.organisationsService.approveKyb(organisationId, user.id);
  }

  /** Internal platform-admin action — see PlatformAdminGuard. */
  @UseGuards(PlatformAdminGuard)
  @Post(":organisationId/kyb/reject")
  rejectKyb(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: RejectKybDto,
  ) {
    return this.organisationsService.rejectKyb(organisationId, user.id, dto.reason);
  }
}

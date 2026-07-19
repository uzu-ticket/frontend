import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { PlatformAdminGuard } from "../../common/auth/platform-admin.guard";
import { OrganisationsService } from "./organisations.service";
import { CreateOrganisationDto } from "./dto/create-organisation.dto";
import { UpdateOrganisationDto } from "./dto/update-organisation.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { SubmitKybDto } from "./dto/submit-kyb.dto";

class RejectKybDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags("organisations")
@Controller("organisations")
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrganisationDto) {
    return this.organisationsService.create(user.id, dto);
  }

  @Get("mine")
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.organisationsService.findMine(user.id);
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

  @Post(":organisationId/members/:memberId/revoke")
  revokeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.organisationsService.revokeMember(organisationId, memberId, user.id);
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

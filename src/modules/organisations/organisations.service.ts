import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { CreateOrganisationDto } from "./dto/create-organisation.dto";
import { UpdateOrganisationDto } from "./dto/update-organisation.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { SubmitKybDto } from "./dto/submit-kyb.dto";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
  ) {}

  async create(userId: string, dto: CreateOrganisationDto) {
    const baseSlug = slugify(dto.name) || "organisation";
    let slug = baseSlug;
    let suffix = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await this.prisma.organisation.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++suffix}`;
    }

    const org = await this.prisma.$transaction(async (tx) => {
      const organisation = await tx.organisation.create({
        data: {
          id: newId(),
          name: dto.name,
          slug,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          description: dto.description,
          logoUrl: dto.logoUrl,
          createdBy: userId,
        },
      });
      await tx.organisationMember.create({
        data: {
          id: newId(),
          organisationId: organisation.id,
          userId,
          role: "super_admin",
          acceptedAt: new Date(),
        },
      });
      await this.audit.log(
        {
          organisationId: organisation.id,
          actorUserId: userId,
          action: "organisation.created",
          entityType: "organisation",
          entityId: organisation.id,
        },
        tx,
      );
      return organisation;
    });

    return org;
  }

  async findMine(userId: string) {
    const memberships = await this.prisma.organisationMember.findMany({
      where: { userId, acceptedAt: { not: null }, revokedAt: null },
      include: { organisation: true },
    });
    return memberships.map((m) => ({ ...m.organisation, myRole: m.role }));
  }

  async findOne(organisationId: string, userId: string) {
    await this.assertMember(organisationId, userId);
    const org = await this.prisma.organisation.findUnique({ where: { id: organisationId } });
    if (!org) throw new NotFoundException("Organisation not found");
    return org;
  }

  async update(organisationId: string, userId: string, dto: UpdateOrganisationDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.OrgEditProfile);
    const org = await this.prisma.organisation.update({ where: { id: organisationId }, data: dto });
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "organisation.updated",
      entityType: "organisation",
      entityId: organisationId,
      metadata: dto as Record<string, unknown>,
    });
    return org;
  }

  async listMembers(organisationId: string, userId: string) {
    await this.assertMember(organisationId, userId);
    return this.prisma.organisationMember.findMany({
      where: { organisationId, revokedAt: null },
      include: { user: { select: { id: true, email: true, fullName: true } } },
    });
  }

  async inviteMember(organisationId: string, actorUserId: string, dto: InviteMemberDto) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrgManageRoles);

    const invitee = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!invitee) {
      throw new NotFoundException(
        "No UzuTicket account found for this email — the invitee must register first",
      );
    }

    const member = await this.prisma.organisationMember.create({
      data: {
        id: newId(),
        organisationId,
        userId: invitee.id,
        role: dto.role,
        invitedBy: actorUserId,
      },
    });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "organisation.member_invited",
      entityType: "organisation_member",
      entityId: member.id,
      metadata: { email: dto.email, role: dto.role },
    });
    return member;
  }

  async acceptInvite(organisationId: string, memberId: string, userId: string) {
    const member = await this.prisma.organisationMember.findUnique({ where: { id: memberId } });
    if (!member || member.organisationId !== organisationId) {
      throw new NotFoundException("Invite not found");
    }
    if (member.userId !== userId) {
      throw new ForbiddenException("This invite is not addressed to you");
    }
    if (member.revokedAt) {
      throw new BadRequestException("This invite has been revoked");
    }
    const updated = await this.prisma.organisationMember.update({
      where: { id: memberId },
      data: { acceptedAt: new Date() },
    });
    await this.audit.log({
      organisationId,
      actorUserId: userId,
      action: "organisation.member_accepted",
      entityType: "organisation_member",
      entityId: memberId,
    });
    return updated;
  }

  async revokeMember(organisationId: string, memberId: string, actorUserId: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrgManageRoles);
    const member = await this.prisma.organisationMember.findUnique({ where: { id: memberId } });
    if (!member || member.organisationId !== organisationId) {
      throw new NotFoundException("Member not found");
    }
    const updated = await this.prisma.organisationMember.update({
      where: { id: memberId },
      data: { revokedAt: new Date() },
    });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "organisation.member_revoked",
      entityType: "organisation_member",
      entityId: memberId,
    });
    return updated;
  }

  async submitKyb(organisationId: string, actorUserId: string, dto: SubmitKybDto) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrgManageBankDetails);
    const org = await this.prisma.organisation.update({
      where: { id: organisationId },
      data: {
        cacNumber: dto.cacNumber,
        settlementBankCode: dto.settlementBankCode,
        settlementAccountNumber: dto.settlementAccountNumber,
        settlementAccountName: dto.settlementAccountName,
        kybStatus: "pending",
      },
    });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "organisation.kyb_submitted",
      entityType: "organisation",
      entityId: organisationId,
    });
    return org;
  }

  /** Platform-admin only — see PlatformAdminGuard on the controller route. */
  async approveKyb(organisationId: string, actorUserId: string) {
    const org = await this.prisma.organisation.update({
      where: { id: organisationId },
      data: { kybStatus: "verified" },
    });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "organisation.kyb_approved",
      entityType: "organisation",
      entityId: organisationId,
    });
    return org;
  }

  async rejectKyb(organisationId: string, actorUserId: string, reason?: string) {
    const org = await this.prisma.organisation.update({
      where: { id: organisationId },
      data: { kybStatus: "rejected" },
    });
    await this.audit.log({
      organisationId,
      actorUserId,
      action: "organisation.kyb_rejected",
      entityType: "organisation",
      entityId: organisationId,
      metadata: { reason },
    });
    return org;
  }

  async assertMember(organisationId: string, userId: string): Promise<void> {
    const member = await this.prisma.organisationMember.findFirst({
      where: { organisationId, userId, acceptedAt: { not: null }, revokedAt: null },
    });
    if (!member) {
      throw new ForbiddenException("You are not a member of this organisation");
    }
  }
}

import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { AppConfigService } from "../../config/app-config.service";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";
import { CreateOrganisationDto } from "./dto/create-organisation.dto";
import { UpdateOrganisationDto } from "./dto/update-organisation.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { SubmitKybDto } from "./dto/submit-kyb.dto";

const roleLabels: Record<string, string> = {
  super_admin: "Owner",
  admin: "Admin",
  member: "Member",
};

function roleLabel(role?: string): string {
  if (!role) return "Owner";
  return roleLabels[role.toLowerCase()] ?? role;
}

function initialsFromName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || "";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

@Injectable()
export class OrganisationsService {
  private readonly logger = new Logger(OrganisationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
    private readonly config: AppConfigService,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
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
      include: {
        organisation: {
          include: {
            _count: {
              select: {
                events: true,
                members: true,
              },
            },
          },
        },
      },
    });
    return memberships.map((m) => ({
      ...m.organisation,
      myRole: m.role,
      eventsCount: m.organisation._count?.events ?? 0,
      membersCount: m.organisation._count?.members ?? 0,
    }));
  }

  async findMyPendingInvites(userId: string) {
    const memberships = await this.prisma.organisationMember.findMany({
      where: { userId, acceptedAt: null, revokedAt: null },
      include: {
        organisation: true,
        inviter: { select: { fullName: true, email: true } },
      },
    });
    return memberships.map((m) => ({
      id: m.id,
      organisationId: m.organisationId,
      orgName: m.organisation.name,
      invitedBy: m.inviter?.fullName || m.inviter?.email || "Organization Admin",
      role: roleLabel(m.role),
      initials: initialsFromName(m.organisation.name),
      badgeBg: "#0E2615",
      badgeColor: "#3FD246",
    }));
  }

  async getInviteInfo(memberId: string) {
    const member = await this.prisma.organisationMember.findUnique({
      where: { id: memberId },
      include: {
        organisation: { select: { id: true, name: true, slug: true } },
        inviter: { select: { fullName: true, email: true } },
        user: { select: { email: true } },
      },
    });
    if (!member || member.revokedAt) {
      throw new NotFoundException("Invitation link is invalid or has expired");
    }
    return {
      id: member.id,
      organisationId: member.organisationId,
      orgName: member.organisation.name,
      orgSlug: member.organisation.slug,
      role: roleLabel(member.role),
      invitedBy: member.inviter?.fullName || member.inviter?.email || "Organization Admin",
      inviteeEmail: member.user?.email,
      isAccepted: !!member.acceptedAt,
    };
  }


  async declineInvite(organisationId: string, memberId: string, userId: string) {
    const member = await this.prisma.organisationMember.findUnique({ where: { id: memberId } });
    if (!member || member.organisationId !== organisationId) {
      throw new NotFoundException("Invite not found");
    }
    if (member.userId !== userId) {
      throw new ForbiddenException("This invite is not addressed to you");
    }
    const updated = await this.prisma.organisationMember.update({
      where: { id: memberId },
      data: { revokedAt: new Date() },
    });
    return updated;
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

    let invitee = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!invitee) {
      invitee = await this.prisma.user.create({
        data: {
          id: newId(),
          email: dto.email,
          fullName: dto.email.split('@')[0],
          passwordHash: '',
          isEmailVerified: false,
        },
      });
    }

    const existing = await this.prisma.organisationMember.findFirst({
      where: { organisationId, userId: invitee.id, revokedAt: null },
    });
    if (existing) {
      throw new BadRequestException("This user is already a member or has a pending invite in this organisation");
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

    const [org, inviter] = await Promise.all([
      this.prisma.organisation.findUnique({ where: { id: organisationId } }),
      this.prisma.user.findUnique({ where: { id: actorUserId } }),
    ]);

    const orgName = org?.name || "Organisation";
    const inviterName = inviter?.fullName || inviter?.email || "An organisation admin";
    const inviteUrl = `${this.config.appBaseUrl}/join/${org?.slug || organisationId}?invite=${member.id}`;

    try {
      await this.notifications.sendEmail({
        to: dto.email,
        subject: `Invitation to join ${orgName} on UzuTicket`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
            <h2>Invitation to join ${orgName}</h2>
            <p>Hello,</p>
            <p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> as a <strong>${dto.role}</strong> on UzuTicket.</p>
            <p style="margin: 24px 0;">
              <a href="${inviteUrl}" style="background-color: #3FD246; color: #0E2615; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser: <br><a href="${inviteUrl}">${inviteUrl}</a></p>
          </div>
        `,
        text: `${inviterName} invited you to join ${orgName} as ${dto.role} on UzuTicket. Accept here: ${inviteUrl}`,
      });
    } catch (err) {
      this.logger.error(`Failed to send invitation email to ${dto.email}`, err instanceof Error ? err.stack : undefined);
    }

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

  async resendInvite(organisationId: string, memberId: string, actorUserId: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrgManageRoles);
    const member = await this.prisma.organisationMember.findUnique({
      where: { id: memberId },
      include: { user: true, organisation: true },
    });
    if (!member || member.organisationId !== organisationId || member.revokedAt) {
      throw new NotFoundException("Invite not found or revoked");
    }
    if (member.acceptedAt) {
      throw new BadRequestException("Member has already accepted the invitation");
    }

    const inviter = await this.prisma.user.findUnique({ where: { id: actorUserId } });
    const inviterName = inviter?.fullName || inviter?.email || "An organisation admin";
    const orgName = member.organisation?.name || "Organisation";
    const email = member.user?.email;

    if (!email) {
      throw new BadRequestException("User email not found");
    }

    const inviteUrl = `${this.config.appBaseUrl}/join/${member.organisation?.slug || organisationId}?invite=${member.id}`;

    try {
      await this.notifications.sendEmail({
        to: email,
        subject: `[Reminder] Invitation to join ${orgName} on UzuTicket`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
            <h2>Invitation Reminder: ${orgName}</h2>
            <p>Hello,</p>
            <p>This is a reminder that <strong>${inviterName}</strong> invited you to join <strong>${orgName}</strong> as a <strong>${member.role}</strong> on UzuTicket.</p>
            <p style="margin: 24px 0;">
              <a href="${inviteUrl}" style="background-color: #3FD246; color: #0E2615; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser: <br><a href="${inviteUrl}">${inviteUrl}</a></p>
          </div>
        `,
        text: `Reminder: ${inviterName} invited you to join ${orgName} as ${member.role} on UzuTicket. Accept here: ${inviteUrl}`,
      });
    } catch (err) {
      this.logger.error(`Failed to resend invitation email to ${email}`, err instanceof Error ? err.stack : undefined);
    }

    return { success: true };
  }


  async acceptInvite(organisationId: string, memberId: string, userId: string) {
    const member = await this.prisma.organisationMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });
    if (!member || member.organisationId !== organisationId) {
      throw new NotFoundException("Invite not found");
    }
    if (member.revokedAt) {
      throw new BadRequestException("This invite has been revoked");
    }

    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) {
      throw new ForbiddenException("User not found");
    }

    const isSameUser = member.userId === userId;
    const isSameEmail = member.user?.email && currentUser.email && member.user.email.toLowerCase() === currentUser.email.toLowerCase();

    if (!isSameUser && !isSameEmail) {
      throw new ForbiddenException(`This invite was sent to ${member.user?.email || "another email"}. You are currently logged in as ${currentUser.email}.`);
    }

    const updated = await this.prisma.organisationMember.update({
      where: { id: memberId },
      data: {
        userId: currentUser.id,
        acceptedAt: new Date(),
      },
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

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";
import { Inject } from "@nestjs/common";
import { Permission } from "../../common/auth/permissions";
import { PermissionsService } from "../../common/auth/permissions.service";
import { PrismaService } from "../../prisma/prisma.service";
import { newId } from "../../common/id";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Injectable()
export class MarketingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
  ) {}

  private async assertAccess(userId: string, organisationId: string, permission: Permission) {
    await this.permissions.assertPermission(userId, organisationId, permission);
    const organisation = await this.prisma.organisation.findUnique({
      where: { id: organisationId },
      select: { isPremium: true },
    });
    if (!organisation) throw new NotFoundException("Organisation not found");
    if (!organisation.isPremium) throw new ForbiddenException("Marketing campaigns require a premium organisation");
  }

  async list(organisationId: string, userId: string) {
    await this.assertAccess(userId, organisationId, Permission.MarketingView);
    return this.prisma.emailCampaign.findMany({
      where: { organisationId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { recipients: true } } },
    });
  }

  async stats(organisationId: string, userId: string) {
    await this.assertAccess(userId, organisationId, Permission.MarketingView);
    const [total, sent, delivered, opened, clicked] = await Promise.all([
      this.prisma.emailCampaign.count({ where: { organisationId } }),
      this.prisma.campaignRecipient.count({ where: { campaign: { organisationId }, status: { not: "queued" } } }),
      this.prisma.campaignRecipient.count({ where: { campaign: { organisationId }, deliveredAt: { not: null } } }),
      this.prisma.campaignRecipient.count({ where: { campaign: { organisationId }, openedAt: { not: null } } }),
      this.prisma.campaignRecipient.count({ where: { campaign: { organisationId }, clickedAt: { not: null } } }),
    ]);
    return {
      totalCampaigns: total,
      emailsSent: sent,
      openRate: delivered ? (opened / delivered) * 100 : 0,
      clickRate: delivered ? (clicked / delivered) * 100 : 0,
    };
  }

  async findOne(organisationId: string, campaignId: string, userId: string) {
    await this.assertAccess(userId, organisationId, Permission.MarketingView);
    const campaign = await this.prisma.emailCampaign.findFirst({
      where: { id: campaignId, organisationId },
      include: { recipients: true },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");
    return campaign;
  }

  async create(organisationId: string, userId: string, dto: CreateCampaignDto) {
    await this.assertAccess(userId, organisationId, Permission.MarketingManage);
    const suppressed = await this.prisma.emailSuppression.findMany({
      where: { OR: [{ organisationId: null }, { organisationId }] },
      select: { email: true },
    });
    const suppressedEmails = new Set(suppressed.map((item) => item.email.toLowerCase()));
    const users = await this.prisma.user.findMany({
      where: {
        ordersAsBuyer: { some: { event: { organisationId } } },
        ...(dto.segmentCity ? { city: dto.segmentCity } : {}),
      },
      select: { id: true, email: true },
      distinct: ["email"],
    });
    const recipients = users.filter((user) => !suppressedEmails.has(user.email.toLowerCase()));
    return this.prisma.emailCampaign.create({
      data: {
        id: newId(),
        organisationId,
        createdBy: userId,
        subject: dto.subject,
        bodyHtml: dto.bodyHtml,
        segmentCity: dto.segmentCity,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        status: dto.scheduledAt ? "scheduled" : "draft",
        totalRecipients: recipients.length,
        recipients: {
          create: recipients.map((recipient) => ({ id: newId(), email: recipient.email, userId: recipient.id })),
        },
      },
      include: { recipients: true },
    });
  }

  async send(organisationId: string, campaignId: string, userId: string) {
    await this.assertAccess(userId, organisationId, Permission.MarketingManage);
    const campaign = await this.prisma.emailCampaign.findFirst({
      where: { id: campaignId, organisationId },
      include: { recipients: true },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");
    if (campaign.status === "sent") throw new BadRequestException("Campaign has already been sent");
    for (const recipient of campaign.recipients) {
      try {
        await this.notifications.sendEmail({
          to: recipient.email,
          subject: campaign.subject,
          html: campaign.bodyHtml ?? "",
        });
        await this.prisma.campaignRecipient.update({
          where: { id: recipient.id },
          data: { status: "delivered", deliveredAt: new Date() },
        });
      } catch {
        await this.prisma.campaignRecipient.update({ where: { id: recipient.id }, data: { status: "failed" } });
      }
    }
    return this.prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { status: "sent", sentAt: new Date() },
      include: { recipients: true },
    });
  }
}

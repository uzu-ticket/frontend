import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { newId } from "../../common/id";
import { ClientDeviceInfo } from "../../common/utils/device-detector.util";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { interests: { include: { category: true } } },
    });
    if (!user) throw new NotFoundException("User not found");
    const { passwordHash: _passwordHash, totpSecret: _totpSecret, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
        ...(dto.city !== undefined ? { city: dto.city } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.preferredCurrency !== undefined ? { preferredCurrency: dto.preferredCurrency } : {}),
        ...(dto.marketingOptIn !== undefined ? { marketingOptIn: dto.marketingOptIn } : {}),
      },
    });
    const { passwordHash: _passwordHash, totpSecret: _totpSecret, ...safe } = user;
    return safe;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");
    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new BadRequestException("Current password is incorrect");
      }
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { message: "Password updated successfully" };
  }


  async setInterests(userId: string, categoryIds: string[]) {
    await this.prisma.$transaction([
      this.prisma.userInterest.deleteMany({ where: { userId } }),
      this.prisma.userInterest.createMany({
        data: categoryIds.map((categoryId) => ({ userId, categoryId })),
        skipDuplicates: true,
      }),
    ]);
    return this.prisma.userInterest.findMany({ where: { userId }, include: { category: true } });
  }

  async searchUsers(query: string) {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim();
    const users = await this.prisma.user.findMany({
      where: {
        OR: [{ email: { contains: q, mode: "insensitive" } }, { fullName: { contains: q, mode: "insensitive" } }],
      },
      take: 10,
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
    return users;
  }

  async getSessions(userId: string, currentSessionId?: string, clientInfo?: ClientDeviceInfo) {
    let sessions = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null },
      orderBy: { lastActiveAt: "desc" },
    });

    if (sessions.length === 0 && clientInfo) {
      const created = await this.prisma.userSession.create({
        data: {
          id: newId(),
          userId,
          device: clientInfo.device,
          browser: clientInfo.browser,
          os: clientInfo.os,
          ipAddress: clientInfo.ipAddress,
          location: clientInfo.location,
          userAgent: clientInfo.userAgent,
          lastActiveAt: new Date(),
        },
      });
      sessions = [created];
    }

    return sessions.map((s, index) => ({
      id: s.id,
      device: s.device || "Desktop",
      browser: s.browser || "Unknown Browser",
      os: s.os || "Unknown OS",
      ipAddress: s.ipAddress || "127.0.0.1",
      location: s.location || "Lagos, Nigeria",
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      isCurrent: currentSessionId ? s.id === currentSessionId : index === 0,
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.userSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException("Session not found");

    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    return { message: "Session revoked successfully" };
  }

  async revokeAllOtherSessions(userId: string, currentSessionId?: string) {
    await this.prisma.userSession.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(currentSessionId ? { NOT: { id: currentSessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });
    return { message: "All other sessions revoked successfully" };
  }

  async getLoginActivity(userId: string, limit = 20) {
    const activities = await this.prisma.loginActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return activities.map((a) => ({
      id: a.id,
      device: a.device || "Desktop",
      browser: a.browser || "Unknown Browser",
      os: a.os || "Unknown OS",
      ipAddress: a.ipAddress || "127.0.0.1",
      location: a.location || "Lagos, Nigeria",
      status: a.status || "success",
      createdAt: a.createdAt,
    }));
  }
}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
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
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

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
    return this.prisma.user.update({
      where: { id: userId },
      data: { fullName: dto.fullName, city: dto.city, phone: dto.phone },
    });
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

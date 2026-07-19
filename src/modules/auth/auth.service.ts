import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { newId } from "../../common/id";
import { OtpService } from "./otp.service";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
    private readonly otpService: OtpService,
  ) {}

  async register(email: string, password: string, fullName?: string): Promise<TokenPair> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.linkGuestOrdersOnCreate(
      await this.prisma.user.create({
        data: { id: newId(), email, passwordHash, fullName, isEmailVerified: false },
      }),
    );
    return this.issueTokens(user.id, user.email);
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.status !== "active") {
      throw new UnauthorizedException("Account is not active");
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user.id, user.email);
  }

  async requestOtp(email: string): Promise<void> {
    await this.otpService.requestOtp(email);
  }

  async verifyOtpAndLogin(email: string, code: string): Promise<TokenPair> {
    const valid = await this.otpService.verifyOtp(email, code);
    if (!valid) {
      throw new UnauthorizedException("Invalid or expired code");
    }
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.linkGuestOrdersOnCreate(
        await this.prisma.user.create({ data: { id: newId(), email, isEmailVerified: true } }),
      );
    } else if (!user.isEmailVerified) {
      user = await this.prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user.id, user.email);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string }>(refreshToken, {
        secret: this.config.jwtRefreshSecret,
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.status !== "active") {
        throw new UnauthorizedException();
      }
      return this.issueTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { secret: this.config.jwtAccessSecret, expiresIn: this.config.jwtAccessTtl }),
      this.jwt.signAsync(payload, { secret: this.config.jwtRefreshSecret, expiresIn: this.config.jwtRefreshTtl }),
    ]);
    return { accessToken, refreshToken };
  }

  /**
   * PRD §3.4: "Guest purchases made with an email later used for
   * registration are automatically linked to the new account."
   */
  private async linkGuestOrdersOnCreate<T extends { id: string; email: string }>(user: T): Promise<T> {
    await this.prisma.order.updateMany({
      where: { buyerEmail: user.email, buyerUserId: null },
      data: { buyerUserId: user.id },
    });
    return user;
  }
}

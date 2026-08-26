import { ConflictException, Injectable, Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { newId } from "../../common/id";
import { REDIS_CLIENT } from "../../common/redis/redis.module";
import type Redis from "ioredis";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";
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
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async register(email: string, password: string, fullName?: string, phone?: string): Promise<TokenPair> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.linkGuestOrdersOnCreate(
      await this.prisma.user.create({
        data: { id: newId(), email, passwordHash, fullName, phone, isEmailVerified: false },
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

  async requestPasswordReset(
    contact: string,
    channel: "email" | "phone",
  ): Promise<{ token?: string; code?: string }> {
    const result: { token?: string; code?: string } = {};
    if (channel === "email") {
      const user = await this.prisma.user.findUnique({ where: { email: contact } });
      if (!user) return result;
      const token = randomInt(0, 1_000_000_000_000).toString(36);
      await this.redis.set(`pwd_reset:${contact}`, token, "EX", 900);
      result.token = token;
      const link = `${this.config.appBaseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(contact)}`;
      try {
        await this.notifications.sendEmail({
          to: contact,
          subject: "Reset your UzuTicket password",
          html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
          text: `Reset your password: ${link}`,
        });
      } catch (e) {
        this.logger.error(`Failed to send password reset email to ${contact}`, e instanceof Error ? e.stack : undefined);
      }
    } else {
      const user = await this.prisma.user.findUnique({ where: { phone: contact } });
      if (!user) return result;
      const code = await this.otpService.requestSmsOtp(contact);
      result.code = code;
    }
    return result;
  }

  async resetPassword(
    contact: string,
    channel: "email" | "phone",
    tokenOrCode: string,
    password: string,
  ): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    if (channel === "email") {
      const stored = await this.redis.get(`pwd_reset:${contact}`);
      if (!stored || stored !== tokenOrCode) {
        throw new UnauthorizedException("Invalid or expired reset token");
      }
      await this.redis.del(`pwd_reset:${contact}`);
      await this.prisma.user.updateMany({
        where: { email: contact },
        data: { passwordHash },
      });
    } else {
      const valid = await this.otpService.verifySmsOtp(contact, tokenOrCode);
      if (!valid) {
        throw new UnauthorizedException("Invalid or expired code");
      }
      await this.prisma.user.updateMany({
        where: { phone: contact },
        data: { passwordHash },
      });
    }
  }

  async requestEmailVerification(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.isEmailVerified) return;
    const token = randomInt(0, 1_000_000_000_000).toString(36);
    await this.redis.set(`email_verify:${email}`, token, "EX", 86400);
    const link = `${this.config.appBaseUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    try {
      await this.notifications.sendEmail({
        to: email,
        subject: "Verify your UzuTicket email",
        html: `<p>Click <a href="${link}">here</a> to verify your email address.</p>`,
        text: `Verify your email: ${link}`,
      });
    } catch (e) {
      this.logger.error(`Failed to send verification email to ${email}`, e instanceof Error ? e.stack : undefined);
    }
  }

  async verifyEmail(email: string, token: string): Promise<void> {
    const stored = await this.redis.get(`email_verify:${email}`);
    if (!stored || stored !== token) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }
    await this.redis.del(`email_verify:${email}`);
    await this.prisma.user.update({ where: { email }, data: { isEmailVerified: true } });
  }
}

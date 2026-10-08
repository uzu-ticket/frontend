import { BadRequestException, ConflictException, Injectable, Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import * as bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { newId } from "../../common/id";
import { REDIS_CLIENT } from "../../common/redis/redis.module";
import type Redis from "ioredis";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";
import { OtpService } from "./otp.service";
import { ClientDeviceInfo } from "../../common/utils/device-detector.util";

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

  async register(
    email: string,
    password: string,
    fullName?: string,
    phone?: string,
    clientInfo?: ClientDeviceInfo,
  ): Promise<TokenPair> {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.linkGuestOrdersOnCreate(
      await this.prisma.user.create({
        data: { id: newId(), email: normalizedEmail, passwordHash, fullName, phone, isEmailVerified: false },
      }),
    );

    // Send email verification link
    await this.requestEmailVerification(normalizedEmail);

    const session = await this.createSession(user.id, clientInfo);
    await this.recordLoginActivity(user.id, clientInfo, "success");

    return this.issueTokens(user.id, user.email, session?.id);
  }

  async login(email: string, password: string, clientInfo?: ClientDeviceInfo): Promise<TokenPair> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      if (user) {
        await this.recordLoginActivity(user.id, clientInfo, "failed");
      }
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.status !== "active") {
      throw new UnauthorizedException("Account is not active");
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const session = await this.createSession(user.id, clientInfo);
    await this.recordLoginActivity(user.id, clientInfo, "success");

    return this.issueTokens(user.id, user.email, session?.id);
  }

  async requestOtp(email: string): Promise<void> {
    await this.otpService.requestOtp(email);
  }

  async verifyOtpAndLogin(email: string, code: string, clientInfo?: ClientDeviceInfo): Promise<TokenPair> {
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
    const session = await this.createSession(user.id, clientInfo);
    await this.recordLoginActivity(user.id, clientInfo, "success");

    return this.issueTokens(user.id, user.email, session?.id);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string; sessionId?: string }>(refreshToken, {
        secret: this.config.jwtRefreshSecret,
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.status !== "active") {
        throw new UnauthorizedException();
      }
      if (payload.sessionId) {
        const session = await this.prisma.userSession.findUnique({ where: { id: payload.sessionId } });
        if (session?.revokedAt) {
          throw new UnauthorizedException("Session has been revoked");
        }
        await this.prisma.userSession.update({
          where: { id: payload.sessionId },
          data: { lastActiveAt: new Date() },
        });
      }
      return this.issueTokens(user.id, user.email, payload.sessionId);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  getGoogleAuthUrl(redirectUri?: string): string {
    const clientId = this.config.googleClientId;
    if (!clientId) {
      throw new BadRequestException(
        "Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.",
      );
    }
    const redirect = redirectUri || this.config.googleCallbackUrl;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirect,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async loginWithGoogle(
    code: string,
    redirectUri?: string,
    clientInfo?: ClientDeviceInfo,
  ): Promise<TokenPair & { user: any }> {
    const clientId = this.config.googleClientId;
    const clientSecret = this.config.googleClientSecret;
    if (!clientId || !clientSecret) {
      throw new BadRequestException(
        "Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.",
      );
    }
    const redirect = redirectUri || this.config.googleCallbackUrl;

    let tokenRes;
    try {
      tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect,
          grant_type: "authorization_code",
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );
    } catch (err: any) {
      const detail = err.response?.data?.error_description || err.response?.data?.error || err.message;
      this.logger.error(`Google token exchange failed: ${detail}`, err.stack);
      throw new UnauthorizedException(`Failed to exchange Google authorization code: ${detail}`);
    }

    const accessToken = tokenRes.data?.access_token;
    if (!accessToken) {
      throw new UnauthorizedException("Google did not return an access token");
    }

    let userRes;
    try {
      userRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err: any) {
      this.logger.error("Failed to fetch Google user profile", err);
      throw new UnauthorizedException("Failed to fetch Google user profile");
    }

    const { email, name, picture, email_verified } = userRes.data;
    if (!email) {
      throw new UnauthorizedException("No email returned by Google account");
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      // Sign Up: New user from Google
      user = await this.linkGuestOrdersOnCreate(
        await this.prisma.user.create({
          data: {
            id: newId(),
            email: normalizedEmail,
            fullName: name || undefined,
            avatarUrl: picture || undefined,
            isEmailVerified: Boolean(email_verified),
            status: "active",
          },
        }),
      );
    } else {
      // Sign In: Existing user, update profile details if missing
      const updateData: any = {};
      if (!user.fullName && name) updateData.fullName = name;
      if (!user.avatarUrl && picture) updateData.avatarUrl = picture;
      if (!user.isEmailVerified && email_verified) updateData.isEmailVerified = true;

      if (Object.keys(updateData).length > 0) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    }

    if (user.status !== "active") {
      throw new UnauthorizedException("Account is not active");
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const session = await this.createSession(user.id, clientInfo);
    await this.recordLoginActivity(user.id, clientInfo, "success");

    const tokens = await this.issueTokens(user.id, user.email, session?.id);
    const { passwordHash: _, totpSecret: __, ...safeUser } = user;
    return { ...tokens, user: safeUser };
  }

  private async createSession(userId: string, clientInfo?: ClientDeviceInfo) {
    try {
      return await this.prisma.userSession.create({
        data: {
          id: newId(),
          userId,
          device: clientInfo?.device || "Desktop",
          browser: clientInfo?.browser || "Unknown Browser",
          os: clientInfo?.os || "Unknown OS",
          ipAddress: clientInfo?.ipAddress || "127.0.0.1",
          location: clientInfo?.location || "Lagos, Nigeria",
          userAgent: clientInfo?.userAgent || "",
          lastActiveAt: new Date(),
        },
      });
    } catch (e) {
      this.logger.error("Failed to create user session", e);
      return null;
    }
  }

  private async recordLoginActivity(userId: string, clientInfo?: ClientDeviceInfo, status = "success") {
    try {
      await this.prisma.loginActivity.create({
        data: {
          id: newId(),
          userId,
          device: clientInfo?.device || "Desktop",
          browser: clientInfo?.browser || "Unknown Browser",
          os: clientInfo?.os || "Unknown OS",
          ipAddress: clientInfo?.ipAddress || "127.0.0.1",
          location: clientInfo?.location || "Lagos, Nigeria",
          userAgent: clientInfo?.userAgent || "",
          status,
        },
      });
    } catch (e) {
      this.logger.error("Failed to record login activity", e);
    }
  }

  private async issueTokens(userId: string, email: string, sessionId?: string): Promise<TokenPair> {
    const payload = { sub: userId, email, sessionId };
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

  async requestPasswordReset(contact: string, channel: "email" | "phone"): Promise<{ token?: string; code?: string }> {
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
        this.logger.error(
          `Failed to send password reset email to ${contact}`,
          e instanceof Error ? e.stack : undefined,
        );
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

  async requestEmailVerification(email: string): Promise<{ token: string; link: string } | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || user.isEmailVerified) return;
    const token = randomInt(0, 1_000_000_000_000).toString(36);
    await this.redis.set(`email_verify:${normalizedEmail}`, token, "EX", 86400);
    const link = `${this.config.appBaseUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;
    this.logger.log(`[VERIFICATION EMAIL LINK]: ${link}`);
    try {
      await this.notifications.sendEmail({
        to: normalizedEmail,
        subject: "Verify your UzuTicket email",
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #0E2615; margin-top: 0;">Verify your email address</h2>
            <p style="color: #374151; font-size: 15px; line-height: 1.5;">Welcome to UzuTicket! Please click the button below to verify your email address and activate your account.</p>
            <p style="margin: 24px 0;">
              <a href="${link}" style="background-color: #3FD246; color: #0E2615; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email Address
              </a>
            </p>
            <p style="color: #6b7280; font-size: 13px;">If you didn't create an account with UzuTicket, you can safely ignore this email.</p>
          </div>
        `,
        text: `Verify your email: ${link}`,
      });
    } catch (e) {
      this.logger.error(`Failed to send verification email to ${normalizedEmail}`, e instanceof Error ? e.stack : undefined);
    }
    return { token, link };
  }

  async verifyEmail(email: string, token: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      throw new UnauthorizedException("User account not found");
    }
    if (user.isEmailVerified) {
      return;
    }

    const stored = await this.redis.get(`email_verify:${normalizedEmail}`);
    if (!stored || stored !== token) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }
    await this.redis.del(`email_verify:${normalizedEmail}`);
    await this.prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });
  }
}

import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";
import { randomInt } from "crypto";
import { REDIS_CLIENT } from "../../common/redis/redis.module";
import { AppConfigService } from "../../config/app-config.service";
import { NOTIFICATION_PROVIDER, NotificationProvider } from "../../common/notifications/notification-provider";

/**
 * Email OTP for passwordless login/registration (PRD §3.4 "email/phone +
 * password or OTP"). SMS OTP is not wired — no SMS provider in scope yet.
 */
@Injectable()
export class OtpService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
    private readonly config: AppConfigService,
  ) {}

  private key(email: string): string {
    return `otp:${email.toLowerCase()}`;
  }

  async requestOtp(email: string): Promise<void> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    await this.redis.set(this.key(email), code, "EX", this.config.otpTtlSeconds);
    await this.notifications.sendEmail({
      to: email,
      subject: "Your UzuTicket verification code",
      html: `<p>Your verification code is <strong>${code}</strong>. It expires in ${Math.round(
        this.config.otpTtlSeconds / 60,
      )} minutes.</p>`,
      text: `Your verification code is ${code}. It expires in ${Math.round(this.config.otpTtlSeconds / 60)} minutes.`,
    });
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(this.key(email));
    if (!stored || stored !== code) {
      return false;
    }
    await this.redis.del(this.key(email));
    return true;
  }
}

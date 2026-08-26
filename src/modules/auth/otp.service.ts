import { Inject, Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import { randomInt } from "crypto";
import { REDIS_CLIENT } from "../../common/redis/redis.module";
import { AppConfigService } from "../../config/app-config.service";
import {
  NOTIFICATION_PROVIDER,
  NotificationProvider,
  SendSmsInput,
} from "../../common/notifications/notification-provider";

/**
 * Email OTP for passwordless login/registration (PRD §3.4 "email/phone +
 * password or OTP"). SMS OTP stub — no SMS provider in scope yet.
 */
@Injectable()
export class OtpService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(NOTIFICATION_PROVIDER) private readonly notifications: NotificationProvider,
    private readonly config: AppConfigService,
  ) {}

  private readonly logger = new Logger(OtpService.name);

  private key(email: string): string {
    return `otp:${email.toLowerCase()}`;
  }

  async requestOtp(email: string): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    await this.redis.set(this.key(email), code, "EX", this.config.otpTtlSeconds);
    try {
      await this.notifications.sendEmail({
        to: email,
        subject: "Your UzuTicket verification code",
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in ${Math.round(
          this.config.otpTtlSeconds / 60,
        )} minutes.</p>`,
        text: `Your verification code is ${code}. It expires in ${Math.round(this.config.otpTtlSeconds / 60)} minutes.`,
      });
    } catch (e) {
      this.logger.error(`Failed to send OTP email to ${email}`, e instanceof Error ? e.stack : undefined);
    }
    return code;
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(this.key(email));
    if (!stored || stored !== code) {
      return false;
    }
    await this.redis.del(this.key(email));
    return true;
  }

  async requestSmsOtp(phone: string): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const key = `otp:${phone}`;
    await this.redis.set(key, code, "EX", this.config.otpTtlSeconds);
    try {
      await this.notifications.sendSms({
        to: phone,
        body: `Your UzuTicket verification code is ${code}. It expires in ${Math.round(this.config.otpTtlSeconds / 60)} minutes.`,
      });
    } catch (e) {
      this.logger.error(`Failed to send SMS OTP to ${phone}`, e instanceof Error ? e.stack : undefined);
    }
    return code;
  }

  async verifySmsOtp(phone: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(`otp:${phone}`);
    if (!stored || stored !== code) {
      return false;
    }
    await this.redis.del(`otp:${phone}`);
    return true;
  }
}

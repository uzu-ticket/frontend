import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env.schema";

/**
 * Thin typed wrapper around ConfigService<Env> so the rest of the app never
 * touches raw process.env or deals with zod's inferred optionality directly.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get isProduction(): boolean {
    return this.config.get("NODE_ENV", { infer: true }) === "production";
  }

  get port(): number {
    return this.config.get("PORT", { infer: true });
  }

  get appBaseUrl(): string {
    return this.config.get("APP_BASE_URL", { infer: true });
  }

  get corsOrigins(): string[] {
    const raw = this.config.get("CORS_ORIGINS", { infer: true });
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  get awsRegion(): string {
    return this.config.get("AWS_REGION", { infer: true });
  }

  get awsS3Bucket(): string | undefined {
    return this.config.get("AWS_S3_BUCKET", { infer: true });
  }

  get awsS3PublicBaseUrl(): string | undefined {
    return this.config.get("AWS_S3_PUBLIC_BASE_URL", { infer: true });
  }

  get awsAccessKeyId(): string | undefined {
    return this.config.get("AWS_ACCESS_KEY_ID", { infer: true });
  }

  get awsSecretAccessKey(): string | undefined {
    return this.config.get("AWS_SECRET_ACCESS_KEY", { infer: true });
  }

  get databaseUrl(): string {
    return this.config.get("DATABASE_URL", { infer: true });
  }

  get redisUrl(): string {
    return this.config.get("REDIS_URL", { infer: true });
  }

  get mqttUrl(): string {
    return this.config.get("MQTT_URL", { infer: true });
  }

  get jwtAccessSecret(): string {
    return this.config.get("JWT_ACCESS_SECRET", { infer: true });
  }

  get jwtAccessTtl(): string {
    return this.config.get("JWT_ACCESS_TTL", { infer: true });
  }

  get jwtRefreshSecret(): string {
    return this.config.get("JWT_REFRESH_SECRET", { infer: true });
  }

  get jwtRefreshTtl(): string {
    return this.config.get("JWT_REFRESH_TTL", { infer: true });
  }

  get otpTtlSeconds(): number {
    return this.config.get("OTP_TTL_SECONDS", { infer: true });
  }

  get platformAdminEmails(): string[] {
    return this.config
      .get("PLATFORM_ADMIN_EMAILS", { infer: true })
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }

  get signingKeyMasterSecret(): Buffer {
    const secret: string = this.config.get("SIGNING_KEY_MASTER_SECRET", { infer: true });
    return Buffer.from(secret, "hex");
  }

  get paystackSecretKey(): string {
    return this.config.get("PAYSTACK_SECRET_KEY", { infer: true });
  }

  get paystackPublicKey(): string {
    return this.config.get("PAYSTACK_PUBLIC_KEY", { infer: true });
  }

  get boucloudApiToken(): string | undefined {
    return this.config.get("BOUCLOUD_API_TOKEN", { infer: true });
  }

  get boucloudApiBaseUrl(): string {
    return this.config.get("BOUCLOUD_API_BASE_URL", { infer: true });
  }

  get platformFeePercentBps(): number {
    return this.config.get("PLATFORM_FEE_PERCENT_BPS", { infer: true });
  }

  get platformFeeFixedMinor(): bigint {
    return BigInt(this.config.get("PLATFORM_FEE_FIXED_MINOR", { infer: true }));
  }

  get defaultRiskHoldPercentBps(): number {
    return this.config.get("DEFAULT_RISK_HOLD_PERCENT_BPS", { infer: true });
  }

  get pendingOrderTimeoutMinutes(): number {
    return this.config.get("PENDING_ORDER_TIMEOUT_MINUTES", { infer: true });
  }

  get manifestRetentionDays(): number {
    return this.config.get("MANIFEST_RETENTION_DAYS", { infer: true });
  }

  get smtp() {
    return {
      host: this.config.get("SMTP_HOST", { infer: true }),
      port: this.config.get("SMTP_PORT", { infer: true }),
      secure: this.config.get("SMTP_SECURE", { infer: true }),
      user: this.config.get("SMTP_USER", { infer: true }),
      pass: this.config.get("SMTP_PASS", { infer: true }),
      from: this.config.get("SMTP_FROM", { infer: true }),
    };
  }

  get mailgun() {
    return {
      apiKey: this.config.get("MAILGUN_API_KEY", { infer: true }),
      domain: this.config.get("MAILGUN_DOMAIN", { infer: true }),
      from: this.config.get("MAILGUN_FROM", { infer: true }) || this.smtp.from,
    };
  }
}

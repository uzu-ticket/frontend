import { z } from "zod";

/**
 * z.coerce.boolean() is a trap for env vars: it calls JS `Boolean(value)`,
 * and `Boolean("false")` is `true` (any non-empty string is truthy). This
 * parses the literal strings "true"/"false" instead.
 */
const booleanString = z
  .enum(["true", "false"])
  .default("false")
  .transform((v) => v === "true");

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_BASE_URL: z.string().url(),
  CORS_ORIGINS: z.string().default(""),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  MQTT_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_REFRESH_TTL: z.string().default("30d"),
  OTP_TTL_SECONDS: z.coerce.number().int().positive().default(300),

  PLATFORM_ADMIN_EMAILS: z.string().default(""),

  SIGNING_KEY_MASTER_SECRET: z
    .string()
    .regex(/^[0-9a-f]{64}$/i, "must be a 32-byte hex string (64 hex chars)"),

  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_PUBLIC_KEY: z.string().min(1),

  PLATFORM_FEE_PERCENT_BPS: z.coerce.number().int().min(0).default(500),
  PLATFORM_FEE_FIXED_MINOR: z.coerce.number().int().min(0).default(10000),
  DEFAULT_RISK_HOLD_PERCENT_BPS: z.coerce.number().int().min(0).max(10000).default(1000),

  PENDING_ORDER_TIMEOUT_MINUTES: z.coerce.number().int().positive().default(30),
  MANIFEST_RETENTION_DAYS: z.coerce.number().int().positive().default(14),

  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_SECURE: booleanString,
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("UzuTicket <tickets@uzuticket.com>"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${message}`);
  }
  return parsed.data;
}

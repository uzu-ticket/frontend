import { IsIn, IsOptional, IsString } from "class-validator";

export const SUPPORTED_PROVIDERS = [
  "paystack",
  "mailchimp",
  "google-analytics",
  "meta-pixel",
  "zapier",
  "paypal",
  "flutterwave",
] as const;

export type SupportedProvider = (typeof SUPPORTED_PROVIDERS)[number];

export class ConnectIntegrationDto {
  @IsOptional()
  @IsString()
  publicKey?: string;

  @IsOptional()
  @IsString()
  secretKey?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsString()
  audienceId?: string;

  @IsOptional()
  @IsString()
  pixelId?: string;

  @IsOptional()
  @IsString()
  measurementId?: string;
}

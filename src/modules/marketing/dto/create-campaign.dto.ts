import { Type } from "class-transformer";
import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCampaignDto {
  @IsString()
  @MaxLength(160)
  subject!: string;

  @IsString()
  bodyHtml!: string;

  @IsOptional()
  @IsString()
  segmentCity?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

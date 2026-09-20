import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class CreatePromoterLinkDto {
  @IsUUID()
  eventId!: string;

  @IsIn(["percentage", "fixed"])
  commissionType!: "percentage" | "fixed";

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionValue!: number;

  @IsOptional()
  @IsIn(["never", "7days", "30days", "event-end"])
  expiration?: "never" | "7days" | "30days" | "event-end";
}

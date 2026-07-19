import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateTicketTypeDto {
  @IsString()
  @MinLength(1)
  name!: string;

  /** Minor units (kobo). 0 = free/RSVP. */
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceMinor!: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantityTotal!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perOrderLimit?: number;

  @IsOptional()
  @IsDateString()
  saleStartsAt?: string;

  @IsOptional()
  @IsDateString()
  saleEndsAt?: string;
}

export class UpdateTicketTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceMinor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantityTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perOrderLimit?: number;

  @IsOptional()
  @IsDateString()
  saleStartsAt?: string;

  @IsOptional()
  @IsDateString()
  saleEndsAt?: string;
}

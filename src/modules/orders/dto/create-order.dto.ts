import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { EmbedChannel } from "@prisma/client";

export class RecipientDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateOrderItemDto {
  @IsUUID()
  ticketTypeId!: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity!: number;

  /**
   * Split delivery (PRD §3.3): one recipient per ticket. Length must equal
   * `quantity` if provided; omit to send every ticket in this line to the buyer.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients?: RecipientDto[];
}

export class CreateOrderDto {
  @IsUUID()
  eventId!: string;

  @IsString()
  buyerName!: string;

  @IsEmail()
  buyerEmail!: string;

  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @IsOptional()
  @IsEnum(EmbedChannel)
  channel?: EmbedChannel;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}

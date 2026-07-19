import { ArrayMinSize, IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class ResendAllDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ResendSelectedDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("all", { each: true })
  ticketIds!: string[];

  @IsOptional()
  @IsString()
  reason?: string;
}

export class RegenerateTicketDto {
  @IsString()
  reason!: string;
}

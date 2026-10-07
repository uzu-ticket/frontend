import { IsDateString, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";

const time12HourPattern = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

export class EventScheduleDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsDateString()
  dateObj?: string | null;

  @IsOptional()
  @IsString()
  @Matches(time12HourPattern)
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(time12HourPattern)
  endTime?: string;
}

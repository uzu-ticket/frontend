import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class AddEventImageDto {
  @IsString()
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsBoolean()
  isCover?: boolean;
}

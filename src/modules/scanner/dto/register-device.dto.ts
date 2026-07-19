import { IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDeviceDto {
  @IsString()
  @MinLength(4)
  deviceFingerprint!: string;

  @IsOptional()
  @IsString()
  deviceLabel?: string;
}

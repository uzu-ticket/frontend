import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsString, ValidateNested } from "class-validator";

export class OnlineScanDto {
  @IsString()
  qrCode!: string;
}

export class OfflineScanItemDto {
  @IsString()
  qrCode!: string;

  /** Device monotonic clock reading (ms) at the moment of this scan — translated server-side using the assignment's offset. */
  @IsInt()
  scannedAtMonotonicMs!: number;
}

export class OfflineSyncDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OfflineScanItemDto)
  scans!: OfflineScanItemDto[];
}

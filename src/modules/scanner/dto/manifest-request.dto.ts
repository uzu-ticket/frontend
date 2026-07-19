import { IsInt } from "class-validator";

export class ManifestRequestDto {
  /** Device's monotonic clock reading (ms) at the moment of this request — integrity doc §8 decision 3. */
  @IsInt()
  deviceMonotonicMs!: number;
}

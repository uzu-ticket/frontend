import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class AddEventImageDto {
  @IsString()
  url!: string;

  /**
   * The S3 object key for the uploaded file.
   * When provided, the backend uses this to generate presigned GET URLs
   * instead of serving the direct (non-public) S3 URL.
   */
  @IsOptional()
  @IsString()
  s3Key?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsBoolean()
  isCover?: boolean;
}

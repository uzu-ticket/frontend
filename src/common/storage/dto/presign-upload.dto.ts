import { IsIn, IsInt, IsString, Max, Min } from "class-validator";

/** MIME types accepted for image uploads */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_TYPES)[number];

/** Max file size: 10 MB in bytes */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export class PresignUploadDto {
  /** Original filename — used only to derive the extension */
  @IsString()
  fileName!: string;

  /** MIME type of the file to be uploaded */
  @IsIn(ALLOWED_IMAGE_TYPES, {
    message: `contentType must be one of: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
  })
  contentType!: AllowedImageMimeType;

  /** File size in bytes — validated server-side before issuing the URL */
  @IsInt()
  @Min(1)
  @Max(MAX_FILE_SIZE, { message: `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024} MB` })
  fileSize!: number;
}

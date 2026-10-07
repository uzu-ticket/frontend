import { IsIn } from "class-validator";
import { PresignUploadDto } from "../../../common/storage/dto/presign-upload.dto";

export class PresignEventUploadDto extends PresignUploadDto {
  /** Which event asset slot this upload is for */
  @IsIn(["cover", "gallery"], { message: "assetType must be 'cover' or 'gallery'" })
  assetType!: "cover" | "gallery";
}

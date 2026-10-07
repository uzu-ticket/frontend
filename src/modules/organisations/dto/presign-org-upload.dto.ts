import { IsIn } from "class-validator";
import { PresignUploadDto } from "../../../common/storage/dto/presign-upload.dto";

export class PresignOrgUploadDto extends PresignUploadDto {
  /** Which organisation asset slot this upload is for */
  @IsIn(["logo", "cover"], { message: "assetType must be 'logo' or 'cover'" })
  assetType!: "logo" | "cover";
}

import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "multer";
import { extname } from "node:path";
import { randomUUID } from "node:crypto";
import { AppConfigService } from "../../config/app-config.service";

export interface PresignedUploadResult {
  /** The signed URL the client should HTTP PUT the file to */
  uploadUrl: string;
  /** The permanent public URL of the file once uploaded */
  fileUrl: string;
  /** The S3 object key (useful for debugging / audit) */
  key: string;
}

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor(private readonly config: AppConfigService) {
    const credentials =
      this.config.awsAccessKeyId && this.config.awsSecretAccessKey
        ? {
            accessKeyId: this.config.awsAccessKeyId,
            secretAccessKey: this.config.awsSecretAccessKey,
          }
        : undefined;

    this.client = new S3Client({
      region: this.config.awsRegion,
      credentials,
    });
  }

  // ---------------------------------------------------------------------------
  // Legacy server-side upload helpers (kept for backwards compatibility)
  // ---------------------------------------------------------------------------

  async uploadOrganisationAsset(
    organisationId: string,
    type: "logo" | "cover",
    file: Express.Multer.File,
  ): Promise<string> {
    return this.uploadAssetToBucket(`organisations/${organisationId}/${type}`, file);
  }

  async uploadEventAsset(
    organisationId: string,
    eventId: string,
    type: "cover",
    file: Express.Multer.File,
  ): Promise<string> {
    return this.uploadAssetToBucket(`events/${organisationId}/${eventId}/${type}`, file);
  }

  // ---------------------------------------------------------------------------
  // Presigned-URL helpers — client uploads directly to S3
  // ---------------------------------------------------------------------------

  /**
   * Generate a presigned PUT URL for an organisation asset (logo / cover).
   * The URL expires in `expiresIn` seconds (default 10 min).
   */
  async presignOrganisationAsset(
    organisationId: string,
    type: "logo" | "cover",
    fileName: string,
    contentType: string,
    expiresIn = 600,
  ): Promise<PresignedUploadResult> {
    const prefix = `organisations/${organisationId}/${type}`;
    return this.createPresignedUrl(prefix, fileName, contentType, expiresIn);
  }

  /**
   * Generate a presigned PUT URL for an event asset (cover / gallery).
   */
  async presignEventAsset(
    organisationId: string,
    eventId: string,
    type: "cover" | "gallery",
    fileName: string,
    contentType: string,
    expiresIn = 600,
  ): Promise<PresignedUploadResult> {
    const prefix = `events/${organisationId}/${eventId}/${type}`;
    return this.createPresignedUrl(prefix, fileName, contentType, expiresIn);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async createPresignedUrl(
    prefix: string,
    fileName: string,
    contentType: string,
    expiresIn: number,
  ): Promise<PresignedUploadResult> {
    if (!this.config.awsS3Bucket) {
      throw new ServiceUnavailableException("File storage is not configured");
    }

    const extension = extname(fileName).toLowerCase() || ".bin";
    const key = `${prefix}/${randomUUID()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.config.awsS3Bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });

    const baseUrl =
      this.config.awsS3PublicBaseUrl?.replace(/\/$/, "") ||
      `https://${this.config.awsS3Bucket}.s3.${this.config.awsRegion}.amazonaws.com`;

    return {
      uploadUrl,
      fileUrl: `${baseUrl}/${key}`,
      key,
    };
  }

  private async uploadAssetToBucket(prefix: string, file: Express.Multer.File): Promise<string> {
    if (!this.config.awsS3Bucket) {
      throw new ServiceUnavailableException("File storage is not configured");
    }

    const extension = extname(file.originalname).toLowerCase() || ".bin";
    const key = `${prefix}/${randomUUID()}${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.awsS3Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const baseUrl =
      this.config.awsS3PublicBaseUrl?.replace(/\/$/, "") ||
      `https://${this.config.awsS3Bucket}.s3.${this.config.awsRegion}.amazonaws.com`;

    return `${baseUrl}/${key}`;
  }
}

import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "multer";
import { extname } from "node:path";
import { randomUUID } from "node:crypto";
import { AppConfigService } from "../../config/app-config.service";

export interface PresignedUploadResult {
  /** The signed URL the client should HTTP PUT the file to */
  uploadUrl: string;
  /** The base S3 URL of the file (NOT publicly accessible — bucket is private) */
  fileUrl: string;
  /** The S3 object key — persist this in the DB; use it to generate presigned GET URLs */
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
  // Presigned PUT URL helpers — client uploads directly to S3
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
    return this.createPresignedPutUrl(prefix, fileName, contentType, expiresIn);
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
    return this.createPresignedPutUrl(prefix, fileName, contentType, expiresIn);
  }

  // ---------------------------------------------------------------------------
  // Presigned GET URL — generate a time-limited viewing URL for a stored object
  // ---------------------------------------------------------------------------

  /**
   * Generate a presigned GET URL for an S3 object key.
   *
   * ⚠️  The caller MUST validate that the requesting user is authorized to
   * access the object before calling this method (e.g. by checking org
   * membership and verifying the key belongs to the requested event/image row).
   * Never sign an arbitrary key supplied by the client.
   *
   * @param key      - The S3 object key stored persistently in the DB (s3Key)
   * @param expiresIn - Seconds until the URL expires (default 1 h; max ~7 days)
   */
  async presignGetUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!this.config.awsS3Bucket) {
      throw new ServiceUnavailableException("File storage is not configured");
    }

    const command = new GetObjectCommand({
      Bucket: this.config.awsS3Bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async createPresignedPutUrl(
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

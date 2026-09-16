import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "node:path";
import { randomUUID } from "node:crypto";
import { AppConfigService } from "../../config/app-config.service";

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

  async uploadOrganisationAsset(
    organisationId: string,
    type: "logo" | "cover",
    file: Express.Multer.File,
  ): Promise<string> {
    if (!this.config.awsS3Bucket) {
      throw new ServiceUnavailableException("File storage is not configured");
    }

    const extension = extname(file.originalname).toLowerCase() || ".bin";
    const key = `organisations/${organisationId}/${type}/${randomUUID()}${extension}`;

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

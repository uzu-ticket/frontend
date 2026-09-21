import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

export interface FormattedApiKey {
  id: string;
  name: string;
  keyMasked: string;
  fullKey?: string;
  environment: string;
  permissions: string[];
  createdDate: string;
  status: "Active" | "Revoked";
}

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService,
  ) {}

  private async assertOrgAccess(organisationId: string, userId: string) {
    await this.permissions.assertPermission(
      userId,
      organisationId,
      Permission.EventViewDashboard,
    );
  }

  /** List all API keys for an organisation */
  async list(
    organisationId: string,
    userId: string,
  ): Promise<FormattedApiKey[]> {
    await this.assertOrgAccess(organisationId, userId);

    const keys = await this.prisma.apiKey.findMany({
      where: { organisationId },
      orderBy: { createdAt: "desc" },
    });

    return keys.map((k) => this.formatKey(k));
  }

  /** Create a new API key for an organisation */
  async create(
    organisationId: string,
    userId: string,
    dto: CreateApiKeyDto,
  ): Promise<FormattedApiKey> {
    await this.assertOrgAccess(organisationId, userId);

    const isLive =
      !dto.environment ||
      dto.environment.toLowerCase().includes("live") ||
      dto.environment.toLowerCase().includes("production");

    const envLabel = isLive ? "Live (Production)" : "Test (Sand hook)";
    const keyPrefixStr = isLive ? "SK_Live_" : "SK_Test_";

    // Generate 24 random bytes (48 hex chars)
    const randomHex = randomBytes(24).toString("hex");
    const fullKey = `${keyPrefixStr}${randomHex}`;

    // Hash with SHA-256 for secure DB storage
    const keyHash = createHash("sha256").update(fullKey).digest("hex");

    // Key prefix matches fullKey (e.g., SK_Live_a1b2 / SK_Test_a1b2)
    const keyPrefix = `${keyPrefixStr}${randomHex.slice(0, 4)}`;

    const id = newId();
    const created = await this.prisma.apiKey.create({
      data: {
        id,
        organisationId,
        keyPrefix,
        keyHash,
        label: dto.label || "New API key",
        environment: envLabel,
        permissions: dto.permissions || [
          "Read - View events, tickets, etc.",
          "Write - Create and update resources",
        ],
        isActive: true,
      },
    });

    const formatted = this.formatKey(created);
    formatted.fullKey = fullKey; // Only returned once on creation!
    return formatted;
  }

  /** Revoke an API key */
  async revoke(
    organisationId: string,
    userId: string,
    keyId: string,
  ): Promise<FormattedApiKey> {
    await this.assertOrgAccess(organisationId, userId);

    const key = await this.prisma.apiKey.findFirst({
      where: { id: keyId, organisationId },
    });

    if (!key) {
      throw new NotFoundException("API key not found");
    }

    const updated = await this.prisma.apiKey.update({
      where: { id: keyId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    return this.formatKey(updated);
  }

  private formatKey(k: {
    id: string;
    label: string | null;
    keyPrefix: string;
    environment: string | null;
    permissions: string[];
    isActive: boolean;
    createdAt: Date;
  }): FormattedApiKey {
    const formattedDate = new Date(k.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return {
      id: k.id,
      name: k.label || "API Key",
      keyMasked: `${k.keyPrefix}************************`,
      environment: k.environment || "Live (Production)",
      permissions: k.permissions,
      createdDate: formattedDate,
      status: k.isActive ? "Active" : "Revoked",
    };
  }
}

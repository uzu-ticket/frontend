import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import {
  ConnectIntegrationDto,
  SUPPORTED_PROVIDERS,
  SupportedProvider,
} from "./dto/connect-integration.dto";

// ---------------------------------------------------------------------------
// Static catalogue — merged with live DB rows at query time
// ---------------------------------------------------------------------------
export interface IntegrationCatalogueEntry {
  provider: SupportedProvider;
  name: string;
  category: "Payment" | "Email Marketing" | "Analytics" | "Automation";
  description: string;
  logoKey: string;
}

const CATALOGUE: IntegrationCatalogueEntry[] = [
  {
    provider: "paystack",
    name: "Paystack",
    category: "Payment",
    description: "Accept payments for your events",
    logoKey: "paystack",
  },
  {
    provider: "mailchimp",
    name: "Mailchimp",
    category: "Email Marketing",
    description: "Send emails and manage audiences",
    logoKey: "mailchimp",
  },
  {
    provider: "google-analytics",
    name: "Google Analytics",
    category: "Analytics",
    description: "Track website traffic and conversion data",
    logoKey: "google-analytics",
  },
  {
    provider: "meta-pixel",
    name: "Meta Pixel",
    category: "Analytics",
    description: "Track Facebook ad performance and visitor activity",
    logoKey: "meta-pixel",
  },
  {
    provider: "zapier",
    name: "Zapier",
    category: "Automation",
    description: "Connect UzuTicket to 5,000+ web applications",
    logoKey: "zapier",
  },
  {
    provider: "paypal",
    name: "PayPal",
    category: "Payment",
    description: "Accept international PayPal payments",
    logoKey: "paypal",
  },
  {
    provider: "flutterwave",
    name: "Flutterwave",
    category: "Payment",
    description: "Accept cards, mobile money & bank transfers",
    logoKey: "flutterwave",
  },
];

// ---------------------------------------------------------------------------
// Encryption helpers (AES-256-GCM)
// ---------------------------------------------------------------------------
const ALGO = "aes-256-gcm" as const;

function getEncKey(): Buffer {
  const secret = process.env.APP_SECRET ?? "default-secret-replace-me-32chars";
  // Derive a 32-byte key from the secret (simple zero-pad/truncate)
  return Buffer.from(secret.padEnd(32, "0").slice(0, 32), "utf8");
}

function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, getEncKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // iv(12) + tag(16) + ciphertext — base64 encoded
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(encoded: string): string {
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = createDecipheriv(ALGO, getEncKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

function maskSecret(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const plain = decrypt(value);
    return plain.slice(0, 6) + "••••••••";
  } catch {
    return "••••••••";
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
@Injectable()
export class IntegrationsService {
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

  private assertValidProvider(provider: string): SupportedProvider {
    if (!SUPPORTED_PROVIDERS.includes(provider as SupportedProvider)) {
      throw new BadRequestException(`Unsupported integration provider: ${provider}`);
    }
    return provider as SupportedProvider;
  }

  // -------------------------------------------------------------------------
  // LIST — merge catalogue with DB rows
  // -------------------------------------------------------------------------
  async list(organisationId: string, userId: string) {
    await this.assertOrgAccess(organisationId, userId);

    const rows = await this.prisma.orgIntegration.findMany({
      where: { organisationId },
    });

    const rowByProvider = new Map(rows.map((r) => [r.provider, r]));

    const integrations = CATALOGUE.map((entry) => {
      const row = rowByProvider.get(entry.provider);
      return {
        id: entry.provider,
        provider: entry.provider,
        name: entry.name,
        category: entry.category,
        description: entry.description,
        logoKey: entry.logoKey,
        status: "Live" as const,
        connected: row?.isConnected ?? false,
        connectedAt: row?.createdAt ?? null,
        publicKey: row ? maskSecret(row.publicKey) : null,
      };
    });

    return {
      data: {
        connected: integrations.filter((i) => i.connected),
        available: integrations.filter((i) => !i.connected),
      },
    };
  }

  // -------------------------------------------------------------------------
  // GET ONE
  // -------------------------------------------------------------------------
  async getOne(organisationId: string, userId: string, provider: string) {
    await this.assertOrgAccess(organisationId, userId);
    const validProvider = this.assertValidProvider(provider);
    const entry = CATALOGUE.find((c) => c.provider === validProvider)!;

    const row = await this.prisma.orgIntegration.findUnique({
      where: { organisationId_provider: { organisationId, provider: validProvider } },
    });

    return {
      data: {
        id: validProvider,
        provider: validProvider,
        name: entry.name,
        category: entry.category,
        description: entry.description,
        logoKey: entry.logoKey,
        status: "Live" as const,
        connected: row?.isConnected ?? false,
        connectedAt: row?.createdAt ?? null,
        publicKey: row ? maskSecret(row.publicKey) : null,
        webhookUrl: row?.webhookUrl ?? null,
        audienceId: row?.audienceId ?? null,
        pixelId: row?.pixelId ?? null,
        measurementId: row?.measurementId ?? null,
      },
    };
  }

  // -------------------------------------------------------------------------
  // CONNECT — upsert credentials
  // -------------------------------------------------------------------------
  async connect(
    organisationId: string,
    userId: string,
    provider: string,
    dto: ConnectIntegrationDto,
  ) {
    await this.assertOrgAccess(organisationId, userId);
    const validProvider = this.assertValidProvider(provider);
    const entry = CATALOGUE.find((c) => c.provider === validProvider)!;

    const row = await this.prisma.orgIntegration.upsert({
      where: {
        organisationId_provider: { organisationId, provider: validProvider },
      },
      create: {
        id: newId(),
        organisationId,
        provider: validProvider,
        category: entry.category,
        isConnected: true,
        publicKey: dto.publicKey ? encrypt(dto.publicKey) : null,
        secretKey: dto.secretKey ? encrypt(dto.secretKey) : null,
        webhookUrl: dto.webhookUrl ?? null,
        audienceId: dto.audienceId ?? null,
        pixelId: dto.pixelId ?? null,
        measurementId: dto.measurementId ?? null,
      },
      update: {
        isConnected: true,
        ...(dto.publicKey !== undefined && {
          publicKey: encrypt(dto.publicKey),
        }),
        ...(dto.secretKey !== undefined && {
          secretKey: encrypt(dto.secretKey),
        }),
        ...(dto.webhookUrl !== undefined && { webhookUrl: dto.webhookUrl }),
        ...(dto.audienceId !== undefined && { audienceId: dto.audienceId }),
        ...(dto.pixelId !== undefined && { pixelId: dto.pixelId }),
        ...(dto.measurementId !== undefined && {
          measurementId: dto.measurementId,
        }),
      },
    });

    return {
      data: {
        id: row.id,
        provider: validProvider,
        name: entry.name,
        connected: true,
        connectedAt: row.createdAt,
      },
      message: `${entry.name} connected successfully`,
    };
  }

  // -------------------------------------------------------------------------
  // DISCONNECT
  // -------------------------------------------------------------------------
  async disconnect(organisationId: string, userId: string, provider: string) {
    await this.assertOrgAccess(organisationId, userId);
    const validProvider = this.assertValidProvider(provider);
    const entry = CATALOGUE.find((c) => c.provider === validProvider)!;

    const existing = await this.prisma.orgIntegration.findUnique({
      where: {
        organisationId_provider: { organisationId, provider: validProvider },
      },
    });

    if (!existing || !existing.isConnected) {
      throw new NotFoundException(
        `${entry.name} is not connected for this organisation`,
      );
    }

    await this.prisma.orgIntegration.update({
      where: {
        organisationId_provider: { organisationId, provider: validProvider },
      },
      data: { isConnected: false },
    });

    return { message: `${entry.name} disconnected successfully` };
  }
}

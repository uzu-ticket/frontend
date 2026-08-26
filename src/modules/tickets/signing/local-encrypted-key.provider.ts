import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  generateKeyPairSync,
  sign as edSign,
  createPrivateKey,
  JsonWebKey,
} from "crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import { AppConfigService } from "../../../config/app-config.service";
import { GeneratedKeyPair, KeyProvider } from "./key-provider";

const ALGO = "aes-256-gcm";

/**
 * Dev/self-hosted stand-in for a real KMS — see README.md in this
 * directory and the SigningKeySecret model doc comment in schema.prisma.
 * Encrypts the Ed25519 private key's JWK 'd' component at rest with
 * AES-256-GCM under SIGNING_KEY_MASTER_SECRET. Swap for AwsKmsKeyProvider
 * (or similar) in production by rebinding the KEY_PROVIDER token — nothing
 * outside this file needs to change.
 */
@Injectable()
export class LocalEncryptedKeyProvider implements KeyProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
  ) {}

  async generateKeyPair(): Promise<GeneratedKeyPair> {
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");
    const publicJwk = publicKey.export({ format: "jwk" }) as JsonWebKey;
    const privateJwk = privateKey.export({ format: "jwk" }) as JsonWebKey;
    return { publicKey: publicJwk.x!, privateKeyHandle: privateJwk.d! };
  }

  async persistPrivateKey(
    signingKeyId: string,
    privateKeyHandle: unknown,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    const { ciphertext, iv, authTag } = this.encrypt(privateKeyHandle as string);
    await client.signingKeySecret.create({
      data: { id: signingKeyId, ciphertext, iv, authTag },
    });
  }

  async sign(signingKeyId: string, data: Buffer, tx?: Prisma.TransactionClient): Promise<Buffer> {
    const client = tx ?? this.prisma;
    const [key, secret] = await Promise.all([
      client.eventSigningKey.findUnique({ where: { id: signingKeyId } }),
      client.signingKeySecret.findUnique({ where: { id: signingKeyId } }),
    ]);
    if (!key || !secret) {
      throw new NotFoundException(`Signing key ${signingKeyId} not found`);
    }

    const d = this.decrypt(secret.ciphertext, secret.iv, secret.authTag);
    const privateKey = createPrivateKey({
      key: { kty: "OKP", crv: "Ed25519", x: key.publicKey, d } as JsonWebKey,
      format: "jwk",
    });
    return edSign(null, data, privateKey);
  }

  private encrypt(plaintext: string): { ciphertext: Buffer; iv: Buffer; authTag: Buffer } {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGO, this.config.signingKeyMasterSecret, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    return { ciphertext, iv, authTag: cipher.getAuthTag() };
  }

  private decrypt(ciphertext: Buffer, iv: Buffer, authTag: Buffer): string {
    const decipher = createDecipheriv(ALGO, this.config.signingKeyMasterSecret, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  }
}

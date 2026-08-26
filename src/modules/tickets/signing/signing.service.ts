import { Inject, Injectable } from "@nestjs/common";
import { createPublicKey, verify as edVerify, JsonWebKey } from "crypto";
import { Prisma, EventSigningKey } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import { newId } from "../../../common/id";
import { KEY_PROVIDER, KeyProvider } from "./key-provider";
import { buildQrCode, encodePayload, QrPayload } from "./qr-payload";

@Injectable()
export class SigningService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(KEY_PROVIDER) private readonly keyProvider: KeyProvider,
  ) {}

  /**
   * Per-event key rotation (integrity doc §8 decision 1): find the event's
   * active key, or mint one on first use. Existing tickets keep verifying
   * against whatever key they were signed with even after rotation, since
   * each ticket stores its own signingKeyId.
   */
  async ensureActiveSigningKey(eventId: string, tx: Prisma.TransactionClient = this.prisma): Promise<EventSigningKey> {
    const existing = await tx.eventSigningKey.findFirst({ where: { eventId, isActive: true } });
    if (existing) return existing;

    const id = newId();
    const { publicKey, privateKeyHandle } = await this.keyProvider.generateKeyPair();
    // The EventSigningKey row must exist (and be visible on this same
    // connection/transaction) before persistPrivateKey can write the
    // signing_key_secrets row that foreign-keys to it.
    const created = await tx.eventSigningKey.create({
      data: { id, eventId, publicKey, isActive: true },
    });
    await this.keyProvider.persistPrivateKey(id, privateKeyHandle, tx);
    return created;
  }

  async signTicket(
    ticketId: string,
    eventId: string,
    issuedAt: Date,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<{ qrCode: string; signature: string; signingKeyId: string }> {
    const key = await this.ensureActiveSigningKey(eventId, tx);
    const payload: QrPayload = {
      tid: ticketId,
      eid: eventId,
      iat: Math.floor(issuedAt.getTime() / 1000),
      kid: key.id,
    };
    const { bytes } = encodePayload(payload);
    const signature = await this.keyProvider.sign(key.id, bytes, tx);
    return {
      qrCode: buildQrCode(payload, signature),
      signature: signature.toString("base64url"),
      signingKeyId: key.id,
    };
  }

  /**
   * Server-side verification (online scan, and defense-in-depth on offline
   * sync). Offline devices do the equivalent check locally against the
   * manifest's public keys — see scanner module.
   */
  async verifyTicket(ticket: {
    id: string;
    eventId: string;
    signingKeyId: string;
    signature: string;
    issuedAt: Date;
  }): Promise<boolean> {
    const key = await this.prisma.eventSigningKey.findUnique({ where: { id: ticket.signingKeyId } });
    if (!key) return false;

    const payload: QrPayload = {
      tid: ticket.id,
      eid: ticket.eventId,
      iat: Math.floor(ticket.issuedAt.getTime() / 1000),
      kid: ticket.signingKeyId,
    };
    const { bytes } = encodePayload(payload);
    const publicKey = createPublicKey({
      key: { kty: "OKP", crv: "Ed25519", x: key.publicKey } as JsonWebKey,
      format: "jwk",
    });
    return edVerify(null, bytes, publicKey, Buffer.from(ticket.signature, "base64url"));
  }
}

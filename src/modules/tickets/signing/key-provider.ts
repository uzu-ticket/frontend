import { Prisma } from "@prisma/client";

export const KEY_PROVIDER = "KEY_PROVIDER";

export interface GeneratedKeyPair {
  publicKey: string;
  /**
   * Opaque outside the provider implementation — SigningService just
   * ferries this from generateKeyPair to persistPrivateKey without
   * inspecting it. Kept separate from key generation because
   * `signing_key_secrets.id` is a foreign key to `event_signing_keys.id`
   * (see schema.prisma), so the EventSigningKey row must exist — and be
   * visible on the same DB connection — before the secret can be written.
   */
  privateKeyHandle: unknown;
}

/**
 * Abstracts where the Ed25519 private key material lives. The private key
 * itself never leaves the implementation — callers only ever get a public
 * key back, or a signature.
 */
export interface KeyProvider {
  /** Pure key generation — no DB writes, so callers can create the owning EventSigningKey row first. */
  generateKeyPair(): Promise<GeneratedKeyPair>;

  /** Persists the private key material for an EventSigningKey row that must already exist (same tx if provided). */
  persistPrivateKey(signingKeyId: string, privateKeyHandle: unknown, tx?: Prisma.TransactionClient): Promise<void>;

  /** Signs `data` with the private key belonging to `signingKeyId`. Returns a raw (not base64) signature buffer. */
  sign(signingKeyId: string, data: Buffer, tx?: Prisma.TransactionClient): Promise<Buffer>;
}

# Ticket signing keys

Implements the design in `uzuticket-ticket-integrity-and-offline-scanning.md`
§3 and §8 decision 1: one Ed25519 key pair per event, rotated per event, the
private key never touching application code paths that a client can reach.

- `key-provider.ts` — the `KeyProvider` interface: `generateKeyPair()` (pure,
  no DB writes), `persistPrivateKey(signingKeyId, handle)`, and `sign()`.
  Generation and persistence are deliberately split — `signing_key_secrets.id`
  foreign-keys to `event_signing_keys.id`, so SigningService must create the
  `EventSigningKey` row (using the freshly generated public key) *before*
  the private key can be persisted against it, especially inside a
  transaction where the row isn't visible on other connections yet.
- `local-encrypted-key.provider.ts` — the **dev/self-hosted default**.
  Stores the private key's JWK `d` component AES-256-GCM-encrypted in the
  `signing_key_secrets` table (see the deviation note on that model in
  `prisma/schema.prisma`), keyed by `SIGNING_KEY_MASTER_SECRET`.
- `aws-kms-key.provider.stub.ts` — **not implemented**. This is where a real
  KMS integration goes before production. Implement `KeyProvider` against
  AWS KMS (or GCP Secret Manager + KMS, or HashiCorp Vault) and rebind the
  `KEY_PROVIDER` token in `tickets.module.ts` — nothing else in the codebase
  needs to change, including the DB schema.
- `signing.service.ts` — the actual business logic: find-or-create the
  active key for an event, build the QR payload, sign it.

Swapping providers is a one-line change in `TicketsModule`:

```ts
{ provide: KEY_PROVIDER, useClass: AwsKmsKeyProvider } // instead of LocalEncryptedKeyProvider
```

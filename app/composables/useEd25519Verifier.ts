/**
 * Browser-side Ed25519 signature verification for ticket QR codes
 * (integrity doc §1, §2, §8 decision 1).
 *
 * The server's SigningService stores the JWK `x` component of each event
 * signing key as `event_signing_keys.publicKey`, ships it inside the
 * manifest, and signs `payloadBytes` with the matching private key. To
 * verify a QR offline we have to reproduce that exact byte-for-byte
 * signature check here, in the browser, against the public key whose `kid`
 * is bound into the signed payload.
 *
 * `verify()` returns true ONLY when:
 *  1. the kid is known to the manifest,
 *  2. the public key parses, and
 *  3. the signature is a valid Ed25519 signature over the exact payload
 *     bytes that were presented.
 *
 * Anything else — unknown kid, malformed key, tampered bytes, bad
 * signature — returns false. The validator maps `false` to `invalid` so
 * a forged or replayed payload can't slip through offline.
 */
import { etc as ed25519Etc, verify as ed25519Verify } from "@noble/ed25519"
import { sha512 } from "@noble/hashes/sha512"

// @noble/ed25519 2.x defers the SHA-512 implementation. Browsers and
// Node 22+ get it auto-wired via WebCrypto; older Node, jsdom, and any
// future runtime without WebCrypto need an explicit @noble/hashes
// registration. Bind it once at module load so verification works in
// every environment this composable is imported into.
ed25519Etc.sha512Sync = (...m) => sha512(ed25519Etc.concatBytes(...m))

export interface VerifyOk {
  ok: true
  kid: string
}
export interface VerifyFail {
  ok: false
  reason: "unknown_kid" | "bad_public_key" | "bad_signature" | "malformed"
}
export type VerifyResult = VerifyOk | VerifyFail

export interface ManifestKey {
  kid: string
  publicKey: string
  isActive: boolean
}

/**
 * Verify an Ed25519 signature on `payloadBytes` against the public key
 * identified by `kid` in the supplied manifest keys. The public key is
 * the 32-byte Ed25519 X-coordinate (the JWK `x` value), base64url-encoded
 * the same way the server stores it on `event_signing_keys.publicKey`.
 *
 * This is a pure function — safe to call from tests, server-side Node,
 * and the browser. There is no `await` and no I/O.
 */
export function verifyTicketSignature(
  payloadBytes: Uint8Array,
  signature: Uint8Array,
  kid: string,
  keys: readonly ManifestKey[],
): VerifyResult {
  if (!(payloadBytes instanceof Uint8Array) || !(signature instanceof Uint8Array)) {
    return { ok: false, reason: "malformed" }
  }
  if (signature.length !== 64) {
    return { ok: false, reason: "malformed" }
  }
  const key = keys.find((k) => k.kid === kid)
  if (!key) {
    return { ok: false, reason: "unknown_kid" }
  }

  let publicKeyBytes: Uint8Array
  try {
    publicKeyBytes = base64UrlDecode(key.publicKey)
  } catch {
    return { ok: false, reason: "bad_public_key" }
  }
  if (publicKeyBytes.length !== 32) {
    return { ok: false, reason: "bad_public_key" }
  }

  let valid: boolean
  try {
    valid = ed25519Verify(signature, payloadBytes, publicKeyBytes)
  } catch {
    return { ok: false, reason: "bad_signature" }
  }
  if (!valid) {
    return { ok: false, reason: "bad_signature" }
  }
  return { ok: true, kid }
}

function base64UrlDecode(str: string): Uint8Array {
  const pad = (s: string) => s + "==".slice(0, (4 - (s.length % 4)) % 4)
  const binary = atob(pad(str.replace(/-/g, "+").replace(/_/g, "/")))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

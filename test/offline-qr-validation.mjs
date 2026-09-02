/**
 * Round-trip test for the offline-first QR validation crypto.
 *
 * Mints an Ed25519 key pair with Node's crypto (same algo as the server's
 * SigningService), builds a real signed QR payload the same way
 * server-app/src/modules/tickets/signing/qr-payload.ts does, then runs
 * the browser-side verifier and the pure offline validator against it.
 * No Nuxt context, no localStorage — only the security-critical path.
 *
 * Run: node --experimental-strip-types test/offline-qr-validation.mjs
 *      (Node 22+; flag is for the .ts imports.)
 */
import { generateKeyPairSync, sign as edSign, randomBytes } from "node:crypto"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const FE = join(__dirname, "..")

const { verifyTicketSignature } = await import(`file://${join(FE, "app/composables/useEd25519Verifier.ts")}`)
const { validateOfflineQr } = await import(`file://${join(FE, "app/composables/validateOfflineQr.ts")}`)

const { publicKey, privateKey } = generateKeyPairSync("ed25519")
const publicJwk = publicKey.export({ format: "jwk" })

const b64url = (buf) => Buffer.from(buf).toString("base64url")
const b64urlDecode = (s) => new Uint8Array(Buffer.from(s, "base64url"))

const buildQrCode = (payload, sig) => `${b64url(Buffer.from(JSON.stringify(payload), "utf8"))}.${b64url(sig)}`

function signPayload(payload) {
  const payloadBytes = Buffer.from(JSON.stringify(payload), "utf8")
  const sig = edSign(null, payloadBytes, privateKey)
  return { payload, payloadBytes, sig }
}

const EVENT_ID = "0190f1e0-5678-7abc-8def-0123456789ab"
const WRONG_EVENT_ID = "0190ffff-ffff-7fff-8fff-ffffffffffff"
const KID = "0190f1e0-9999-7abc-8def-0123456789ab"
const TICKET_ID = "0190f1e0-1234-7abc-8def-0123456789ab"
const TICKET_TYPE_ID = "0190f1e0-aaaa-7abc-8def-0123456789ab"

const manifest = {
  signingKeys: [{ kid: KID, publicKey: publicJwk.x, isActive: true }],
  tickets: [{ id: TICKET_ID, ticketTypeId: TICKET_TYPE_ID, status: "valid" }],
}

let pass = 0, fail = 0
function ok(name) { console.log(`  ok  ${name}`); pass++ }
function bad(name, info) { console.log(`FAIL  ${name}: ${JSON.stringify(info)}`); fail++ }
function expect(cond, name, info) { cond ? ok(name) : bad(name, info) }

// --- crypto verifier -------------------------------------------------------
{
  const { payload, payloadBytes, sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const v = verifyTicketSignature(payloadBytes, sig, KID, manifest.signingKeys)
  expect(v.ok === true, "valid signature verifies", v)
}
{
  const { payloadBytes, sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const tampered = Buffer.from(payloadBytes); tampered[tampered.length - 1] ^= 0x01
  const v = verifyTicketSignature(tampered, sig, KID, manifest.signingKeys)
  expect(v.ok === false && v.reason === "bad_signature", "tampered payload fails", v)
}
{
  const { sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const v = verifyTicketSignature(Buffer.from("anything"), sig, "not-a-kid", manifest.signingKeys)
  expect(v.ok === false && v.reason === "unknown_kid", "unknown kid rejected", v)
}
{
  const { sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const v = verifyTicketSignature(Buffer.from("x"), sig, KID, [{ kid: "other", publicKey: "AAAAAAAAAAAAAAAAAAAAAA", isActive: true }])
  expect(v.ok === false && v.reason === "unknown_kid", "manifest without matching kid rejects", v)
}

// --- offline validator ----------------------------------------------------
const runValidator = (qr, used = new Set()) => validateOfflineQr({
  qrCode: qr, expectedEventId: EVENT_ID, manifest, usedTicketIds: used,
})

{
  const { payload, sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const r = runValidator(buildQrCode(payload, sig))
  expect(r.kind === "admitted" && r.ticketId === TICKET_ID, "valid ticket admits offline", r)
}
{
  // Attacker forges: valid JSON payload, but random signature bytes
  const payload = { tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID }
  const forgedSig = randomBytes(64)
  const r = runValidator(buildQrCode(payload, forgedSig))
  expect(r.kind === "invalid", "forged signature (random bytes) rejected", r)
}
{
  // Attacker swaps the payload of a real signed QR (so signature is no longer over these bytes)
  const { payload, sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const swapped = { ...payload, tid: "0190ffff-ffff-7fff-8fff-ffffffffffff" }
  const r = runValidator(buildQrCode(swapped, sig))
  expect(r.kind === "invalid", "swapped payload rejected (signature check)", r)
}
{
  const { payload, sig } = signPayload({ tid: TICKET_ID, eid: WRONG_EVENT_ID, iat: 1_700_000_000, kid: KID })
  const r = runValidator(buildQrCode(payload, sig))
  expect(r.kind === "wrong_event", "wrong event flagged", r)
}
{
  const used = new Set()
  const { payload, sig } = signPayload({ tid: TICKET_ID, eid: EVENT_ID, iat: 1_700_000_000, kid: KID })
  const qr = buildQrCode(payload, sig)
  const r1 = runValidator(qr, used)
  used.add(r1.ticketId)
  const r2 = runValidator(qr, used)
  expect(r1.kind === "admitted" && r2.kind === "duplicate", "second scan on same device = duplicate", { r1, r2 })
}
{
  const r = runValidator("not-a-valid-qr-string")
  expect(r.kind === "invalid", "malformed QR rejected", r)
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)

/**
 * Pure offline-validation function — no Vue, no Nuxt, no localStorage.
 * Testable from Node. Mirrors the steps in `useQrValidator.validateOffline`
 * but with the dependencies passed in explicitly.
 *
 * Returns a discriminated union the UI layer maps to a ScanValidationResult.
 */
import { parseQrCode } from "../types/scanner.ts"
import { verifyTicketSignature } from "./useEd25519Verifier.ts"

export type OfflineAdmission =
  | { kind: "admitted"; ticketId: string; ticketTypeId: string }
  | { kind: "duplicate"; ticketId: string }
  | { kind: "wrong_event"; ticketId: string }
  | { kind: "invalid"; reason: string; ticketId: string | null }

export function validateOfflineQr(args: {
  qrCode: string
  expectedEventId: string
  manifest: {
    signingKeys: ReadonlyArray<{ kid: string; publicKey: string; isActive: boolean }>
    tickets: ReadonlyArray<{ id: string; ticketTypeId: string; status: string }>
  }
  usedTicketIds: ReadonlySet<string>
}): OfflineAdmission {
  let parsed: ReturnType<typeof parseQrCode>
  try {
    parsed = parseQrCode(args.qrCode)
  } catch {
    return { kind: "invalid", reason: "QR code could not be parsed", ticketId: null }
  }

  const sig = verifyTicketSignature(
    parsed.payloadBytes,
    parsed.signature,
    parsed.payload.kid,
    args.manifest.signingKeys,
  )
  if (!sig.ok) {
    const reason =
      sig.reason === "unknown_kid"
        ? "Signing key not in manifest — ticket cannot be verified offline"
        : sig.reason === "bad_signature"
          ? "Signature invalid — ticket failed offline verification"
          : sig.reason === "bad_public_key"
            ? "Manifest public key is malformed"
            : "Ticket is malformed"
    return { kind: "invalid", reason, ticketId: parsed.payload.tid }
  }

  if (parsed.payload.eid !== args.expectedEventId) {
    return { kind: "wrong_event", ticketId: parsed.payload.tid }
  }

  const ticket = args.manifest.tickets.find((t) => t.id === parsed.payload.tid)
  if (!ticket) {
    return { kind: "invalid", reason: "Ticket not found in manifest", ticketId: parsed.payload.tid }
  }
  if (ticket.status === "void" || ticket.status === "refunded") {
    return { kind: "invalid", reason: `Ticket is ${ticket.status}`, ticketId: parsed.payload.tid }
  }
  if (args.usedTicketIds.has(parsed.payload.tid)) {
    return { kind: "duplicate", ticketId: parsed.payload.tid }
  }

  return { kind: "admitted", ticketId: parsed.payload.tid, ticketTypeId: ticket.ticketTypeId }
}

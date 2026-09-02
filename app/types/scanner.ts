import type { Event } from "~/types/event"

export interface ApiScannerDevice {
  id: string
  deviceLabel: string | null
  deviceFingerprint: string
  isRevoked: boolean
  lastSyncedAt: string | null
  syncPriorityOrdinal: number
  createdAt: string
}

export interface ApiIntegrityConflict {
  id: string
  ticketId: string
  eventId: string
  scannerDeviceId: string
  scannedBy: string | null
  mode: string
  result: string
  scannedAt: string
  isConflict: boolean
  createdAt: string
  ticket?: {
    id: string
    orderId: string
    ticketTypeId: string
    status: string
    recipientName: string
    recipientEmail: string
  }
  scannerDevice?: {
    id: string
    deviceLabel: string | null
  }
}

export interface ApiIntegrityReport {
  eventId: string
  totalScans: number
  admitted: number
  conflictCount: number
  conflicts: ApiIntegrityConflict[]
}

export interface ApiAssignment {
  id: string
  eventId: string
  scannerDeviceId: string
  assignedBy: string
  manifestVersionDownloaded: number | null
  downloadedAt: string | null
  monotonicOffsetMs: string | null
  createdAt: string
  scannerDevice?: ApiScannerDevice
}

export interface ScannerEventOption {
  value: string
  label: string
}

export interface ScannerEventDisplay {
  id: string
  title: string
  dateTime: string
  location: string
  imageUrl: string
  status: "Live" | "Upcoming" | string
}

export function formatEventDate(startsAt: string): string {
  const d = new Date(startsAt)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function eventStatusFromApi(status: string): "Live" | "Upcoming" | string {
  if (status === "live") return "Live"
  if (status === "published" || status === "sales_closed") return "Upcoming"
  return status
}

export function mapEventToDisplay(event: Event): ScannerEventDisplay {
  return {
    id: event.id,
    title: event.title,
    dateTime: formatEventDate(event.startsAt),
    location: event.venueName || event.city || "Location TBA",
    imageUrl:
      event.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80",
    status: eventStatusFromApi(event.status || "draft"),
  }
}

export function mapEventsToOptions(events: Event[]): ScannerEventOption[] {
  return events.map((e) => ({
    value: e.id,
    label: e.title,
  }))
}

export function mapEventsToDisplays(events: Event[]): ScannerEventDisplay[] {
  return events.map(mapEventToDisplay)
}

export function formatScanTime(scannedAt: string): string {
  if (!scannedAt) return ""
  const d = new Date(scannedAt)
  if (Number.isNaN(d.getTime())) return ""
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

export type { Event }

// ---------------------------------------------------------------------------
// QR code payload (mirrors server-app QR encoding: base64url(payload).base64url(sig))
// ---------------------------------------------------------------------------

export interface QrPayload {
  tid: string
  eid: string
  iat: number
  kid: string
}

export interface ParsedQr {
  payload: QrPayload
  payloadBytes: Uint8Array
  signature: Uint8Array
}

export function parseQrCode(qrCode: string): ParsedQr {
  const [encodedPayload, encodedSignature] = qrCode.split(".")
  if (!encodedPayload || !encodedSignature) {
    throw new Error("Malformed QR code")
  }
  const payloadBytes = base64UrlDecode(encodedPayload)
  const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as QrPayload
  const signature = base64UrlDecode(encodedSignature)
  return { payload, payloadBytes, signature }
}

function base64UrlDecode(str: string): Uint8Array {
  const pad = (s: string) => s + "==".slice(0, (4 - (s.length % 4)) % 4)
  const binary = atob(pad(str.replace(/-/g, "+").replace(/_/g, "/")))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// ---------------------------------------------------------------------------
// Manifest & offline validation types
// ---------------------------------------------------------------------------

export interface ApiManifestTicket {
  id: string
  ticketTypeId: string
  status: string
}

export interface ApiManifestSigningKey {
  kid: string
  publicKey: string
  isActive: boolean
}

export interface ApiManifest {
  eventId: string
  manifestVersion: number
  sealedAt: string | null
  serverTimeReference: string
  signingKeys: ApiManifestSigningKey[]
  tickets: ApiManifestTicket[]
}

export interface OfflineScanRecord {
  id: string
  eventId: string
  qrCode: string
  ticketId: string | null
  result: ScanResult
  isConflict: boolean
  scannedAtMonotonicMs: number
  scannedAtWallClock: string
  synced: boolean
}

export type ScanResult = "admitted" | "duplicate" | "invalid" | "wrong_event"

// ---------------------------------------------------------------------------
// Scan validation result (used by the UI)
// ---------------------------------------------------------------------------

export interface ScanValidationResult {
  qrCode: string
  ticketId: string | null
  result: "admitted" | "duplicate" | "invalid" | "wrong_event"
  isConflict: boolean
  isOffline: boolean
  reason?: string
  recipientName?: string
  recipientEmail?: string
  ticketType?: string
}


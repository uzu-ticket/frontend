import type { ApiManifest, OfflineScanRecord, ScanResult, ScanValidationResult } from "~/types/scanner"
import { useApi } from "~/composables/useApi"
import { useScanner } from "~/composables/useScanner"
import { useToast } from "~/composables/useToast"
import { useOrgState } from "~/composables/useOrgState"
import { ref } from "vue"
import { validateOfflineQr } from "~/composables/validateOfflineQr"

const MANIFEST_STORAGE_KEY = "scanner:manifest"
const OFFLINE_SCANS_KEY = "scanner:offline-scans"
const USED_TICKETS_KEY = "scanner:used-tickets"
const OFFSET_STORAGE_KEY = "scanner:monotonic-offsets"

function useStorage<T>(key: string, fallback: T) {
  const read = (): T => {
    if (typeof localStorage === "undefined") return fallback
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  }
  const write = (val: T) => {
    if (typeof localStorage === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      void 0
    }
  }
  return { read, write }
}

function monotonicNow(): number {
  if (typeof performance !== "undefined") return Math.floor(performance.now())
  return Date.now()
}

export const useQrValidator = (eventId: string) => {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()
  const scannerStore = useScanner()
  const toast = useToast()

  const isOnline = ref(true)
  const manifest = ref<ApiManifest | null>(null)
  const usedTickets = ref<Set<string>>(new Set())
  const offlineScans = ref<OfflineScanRecord[]>([])
  const loading = ref(false)
  /**
   * Server reference timestamp captured at manifest download, paired with
   * the device's monotonic reading at that moment (integrity doc §8
   * decision 3). The server translates a later scan's `performance.now()`
   * reading into a server-comparable wall clock via:
   *   downloadedAt + (scanMonotonicMs - storedOffsetMs).
   * Stored as a plain record keyed by eventId so it survives page reloads.
   */
  const monotonicOffsetMs = ref<number | null>(null)
  const manifestDownloadedAt = ref<string | null>(null)

  const manifestStorage = useStorage<Record<string, ApiManifest>>(MANIFEST_STORAGE_KEY, {})
  const scansStorage = useStorage<OfflineScanRecord[]>(OFFLINE_SCANS_KEY, [])
  const usedStorage = useStorage<string[]>(USED_TICKETS_KEY, [])
  const offsetStorage = useStorage<Record<string, { offsetMs: number; downloadedAt: string }>>(
    OFFSET_STORAGE_KEY,
    {},
  )

  if (typeof window !== "undefined") {
    const stored = manifestStorage.read()
    if (stored[eventId]) manifest.value = stored[eventId]

    offlineScans.value = scansStorage.read().filter((s) => s.eventId === eventId)
    usedTickets.value = new Set(usedStorage.read())

    const storedOffset = offsetStorage.read()[eventId]
    if (storedOffset) {
      monotonicOffsetMs.value = storedOffset.offsetMs
      manifestDownloadedAt.value = storedOffset.downloadedAt
    }
  }

  if (typeof window !== "undefined") {
    isOnline.value = navigator.onLine
    window.addEventListener("online", () => {
      isOnline.value = true
      void syncPendingScans()
    })
    window.addEventListener("offline", () => {
      isOnline.value = false
    })
  }

  function getDeviceId(): string {
    const devices = scannerStore.devices.value
    return devices.length > 0 ? devices[0].id : ""
  }

  async function fetchManifest(deviceId: string): Promise<ApiManifest> {
    loading.value = true
    try {
      const deviceMonotonicMs = monotonicNow()
      const res = await instance.post<ApiManifest>(
        `/organisations/${activeOrgId.value}/events/${eventId}/scanner/devices/${deviceId}/manifest`,
        { deviceMonotonicMs },
      )
      const raw = res.data?.data ?? res.data
      manifest.value = raw
      const stored = manifestStorage.read()
      stored[eventId] = raw
      manifestStorage.write(stored)

      // Server responded with its own clock reading (serverTimeReference).
      // Our device monotonic at that moment was `deviceMonotonicMs`, so the
      // shared reference is offset = (server wall clock) - (device
      // monotonic at capture). Later scans record their `performance.now()`
      // and the server translates via assignment.downloadedAt + (scanMono -
      // assignment.monotonicOffsetMs). Keeping the same offset on the
      // client lets us sanity-check our local monotonic clock drift.
      if (raw.serverTimeReference) {
        const serverMs = new Date(raw.serverTimeReference).getTime()
        if (!Number.isNaN(serverMs)) {
          monotonicOffsetMs.value = deviceMonotonicMs
          manifestDownloadedAt.value = raw.serverTimeReference
          const allOffsets = offsetStorage.read()
          allOffsets[eventId] = { offsetMs: deviceMonotonicMs, downloadedAt: raw.serverTimeReference }
          offsetStorage.write(allOffsets)
        }
      }
      return raw
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to download manifest"
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Pure-function offline validation. Trusts nothing in the QR code
   * except the Ed25519 signature over the payload bytes. Steps mirror
   * integrity doc §2 and §5.1.2 — the actual logic lives in
   * `validateOfflineQr` (testable in isolation). The local "used" set
   * is updated here so a second scan of the same ticket on this device
   * becomes a duplicate without round-tripping to the server.
   */
  function validateOffline(qrCode: string): ScanValidationResult {
    if (!manifest.value) {
      return {
        qrCode,
        ticketId: null,
        result: "invalid",
        isConflict: false,
        isOffline: true,
        reason: "No manifest available — download manifest while online first",
      }
    }
    const outcome = validateOfflineQr({
      qrCode,
      expectedEventId: eventId,
      manifest: manifest.value,
      usedTicketIds: usedTickets.value,
    })
    if (outcome.kind === "admitted") {
      usedTickets.value.add(outcome.ticketId)
      persistUsedTickets()
      return {
        qrCode,
        ticketId: outcome.ticketId,
        result: "admitted",
        isConflict: false,
        isOffline: true,
        ticketType: outcome.ticketTypeId,
      }
    }
    if (outcome.kind === "duplicate") {
      return {
        qrCode,
        ticketId: outcome.ticketId,
        result: "duplicate",
        isConflict: true,
        isOffline: true,
        reason: "Ticket already scanned on this device",
      }
    }
    if (outcome.kind === "wrong_event") {
      return {
        qrCode,
        ticketId: outcome.ticketId,
        result: "wrong_event",
        isConflict: false,
        isOffline: true,
        reason: "Ticket belongs to a different event",
      }
    }
    return {
      qrCode,
      ticketId: outcome.ticketId,
      result: "invalid",
      isConflict: false,
      isOffline: true,
      reason: outcome.reason,
    }
  }

  async function validateOnline(qrCode: string): Promise<ScanValidationResult> {
    const deviceId = getDeviceId()
    try {
      const res = await instance.post<{ result: string; isConflict: boolean; ticketId: string | null }>(
        `/organisations/${activeOrgId.value}/events/${eventId}/scanner/devices/${deviceId}/scan`,
        { qrCode },
      )
      const raw = res.data?.data ?? res.data
      return {
        qrCode,
        ticketId: raw.ticketId,
        result: (raw.result || "invalid") as ScanResult,
        isConflict: raw.isConflict,
        isOffline: false,
      }
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status
      if (status === 0 || status === undefined || (status >= 500 && status < 600)) {
        return validateOffline(qrCode)
      }
      const apiError = e as { response?: { data?: { message?: string | string[] } } }
      const data = apiError?.response?.data
      const message = Array.isArray(data?.message) ? data.message.join(" ") : data?.message
      return {
        qrCode,
        ticketId: null,
        result: "invalid",
        isConflict: false,
        isOffline: false,
        reason: message || "Server rejected the scan",
      }
    }
  }

  async function queueOfflineScan(qrCode: string, validation: ScanValidationResult): Promise<void> {
    const record: OfflineScanRecord = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      eventId,
      qrCode,
      ticketId: validation.ticketId,
      result: validation.result,
      isConflict: validation.isConflict,
      scannedAtMonotonicMs: monotonicNow(),
      scannedAtWallClock: new Date().toISOString(),
      synced: false,
    }

    offlineScans.value.push(record)
    persistOfflineScans()
  }

  async function syncPendingScans(): Promise<{ synced: number; failed: number }> {
    const deviceId = getDeviceId()
    if (!deviceId) return { synced: 0, failed: offlineScans.value.length }

    const pending = offlineScans.value.filter((s) => !s.synced)
    if (pending.length === 0) return { synced: 0, failed: 0 }

    try {
      const scans = pending.map((s) => ({
        qrCode: s.qrCode,
        scannedAtMonotonicMs: s.scannedAtMonotonicMs,
      }))

      await instance.post<{ synced: number; results: unknown[] }>(
        `/organisations/${activeOrgId.value}/events/${eventId}/scanner/devices/${deviceId}/sync`,
        { scans },
      )

      pending.forEach((s) => {
        s.synced = true
      })
      persistOfflineScans()

      toast.show({
        title: "Sync Complete",
        message: `${pending.length} offline scan(s) synced successfully.`,
        type: "success",
      })

      return { synced: pending.length, failed: 0 }
    } catch (e) {
      void e
      toast.show({
        title: "Sync Failed",
        message: "Could not sync offline scans. They will be retried when online.",
        type: "error",
      })
      return { synced: 0, failed: pending.length }
    }
  }

  function persistUsedTickets(): void {
    const arr = Array.from(usedTickets.value)
    const merged = Array.from(new Set([...usedStorage.read(), ...arr]))
    usedStorage.write(merged)
  }

  function persistOfflineScans(): void {
    const all = scansStorage.read().filter((s) => s.eventId !== eventId)
    scansStorage.write([...all, ...offlineScans.value])
  }

  function clearLocalState(): void {
    manifest.value = null
    usedTickets.value.clear()
    offlineScans.value = []
    usedStorage.write([])
    scansStorage.write(scansStorage.read().filter((s) => s.eventId !== eventId))
    const storedManifests = manifestStorage.read()
    delete storedManifests[eventId]
    manifestStorage.write(storedManifests)
    const allOffsets = offsetStorage.read()
    delete allOffsets[eventId]
    offsetStorage.write(allOffsets)
    monotonicOffsetMs.value = null
    manifestDownloadedAt.value = null
  }

  async function validateAndRecord(qrCode: string): Promise<ScanValidationResult> {
    let validation: ScanValidationResult
    let wasOffline = false

    if (isOnline.value) {
      validation = await validateOnline(qrCode)
      // If the online path failed-over to offline (network down), the
      // resulting validation is an offline admission and we must queue
      // it for sync. Otherwise the server already has the row.
      wasOffline = validation.isOffline
    } else {
      validation = validateOffline(qrCode)
      wasOffline = true
    }

    if (wasOffline && (validation.result === "admitted" || validation.result === "duplicate")) {
      await queueOfflineScan(qrCode, validation)
    }

    return validation
  }

  return {
    isOnline,
    manifest,
    usedTickets,
    offlineScans,
    loading,
    monotonicOffsetMs,
    manifestDownloadedAt,
    fetchManifest,
    validateOffline,
    validateOnline,
    queueOfflineScan,
    syncPendingScans,
    validateAndRecord,
    clearLocalState,
  }
}

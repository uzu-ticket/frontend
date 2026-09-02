import type { Event } from "~/types/event"
import type {
  ApiScannerDevice,
  ApiIntegrityReport,
  ApiAssignment,
  ApiIntegrityConflict,
  ScannerEventDisplay,
  ScannerEventOption,
} from "~/types/scanner"
import {
  mapEventsToOptions,
  mapEventsToDisplays,
  mapEventToDisplay,
  formatScanTime,
} from "~/types/scanner"

export const useScanner = () => {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()
  const eventsStore = useEvents()

  const devices = useState<ApiScannerDevice[]>("scanner:devices", () => [])
  const integrityReports = useState<Record<string, ApiIntegrityReport>>("scanner:integrity", () => ({}))
  const loading = ref(false)
  const error = ref<string | null>(null)

  function extractError(e: unknown, fallback: string): string {
    const apiError = e as {
      response?: {
        data?: {
          message?: string | string[]
          errors?: Record<string, string[]>
        }
      }
      message?: string
    }
    const data = apiError?.response?.data
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(" ") : data.message
    }
    if (data?.errors) {
      return Object.values(data.errors).flat().join(", ")
    }
    if (apiError?.message) return apiError.message
    return fallback
  }

  async function fetchEvents(force = false): Promise<ScannerEventDisplay[]> {
    try {
      const apiEvents = await eventsStore.fetchEvents(force)
      return mapEventsToDisplays(apiEvents)
    } catch (e) {
      error.value = extractError(e, "Failed to load events")
      throw e
    }
  }

  async function fetchEventOptions(force = false): Promise<ScannerEventOption[]> {
    try {
      const events = await eventsStore.fetchEvents(force)
      return mapEventsToOptions(events)
    } catch (e) {
      error.value = extractError(e, "Failed to load event options")
      throw e
    }
  }

  async function fetchEvent(eventId: string): Promise<Event> {
    try {
      return await eventsStore.fetchEvent(eventId)
    } catch (e) {
      error.value = extractError(e, "Failed to load event")
      throw e
    }
  }

  async function fetchDevices(force = false): Promise<ApiScannerDevice[]> {
    if (!force && devices.value.length > 0) return devices.value
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<ApiScannerDevice[]>(
        `/organisations/${activeOrgId.value}/scanner/devices`,
      )
      const raw = res.data?.data ?? res.data
      devices.value = Array.isArray(raw) ? raw : []
      return devices.value
    } catch (e) {
      error.value = extractError(e, "Failed to load scanner devices")
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAssignments(eventId: string): Promise<ApiAssignment[]> {
    try {
      const res = await instance.get<ApiAssignment[]>(
        `/organisations/${activeOrgId.value}/events/${eventId}/scanner-assignments`,
      )
      const raw = res.data?.data ?? res.data
      return Array.isArray(raw) ? raw : []
    } catch (e) {
      error.value = extractError(e, "Failed to load scanner assignments")
      throw e
    }
  }

  async function fetchIntegrityReport(eventId: string, force = false): Promise<ApiIntegrityReport> {
    if (!force && integrityReports.value[eventId]) return integrityReports.value[eventId]
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<ApiIntegrityReport>(
        `/organisations/${activeOrgId.value}/events/${eventId}/integrity-report`,
      )
      const report = res.data?.data ?? res.data
      integrityReports.value[eventId] = report
      return report
    } catch (e) {
      error.value = extractError(e, "Failed to load integrity report")
      throw e
    } finally {
      loading.value = false
    }
  }

  function mapConflictToScanItem(conflict: ApiIntegrityConflict) {
    const ticket = conflict.ticket
    const name = ticket?.recipientName || "Unknown"
    const email = ticket?.recipientEmail || ""
    return {
      id: conflict.id,
      name,
      email,
      status: conflict.result === "admitted" ? "Valid" : "Invalid",
      time: formatScanTime(conflict.scannedAt),
      ticketType: ticket?.ticketTypeId ? "Ticket" : undefined,
      ticketId: conflict.id,
      orderId: ticket?.orderId,
      gate: conflict.scannerDevice?.deviceLabel || conflict.scannerDeviceId,
      scanner: conflict.scannerDevice?.deviceLabel || conflict.scannerDeviceId,
      scannedAt: formatDateTime(conflict.scannedAt),
      purchased: undefined,
      avatarColor: undefined,
      isConflict: conflict.isConflict,
      result: conflict.result,
    }
  }

  return {
    devices,
    integrityReports,
    loading,
    error,
    fetchEvents,
    fetchEventOptions,
    fetchEvent,
    fetchDevices,
    fetchAssignments,
    fetchIntegrityReport,
    mapConflictToScanItem,
  }
}

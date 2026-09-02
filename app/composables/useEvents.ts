import type { Event, EventCategory, TicketType, CreateEventDto, CreateTicketTypeDto } from '~/types/event'

export const useEvents = () => {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

  const events = useState<Event[]>('events:list', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function extractErrorMessage(e: unknown, fallback: string): string {
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
      return Array.isArray(data.message) ? data.message.join(' ') : data.message
    }
    if (data?.errors) {
      return Object.values(data.errors).flat().join(', ')
    }
    if (apiError?.message) {
      return apiError.message
    }
    return fallback
  }

  const fetchEvent = async (eventId: string): Promise<Event> => {
    const cached = events.value.find((e) => e.id === eventId)
    if (cached) return cached

    try {
      loading.value = true
      error.value = null
      const res = await instance.get<Event>(
        `/organisations/${activeOrgId.value}/events/${eventId}`,
      )
      return res.data?.data ?? res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to load event')
      if (cached) return cached
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchEvents = async (force = false): Promise<Event[]> => {
    if (!force && events.value.length > 0) return events.value
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<Event[]>(
        `/organisations/${activeOrgId.value}/events`,
      )
      const raw = res.data?.data ?? res.data
      events.value = Array.isArray(raw) ? raw : []
      return Array.isArray(raw) ? raw : []
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to load events')
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async (): Promise<EventCategory[]> => {
    try {
      const res = await instance.get<EventCategory[]>('/categories')
      const raw = res.data?.data ?? res.data
      return Array.isArray(raw) ? raw : []
    } catch (e) {
      const msg = extractErrorMessage(e, 'Failed to load categories')
      console.error(msg)
      return []
    }
  }

  const createEvent = async (dto: CreateEventDto): Promise<Event> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<Event>(
        `/organisations/${activeOrgId.value}/events`,
        dto,
      )
      const newEvent = res.data?.data ?? res.data
      events.value = [newEvent, ...events.value]
      return newEvent
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to create event')
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateEvent = async (eventId: string, dto: Partial<CreateEventDto>): Promise<Event> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.patch<Event>(
        `/organisations/${activeOrgId.value}/events/${eventId}`,
        dto,
      )
      const updated = res.data?.data ?? res.data
      const idx = events.value.findIndex((e) => e.id === eventId)
      if (idx !== -1) events.value[idx] = updated
      return updated
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to update event')
      throw e
    } finally {
      loading.value = false
    }
  }

  const publishEvent = async (eventId: string): Promise<Event> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<Event>(
        `/organisations/${activeOrgId.value}/events/${eventId}/publish`,
        {},
      )
      const updated = res.data?.data ?? res.data
      const idx = events.value.findIndex((e) => e.id === eventId)
      if (idx !== -1) {
        events.value[idx] = updated
      } else {
        events.value.push(updated)
      }
      return updated
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to publish event')
      throw e
    } finally {
      loading.value = false
    }
  }

  const cancelEvent = async (eventId: string): Promise<Event> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<Event>(
        `/organisations/${activeOrgId.value}/events/${eventId}/cancel`,
        {},
      )
      const updated = res.data?.data ?? res.data
      const idx = events.value.findIndex((e) => e.id === eventId)
      if (idx !== -1) events.value[idx] = updated
      return updated
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to cancel event')
      throw e
    } finally {
      loading.value = false
    }
  }

  const createTicketType = async (eventId: string, dto: CreateTicketTypeDto): Promise<TicketType> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<TicketType>(
        `/organisations/${activeOrgId.value}/events/${eventId}/ticket-types`,
        dto,
      )
      return res.data?.data ?? res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to add ticket type')
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteTicketType = async (eventId: string, ticketTypeId: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await instance.delete(
        `/organisations/${activeOrgId.value}/events/${eventId}/ticket-types/${ticketTypeId}`,
      )
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to delete ticket type')
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvent,
    fetchEvents,
    fetchCategories,
    createEvent,
    updateEvent,
    publishEvent,
    cancelEvent,
    createTicketType,
    deleteTicketType,
  }
}

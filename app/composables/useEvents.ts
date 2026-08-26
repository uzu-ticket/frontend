import type { Event, EventCategory, EventImage, TicketType, CreateEventDto } from '~/types/event'

export const useEvents = () => {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

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
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<Event>(
        `/organisations/${activeOrgId.value}/events/${eventId}`,
      )
      return res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to load event')
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchEvents = async (): Promise<Event[]> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<Event[]>(
        `/organisations/${activeOrgId.value}/events`,
      )
      return res.data
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
      return res.data
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
      return res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to create event')
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
      return res.data
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to publish event')
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchEvent,
    fetchEvents,
    fetchCategories,
    createEvent,
    publishEvent,
  }
}

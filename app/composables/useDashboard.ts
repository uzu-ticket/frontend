import type { Ref } from 'vue'
import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useOrgState } from './useOrgState'

export interface DashboardOrdersOverTime {
  day: string
  orders: number
  revenueMinor: string
}

export interface DashboardUpcomingEvent {
  id: string
  title: string
  startsAt: string
  venueName: string | null
  city: string | null
  status: string
}

export interface DashboardRecentActivity {
  id: string
  action: string
  entityType: string | null
  createdAt: string
  actorName: string | null
}

export interface DashboardData {
  eventCount: number
  grossRevenueMinor: string
  ordersOverTime: DashboardOrdersOverTime[]
  upcomingEvents: DashboardUpcomingEvent[]
  recentActivities: DashboardRecentActivity[]
}

export const useDashboard = () => {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

  const data = ref<DashboardData | null>(null)
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
    const apiData = apiError?.response?.data
    if (apiData?.message) {
      return Array.isArray(apiData.message) ? apiData.message.join(' ') : apiData.message
    }
    if (apiData?.errors) {
      return Object.values(apiData.errors).flat().join(', ')
    }
    if (apiError?.message) {
      return apiError.message
    }
    return fallback
  }

  const fetchDashboardData = async (): Promise<DashboardData | null> => {
    if (!activeOrgId.value) return null

    try {
      loading.value = true
      error.value = null
      const res = await instance.get<DashboardData>(
        `/organisations/${activeOrgId.value}/dashboard`,
      )
      const raw = res.data?.data ?? res.data
      if (raw && typeof raw === 'object' && 'eventCount' in raw) {
        data.value = raw as DashboardData
        return data.value
      }
      return null
    } catch (e) {
      error.value = extractErrorMessage(e, 'Failed to load dashboard data')
      throw e
    } finally {
      loading.value = false
    }
  }

  const chartData = computed(() => {
    const items = data.value?.ordersOverTime
    if (!Array.isArray(items) || items.length === 0) return []
    return items.map((item) => ({
      day: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      orders: Number(item.orders) || 0,
      revenue: Number(item.revenueMinor) / 100 || 0,
    }))
  })

  const upcomingEvents = computed(() => data.value?.upcomingEvents ?? [])
  const recentActivities = computed(() => data.value?.recentActivities ?? [])
  const eventCount = computed(() => data.value?.eventCount ?? 0)
  const grossRevenueMinor = computed(() => data.value?.grossRevenueMinor ?? '0')

  return {
    data,
    loading,
    error,
    fetchDashboardData,
    chartData,
    upcomingEvents,
    recentActivities,
    eventCount,
    grossRevenueMinor,
  }
}

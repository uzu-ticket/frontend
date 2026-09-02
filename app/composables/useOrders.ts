import type {
  Order,
  ApiOrder,
  OrderMetrics,
  CreateOrderDto,
  OrderStatus,
} from "~/types/orders"
import {
  mapOrderFromApi,
  mapOrdersFromApi,
  computeOrderMetrics,
} from "~/types/orders"

export const useOrders = () => {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

  const orders = useState<Order[]>("orders:list", () => [])
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
      return Array.isArray(data.message) ? data.message.join(" ") : data.message
    }
    if (data?.errors) {
      return Object.values(data.errors).flat().join(", ")
    }
    if (apiError?.message) {
      return apiError.message
    }
    return fallback
  }

  const fetchOrders = async (orgId?: string, force = false): Promise<Order[]> => {
    const orgIdToUse = orgId ?? activeOrgId.value
    if (!force && orders.value.length > 0) return orders.value

    try {
      loading.value = true
      error.value = null
      const res = await instance.get<ApiOrder[]>(
        `/orders/organisation/${orgIdToUse}`,
      )
      const apiOrders = res.data?.data ?? res.data
      const mapped = mapOrdersFromApi(Array.isArray(apiOrders) ? apiOrders : [])
      orders.value = mapped
      return mapped
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to load orders")
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchOrder = async (orderId: string): Promise<Order> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.get<ApiOrder>(`/orders/${orderId}`)
      const apiOrder = res.data?.data ?? res.data
      return mapOrderFromApi(apiOrder)
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to load order")
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchMyTickets = async () => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.get(`/orders/mine/tickets`)
      const data = res.data?.data ?? res.data
      return data
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to load tickets")
      throw e
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (dto: CreateOrderDto) => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post<ApiOrder>(`/orders`, dto)
      const created = res.data?.data ?? res.data
      const mapped = mapOrderFromApi(created)
      orders.value = [mapped, ...orders.value]
      return mapped
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to create order")
      throw e
    } finally {
      loading.value = false
    }
  }

  const initiateCheckout = async (orderId: string) => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post(`/orders/${orderId}/checkout`)
      return res.data?.data ?? res.data
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to initiate checkout")
      throw e
    } finally {
      loading.value = false
    }
  }

  const cancelOrder = async (orderId: string): Promise<Order> => {
    try {
      loading.value = true
      error.value = null
      const res = await instance.post(`/orders/${orderId}/cancel`)
      const cancelled = res.data?.data ?? res.data
      const mapped = mapOrderFromApi(cancelled)
      const idx = orders.value.findIndex((o) => o.id === orderId)
      if (idx !== -1) orders.value[idx] = mapped
      return mapped
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to cancel order")
      throw e
    } finally {
      loading.value = false
    }
  }

  const refundOrder = async (orgId: string, orderId: string, reason?: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      const body: Record<string, unknown> = {}
      if (reason) body.reason = reason
      const res = await instance.post(
        `/organisations/${orgId}/orders/${orderId}/refund`,
        body,
      )
      const refunded = res.data?.data ?? res.data
      const idx = orders.value.findIndex((o) => o.id === orderId)
      if (idx !== -1) {
        // Optimistically flip the status to Refunded for UI
        orders.value[idx].status = "Refunded" as OrderStatus
      }
      return refunded
    } catch (e) {
      error.value = extractErrorMessage(e, "Failed to process refund")
      throw e
    } finally {
      loading.value = false
    }
  }

  const getMetrics = (): OrderMetrics => {
    return computeOrderMetrics(orders.value)
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    fetchMyTickets,
    createOrder,
    initiateCheckout,
    cancelOrder,
    refundOrder,
    getMetrics,
  }
}

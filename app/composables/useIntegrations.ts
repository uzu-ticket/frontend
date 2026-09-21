import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useOrgState } from '~/composables/useOrgState'

export interface IntegrationItem {
  id: string
  provider: string
  name: string
  category: 'Payment' | 'Email Marketing' | 'Analytics' | 'Automation'
  description: string
  status: 'Live' | 'Inactive'
  connected: boolean
  logoKey: 'paystack' | 'mailchimp' | 'google-analytics' | 'meta-pixel' | 'zapier' | 'paypal' | 'flutterwave'
  connectedAt?: string | null
  publicKey?: string | null
}

export interface ConnectIntegrationPayload {
  publicKey?: string
  secretKey?: string
  webhookUrl?: string
  audienceId?: string
  pixelId?: string
  measurementId?: string
}

// ---------------------------------------------------------------------------
// Catalogue fallback used while loading or if API unavailable
// ---------------------------------------------------------------------------
const FALLBACK_CATALOGUE: IntegrationItem[] = [
  { id: 'paystack', provider: 'paystack', name: 'Paystack', category: 'Payment', description: 'Accept payments for your events', status: 'Live', connected: false, logoKey: 'paystack' },
  { id: 'mailchimp', provider: 'mailchimp', name: 'Mailchimp', category: 'Email Marketing', description: 'Send emails and manage audiences', status: 'Live', connected: false, logoKey: 'mailchimp' },
  { id: 'google-analytics', provider: 'google-analytics', name: 'Google Analytics', category: 'Analytics', description: 'Track website traffic and conversion data', status: 'Live', connected: false, logoKey: 'google-analytics' },
  { id: 'meta-pixel', provider: 'meta-pixel', name: 'Meta Pixel', category: 'Analytics', description: 'Track Facebook ad performance and visitor activity', status: 'Live', connected: false, logoKey: 'meta-pixel' },
  { id: 'zapier', provider: 'zapier', name: 'Zapier', category: 'Automation', description: 'Connect UzuTicket to 5,000+ web applications', status: 'Live', connected: false, logoKey: 'zapier' },
  { id: 'paypal', provider: 'paypal', name: 'PayPal', category: 'Payment', description: 'Accept international PayPal payments', status: 'Live', connected: false, logoKey: 'paypal' },
  { id: 'flutterwave', provider: 'flutterwave', name: 'Flutterwave', category: 'Payment', description: 'Accept cards, mobile money & bank transfers', status: 'Live', connected: false, logoKey: 'flutterwave' },
]

export function useIntegrations() {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

  const integrationsList = ref<IntegrationItem[]>([...FALLBACK_CATALOGUE])
  const searchQuery = ref('')
  const isAddModalOpen = ref(false)
  const isLoading = ref(false)
  const isConnecting = ref(false)

  // ---- Computed filters ----
  const connectedIntegrations = computed(() => integrationsList.value.filter((i) => i.connected))
  const availableIntegrations = computed(() => integrationsList.value.filter((i) => !i.connected))

  const filteredConnected = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return connectedIntegrations.value
    return connectedIntegrations.value.filter(
      (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
    )
  })

  const filteredAvailable = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return availableIntegrations.value
    return availableIntegrations.value.filter(
      (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
    )
  })

  // ---- API calls ----

  async function fetchIntegrations() {
    if (!activeOrgId.value) return
    isLoading.value = true
    try {
      const res = await instance.get(`/organisations/${activeOrgId.value}/integrations`)
      const data = res.data?.data ?? res.data
      // Merge connected + available into a single flat list
      const all: IntegrationItem[] = [
        ...(data.connected ?? []),
        ...(data.available ?? []),
      ]
      if (all.length > 0) {
        integrationsList.value = all
      }
    } catch {
      // silently fall back to catalogue
    } finally {
      isLoading.value = false
    }
  }

  async function connectIntegration(provider: string, payload: ConnectIntegrationPayload) {
    if (!activeOrgId.value) return
    isConnecting.value = true
    try {
      await instance.post(
        `/organisations/${activeOrgId.value}/integrations/${provider}/connect`,
        payload,
      )
      // Optimistically update local state
      const item = integrationsList.value.find((i) => i.id === provider)
      if (item) item.connected = true
      // Refresh from server
      await fetchIntegrations()
    } finally {
      isConnecting.value = false
    }
  }

  async function disconnectIntegration(provider: string) {
    if (!activeOrgId.value) return
    try {
      await instance.delete(
        `/organisations/${activeOrgId.value}/integrations/${provider}/disconnect`,
      )
      // Optimistically update local state
      const item = integrationsList.value.find((i) => i.id === provider)
      if (item) item.connected = false
      // Refresh from server
      await fetchIntegrations()
    } catch {
      // Revert optimistic update on failure
      await fetchIntegrations()
      throw new Error('Failed to disconnect integration')
    }
  }

  // ---- Legacy toggle (kept for backward compat with components using it) ----
  function toggleConnection(id: string) {
    const item = integrationsList.value.find((i) => i.id === id)
    if (item) item.connected = !item.connected
  }

  // ---- Modal helpers ----
  function openAddModal() { isAddModalOpen.value = true }
  function closeAddModal() { isAddModalOpen.value = false }

  return {
    integrationsList,
    searchQuery,
    isAddModalOpen,
    isLoading,
    isConnecting,
    connectedIntegrations,
    availableIntegrations,
    filteredConnected,
    filteredAvailable,
    fetchIntegrations,
    connectIntegration,
    disconnectIntegration,
    toggleConnection,
    openAddModal,
    closeAddModal,
  }
}

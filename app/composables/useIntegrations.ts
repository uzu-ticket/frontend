import { ref, computed } from 'vue'

export interface IntegrationItem {
  id: string
  name: string
  category: 'Payment' | 'Email Marketing' | 'Analytics' | 'Automation'
  description: string
  status: 'Live' | 'Inactive'
  connected: boolean
  logoKey: 'paystack' | 'mailchimp' | 'google-analytics' | 'meta-pixel' | 'zapier' | 'paypal' | 'flutterwave'
}

const initialIntegrations: IntegrationItem[] = [
  // Connected Integrations
  {
    id: 'paystack',
    name: 'Paystack',
    category: 'Payment',
    description: 'Accept payments for your events',
    status: 'Live',
    connected: true,
    logoKey: 'paystack',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Email Marketing',
    description: 'Send emails and manage audiences',
    status: 'Live',
    connected: true,
    logoKey: 'mailchimp',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'Analytics',
    description: 'Track website traffic and conversion data',
    status: 'Live',
    connected: true,
    logoKey: 'google-analytics',
  },

  // Available Integrations
  {
    id: 'meta-pixel',
    name: 'Meta Pixel',
    category: 'Analytics',
    description: 'Track Facebook ad performance and visitor activity',
    status: 'Live',
    connected: false,
    logoKey: 'meta-pixel',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Automation',
    description: 'Connect UzuTicket to 5,000+ web applications',
    status: 'Live',
    connected: false,
    logoKey: 'zapier',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Payment',
    description: 'Accept international PayPal payments',
    status: 'Live',
    connected: false,
    logoKey: 'paypal',
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    category: 'Payment',
    description: 'Accept cards, mobile money & bank transfers',
    status: 'Live',
    connected: false,
    logoKey: 'flutterwave',
  },
]

export function useIntegrations() {
  const integrationsList = ref<IntegrationItem[]>(initialIntegrations)
  const searchQuery = ref('')
  const isAddModalOpen = ref(false)

  const connectedIntegrations = computed(() => {
    return integrationsList.value.filter((item) => item.connected)
  })

  const availableIntegrations = computed(() => {
    return integrationsList.value.filter((item) => !item.connected)
  })

  const filteredConnected = computed(() => {
    if (!searchQuery.value.trim()) return connectedIntegrations.value
    const q = searchQuery.value.toLowerCase()
    return connectedIntegrations.value.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    )
  })

  const filteredAvailable = computed(() => {
    if (!searchQuery.value.trim()) return availableIntegrations.value
    const q = searchQuery.value.toLowerCase()
    return availableIntegrations.value.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    )
  })

  function toggleConnection(id: string) {
    const item = integrationsList.value.find((i) => i.id === id)
    if (item) {
      item.connected = !item.connected
    }
  }

  function openAddModal() {
    isAddModalOpen.value = true
  }

  function closeAddModal() {
    isAddModalOpen.value = false
  }

  return {
    integrationsList,
    searchQuery,
    isAddModalOpen,
    connectedIntegrations,
    availableIntegrations,
    filteredConnected,
    filteredAvailable,
    toggleConnection,
    openAddModal,
    closeAddModal,
  }
}

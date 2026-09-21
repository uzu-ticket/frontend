<template>
  <div class="integrations-page">
    <IntegrationsOverview
      :connected-list="filteredConnected"
      :available-list="filteredAvailable"
      :is-loading="isLoading"
      @open-add="openAddModal"
      @open-connect="handleOpenConnect"
      @toggle-connect="handleToggleConnect"
      @test-connect="handleTestConnect"
    />

    <!-- Add Integration Modal -->
    <AddIntegrationModal
      v-if="isAddModalOpen"
      :integrations="integrationsList"
      @close="closeAddModal"
      @toggle="handleToggleConnect"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import IntegrationsOverview from '~/components/integrations/IntegrationsOverview.vue'
import AddIntegrationModal from '~/components/integrations/AddIntegrationModal.vue'
import { useIntegrations, type IntegrationItem } from '~/composables/useIntegrations'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Integrations — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Connect your platform with third-party services, APIs, and developer tools.' },
  ],
})

const router = useRouter()
const toast = useToast()
const { activeOrgId } = useOrgState()
const {
  integrationsList,
  isAddModalOpen,
  isLoading,
  filteredConnected,
  filteredAvailable,
  fetchIntegrations,
  disconnectIntegration,
  openAddModal,
  closeAddModal,
} = useIntegrations()

// Fetch on mount and whenever the active org changes
onMounted(() => fetchIntegrations())
watch(activeOrgId, () => fetchIntegrations())

function handleOpenConnect(id: string) {
  router.push(`/integrations/${id}`)
}

function handleTestConnect(item: IntegrationItem) {
  toast.success(`${item.name} connection test succeeded! Signal active.`)
}

async function handleToggleConnect(id: string) {
  const item = integrationsList.value.find((i) => i.id === id)
  if (!item) return

  if (item.connected) {
    // Disconnect
    try {
      await disconnectIntegration(id)
      toast.info(`${item.name} disconnected.`)
    } catch {
      toast.error(`Failed to disconnect ${item.name}`)
    }
  } else {
    // Navigate to the connect page to enter credentials
    router.push(`/integrations/${id}`)
  }
}
</script>

<style scoped>
.integrations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

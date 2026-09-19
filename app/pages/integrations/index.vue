<template>
  <div class="integrations-page">
    <IntegrationsOverview
      :connected-list="filteredConnected"
      :available-list="filteredAvailable"
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
import IntegrationsOverview from '~/components/integrations/IntegrationsOverview.vue'
import AddIntegrationModal from '~/components/integrations/AddIntegrationModal.vue'
import { useIntegrations, type IntegrationItem } from '~/composables/useIntegrations'
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
const {
  integrationsList,
  isAddModalOpen,
  filteredConnected,
  filteredAvailable,
  toggleConnection,
  openAddModal,
  closeAddModal,
} = useIntegrations()

function handleOpenConnect(id: string) {
  router.push(`/integrations/${id}`)
}

function handleTestConnect(item: IntegrationItem) {
  toast.success(`${item.name} connection test succeeded! Signal active.`)
}

function handleToggleConnect(id: string) {
  const item = integrationsList.value.find((i) => i.id === id)
  const wasConnected = item?.connected
  toggleConnection(id)

  if (item) {
    if (!wasConnected) {
      toast.success(`${item.name} connected successfully!`)
    } else {
      toast.info(`${item.name} disconnected.`)
    }
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

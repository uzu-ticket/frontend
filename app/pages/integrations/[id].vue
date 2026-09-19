<template>
  <div class="integrations-page">
    <IntegrationConnectStep
      v-if="targetIntegration"
      :integration="targetIntegration"
      @back="router.push('/integrations')"
      @connect="handleConnect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IntegrationConnectStep from '~/components/integrations/IntegrationConnectStep.vue'
import { useIntegrations } from '~/composables/useIntegrations'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { integrationsList, toggleConnection } = useIntegrations()

const targetIntegration = computed(() => {
  const paramId = route.params.id as string
  return integrationsList.value.find((i) => i.id === paramId) || integrationsList.value[0]
})

useHead({
  title: computed(() => `Connect ${targetIntegration.value?.name || 'Integration'} — Uzu Ticket`),
})

function handleConnect(keys: { publicKey: string; secretKey: string }) {
  if (targetIntegration.value) {
    if (!targetIntegration.value.connected) {
      toggleConnection(targetIntegration.value.id)
    }
    toast.success(`${targetIntegration.value.name} connection saved and activated!`)
  }
  router.push('/integrations')
}
</script>

<style scoped>
.integrations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

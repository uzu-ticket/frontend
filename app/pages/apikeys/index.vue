<template>
  <div class="apikeys-page">
    <ApiKeysOverview
      :api-keys-list="apiKeysList"
      :is-loading="isLoading"
      @generate="router.push('/apikeys/create')"
      @revoke="handleRevoke"
      @copy="handleCopy"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import ApiKeysOverview from '~/components/apikeys/ApiKeysOverview.vue'
import { useApiKeys } from '~/composables/useApiKeys'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'API Keys — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your Uzu Ticket API keys for developer integrations.' },
  ],
})

const router = useRouter()
const toast = useToast()
const { activeOrgId } = useOrgState()
const { apiKeysList, isLoading, fetchApiKeys, revokeApiKey } = useApiKeys()

onMounted(() => {
  fetchApiKeys()
})

watch(activeOrgId, () => {
  fetchApiKeys()
})

async function handleRevoke(id: string) {
  await revokeApiKey(id)
  toast.info('API key revoked and deactivated.')
}

async function handleCopy(key: string) {
  try {
    await navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard!')
  } catch {
    toast.error('Failed to copy — please copy manually.')
  }
}
</script>

<style scoped>
.apikeys-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - 120px);
}
</style>

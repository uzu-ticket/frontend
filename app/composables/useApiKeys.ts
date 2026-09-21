import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useOrgState } from '~/composables/useOrgState'

export interface ApiKey {
  id: string
  name: string
  keyMasked: string
  fullKey?: string
  environment: 'Live (Production)' | 'Test (Sand hook)' | string
  permissions: string[]
  createdDate: string
  status: 'Active' | 'Revoked'
}

const apiKeysList = ref<ApiKey[]>([])
const createdNewKey = ref<ApiKey | null>(null)
const isLoading = ref(false)

export function useApiKeys() {
  const { instance } = useApi()
  const { activeOrgId } = useOrgState()

  async function fetchApiKeys() {
    if (!activeOrgId.value) return
    isLoading.value = true
    try {
      const res = await instance.get<ApiKey[]>(`/organisations/${activeOrgId.value}/api-keys`)
      apiKeysList.value = res.data || []
    } catch {
      // Keep existing list on error
    } finally {
      isLoading.value = false
    }
  }

  async function createApiKey(input: {
    name: string
    environment: 'Live (Production)' | 'Test (Sand hook)'
    permissions: string[]
  }) {
    if (!activeOrgId.value) throw new Error('No active organisation')
    const res = await instance.post<ApiKey>(`/organisations/${activeOrgId.value}/api-keys`, {
      label: input.name,
      environment: input.environment,
      permissions: input.permissions,
    })

    const newKey = res.data
    apiKeysList.value.unshift(newKey)
    createdNewKey.value = newKey
    return newKey
  }

  async function revokeApiKey(id: string) {
    if (!activeOrgId.value) return
    try {
      const res = await instance.delete<ApiKey>(`/organisations/${activeOrgId.value}/api-keys/${id}/revoke`)
      const updated = res.data
      const target = apiKeysList.value.find((k) => k.id === id)
      if (target && updated) {
        target.status = updated.status
      }
    } catch {
      // On error, fallback local status update
      const target = apiKeysList.value.find((k) => k.id === id)
      if (target) target.status = 'Revoked'
    }
  }

  return {
    apiKeysList,
    createdNewKey,
    isLoading,
    fetchApiKeys,
    createApiKey,
    revokeApiKey,
  }
}

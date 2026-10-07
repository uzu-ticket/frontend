import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useOrgState } from '~/composables/useOrgState'

export interface ApiKey {
  id: string
  name: string
  keyMasked: string
  fullKey?: string
  environment: string
  permissions: string[]
  createdDate: string
  createdDateTime?: string
  status: 'Active' | 'Revoked'
  lastUsed?: string
  usageRequests?: number
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

  async function fetchApiKey(keyId: string): Promise<ApiKey | null> {
    if (!activeOrgId.value) return null
    isLoading.value = true
    try {
      const res = await instance.get<ApiKey>(`/organisations/${activeOrgId.value}/api-keys/${keyId}`)
      return res.data || null
    } catch {
      const cached = apiKeysList.value.find((k) => k.id === keyId)
      return cached || null
    } finally {
      isLoading.value = false
    }
  }

  async function createApiKey(input: {
    name: string
    environment: string
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

  async function regenerateApiKey(id: string): Promise<ApiKey | null> {
    if (!activeOrgId.value) return null
    try {
      const res = await instance.post<ApiKey>(`/organisations/${activeOrgId.value}/api-keys/${id}/regenerate`, {})
      const updated = res.data
      const idx = apiKeysList.value.findIndex((k) => k.id === id)
      if (idx !== -1 && updated) {
        apiKeysList.value[idx] = updated
      }
      return updated
    } catch (e) {
      console.error('Failed to regenerate key:', e)
      throw e
    }
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
      const target = apiKeysList.value.find((k) => k.id === id)
      if (target) target.status = 'Revoked'
    }
  }

  return {
    apiKeysList,
    createdNewKey,
    isLoading,
    fetchApiKeys,
    fetchApiKey,
    createApiKey,
    regenerateApiKey,
    revokeApiKey,
  }
}

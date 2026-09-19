import { ref } from 'vue'

export interface ApiKey {
  id: string
  name: string
  keyMasked: string
  fullKey: string
  environment: 'Live (Production)' | 'Test (Sand hook)'
  permissions: string[]
  createdDate: string
  status: 'Active' | 'Revoked'
}

const initialKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production key',
    keyMasked: 'UKL_************************',
    fullKey: 'SK_Live_87acb3456780098811260867493a',
    environment: 'Live (Production)',
    permissions: ['Read - View events, tickets, etc.', 'Write - Create and update resources', 'Webhook - Receive event notification'],
    createdDate: '14 Sept 2026',
    status: 'Active',
  },
  {
    id: 'key-2',
    name: 'Development key',
    keyMasked: 'JKL_************************',
    fullKey: 'SK_Test_49b01c3857d4a1b029c99e8a71b2',
    environment: 'Test (Sand hook)',
    permissions: ['Read - View events, tickets, etc.', 'Write - Create and update resources'],
    createdDate: '16 Sept 2026',
    status: 'Active',
  },
]

const apiKeysList = ref<ApiKey[]>(initialKeys)
const createdNewKey = ref<ApiKey | null>(null)

export function useApiKeys() {
  function createApiKey(input: {
    name: string
    environment: 'Live (Production)' | 'Test (Sand hook)'
    permissions: string[]
  }) {
    const randomHex = Array.from({ length: 28 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('')
    const prefix = input.environment === 'Live (Production)' ? 'SK_Live_' : 'SK_Test_'
    const fullKeyStr = `${prefix}${randomHex}`
    const maskedPrefix = input.environment === 'Live (Production)' ? 'UKL_' : 'JKL_'

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: input.name || 'New API key',
      keyMasked: `${maskedPrefix}************************`,
      fullKey: fullKeyStr,
      environment: input.environment,
      permissions: input.permissions,
      createdDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Active',
    }

    apiKeysList.value.unshift(newKey)
    createdNewKey.value = newKey
    return newKey
  }

  function revokeApiKey(id: string) {
    const target = apiKeysList.value.find((k) => k.id === id)
    if (target) {
      target.status = 'Revoked'
    }
  }

  return {
    apiKeysList,
    createdNewKey,
    createApiKey,
    revokeApiKey,
  }
}

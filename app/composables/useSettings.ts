import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useOrgState } from '~/composables/useOrgState'

export interface UpdateProfilePayload {
  fullName?: string
  phone?: string
  city?: string
  preferredCurrency?: string
  marketingOptIn?: boolean
}

export interface UpdateOrgPayload {
  name?: string
  contactPhone?: string
  contactEmail?: string
  description?: string
}

export function useSettings() {
  const { instance } = useApi()
  const { fetchUser } = useAuth()
  const { loadOrganizations } = useOrgState()

  async function updateProfile(payload: UpdateProfilePayload) {
    try {
      const res = await instance.patch('/users/me', payload)
      await fetchUser()
      return res.data?.data ?? res.data
    } catch (e: any) {
      const message =
        e.response?.data?.message ||
        (Array.isArray(e.response?.data?.message) ? e.response.data.message.join(', ') : null) ||
        e.message ||
        'Failed to update profile'
      throw new Error(message)
    }
  }

  async function updateOrg(orgId: string, payload: UpdateOrgPayload) {
    try {
      const res = await instance.patch(`/organisations/${orgId}`, payload)
      await loadOrganizations(true)
      return res.data?.data ?? res.data
    } catch (e: any) {
      const message =
        e.response?.data?.message ||
        (Array.isArray(e.response?.data?.message) ? e.response.data.message.join(', ') : null) ||
        e.message ||
        'Failed to update organization'
      throw new Error(message)
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      const res = await instance.patch('/users/me/password', {
        currentPassword,
        newPassword,
      })
      return res.data?.data ?? res.data
    } catch (e: any) {
      const message =
        e.response?.data?.message ||
        (Array.isArray(e.response?.data?.message) ? e.response.data.message.join(', ') : null) ||
        e.message ||
        'Failed to change password'
      throw new Error(message)
    }
  }

  return {
    updateProfile,
    updateOrg,
    changePassword,
  }
}

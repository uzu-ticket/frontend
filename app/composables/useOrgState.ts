import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

export interface Organization {
  id: string
  name: string
  role: string
  initials: string
  eventsCount: number
  membersCount: number
  badgeBg: string
}

export interface PendingInvite {
  id: string
  organisationId: string
  orgName: string
  invitedBy: string
  role: string
  initials: string
  badgeBg: string
  badgeColor: string
}

interface ActiveOrg {
  id: string
  name: string
  initials: string
}

interface ApiOrg {
  id: string
  name: string
  myRole?: string
  role?: string
  eventsCount?: number
  membersCount?: number
  [key: string]: unknown
}

const roleLabels: Record<string, string> = {
  super_admin: 'Owner',
  admin: 'Admin',
  member: 'Member',
}

const orgsLoading = ref(false)
const orgsError = ref<string | null>(null)

function initialsFromName(name: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0]?.slice(0, 2).toUpperCase() || ''
}

function roleLabel(role?: string): string {
  if (!role) return 'Owner'
  return roleLabels[role.toLowerCase()] ?? role
}

function mapOrg(o: ApiOrg): Organization {
  return {
    id: o.id,
    name: o.name,
    role: roleLabel(o.myRole ?? o.role),
    initials: initialsFromName(o.name),
    eventsCount: o.eventsCount ?? 0,
    membersCount: o.membersCount ?? 0,
    badgeBg: '#0E2615',
  }
}

function extractOrgError(e: unknown): string {
  const apiError = e as {
    response?: {
      data?: { message?: string | string[]; errors?: Record<string, string[]> }
    }
    message?: string
  }
  const data = apiError?.response?.data
  if (data?.message) {
    return Array.isArray(data.message) ? data.message.join(' ') : data.message
  }
  if (data?.errors) {
    return Object.values(data.errors).flat().join(', ')
  }
  if (apiError?.message) return apiError.message
  return 'Failed to load organizations.'
}

export function useOrgState() {
  const activeOrgCookie = useCookie<ActiveOrg | null>('uzu-active-org', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const hasActiveOrg = computed(() => !!activeOrgCookie.value)
  const activeOrgId = computed(() => activeOrgCookie.value?.id ?? '')
  const activeOrgName = computed(() => activeOrgCookie.value?.name ?? '')
  const activeOrgInitials = computed(() => activeOrgCookie.value?.initials ?? '')

  const organizations = useState<Organization[]>('organizations:list', () => [])
  const pendingInvitations = useState<PendingInvite[]>('organizations:pending-invites', () => [])

  function setActiveOrg(org: { id?: string; name: string; initials?: string }) {
    const newId = org.id ?? ''
    const changed = activeOrgCookie.value?.id !== newId
    activeOrgCookie.value = {
      id: newId,
      name: org.name,
      initials: org.initials ?? initialsFromName(org.name),
    }
    if (changed) {
      const eventsState = useState('events:list')
      eventsState.value = []
    }
  }

  function clearActiveOrg() {
    activeOrgCookie.value = null
  }

  function syncActiveOrg() {
    if (organizations.value.length === 0) return

    const currentId = activeOrgId.value
    const found = organizations.value.find((o) => o.id === currentId)

    if (found) {
      setActiveOrg({ id: found.id, name: found.name, initials: found.initials })
    } else {
      const first = organizations.value[0]
      setActiveOrg({ id: first.id, name: first.name, initials: first.initials })
    }
  }

  async function loadOrganizations(force = false) {
    if (!force && organizations.value.length > 0) {
      syncActiveOrg()
      return organizations.value
    }
    orgsLoading.value = true
    orgsError.value = null
    try {
      const { instance } = useApi()
      const res = await instance.get('/organisations/mine')
      const rawData = res.data?.data ?? res.data
      const raw = Array.isArray(rawData) ? rawData : []
      organizations.value = raw.map(mapOrg)
    } catch (e) {
      orgsError.value = extractOrgError(e)
    } finally {
      orgsLoading.value = false
    }
    syncActiveOrg()
    return organizations.value
  }

  async function loadPendingInvitations() {
    try {
      const { instance } = useApi()
      const res = await instance.get('/organisations/invitations/mine')
      const rawData = res.data?.data ?? res.data
      pendingInvitations.value = Array.isArray(rawData) ? rawData : []
    } catch (e) {
      console.error('Failed to fetch pending invitations:', e)
    }
    return pendingInvitations.value
  }

  async function acceptInvitation(organisationId: string, memberId: string) {
    try {
      const { instance } = useApi()
      await instance.post(`/organisations/${organisationId}/members/${memberId}/accept`)
      await Promise.all([loadOrganizations(true), loadPendingInvitations()])
    } catch (e) {
      console.error('Failed to accept invitation:', e)
      throw e
    }
  }

  async function declineInvitation(organisationId: string, memberId: string) {
    try {
      const { instance } = useApi()
      await instance.post(`/organisations/${organisationId}/members/${memberId}/decline`)
      pendingInvitations.value = pendingInvitations.value.filter((inv) => inv.id !== memberId)
    } catch (e) {
      console.error('Failed to decline invitation:', e)
      throw e
    }
  }

  async function fetchMembers(organisationId: string) {
    try {
      const { instance } = useApi()
      const res = await instance.get(`/organisations/${organisationId}/members`)
      return res.data?.data ?? res.data
    } catch (e) {
      console.error('Failed to fetch members:', e)
      throw e
    }
  }

  async function inviteMember(organisationId: string, payload: { email: string; role: string }) {
    try {
      const { instance } = useApi()
      const res = await instance.post(`/organisations/${organisationId}/members`, payload)
      return res.data?.data ?? res.data
    } catch (e) {
      console.error('Failed to invite member:', e)
      throw e
    }
  }

  async function revokeMember(organisationId: string, memberId: string) {
    try {
      const { instance } = useApi()
      await instance.post(`/organisations/${organisationId}/members/${memberId}/revoke`)
    } catch (e) {
      console.error('Failed to revoke member:', e)
      throw e
    }
  }

  async function resendInvite(organisationId: string, memberId: string) {
    try {
      const { instance } = useApi()
      await instance.post(`/organisations/${organisationId}/members/${memberId}/resend`)
    } catch (e) {
      console.error('Failed to resend invite:', e)
      throw e
    }
  }

  async function searchUsers(query: string) {
    if (!query || !query.trim()) return []
    try {
      const { instance } = useApi()
      const res = await instance.get('/users/search', { params: { q: query } })
      return res.data?.data ?? res.data ?? []
    } catch (e) {
      console.error('Failed to search users:', e)
      return []
    }
  }

  return {
    hasActiveOrg,
    activeOrgId,
    activeOrgName,
    activeOrgInitials,
    organizations,
    pendingInvitations,
    orgsLoading,
    orgsError,
    loadOrganizations,
    loadPendingInvitations,
    acceptInvitation,
    declineInvitation,
    fetchMembers,
    inviteMember,
    revokeMember,
    resendInvite,
    searchUsers,
    setActiveOrg,
    clearActiveOrg,
  }
}


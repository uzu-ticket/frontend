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

  function setActiveOrg(org: { id?: string; name: string; initials?: string }) {
    activeOrgCookie.value = {
      id: org.id ?? '',
      name: org.name,
      initials: org.initials ?? initialsFromName(org.name),
    }
  }

  function clearActiveOrg() {
    activeOrgCookie.value = null
  }

  function syncActiveOrg() {
    if (hasActiveOrg.value && !organizations.value.some((o) => o.id === activeOrgId.value)) {
      clearActiveOrg()
    }
    if (!hasActiveOrg.value && organizations.value.length > 0) {
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
      const raw = res.data as ApiOrg[]
      organizations.value = Array.isArray(raw) ? raw.map(mapOrg) : []
    } catch (e) {
      orgsError.value = extractOrgError(e)
    } finally {
      orgsLoading.value = false
    }
    syncActiveOrg()
    return organizations.value
  }

  return {
    hasActiveOrg,
    activeOrgId,
    activeOrgName,
    activeOrgInitials,
    organizations,
    orgsLoading,
    orgsError,
    loadOrganizations,
    setActiveOrg,
    clearActiveOrg,
  }
}

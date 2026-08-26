<template>
  <div class="team-members-page">
    <!-- Top Header & Actions Bar -->
    <div class="page-header">
      <div class="header-left">
        <div class="back-link-row">
          <button class="btn-back-link" @click="handleBackToOrgs">
            <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>Back to Organizations</span>
          </button>
        </div>
        <h1 class="page-title">Team Members</h1>
        <p class="page-subtitle">
          Manage team members, assign permission roles, and invite people to {{ activeOrgName || 'your organization' }}.
        </p>
      </div>

      <div class="header-actions">
        <button class="btn-secondary-action" @click="copyInviteLink">
          <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy Invite Link</span>
        </button>

        <button class="btn-primary-invite" @click="showInviteModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>+ Invite Team Member</span>
        </button>
      </div>
    </div>

    <!-- Quick Metrics Cards Row -->
    <div class="metrics-row">
      <div class="metric-card">
        <div class="metric-icon-bg metric-icon--members">
          <svg xmlns="http://www.w3.org/2000/svg" class="metric-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div class="metric-data">
          <span class="metric-value">{{ membersList.length }}</span>
          <span class="metric-label">Total Team Members</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-bg metric-icon--admins">
          <svg xmlns="http://www.w3.org/2000/svg" class="metric-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div class="metric-data">
          <span class="metric-value">{{ adminCount }}</span>
          <span class="metric-label">Admins & Owners</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-bg metric-icon--pending">
          <svg xmlns="http://www.w3.org/2000/svg" class="metric-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="metric-data">
          <span class="metric-value">{{ pendingCount }}</span>
          <span class="metric-label">Pending Invites</span>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="content-card">
      <!-- Tabs Navigation -->
      <div class="tabs-bar">
        <div class="tabs-list">
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            All Members ({{ membersList.length }})
          </button>

          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'pending' }"
            @click="activeTab = 'pending'"
          >
            Pending Invites
            <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
          </button>

          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'roles' }"
            @click="activeTab = 'roles'"
          >
            Roles & Permissions
          </button>
        </div>
      </div>

      <!-- TAB 1 & 2: Members Directory List -->
      <div v-if="activeTab === 'all' || activeTab === 'pending'" class="directory-container">
        <!-- Search & Filter Controls Bar -->
        <div class="filters-bar">
          <div class="search-input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search team member by name or email..."
              class="search-field"
            />
          </div>

          <!-- Role Filter Select -->
          <div class="filter-select-wrapper">
            <select v-model="roleFilter" class="role-select">
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager / Sales</option>
              <option value="event_staff">Event Staff</option>
              <option value="member">Member / Support</option>
            </select>
          </div>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="loadingMembers" class="skeleton-table">
          <div v-for="i in 4" :key="i" class="skeleton-row">
            <AppSkeleton variant="circle" width="38px" height="38px" />
            <div class="skeleton-info">
              <AppSkeleton variant="title" width="160px" height="0.9rem" />
              <AppSkeleton variant="text" width="200px" height="0.75rem" />
            </div>
            <AppSkeleton variant="text" width="80px" height="1.5rem" border-radius="9999px" />
            <AppSkeleton variant="text" width="70px" height="1.2rem" />
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="membersError" class="error-box">
          <p class="error-text">{{ membersError }}</p>
          <button class="btn-retry" @click="loadMembers">Retry</button>
        </div>

        <!-- Members Table -->
        <div v-else class="table-wrapper">
          <table class="members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in filteredMembers" :key="member.id">
                <!-- Member Name & Email -->
                <td>
                  <div class="member-cell">
                    <div
                      class="avatar-badge"
                      :style="{ backgroundColor: member.bgColor || '#0E2615', color: member.textColor || '#ffffff' }"
                    >
                      {{ member.initials }}
                    </div>
                    <div class="member-info">
                      <span class="member-name">{{ member.name }}</span>
                      <span class="member-email">{{ member.email }}</span>
                    </div>
                  </div>
                </td>

                <!-- Role Badge -->
                <td>
                  <span class="role-pill" :class="`role-pill--${member.roleKey}`">
                    {{ member.role }}
                  </span>
                </td>

                <!-- Status Badge -->
                <td>
                  <span
                    class="status-pill"
                    :class="member.status === 'Active' ? 'status-pill--active' : 'status-pill--pending'"
                  >
                    <span class="status-dot"></span>
                    {{ member.status }}
                  </span>
                </td>

                <!-- Joined Date -->
                <td class="joined-date">
                  {{ member.joinedDate }}
                </td>

                <!-- Actions -->
                <td class="text-right">
                  <div class="actions-cell">
                    <button
                      v-if="member.status === 'Pending'"
                      class="btn-action-sm btn-resend"
                      @click="resendInvite(member)"
                    >
                      Resend Invite
                    </button>

                    <button
                      v-if="member.roleKey !== 'owner' && member.roleKey !== 'super_admin'"
                      class="btn-action-sm btn-revoke"
                      @click="handleRemoveMember(member)"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredMembers.length === 0">
                <td colspan="5" class="empty-table-cell">
                  <div class="empty-state-box">
                    <p v-if="searchQuery || roleFilter !== 'all'">No team members found matching your filters.</p>
                    <p v-else>No other team members invited yet. Invite your colleagues to get started!</p>
                    <button class="btn-primary-invite btn-sm" @click="showInviteModal = true">
                      + Invite Team Member
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: Roles & Permissions Matrix -->
      <div v-else-if="activeTab === 'roles'" class="roles-matrix-container">
        <div class="matrix-header">
          <h3>Roles & Permission Levels</h3>
          <p>Understand the permissions assigned to each role within your organization.</p>
        </div>

        <div class="roles-cards-grid">
          <div v-for="role in roleDefinitions" :key="role.name" class="role-def-card">
            <div class="role-def-header">
              <span class="role-pill" :class="`role-pill--${role.key}`">{{ role.name }}</span>
            </div>
            <p class="role-def-desc">{{ role.description }}</p>
            <ul class="permissions-list">
              <li v-for="(perm, idx) in role.permissions" :key="idx">
                <span class="perm-check">✓</span> {{ perm }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <InviteMemberModal
      v-model="showInviteModal"
      @invited="handleMemberInvited"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import InviteMemberModal from '~/components/organizations/InviteMemberModal.vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Team Members — Uzu Ticket',
})

const router = useRouter()
const toast = useToast()
const { activeOrgId, activeOrgName, fetchMembers, revokeMember, resendInvite: resendInviteApi } = useOrgState()

const showInviteModal = ref(false)
const activeTab = ref<'all' | 'pending' | 'roles'>('all')
const searchQuery = ref('')
const roleFilter = ref('all')
const loadingMembers = ref(false)
const membersError = ref<string | null>(null)

interface MemberItem {
  id: string
  name: string
  email: string
  role: string
  roleKey: string
  status: 'Active' | 'Pending'
  initials: string
  bgColor?: string
  textColor?: string
  joinedDate?: string
}

const membersList = ref<MemberItem[]>([])

const roleDefinitions = [
  {
    key: 'owner',
    name: 'Owner',
    description: 'Creator and ultimate owner of the organization account.',
    permissions: ['Full control over organization & billing', 'Manage all team members & roles', 'Create, edit & delete events', 'Access finances & withdrawal payouts'],
  },
  {
    key: 'admin',
    name: 'Admin',
    description: 'High-level administrative permissions across all modules.',
    permissions: ['Manage team members & send invites', 'Create and publish events', 'Manage orders and customer details', 'View sales and financial analytics'],
  },
  {
    key: 'manager',
    name: 'Manager / Sales',
    description: 'Operational manager focused on event planning and sales.',
    permissions: ['Create and configure event details', 'Manage ticket tiers and pricing', 'View live sales metrics and orders', 'Manage ticket scanners'],
  },
  {
    key: 'event_staff',
    name: 'Event Staff',
    description: 'Field staff responsible for live event ticket scanning.',
    permissions: ['Access mobile and web ticket scanner', 'Check in guests at event gates', 'View scanner sync logs'],
  },
]

function formatRoleName(role?: string): string {
  if (!role) return 'Member'
  const map: Record<string, string> = {
    super_admin: 'Owner',
    admin: 'Admin',
    sales: 'Manager',
    promoter: 'Promoter',
    ticket_scanner: 'Event Staff',
    customer_support: 'Support',
    member: 'Member',
  }
  return map[role.toLowerCase()] || role
}

function getRoleKey(role?: string): string {
  if (!role) return 'member'
  const r = role.toLowerCase()
  if (r === 'super_admin') return 'owner'
  if (r === 'admin') return 'admin'
  if (r === 'sales') return 'manager'
  if (r === 'ticket_scanner') return 'event_staff'
  return 'member'
}

function initialsFromName(name: string): string {
  if (!name) return 'TM'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'TM'
}

function mapMemberItem(m: any): MemberItem {
  const user = m.user || {}
  const email = user.email || m.email || ''
  const name = user.fullName || m.name || (email ? email.split('@')[0] : 'Team Member')
  const isSuperAdmin = m.role === 'super_admin'
  const isAccepted = !!m.acceptedAt || isSuperAdmin
  const roleTitle = formatRoleName(m.role)
  const roleKey = getRoleKey(m.role)

  return {
    id: m.id,
    name,
    email,
    role: roleTitle,
    roleKey,
    status: isAccepted ? 'Active' : 'Pending',
    initials: initialsFromName(name),
    bgColor: isSuperAdmin ? '#0E2615' : roleKey === 'admin' ? '#DBEAFE' : roleKey === 'manager' ? '#F3E8FF' : '#FEF9C3',
    textColor: isSuperAdmin ? '#ffffff' : roleKey === 'admin' ? '#1D4ED8' : roleKey === 'manager' ? '#7E22CE' : '#854D0E',
    joinedDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
  }
}

async function loadMembers() {
  if (!activeOrgId.value) return
  loadingMembers.value = true
  membersError.value = null
  try {
    const remote = await fetchMembers(activeOrgId.value)
    if (Array.isArray(remote)) {
      membersList.value = remote.map(mapMemberItem)
    }
  } catch (e: any) {
    console.error('Error fetching organization members:', e)
    membersError.value = e?.response?.data?.message || 'Failed to load organization team members'
  } finally {
    loadingMembers.value = false
  }
}

onMounted(() => {
  loadMembers()
})

watch(activeOrgId, () => {
  loadMembers()
})

const adminCount = computed(() => {
  return membersList.value.filter(m => m.roleKey === 'owner' || m.roleKey === 'admin').length
})

const pendingCount = computed(() => {
  return membersList.value.filter(m => m.status === 'Pending').length
})

const filteredMembers = computed(() => {
  return membersList.value.filter(member => {
    if (activeTab.value === 'pending' && member.status !== 'Pending') {
      return false
    }

    if (roleFilter.value !== 'all') {
      if (roleFilter.value === 'owner' && member.roleKey !== 'owner') return false
      if (roleFilter.value === 'admin' && member.roleKey !== 'admin') return false
      if (roleFilter.value === 'manager' && member.roleKey !== 'manager') return false
      if (roleFilter.value === 'event_staff' && member.roleKey !== 'event_staff') return false
      if (roleFilter.value === 'member' && member.roleKey !== 'member') return false
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchName = member.name.toLowerCase().includes(q)
      const matchEmail = member.email.toLowerCase().includes(q)
      return matchName || matchEmail
    }

    return true
  })
})

function handleBackToOrgs() {
  router.push('/organizations')
}

async function copyInviteLink() {
  const orgSlug = activeOrgName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'org'
  const link = `https://uzuticket.com/join/${orgSlug}?invite=tk_${activeOrgId.value || '12389'}`
  try {
    await navigator.clipboard.writeText(link)
    toast.success('Organization invite link copied to clipboard!')
  } catch {
    toast.info('Invite link: ' + link)
  }
}

async function handleMemberInvited(payload: { email: string; role: string }) {
  await loadMembers()
  toast.success(`Invitation successfully sent to ${payload.email}!`)
}

async function resendInvite(member: MemberItem) {
  try {
    if (activeOrgId.value && member.id) {
      await resendInviteApi(activeOrgId.value, member.id)
    }
    toast.success(`Resent invitation email to ${member.email}`)
  } catch (e: any) {
    toast.error(e?.response?.data?.message || 'Failed to resend invitation email.')
  }
}

async function handleRemoveMember(member: MemberItem) {
  if (confirm(`Are you sure you want to remove ${member.name} (${member.email}) from the team?`)) {
    try {
      if (activeOrgId.value && member.id) {
        await revokeMember(activeOrgId.value, member.id)
      }
      toast.success(`Removed ${member.name} from team.`)
      await loadMembers()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to remove team member.')
    }
  }
}
</script>

<style scoped>
.team-members-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.back-link-row {
  margin-bottom: 0.5rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-back-link:hover { color: #0E2615; }
.back-icon { width: 0.95rem; height: 0.95rem; }

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  max-width: 620px;
  line-height: 1.4;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-secondary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-secondary-action:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.action-icon {
  width: 1.05rem;
  height: 1.05rem;
  color: #4b5563;
}

.btn-primary-invite {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0E2615;
  background: #3FD246;
  border: none;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.2);
}
.btn-primary-invite:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

/* Metrics Row */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.metric-card {
  background: #ffffff;
  border-radius: 0.9rem;
  border: 1px solid #eef2ee;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.metric-icon-bg {
  width: 2.85rem;
  height: 2.85rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.metric-icon--members { background: #DCFCE7; color: #16A34A; }
.metric-icon--admins { background: #DBEAFE; color: #2563EB; }
.metric-icon--pending { background: #FEF9C3; color: #CA8A04; }

.metric-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.metric-data {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.1;
}

.metric-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  margin-top: 0.2rem;
}

/* Content Card */
.content-card {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  padding: 1.5rem 1.75rem;
}

/* Tabs Bar */
.tabs-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.95rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  background: none;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab-btn:hover {
  background: #f4fbf4;
  color: #0E2615;
}
.tab-btn--active {
  background: #e8f9e9;
  color: #3FD246;
  font-weight: 800;
}

.badge-count {
  background: #ef4444;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-field {
  width: 100%;
  padding: 0.6rem 0.85rem 0.6rem 2.5rem;
  font-size: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  outline: none;
  background: #f9fafb;
  transition: all 0.15s ease;
}
.search-field:focus {
  background: #ffffff;
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

.role-select {
  padding: 0.6rem 2rem 0.6rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.6rem;
  background: #ffffff;
  outline: none;
  cursor: pointer;
}

/* Skeleton Loading */
.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.error-box {
  padding: 2rem;
  text-align: center;
  color: #dc2626;
}
.error-text {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
.btn-retry {
  padding: 0.5rem 1rem;
  background: #0E2615;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 700;
}

/* Members Table */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.members-table th {
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f3f4f6;
}

.members-table td {
  padding: 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.avatar-badge {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0E2615;
}

.member-email {
  font-size: 0.785rem;
  color: #6b7280;
}

/* Role Pills */
.role-pill {
  display: inline-flex;
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.role-pill--owner { background: #DCFCE7; color: #15803D; }
.role-pill--admin { background: #DBEAFE; color: #1D4ED8; }
.role-pill--manager { background: #F3E8FF; color: #7E22CE; }
.role-pill--event_staff { background: #FEF9C3; color: #854D0E; }
.role-pill--member { background: #F3F4F6; color: #4B5563; }

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.785rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
}
.status-pill--active { background: #f0fdf4; color: #16a34a; }
.status-pill--pending { background: #fffbebfb; color: #d97706; }

.status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.joined-date {
  color: #6b7280;
  font-size: 0.825rem;
}

.text-right { text-align: right; }

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-action-sm {
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.4rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-resend {
  background: #f0fdf4;
  color: #16a34a;
}
.btn-resend:hover { background: #dcfce7; }

.btn-revoke {
  background: #fef2f2;
  color: #dc2626;
}
.btn-revoke:hover { background: #fee2e2; }

.empty-table-cell {
  text-align: center;
  padding: 3rem 1rem !important;
}

.empty-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
}

/* Roles Matrix Tab */
.matrix-header {
  margin-bottom: 1.5rem;
}
.matrix-header h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}
.matrix-header p {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.roles-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.role-def-card {
  border: 1px solid #eef2ee;
  border-radius: 0.85rem;
  padding: 1.25rem;
  background: #fcfdfc;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-def-desc {
  font-size: 0.825rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.35;
}

.permissions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.permissions-list li {
  font-size: 0.785rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.perm-check {
  color: #3FD246;
  font-weight: 900;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }
  .metrics-row {
    grid-template-columns: 1fr;
  }
  .roles-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>

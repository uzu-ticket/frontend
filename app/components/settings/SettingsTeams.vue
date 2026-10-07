<template>
  <div class="settings-tab-content">
    <div class="settings-card">
      <!-- Header Row -->
      <div class="card-header-row">
        <h3 class="section-title">Team Members ({{ members.length }})</h3>
        <button
          class="btn-invite"
          :disabled="!activeOrgId"
          :title="!activeOrgId ? 'Please select an organization first' : ''"
          @click="openInviteModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>+ Invite Member</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="state-container">
        <div class="loading-spinner"></div>
        <span class="state-text">Loading team members...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="members.length === 0" class="state-container">
        <span class="empty-icon">👥</span>
        <h4 class="empty-title">No team members yet</h4>
        <p class="empty-desc">
          {{ !activeOrgId ? 'Select an organization to manage team members.' : 'Invite your team to collaborate on events and manage tickets.' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="table-wrapper">
        <table class="team-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th class="th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id" class="table-row">
              <!-- Name with Circle Initials Avatar -->
              <td>
                <div class="member-name-cell">
                  <div class="avatar-circle" :style="{ background: member.avatarBg }">
                    {{ member.initials }}
                  </div>
                  <span class="member-full-name">{{ member.name }}</span>
                </div>
              </td>

              <!-- Email -->
              <td class="email-cell">{{ member.email }}</td>

              <!-- Role Pill -->
              <td>
                <span class="role-pill" :class="`role-pill--${member.role.toLowerCase()}`">
                  {{ formatRoleLabel(member.role) }}
                </span>
              </td>

              <!-- Status Pill -->
              <td>
                <span class="status-pill" :class="member.status === 'Active' ? 'status--active' : 'status--pending'">
                  {{ member.status }}
                </span>
              </td>

              <!-- Actions Kebab Menu -->
              <td class="actions-cell">
                <div class="kebab-container">
                  <button
                    type="button"
                    class="btn-kebab"
                    @click.stop="toggleKebab(member, $event)"
                  >
                    •••
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Teleported Kebab Action Dropdown Menu (Overlaps table cleanly, never clipped) -->
    <Teleport to="body">
      <div
        v-if="activeKebabMember"
        class="kebab-dropdown-menu-teleported"
        :style="{ top: kebabPos.top, left: kebabPos.left }"
        @click.stop
      >
        <button
          type="button"
          class="menu-item"
          @click="openChangeRoleModal(activeKebabMember); closeAllDropdowns()"
        >
          Change role
        </button>
        <button
          v-if="activeKebabMember.status === 'Pending'"
          type="button"
          class="menu-item"
          @click="handleResendInvite(activeKebabMember.id); closeAllDropdowns()"
        >
          Resend invite
        </button>
        <button
          type="button"
          class="menu-item menu-item--danger"
          @click="openRevokeModal(activeKebabMember); closeAllDropdowns()"
        >
          Remove access
        </button>
      </div>
    </Teleport>

    <!-- Main Invite Member Modal from Team Member Page -->
    <InviteMemberModal
      v-model="showInviteModal"
      @invited="handleMemberInvited"
    />

    <!-- Change Role Modal from Team Member Page -->
    <ChangeRoleModal
      v-model="showChangeRoleModal"
      :member="selectedMemberForRole"
      @saved="handleRoleSaved"
    />

    <!-- Revoke Access Modal from Team Member Page -->
    <RevokeAccessModal
      v-model="showRevokeModal"
      :member-name="targetMemberRevoke?.name"
      :member-id="targetMemberRevoke?.id"
      @confirm="handleRevokeConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import InviteMemberModal from '~/components/organizations/InviteMemberModal.vue'
import ChangeRoleModal from '~/components/organizations/ChangeRoleModal.vue'
import RevokeAccessModal from '~/components/organizations/RevokeAccessModal.vue'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const {
  activeOrgId,
  fetchMembers,
  revokeMember,
  resendInvite,
  updateMemberRole,
} = useOrgState()

const isLoading = ref(false)
const showInviteModal = ref(false)
const showChangeRoleModal = ref(false)
const showRevokeModal = ref(false)

const selectedMemberForRole = ref<any>(null)
const targetMemberRevoke = ref<MemberItem | null>(null)

// Teleported kebab dropdown state
const activeKebabMember = ref<MemberItem | null>(null)
const kebabPos = ref({ top: '0px', left: '0px' })

interface MemberItem {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Pending'
  initials: string
  avatarBg: string
}

const members = ref<MemberItem[]>([])

const avatarColors = [
  '#2DD4BF',
  '#065F46',
  '#2563EB',
  '#7C3AED',
  '#DC2626',
  '#D97706',
  '#059669',
  '#4F46E5',
]

function getAvatarColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % avatarColors.length
  return avatarColors[index]
}

function computeInitials(name?: string, email?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase()
  }
  return 'TM'
}

function formatRoleLabel(role: string): string {
  const map: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    sales: 'Sales',
    customer_support: 'Customer Support',
    promoter: 'Promoter',
    ticket_scanner: 'Ticket Scanner',
    marketing: 'Marketing',
  }
  return map[role.toLowerCase()] || role
}

async function loadMembers() {
  if (!activeOrgId.value) {
    members.value = []
    return
  }
  isLoading.value = true
  try {
    const rawList = await fetchMembers(activeOrgId.value)
    if (Array.isArray(rawList)) {
      members.value = rawList.map((m: any) => {
        const u = m.user || {}
        const name = u.fullName || u.email || 'Team Member'
        const email = u.email || ''
        return {
          id: m.id,
          name,
          email,
          role: m.role || 'sales',
          status: m.acceptedAt ? 'Active' : 'Pending',
          initials: computeInitials(u.fullName, u.email),
          avatarBg: getAvatarColor(email || name),
        }
      })
    } else {
      members.value = []
    }
  } catch (e: any) {
    console.error('Failed to load team members:', e)
  } finally {
    isLoading.value = false
  }
}

watch(
  activeOrgId,
  () => {
    loadMembers()
  },
  { immediate: true },
)

function openInviteModal() {
  if (!activeOrgId.value) {
    toast.error('Please select an active organization first.')
    return
  }
  showInviteModal.value = true
}

function handleMemberInvited() {
  loadMembers()
}

function toggleKebab(member: MemberItem, event: MouseEvent) {
  if (activeKebabMember.value?.id === member.id) {
    activeKebabMember.value = null
    return
  }
  activeKebabMember.value = member
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  kebabPos.value = {
    top: `${rect.bottom + window.scrollY + 6}px`,
    left: `${rect.right + window.scrollX - 180}px`,
  }
}

function closeAllDropdowns() {
  activeKebabMember.value = null
}

function openChangeRoleModal(member: MemberItem) {
  selectedMemberForRole.value = {
    id: member.id,
    name: member.name,
    email: member.email,
    roleKey: member.role?.toLowerCase() || 'sales',
  }
  showChangeRoleModal.value = true
}

async function handleRoleSaved(payload: { memberId: string; roles: string[]; eventAccess: string }) {
  if (!activeOrgId.value || !payload.memberId) return
  const primaryRole = payload.roles[0] || 'sales'
  try {
    await updateMemberRole(activeOrgId.value, payload.memberId, primaryRole)
    toast.success('Member roles and access successfully updated!')
    await loadMembers()
  } catch (e: any) {
    toast.error(e.message || 'Failed to update member role.')
  }
}

function openRevokeModal(member: MemberItem) {
  targetMemberRevoke.value = member
  showRevokeModal.value = true
}

async function handleRevokeConfirmed() {
  if (!targetMemberRevoke.value || !activeOrgId.value) return
  const m = targetMemberRevoke.value
  try {
    await revokeMember(activeOrgId.value, m.id)
    members.value = members.value.filter((item) => item.id !== m.id)
    toast.success(`Revoked access for ${m.name}.`)
  } catch (e: any) {
    toast.error(e.message || 'Failed to revoke access.')
  }
}

async function handleResendInvite(memberId: string) {
  if (!activeOrgId.value) return
  try {
    await resendInvite(activeOrgId.value, memberId)
    toast.success('Invitation resent successfully!')
  } catch (e: any) {
    toast.error(e.message || 'Failed to resend invite.')
  }
}

onMounted(() => {
  window.addEventListener('click', closeAllDropdowns)
  window.addEventListener('scroll', closeAllDropdowns, true)
})
onUnmounted(() => {
  window.removeEventListener('click', closeAllDropdowns)
  window.removeEventListener('scroll', closeAllDropdowns, true)
})
</script>

<style scoped>
.settings-tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  padding: 1.75rem 0;
  border-top: 1px solid #F3F4F6;
}

.settings-card:first-child {
  border-top: none;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0E2615;
  margin: 0;
}

.btn-invite {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.65rem 1.35rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}
.btn-invite:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-invite:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.plus-icon {
  width: 0.95rem;
  height: 0.95rem;
}

/* Loading & Empty State */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 0.75rem;
  text-align: center;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #E5E7EB;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 2.25rem;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.empty-desc {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0;
  max-width: 340px;
}

.state-text {
  font-size: 0.875rem;
  color: #6B7280;
}

/* Table - Matching team members page */
.table-wrapper {
  overflow-x: auto;
  border-top: 1px solid #f3f4f6;
}

.team-table {
  width: 100%;
  border-collapse: collapse;
}

.team-table thead tr th {
  padding: 1rem 0.85rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.table-row {
  transition: background 0.1s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.team-table tbody tr td {
  padding: 1rem 0.85rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.member-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 800;
  flex-shrink: 0;
}

.member-full-name {
  font-weight: 600;
  color: #111827;
}

.email-cell {
  color: #374151;
  font-weight: 500;
}

/* Role Pills - Matching team members page */
.role-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}

.role-pill--super_admin { background: #f3e8ff; color: #9333ea; border: 1px solid #e9d5ff; }
.role-pill--admin { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }
.role-pill--sales { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.role-pill--promoter { background: #fce7f3; color: #db2777; border: 1px solid #fbcfe8; }
.role-pill--ticket_scanner { background: #ccfbf1; color: #0d9488; border: 1px solid #99f6e4; }
.role-pill--customer_support { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
.role-pill--marketing { background: #f3e8ff; color: #7c3aed; border: 1px solid #ddd6fe; }

/* Status Pills - Matching team members page */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.status--active {
  background: #f0fdf4;
  color: #16a34a;
}

.status--pending {
  background: #fff7ed;
  color: #ea580c;
}

/* Kebab Actions */
.th-actions {
  text-align: right;
}

.actions-cell {
  text-align: right;
}

.kebab-container {
  display: inline-block;
}

.btn-kebab {
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  padding: 0.35rem 0.65rem;
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;
  font-weight: 800;
  transition: all 0.15s ease;
}

.btn-kebab:hover {
  background: #e5e7eb;
}
</style>

<!-- Non-scoped styles for Teleported Kebab Dropdown to ensure perfect positioning and z-index -->
<style>
.kebab-dropdown-menu-teleported {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.16);
  padding: 0.5rem;
  min-width: 180px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-family: 'Outfit', sans-serif;
  animation: kebabFadeIn 0.12s ease-out;
}

@keyframes kebabFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.kebab-dropdown-menu-teleported .menu-item {
  display: block;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;
  font-family: 'Outfit', sans-serif;
}

.kebab-dropdown-menu-teleported .menu-item:hover {
  background: #f3f4f6;
}

.kebab-dropdown-menu-teleported .menu-item--danger {
  color: #dc2626;
}

.kebab-dropdown-menu-teleported .menu-item--danger:hover {
  background: #fef2f2;
}
</style>

<template>
  <div class="team-members-page" @click="closeAllDropdowns">
    <!-- Main Unified White Card -->
    <div class="main-card">
      <!-- Inner Header & Controls Row -->
      <div class="card-top-controls">
        <h2 class="card-inner-title">View all your team members</h2>

        <div class="controls-action-bar">
          <!-- Search Bar -->
          <div class="search-input-wrapper">
            <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email or phone..."
              class="search-input"
            />
            <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">&times;</button>
          </div>

          <!-- Roles Filter Dropdown Button -->
          <div class="dropdown-wrapper">
            <button
              type="button"
              class="btn-filter-role"
              :class="{ 'btn-filter-role--active': selectedRoleFilter !== 'all' }"
              @click.stop="isRoleDropdownOpen = !isRoleDropdownOpen"
            >
              <span>{{ selectedRoleLabel }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Roles Filter Dropdown Menu -->
            <Transition name="fade-drop">
              <div v-if="isRoleDropdownOpen" class="role-filter-dropdown" @click.stop>
                <button
                  v-for="opt in roleFilterOptions"
                  :key="opt.key"
                  type="button"
                  class="role-filter-item"
                  :class="{ 'role-filter-item--selected': selectedRoleFilter === opt.key }"
                  @click="selectRoleFilter(opt.key)"
                >
                  <span v-if="opt.color" class="filter-dot" :style="{ background: opt.color }"></span>
                  <span>{{ opt.label }}</span>
                  <svg v-if="selectedRoleFilter === opt.key" class="w-4 h-4 ml-auto text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Invite Member Button -->
          <button type="button" class="btn-invite-member" @click="showInviteModal = true">
            Invite member
          </button>
        </div>
      </div>

      <!-- Members Data Table -->
      <div class="table-wrapper">
        <table class="team-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>LAST ACTIVE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton Rows -->
            <template v-if="loadingMembers">
              <tr v-for="i in 5" :key="i" class="table-row">
                <td>
                  <div class="member-name-cell">
                    <AppSkeleton variant="circle" width="36px" height="36px" />
                    <AppSkeleton variant="text" width="110px" />
                  </div>
                </td>
                <td><AppSkeleton variant="text" width="160px" /></td>
                <td><AppSkeleton variant="text" width="80px" border-radius="999px" /></td>
                <td><AppSkeleton variant="text" width="60px" border-radius="999px" /></td>
                <td><AppSkeleton variant="text" width="120px" /></td>
                <td><AppSkeleton variant="circle" width="24px" height="24px" /></td>
              </tr>
            </template>

            <!-- Table Rows -->
            <template v-else>
            <tr
              v-for="member in paginatedMembers"
              :key="member.id"
              class="table-row"
            >
                <!-- Name with circular avatar -->
                <td>
                  <div class="member-name-cell">
                    <div class="avatar-circle" :style="{ background: member.avatarBg || '#10B981' }">
                      {{ member.initials }}
                    </div>
                    <span class="member-full-name">{{ member.name }}</span>
                  </div>
                </td>

                <!-- Email -->
                <td class="email-cell">{{ member.email }}</td>

                <!-- Role Pill -->
                <td>
                  <span class="role-pill" :class="`role-pill--${member.roleKey}`">
                    {{ member.role }}
                  </span>
                </td>

                <!-- Status Pill -->
                <td>
                  <span class="status-pill" :class="member.status === 'Active' ? 'status--active' : 'status--pending'">
                    {{ member.status }}
                  </span>
                </td>

                <!-- Last Active -->
                <td class="last-active-cell">{{ member.lastActive || 'Aug 20, 2026 10:30AM' }}</td>

                <!-- Kebab Menu Actions Button -->
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

              <!-- Empty State -->
              <tr v-if="filteredMembers.length === 0">
                <td colspan="6" class="empty-table-cell">
                  <div class="empty-box">
                    <p class="empty-text">No team members found matching your search and filter criteria.</p>
                    <button type="button" class="btn-reset-filter" @click="resetFilters">Reset Filters</button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <AppPagination
        v-model="currentPage"
        :total-pages="totalPages"
        :total-items="totalCount"
        :page-size="pageSize"
      />
    </div>

    <!-- Teleported Kebab Action Dropdown Menu (Overlaps table cleanly) -->
    <Teleport to="body">
      <div
        v-if="activeKebabMember"
        class="kebab-dropdown-menu-teleported"
        :style="{ top: kebabPos.top, left: kebabPos.left }"
        @click.stop
      >
        <button type="button" class="menu-item" @click="viewMemberDetail(activeKebabMember)">
          View member
        </button>
        <button type="button" class="menu-item" @click="openChangeRoleModal(activeKebabMember)">
          Change role
        </button>
        <button type="button" class="menu-item" @click="openManageAccessModal(activeKebabMember)">
          Manage event access
        </button>
        <button type="button" class="menu-item menu-item--danger" @click="openRevokeModal(activeKebabMember)">
          Remove access
        </button>
      </div>
    </Teleport>

    <!-- Invite Member Modal -->
    <InviteMemberModal
      v-model="showInviteModal"
      @invited="handleMemberInvited"
    />

    <!-- Member Detail Drawer -->
    <MemberDetailDrawer
      v-model="showDetailDrawer"
      :member="selectedMemberForDetail"
      @change-role="openChangeRoleModal"
      @manage-access="openManageAccessModal"
      @remove-member="openRevokeModal"
    />

    <!-- Change Role / Manage Access Modal (Screenshot 1) -->
    <ChangeRoleModal
      v-model="showChangeRoleModal"
      :member="targetMemberModal"
      @saved="handleRoleSaved"
    />

    <!-- Revoke Access Modal (Screenshot 2) -->
    <RevokeAccessModal
      v-model="showRevokeModal"
      :member-name="targetMemberModal?.name"
      :member-id="targetMemberModal?.id"
      @confirm="handleRevokeConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import InviteMemberModal from '~/components/organizations/InviteMemberModal.vue'
import MemberDetailDrawer from '~/components/organizations/MemberDetailDrawer.vue'
import ChangeRoleModal from '~/components/organizations/ChangeRoleModal.vue'
import RevokeAccessModal from '~/components/organizations/RevokeAccessModal.vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import AppPagination from '~/components/ui/AppPagination.vue'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Team Members — Uzu Ticket',
})

const toast = useToast()
const { activeOrgId, fetchMembers, revokeMember } = useOrgState()

const showInviteModal = ref(false)
const showDetailDrawer = ref(false)
const showChangeRoleModal = ref(false)
const showRevokeModal = ref(false)

const selectedMemberForDetail = ref<any>(null)
const targetMemberModal = ref<any>(null)

const searchQuery = ref('')
const selectedRoleFilter = ref('all')
const isRoleDropdownOpen = ref(false)
const activeKebabMember = ref<any>(null)
const kebabPos = ref({ top: '0px', left: '0px' })
const loadingMembers = ref(false)
const currentPage = ref(1)
const pageSize = 10

interface MemberItem {
  id: string
  name: string
  email: string
  role: string
  roleKey: string
  status: 'Active' | 'Pending'
  initials: string
  avatarBg?: string
  lastActive?: string
  assignedDate?: string
  phone?: string
}

const mockMembers: MemberItem[] = [
  { id: 'tm-1', name: 'Divine Emmanuel', email: 'divineemm@gmail.com', role: 'Super Admin', roleKey: 'super_admin', status: 'Active', initials: 'DE', avatarBg: '#34D399', lastActive: 'Aug 20, 2026 10:30AM', phone: '08022334566' },
  { id: 'tm-2', name: 'Mike Mills', email: 'sarahjohnson@gmail.com', role: 'Admin', roleKey: 'admin', status: 'Active', initials: 'MM', avatarBg: '#065F46', lastActive: 'Aug 10, 2026 12:30PM', phone: '08025334566' },
  { id: 'tm-3', name: 'Jane Cooper', email: 'japhetisaiah@gmail.com', role: 'Sales', roleKey: 'sales', status: 'Active', initials: 'JC', avatarBg: '#2563EB', lastActive: 'Sep 12, 2026 8:30PM', phone: '08032334566' },
  { id: 'tm-4', name: 'Jane Cooper', email: 'timothypeters@gmail.com', role: 'Customer Support', roleKey: 'customer_support', status: 'Active', initials: 'JC', avatarBg: '#2563EB', lastActive: 'Sep 12, 2026 8:30PM', phone: '08032334566' },
  { id: 'tm-5', name: 'Ben Francis', email: 'timothypeters@gmail.com', role: 'Sales', roleKey: 'sales', status: 'Active', initials: 'BF', avatarBg: '#DC2626', lastActive: 'Sep 12, 2026 8:30PM', phone: '08032534766' },
  { id: 'tm-6', name: 'Lizzy Poole', email: 'georgefelix@gmail.com', role: 'Promoter', roleKey: 'promoter', status: 'Active', initials: 'LP', avatarBg: '#581C87', lastActive: 'Sep 06, 2026 10:30AM', phone: '08035534516' },
  { id: 'tm-7', name: 'Lizzy Poole', email: 'georgefelix@gmail.com', role: 'Customer Support', roleKey: 'customer_support', status: 'Pending', initials: 'LP', avatarBg: '#581C87', lastActive: 'Sep 20, 2026 8:10AM', phone: '08035534516' },
  { id: 'tm-8', name: 'Lizzy Poole', email: 'georgefelix@gmail.com', role: 'Promoter', roleKey: 'promoter', status: 'Active', initials: 'LP', avatarBg: '#581C87', lastActive: 'Sep 20, 2026 8:10AM', phone: '08035534516' },
]

const membersList = ref<MemberItem[]>([])

const roleFilterOptions = [
  { key: 'all', label: 'All Roles' },
  { key: 'super_admin', label: 'Super Admin', color: '#9333ea' },
  { key: 'admin', label: 'Admin', color: '#0284c7' },
  { key: 'sales', label: 'Sales', color: '#d97706' },
  { key: 'promoter', label: 'Promoter', color: '#db2777' },
  { key: 'ticket_scanner', label: 'Ticket Scanner', color: '#0d9488' },
  { key: 'customer_support', label: 'Customer Support', color: '#16a34a' },
]

const selectedRoleLabel = computed(() => {
  const found = roleFilterOptions.find(o => o.key === selectedRoleFilter.value)
  return found ? found.label : 'All Roles'
})

const totalCount = computed(() => filteredMembers.value.length)

const totalPages = computed(() => Math.ceil(filteredMembers.value.length / pageSize) || 1)

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredMembers.value.slice(start, start + pageSize)
})

function formatRoleName(role?: string): string {
  if (!role) return 'Member'
  const map: Record<string, string> = {
    super_admin: 'Super Admin',
    owner: 'Super Admin',
    admin: 'Admin',
    sales: 'Sales',
    manager: 'Sales',
    promoter: 'Promoter',
    ticket_scanner: 'Ticket Scanner',
    customer_support: 'Customer Support',
  }
  return map[role.toLowerCase()] || role
}

function getRoleKey(role?: string): string {
  if (!role) return 'customer_support'
  const r = role.toLowerCase()
  if (r === 'super_admin' || r === 'owner') return 'super_admin'
  if (r === 'admin') return 'admin'
  if (r === 'sales' || r === 'manager') return 'sales'
  if (r === 'promoter') return 'promoter'
  if (r === 'ticket_scanner') return 'ticket_scanner'
  if (r === 'customer_support') return 'customer_support'
  return 'sales'
}

function initialsFromName(name: string): string {
  if (!name) return 'TM'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'TM'
}

function getAvatarColor(name: string): string {
  const colors = ['#34D399', '#065F46', '#2563EB', '#DC2626', '#581C87', '#0284C7', '#D97706']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return colors[Math.abs(hash) % colors.length]
}

function mapMemberItem(m: any): MemberItem {
  const user = m.user || {}
  const email = user.email || m.email || ''
  const name = user.fullName || m.name || (email ? email.split('@')[0] : 'Team Member')
  const isSuperAdmin = m.role === 'super_admin' || m.role === 'owner'
  const isAccepted = !!m.acceptedAt || isSuperAdmin
  const roleTitle = formatRoleName(m.role)
  const roleKey = getRoleKey(m.role)

  return {
    id: m.id || Math.random().toString(),
    name,
    email,
    role: roleTitle,
    roleKey,
    status: isAccepted ? 'Active' : 'Pending',
    initials: initialsFromName(name),
    avatarBg: getAvatarColor(name),
    lastActive: m.updatedAt ? new Date(m.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 20, 2026 10:30AM',
    phone: user.phoneNumber || '+234802334566',
  }
}

async function loadMembers() {
  if (!activeOrgId.value) {
    membersList.value = mockMembers
    return
  }
  loadingMembers.value = true
  try {
    const remote = await fetchMembers(activeOrgId.value)
    if (Array.isArray(remote) && remote.length > 0) {
      membersList.value = remote.map(mapMemberItem)
    } else {
      membersList.value = mockMembers
    }
  } catch (e) {
    membersList.value = mockMembers
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

const filteredMembers = computed(() => {
  return membersList.value.filter((m) => {
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || (
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      (m.phone && m.phone.includes(query))
    )
    const matchesRole = selectedRoleFilter.value === 'all' || m.roleKey === selectedRoleFilter.value
    return matchesSearch && matchesRole
  })
})

function closeAllDropdowns() {
  isRoleDropdownOpen.value = false
  activeKebabMember.value = null
}

function selectRoleFilter(key: string) {
  selectedRoleFilter.value = key
  isRoleDropdownOpen.value = false
}

function toggleKebab(member: any, event: MouseEvent) {
  if (activeKebabMember.value?.id === member.id) {
    activeKebabMember.value = null
    return
  }
  activeKebabMember.value = member
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  kebabPos.value = {
    top: `${rect.bottom + window.scrollY + 6}px`,
    left: `${rect.right + window.scrollX - 175}px`,
  }
}

function viewMemberDetail(member: MemberItem) {
  activeKebabMember.value = null
  selectedMemberForDetail.value = member
  showDetailDrawer.value = true
}

function openChangeRoleModal(member: MemberItem) {
  activeKebabMember.value = null
  showDetailDrawer.value = false
  targetMemberModal.value = member
  showChangeRoleModal.value = true
}

function openManageAccessModal(member: MemberItem) {
  activeKebabMember.value = null
  showDetailDrawer.value = false
  targetMemberModal.value = member
  showChangeRoleModal.value = true
}

function openRevokeModal(member: MemberItem) {
  activeKebabMember.value = null
  showDetailDrawer.value = false
  targetMemberModal.value = member
  showRevokeModal.value = true
}

function handleRoleSaved(payload: any) {
  toast.success('Member roles and access successfully updated!')
}

async function handleRevokeConfirmed() {
  if (!targetMemberModal.value) return
  const m = targetMemberModal.value
  try {
    if (activeOrgId.value && m.id) {
      await revokeMember(activeOrgId.value, m.id)
    }
    toast.success(`Revoked access for ${m.name}.`)
    membersList.value = membersList.value.filter(item => item.id !== m.id)
  } catch (e: any) {
    toast.error('Failed to revoke access.')
  }
}

function resetFilters() {
  searchQuery.value = ''
  selectedRoleFilter.value = 'all'
}

function handleMemberInvited(payload: any) {
  loadMembers()
}
</script>

<style scoped>
.team-members-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Main Unified White Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Top Controls Row */
.card-top-controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-inner-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.controls-action-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.25rem 0.65rem 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.85rem;
  color: #111827;
  outline: none;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.search-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.clear-search-btn {
  position: absolute;
  right: 0.85rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.1rem;
  cursor: pointer;
}

/* Dropdown */
.dropdown-wrapper {
  position: relative;
}

.btn-filter-role {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-filter-role:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.btn-filter-role--active {
  border-color: #3FD246;
  color: #16a34a;
}

.role-filter-dropdown {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 180px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.role-filter-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s ease;
  font-family: 'Outfit', sans-serif;
  text-align: left;
}

.role-filter-item:hover {
  background: #f3f4f6;
}

.role-filter-item--selected {
  background: #f0fdf4;
  color: #16a34a;
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.btn-invite-member {
  padding: 0.65rem 1.35rem;
  border-radius: 0.65rem;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-invite-member:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.25);
}

/* Table */
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
  font-weight: 700;
  color: #111827;
}

.email-cell {
  color: #374151;
  font-weight: 500;
}

/* Role Pills */
.role-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.role-pill--super_admin { background: #f3e8ff; color: #9333ea; border: 1px solid #e9d5ff; }
.role-pill--admin { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }
.role-pill--sales { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.role-pill--promoter { background: #fce7f3; color: #db2777; border: 1px solid #fbcfe8; }
.role-pill--ticket_scanner { background: #ccfbf1; color: #0d9488; border: 1px solid #99f6e4; }
.role-pill--customer_support { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--active {
  background: #f0fdf4;
  color: #16a34a;
}

.status--pending {
  background: #fff7ed;
  color: #ea580c;
}

.last-active-cell {
  color: #374151;
  font-size: 0.82rem;
  font-weight: 500;
}

/* Kebab Actions */
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

/* Teleported Kebab Menu */
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
  animation: fadeIn 0.12s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.menu-item {
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

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item--danger {
  color: #dc2626;
}

.menu-item--danger:hover {
  background: #fef2f2;
}

/* Empty State */
.empty-table-cell {
  padding: 3rem 1rem !important;
  text-align: center;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.btn-reset-filter {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #16a34a;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 768px) {
  .controls-action-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

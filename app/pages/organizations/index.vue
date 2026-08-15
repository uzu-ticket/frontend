<template>
  <div class="orgs-page">
    <!-- View State Switcher (for previewing Data vs Empty state) -->
    <div class="view-toggle-bar">
      <span class="toggle-label">Preview State:</span>
      <div class="toggle-pills">
        <button
          class="toggle-pill"
          :class="{ 'toggle-pill--active': viewMode === 'data' }"
          @click="viewMode = 'data'"
        >
          Data State
        </button>
        <button
          class="toggle-pill"
          :class="{ 'toggle-pill--active': viewMode === 'empty' }"
          @click="viewMode = 'empty'"
        >
          Empty State
        </button>
      </div>
    </div>

    <!-- DATA STATE -->
    <div v-if="viewMode === 'data'" class="orgs-data-container">
      <div class="orgs-card-wrapper">
        <!-- Section Header -->
        <h2 class="section-title">View all organizations</h2>

        <!-- Search Bar -->
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search organizations..."
            class="search-input"
          />
        </div>

        <!-- Organizations Grid using OrganizationCard component -->
        <div v-if="filteredOrganizations.length > 0" class="orgs-grid">
          <OrganizationCard
            v-for="org in filteredOrganizations"
            :id="org.id"
            :key="org.id"
            :name="org.name"
            :role="org.role"
            :initials="org.initials"
            :badge-bg="org.badgeBg"
            :events-count="org.eventsCount"
            :members-count="org.membersCount"
          />
        </div>

        <div v-else class="no-search-results">
          <p>No organizations found matching "{{ searchQuery }}"</p>
        </div>

        <!-- Pending Invitations Section -->
        <div class="pending-section">
          <div class="pending-header">
            <h3 class="pending-title">Pending Invitations</h3>
            <p class="pending-subtitle">You have been invited to join the following organizations</p>
          </div>

          <div class="pending-list">
            <PendingInvitationCard
              v-for="inv in pendingInvitations"
              :id="inv.id"
              :key="inv.id"
              :org-name="inv.orgName"
              :invited-by="inv.invitedBy"
              :role="inv.role"
              :initials="inv.initials"
              :badge-bg="inv.badgeBg"
              :badge-color="inv.badgeColor"
              @accept="handleAcceptInvitation(inv.id)"
              @decline="handleDeclineInvitation(inv.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <OrgEmptyState
      v-else
      @create="handleCreateOrg"
      @accept-invitation="viewMode = 'data'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OrganizationCard from '~/components/organizations/OrganizationCard.vue'
import PendingInvitationCard from '~/components/organizations/PendingInvitationCard.vue'
import OrgEmptyState from '~/components/organizations/OrgEmptyState.vue'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'My Organizations — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your organizations and view pending invitations.' },
  ],
})

const router = useRouter()
const viewMode = ref<'data' | 'empty'>('data')
const searchQuery = ref('')

// Mock Organizations Data
const organizations = ref([
  {
    id: 1,
    name: 'Zeenom Event',
    role: 'Owner',
    initials: 'ZE',
    eventsCount: 23,
    membersCount: 10,
    badgeBg: '#0E2615',
  },
  {
    id: 2,
    name: 'Zeenom Event',
    role: 'Owner',
    initials: 'ZE',
    eventsCount: 23,
    membersCount: 10,
    badgeBg: '#0E2615',
  },
  {
    id: 3,
    name: 'Zeenom Event',
    role: 'Owner',
    initials: 'ZE',
    eventsCount: 23,
    membersCount: 10,
    badgeBg: '#0E2615',
  },
])

// Mock Pending Invitations Data
const pendingInvitations = ref([
  {
    id: 101,
    orgName: 'Worship Kitchen',
    invitedBy: 'Esther Thoman',
    role: 'Admin',
    initials: 'WC',
    badgeBg: '#fce7f3',
    badgeColor: '#db2777',
  },
])

// Search filter computed
const filteredOrganizations = computed(() => {
  if (!searchQuery.value.trim()) return organizations.value
  const q = searchQuery.value.toLowerCase().trim()
  return organizations.value.filter(org => org.name.toLowerCase().includes(q) || org.role.toLowerCase().includes(q))
})

function handleCreateOrg() {
  router.push('/organizations/new')
}

function handleAcceptInvitation(id: number) {
  pendingInvitations.value = pendingInvitations.value.filter(inv => inv.id !== id)
}

function handleDeclineInvitation(id: number) {
  pendingInvitations.value = pendingInvitations.value.filter(inv => inv.id !== id)
}
</script>

<style scoped>
.orgs-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* View State Switcher */
.view-toggle-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.toggle-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

.toggle-pills {
  display: flex;
  background: #e5e7eb;
  padding: 0.2rem;
  border-radius: 9999px;
  gap: 0.2rem;
}

.toggle-pill {
  padding: 0.35rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4b5563;
  background: transparent;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-pill--active {
  background: #ffffff;
  color: #0E2615;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Container Card */
.orgs-card-wrapper {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
  letter-spacing: -0.01em;
}

/* Search Box */
.search-box {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.05rem;
  height: 1.05rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  background: #EBF1F6;
  border: 1px solid transparent;
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #1f2937;
  outline: none;
  transition: all 0.15s ease;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  background: #ffffff;
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

/* Organizations Grid */
.orgs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.no-search-results {
  padding: 2rem 0 3rem;
  color: #6b7280;
  font-size: 0.95rem;
}

/* Pending Section */
.pending-section {
  border-top: 1px solid #f3f4f6;
  padding-top: 2.25rem;
}

.pending-header {
  margin-bottom: 1.25rem;
}

.pending-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.2rem;
}

.pending-subtitle {
  font-size: 0.825rem;
  color: #6b7280;
  margin: 0;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .orgs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .orgs-grid {
    grid-template-columns: 1fr;
  }
  .orgs-card-wrapper {
    padding: 1.75rem 1.25rem;
  }
}
</style>

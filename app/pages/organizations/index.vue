<template>
  <div class="orgs-page">
    <!-- SKELETON LOADING STATE -->
    <div v-if="orgsLoading" class="orgs-card-wrapper">
      <div class="orgs-section-header">
        <AppSkeleton variant="title" width="180px" />
        <AppSkeleton
          variant="text"
          width="110px"
          height="36px"
          border-radius="0.6rem"
        />
      </div>
      <div class="search-box">
        <AppSkeleton
          variant="text"
          width="100%"
          height="40px"
          border-radius="9999px"
        />
      </div>
      <div class="orgs-grid">
        <div v-for="i in 3" :key="i" class="skeleton-card-box">
          <div class="skeleton-header">
            <AppSkeleton variant="circle" width="40px" height="40px" />
            <div class="skeleton-header-info">
              <AppSkeleton variant="title" width="75%" height="1rem" />
              <AppSkeleton variant="text" width="45%" height="0.75rem" />
            </div>
          </div>
          <div class="skeleton-metrics">
            <AppSkeleton variant="text" width="40%" height="1.2rem" />
            <AppSkeleton variant="text" width="40%" height="1.2rem" />
          </div>
          <AppSkeleton
            variant="text"
            width="100%"
            height="38px"
            border-radius="0.6rem"
          />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="orgsError" class="error-state">
      <p class="error-text">{{ orgsError }}</p>
      <button class="btn-retry" @click="retryLoad">Retry</button>
    </div>

    <!-- DATA STATE -->
    <div v-else-if="viewMode === 'data'" class="orgs-data-container">
      <div class="orgs-card-wrapper">
        <!-- Section Header + Create action -->
        <div class="orgs-section-header">
          <h2 class="section-title">View all organizations</h2>
          <button class="btn-create-org" @click="handleCreateOrg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="btn-create-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            <span>+ Create New</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
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
            <div class="pending-header-copy">
              <h3 class="pending-title">Pending Invitations</h3>
              <p class="pending-subtitle">
                You have been invited to join the following organizations
              </p>
            </div>

            <button class="btn-view-all" type="button">
              <span>View all invitations</span>
              <img
                src="/arrow-out.png"
                alt="View all invitations"
                class="view-all-icon"
              />
            </button>
          </div>

          <div class="pending-list">
            <div
              v-for="(inv, index) in mockPendingInvitations"
              :key="index"
              class="pending-row"
            >
              <div class="pending-org-block">
                <div
                  class="org-badge"
                  :style="{
                    backgroundColor: inv.badgeBg,
                    color: inv.badgeColor,
                  }"
                >
                  {{ inv.initials }}
                </div>

                <div class="pending-org-meta">
                  <div class="pending-org-name-row">
                    <span class="pending-org-name">{{ inv.orgName }}</span>
                    <span
                      class="pending-role-badge"
                      :style="{
                        backgroundColor: inv.roleBg,
                        color: inv.roleColor,
                      }"
                    >
                      {{ inv.role }}
                    </span>
                  </div>

                  <span class="pending-invited-by"
                    >Invited by {{ inv.invitedBy }}</span
                  >
                </div>
              </div>

              <div class="pending-date-block">
                <span class="pending-date">{{ inv.date }}</span>
                <span class="pending-time">{{ inv.time }}</span>
              </div>

              <div class="pending-actions">
                <button class="btn-accept" type="button">Accept</button>
                <button class="btn-decline" type="button">Decline</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <OrgEmptyState
      v-else
      @create="handleCreateOrg"
      @accept-invitation="handleAcceptInvitedOrg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import OrganizationCard from "~/components/organizations/OrganizationCard.vue";
import PendingInvitationCard from "~/components/organizations/PendingInvitationCard.vue";
import OrgEmptyState from "~/components/organizations/OrgEmptyState.vue";
import AppSkeleton from "~/components/ui/AppSkeleton.vue";
import { useOrgState, type PendingInvite } from "~/composables/useOrgState";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "My Organizations — Uzu Ticket",
  meta: [
    {
      name: "description",
      content: "Manage your organizations and view pending invitations.",
    },
  ],
});

const router = useRouter();
const searchQuery = ref("");

const {
  organizations,
  pendingInvitations,
  orgsLoading,
  orgsError,
  loadOrganizations,
  loadPendingInvitations,
  acceptInvitation,
  declineInvitation,
} = useOrgState();

onMounted(() => {
  loadOrganizations();
  loadPendingInvitations();
});

const filteredOrganizations = computed(() => {
  if (!searchQuery.value.trim()) return organizations.value;
  const q = searchQuery.value.toLowerCase().trim();
  return organizations.value.filter(
    (org) =>
      org.name.toLowerCase().includes(q) || org.role.toLowerCase().includes(q),
  );
});

const viewMode = computed<"data" | "empty">(() =>
  organizations.value.length > 0 ? "data" : "empty",
);

const mockPendingInvitations = [
  {
    orgName: "Workshop Kitchen",
    invitedBy: "Esther Thoman",
    role: "Admin",
    roleBg: "#E7F8ED",
    roleColor: "#2C8C5A",
    initials: "WC",
    badgeBg: "#F4D9E9",
    badgeColor: "#E65CA6",
    date: "24/09/2026",
    time: "10:20 PM",
  },
  {
    orgName: "Workshop Kitchen",
    invitedBy: "Esther Thoman",
    role: "Admin",
    roleBg: "#E7F8ED",
    roleColor: "#2C8C5A",
    initials: "TE",
    badgeBg: "#1D2A24",
    badgeColor: "#F4F9F5",
    date: "24/09/2026",
    time: "10:20 PM",
  },
  {
    orgName: "Workshop Kitchen",
    invitedBy: "Esther Thoman",
    role: "Admin",
    roleBg: "#E7F8ED",
    roleColor: "#2C8C5A",
    initials: "WC",
    badgeBg: "#F4D9E9",
    badgeColor: "#E65CA6",
    date: "24/09/2026",
    time: "10:20 PM",
  },
  {
    orgName: "Workshop Kitchen",
    invitedBy: "Esther Thoman",
    role: "Admin",
    roleBg: "#E7F8ED",
    roleColor: "#2C8C5A",
    initials: "TE",
    badgeBg: "#1D2A24",
    badgeColor: "#F4F9F5",
    date: "24/09/2026",
    time: "10:20 PM",
  },
  {
    orgName: "Workshop Kitchen",
    invitedBy: "Esther Thoman",
    role: "Admin",
    roleBg: "#E7F8ED",
    roleColor: "#2C8C5A",
    initials: "WC",
    badgeBg: "#F4D9E9",
    badgeColor: "#E65CA6",
    date: "24/09/2026",
    time: "10:20 PM",
  },
];

function retryLoad() {
  loadOrganizations(true);
  loadPendingInvitations();
}

function handleCreateOrg() {
  router.push("/organizations/new");
}

async function handleAcceptInvitation(inv: PendingInvite) {
  await acceptInvitation(inv.organisationId, inv.id);
}

async function handleDeclineInvitation(inv: PendingInvite) {
  await declineInvitation(inv.organisationId, inv.id);
}

function handleAcceptInvitedOrg() {
  loadOrganizations(true);
  loadPendingInvitations();
}
</script>

<style scoped>
.orgs-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Loading / Error */
.loading-state {
  padding: 3rem 1rem;
  text-align: center;
}
.loading-text {
  font-size: 0.9rem;
  color: #6b7280;
}
.error-state {
  padding: 2rem 1.5rem;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 0.75rem;
}
.error-text {
  font-size: 0.875rem;
  color: #c53030;
  margin-bottom: 0.75rem;
}

/* Container Card */
.orgs-card-wrapper {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.orgs-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
  letter-spacing: -0.01em;
}
.btn-create-org {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #3fd246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  border: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease;
}
.btn-create-org:hover {
  background: #36bd3d;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}
.btn-create-icon {
  width: 1rem;
  height: 1rem;
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
  background: #ebf1f6;
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
  border-color: #3fd246;
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
  text-align: center;
  font-size: 0.95rem;
  color: #6b7280;
}

.btn-retry {
  padding: 0.55rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0e2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-retry:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Pending Section */
.pending-section {
  border-top: 1px solid #f3f4f6;
  padding-top: 2.25rem;
}

.pending-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.pending-header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.pending-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0e2615;
  margin: 0;
}

.pending-subtitle {
  font-size: 0.76rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  background: transparent;
  border: none;
  color: #3fd246;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
}

.view-all-icon {
  width: 0.8rem;
  height: 0.8rem;
  display: block;
  filter: brightness(0) saturate(100%) invert(57%) sepia(73%) saturate(472%)
    hue-rotate(86deg) brightness(95%) contrast(90%);
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pending-row {
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(100px, 0.65fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #eef2ee;
}

.pending-row:last-child {
  border-bottom: none;
}

.pending-org-block {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.org-badge {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.7rem;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pending-org-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}

.pending-org-name-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.pending-org-name {
  font-size: 0.92rem;
  font-weight: 500;
  color: #0e2615;
  line-height: 1.2;
}

.pending-role-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding: 0.18rem 0.45rem;
  border-radius: 9999px;
  font-size: 0.62rem;
  font-weight: 500;
}

.pending-invited-by {
  font-size: 0.72rem;
  color: #6b7280;
  font-weight: 400;
}

.pending-date-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 0.72rem;
  color: #0e2615;
  line-height: 1.35;
  font-weight: 400;
}

.pending-date,
.pending-time {
  font-size: 0.75rem;
  color: #0e2615;
  font-weight: 400;
}

.pending-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: flex-end;
}

.btn-accept {
  min-width: 6.4rem;
  padding: 0.62rem 1.1rem;
  background: #3fd246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.78rem;
  border-radius: 0.7rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(63, 210, 70, 0.18);
}

.btn-decline {
  min-width: 6.4rem;
  padding: 0.62rem 1.1rem;
  background: #ffffff;
  border: 1.5px solid #dfe8e2;
  color: #0e2615;
  font-weight: 700;
  font-size: 0.78rem;
  border-radius: 0.7rem;
  cursor: pointer;
}

.skeleton-card-box {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #eef2ee;
  padding: 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skeleton-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.skeleton-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
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

<template>
  <div class="promoters-page">
    <AppPageSkeleton
      v-if="isLoading"
      layout="stats"
      :stat-cards="4"
      :show-header="false"
    />

    <template v-else>
      <!-- Main Unified Card -->
      <div class="main-card">
        <!-- Top Controls & Action Row -->
        <div class="top-action-row">
          <!-- Search & Filter Bar -->
          <div class="search-filter-group">
            <div class="search-input-wrapper">
              <svg
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
                placeholder="Search by promoter by name..."
                class="search-input"
              />
              <button
                v-if="searchQuery"
                class="clear-search-btn"
                @click="searchQuery = ''"
              >
                &times;
              </button>
            </div>

            <!-- Filter Dropdown -->
            <div class="filter-wrapper">
              <button
                type="button"
                class="btn-control btn-filter"
                :class="{ 'btn-control--active': filterStatus !== 'All' }"
                @click.stop="showFilterDropdown = !showFilterDropdown"
              >
                <svg
                  class="filter-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
                <span v-if="filterStatus !== 'All'" class="filter-active-dot" />
              </button>

              <Transition name="fade-drop">
                <div
                  v-if="showFilterDropdown"
                  class="filter-dropdown"
                  @click.stop
                >
                  <div class="filter-dropdown-title">Filter by Status</div>
                  <button
                    v-for="opt in statusOptions"
                    :key="opt"
                    class="filter-option"
                    :class="{ 'filter-option--active': filterStatus === opt }"
                    @click="
                      filterStatus = opt;
                      showFilterDropdown = false;
                    "
                  >
                    {{ opt }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Create Promoter Link Button -->
          <NuxtLink to="/promoters/create" class="btn-create-link">
            <svg
              class="plus-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Promoter Link
          </NuxtLink>
        </div>

        <!-- 4 Stat Cards Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Total Customers</span>
            <div class="stat-value">
              {{ summaryStats.totalCustomers.toLocaleString() }}
            </div>
            <div class="stat-trend">{{ summaryStats.totalCustomersTrend }}</div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Active (Last 30 days)</span>
            <div class="stat-value">
              {{ summaryStats.activeCustomers.toLocaleString() }}
            </div>
            <div class="stat-trend">{{ summaryStats.activeCustomersTrend }}</div>
          </div>

          <div class="stat-card">
            <span class="stat-label">New</span>
            <div class="stat-value">
              {{ summaryStats.newCustomers.toLocaleString() }}
            </div>
            <div class="stat-trend">{{ summaryStats.newCustomersTrend }}</div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Duplicate/Used</span>
            <div class="stat-value">
              {{ summaryStats.duplicateCustomers.toLocaleString() }}
            </div>
            <div class="stat-trend">{{ summaryStats.duplicateCustomersTrend }}</div>
          </div>
        </div>

        <!-- Section Title -->
        <div class="section-header">
          <h2 class="section-title">Top Performing Promoters</h2>
        </div>

        <!-- Promoters Table -->
        <div class="table-wrapper">
          <table class="promoters-table">
            <thead>
              <tr>
                <th>PROMOTER</th>
                <th>EVENT</th>
                <th>TICKET SOLD</th>
                <th>REVENUE</th>
                <th>COMMISSION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredPromoters"
                :key="item.id"
                class="table-row clickable-row"
                @click="navigateToPromoter(item.id)"
              >
                <!-- Promoter Name with Avatar Circle -->
                <td class="promoter-name-cell">
                  <div class="promoter-avatar-row">
                    <div
                      class="promoter-avatar"
                      :style="{ background: item.avatarBg || getAvatarBg(item.promoterName) }"
                    >
                      {{ item.initials || getInitials(item.promoterName) }}
                    </div>
                    <span class="promoter-name-text">{{ item.promoterName }}</span>
                  </div>
                </td>

                <td class="event-name">{{ item.event }}</td>
                <td class="tickets-sold">{{ item.ticketsSold }}</td>
                <td class="revenue-cell">
                  N{{ formatCurrency(item.revenue ?? (item.commissionEarned * 10)) }}
                </td>
                <td class="earned-cell">
                  N{{ formatCurrency(item.commissionEarned) }}
                </td>
                <td>
                  <span
                    class="status-pill"
                    :class="`status--${item.status.toLowerCase()}`"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredPromoters.length === 0">
                <td colspan="6" class="empty-cell">
                  No matching promoters found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bottom Link -->
        <div class="card-footer">
          <button type="button" class="btn-view-all" @click="resetFilters">
            View all promoters
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useOrgState } from "~/composables/useOrgState";
import AppPageSkeleton from "~/components/ui/AppPageSkeleton.vue";
import type { PromoterEventCommission } from "~/types/promoter";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Promoters — Uzu Ticket",
  meta: [
    {
      name: "description",
      content:
        "Manage your promotions, and keep up with your commission earnings.",
    },
  ],
});

const router = useRouter();
const searchQuery = ref("");
const filterStatus = ref("All");
const showFilterDropdown = ref(false);
const statusOptions = ["All", "Active", "Inactive", "Pending", "Completed"];

const { instance } = useApi();
const { activeOrgId } = useOrgState();
const isLoading = ref(true);

const summaryStats = ref({
  totalCustomers: 12842,
  activeCustomers: 21358,
  newCustomers: 342,
  duplicateCustomers: 214,
  totalCustomersTrend: "+12.4%",
  activeCustomersTrend: "+8.6%",
  newCustomersTrend: "+5.2%",
  duplicateCustomersTrend: "+3.1%",
});

// Mock/Default list matching the exact screenshot layout
const defaultPromoters: PromoterEventCommission[] = [
  {
    id: "promoter-1",
    promoterName: "Divine Emmanuel",
    initials: "DE",
    avatarBg: "#14b8a6", // Teal
    event: "Summer Music Fest",
    ticketsSold: 156,
    revenue: 180000,
    commissionEarned: 180000,
    commissionRate: "10%",
    status: "Active",
  },
  {
    id: "promoter-2",
    promoterName: "Mike Mills",
    initials: "MM",
    avatarBg: "#064e3b", // Dark green
    event: "Arts Emergence",
    ticketsSold: 98,
    revenue: 250000,
    commissionEarned: 250000,
    commissionRate: "15%",
    status: "Inactive",
  },
  {
    id: "promoter-3",
    promoterName: "Jane Cooper",
    initials: "JC",
    avatarBg: "#2563eb", // Blue
    event: "Chess Africa",
    ticketsSold: 76,
    revenue: 150000,
    commissionEarned: 150000,
    commissionRate: "10%",
    status: "Active",
  },
  {
    id: "promoter-4",
    promoterName: "Ben Francis",
    initials: "BF",
    avatarBg: "#dc2626", // Red
    event: "New Year Groove",
    ticketsSold: 60,
    revenue: 300000,
    commissionEarned: 300000,
    commissionRate: "12%",
    status: "Active",
  },
  {
    id: "promoter-5",
    promoterName: "Lizzy Poole",
    initials: "LP",
    avatarBg: "#581c87", // Purple
    event: "Pool Party Event",
    ticketsSold: 44,
    revenue: 120000,
    commissionEarned: 120000,
    commissionRate: "10%",
    status: "Inactive",
  },
];

const promoters = ref<PromoterEventCommission[]>([]);

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function getInitials(name?: string) {
  if (!name) return "PR";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const colorPalette = ["#14b8a6", "#064e3b", "#2563eb", "#dc2626", "#581c87", "#ea580c"];
function getAvatarBg(name?: string) {
  if (!name) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

async function fetchPromoterData() {
  isLoading.value = true;
  try {
    if (!activeOrgId.value) {
      promoters.value = defaultPromoters;
      return;
    }

    const [summaryResponse, listResponse] = await Promise.all([
      instance.get(`/organisations/${activeOrgId.value}/promoters/summary`),
      instance.get(`/organisations/${activeOrgId.value}/promoters`),
    ]);

    const summaryData = summaryResponse.data?.data ?? summaryResponse.data;
    if (summaryData) {
      summaryStats.value = {
        totalCustomers: summaryData.totalCustomers !== undefined ? summaryData.totalCustomers : 12842,
        activeCustomers: summaryData.activeCustomers !== undefined ? summaryData.activeCustomers : 21358,
        newCustomers: summaryData.newCustomers !== undefined ? summaryData.newCustomers : 342,
        duplicateCustomers: summaryData.duplicateCustomers !== undefined ? summaryData.duplicateCustomers : 214,
        totalCustomersTrend: summaryData.totalCustomersTrend || "+12.4%",
        activeCustomersTrend: summaryData.activeCustomersTrend || "+8.6%",
        newCustomersTrend: summaryData.newCustomersTrend || "+5.2%",
        duplicateCustomersTrend: summaryData.duplicateCustomersTrend || "+3.1%",
      };
    }

    const listData = listResponse.data?.data ?? listResponse.data ?? [];
    if (Array.isArray(listData) && listData.length > 0) {
      promoters.value = listData.map((item: any) => ({
        id: item.id,
        promoterName: item.promoterName || "Promoter",
        initials: item.initials || getInitials(item.promoterName),
        avatarBg: getAvatarBg(item.promoterName),
        event: item.event,
        ticketsSold: Number(item.ticketsSold ?? 0),
        revenue: Number(item.revenue ?? (item.commissionEarned ? item.commissionEarned * 10 : 0)),
        commissionEarned: Number(item.commissionEarned ?? 0),
        commissionRate: item.commissionRate,
        status: item.status || "Active",
      }));
    } else {
      promoters.value = defaultPromoters;
    }
  } catch (error) {
    console.warn("Using default promoter table layout", error);
    promoters.value = defaultPromoters;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchPromoterData();
});

watch(activeOrgId, () => {
  fetchPromoterData();
});

const filteredPromoters = computed(() => {
  return promoters.value.filter((item) => {
    const q = searchQuery.value.toLowerCase().trim();
    const name = (item.promoterName || "").toLowerCase();
    const evt = (item.event || "").toLowerCase();
    const matchesSearch = !q || name.includes(q) || evt.includes(q);

    const matchesStatus =
      filterStatus.value === "All" ||
      item.status.toLowerCase() === filterStatus.value.toLowerCase();

    return matchesSearch && matchesStatus;
  });
});

function navigateToPromoter(id: string) {
  router.push(`/promoters/${id}`);
}

function resetFilters() {
  searchQuery.value = "";
  filterStatus.value = "All";
}
</script>

<style scoped>
.promoters-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
}

/* Main Unified Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Top Action Row (Search, Filter, Create Link Button) */
.top-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 650px;
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
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.search-input:focus {
  border-color: #3fd246;
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

.filter-wrapper {
  position: relative;
}

.btn-control {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.15rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-family: "Outfit", sans-serif;
}

.filter-icon {
  width: 1rem;
  height: 1rem;
  color: #4b5563;
}

.btn-control:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.btn-control--active {
  border-color: #3fd246;
  color: #16a34a;
}

.filter-active-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3fd246;
  margin-left: 0.25rem;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 160px;
}

.filter-dropdown-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.5rem 0.5rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 0.35rem;
}

.filter-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s ease;
  font-family: "Outfit", sans-serif;
}

.filter-option:hover {
  background: #f3f4f6;
}

.filter-option--active {
  background: #f0fdf4;
  color: #16a34a;
  font-weight: 700;
}

.btn-create-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.35rem;
  border-radius: 0.65rem;
  background: #3fd246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.plus-icon {
  width: 1rem;
  height: 1rem;
}

.btn-create-link:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.25);
}

/* Stats Grid (4 columns) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #fafdfa;
  border: 1px solid rgba(63, 210, 70, 0.45);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 210, 70, 0.08);
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
}

.stat-value {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0e2615;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3fd246;
}

/* Section Header */
.section-header {
  margin-top: 0.5rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.promoters-table {
  width: 100%;
  border-collapse: collapse;
}

.promoters-table thead tr th {
  padding: 0.85rem 0.75rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  color: #16a34a; /* Green Header Text */
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.table-row {
  transition: background 0.12s ease;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: #f9fafb;
}

.promoters-table tbody tr td {
  padding: 1.1rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.promoter-avatar-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.promoter-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.promoter-name-text {
  font-weight: 700;
  color: #111827;
}

.event-name {
  font-weight: 600;
  color: #374151;
}

.tickets-sold {
  font-weight: 600;
  color: #111827;
}

.revenue-cell {
  font-weight: 700;
  color: #111827;
}

.earned-cell {
  font-weight: 700;
  color: #111827;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--active,
.status--completed {
  background: #dcfce7;
  color: #16a34a;
}

.status--inactive,
.status--cancelled {
  background: #f3f4f6;
  color: #6b7280;
}

.status--pending {
  background: #ffedd5;
  color: #ea580c;
}

.empty-cell {
  text-align: center;
  padding: 2.5rem 1rem !important;
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
}

.btn-view-all {
  background: transparent;
  border: none;
  color: #16a34a;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-view-all:hover {
  color: #15803d;
  text-decoration: underline;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .top-action-row {
    flex-direction: column;
    align-items: stretch;
  }
  .search-filter-group {
    max-width: 100%;
  }
  .btn-create-link {
    justify-content: center;
  }
}
</style>

<template>
  <div class="promoters-page">
    <!-- Quick Nav Bar for demo / testing -->
    <div class="demo-nav-row">
      <NuxtLink to="/promoters" class="demo-nav-link demo-nav-link--active">Dashboard</NuxtLink>
      <NuxtLink to="/promoters/create" class="demo-nav-link">+ Create Link</NuxtLink>
      <NuxtLink to="/promoters/link-ready" class="demo-nav-link">Link Ready</NuxtLink>
      <NuxtLink to="/promoters/invite" class="demo-nav-link">Invite Flow</NuxtLink>
    </div>

    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Title & Subtitle -->
      <div class="card-header">
        <div class="header-text">
          <h1 class="card-title">Commission</h1>
          <p class="card-subtitle">Share your promoter link and start earning commission</p>
        </div>
        <NuxtLink to="/promoters/create" class="btn-create-link">
          + Create Link
        </NuxtLink>
      </div>

      <!-- Stat Cards (4 Cards Grid) -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Commission Earned</span>
          <div class="stat-value">93,000</div>
          <div class="stat-trend">+12.4% from last 30 days</div>
        </div>

        <div class="stat-card">
          <span class="stat-label">Pending (After Event)</span>
          <div class="stat-value">12,842</div>
          <div class="stat-trend">+8.6% from last 30 days</div>
        </div>

        <div class="stat-card">
          <span class="stat-label">Available to Withdraw</span>
          <div class="stat-value">18,000</div>
          <div class="stat-trend">+5.2% from last 30 days</div>
        </div>

        <div class="stat-card">
          <span class="stat-label">Paid Out</span>
          <div class="stat-value">N75,000</div>
          <div class="stat-trend">+3.1% from last 30 days</div>
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="controls-top-row">
        <!-- Search -->
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search event..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">
            &times;
          </button>
        </div>

        <!-- Filter -->
        <div class="filter-wrapper">
          <button
            type="button"
            class="btn-control btn-filter"
            :class="{ 'btn-control--active': filterStatus !== 'All' }"
            @click.stop="showFilterDropdown = !showFilterDropdown"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
            <span v-if="filterStatus !== 'All'" class="filter-active-dot" />
          </button>

          <!-- Filter Dropdown -->
          <Transition name="fade-drop">
            <div v-if="showFilterDropdown" class="filter-dropdown" @click.stop>
              <div class="filter-dropdown-title">Filter by Status</div>
              <button
                v-for="opt in statusOptions"
                :key="opt"
                class="filter-option"
                :class="{ 'filter-option--active': filterStatus === opt }"
                @click="filterStatus = opt; showFilterDropdown = false"
              >
                {{ opt }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-wrapper">
        <table class="promoters-table">
          <thead>
            <tr>
              <th>EVENT</th>
              <th>TICKETS SOLD</th>
              <th>COMMISSION RATE</th>
              <th>COMMISSION EARNED</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCommissions" :key="item.id" class="table-row">
              <td class="event-name">{{ item.event }}</td>
              <td>{{ item.ticketsSold }}</td>
              <td>{{ item.commissionRate }}</td>
              <td class="earned-cell">N{{ item.commissionEarned.toLocaleString() }}</td>
              <td>
                <span class="status-pill" :class="`status--${item.status.toLowerCase()}`">
                  {{ item.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredCommissions.length === 0">
              <td colspan="5" class="empty-cell">No matching commission logs found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Bar -->
      <div class="card-footer">
        <span class="footer-note">Commission becomes payable after the event end date</span>
        <button type="button" class="btn-withdraw" @click="handleWithdraw">
          + Withdraw
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PromoterEventCommission } from '~/types/promoter'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Promoters — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your promotions, and keep up with your commission earnings.' },
  ],
})

const searchQuery = ref('')
const filterStatus = ref('All')
const showFilterDropdown = ref(false)
const statusOptions = ['All', 'Completed', 'Pending', 'Cancelled']

const commissions = ref<PromoterEventCommission[]>([
  { id: '1', event: 'Summer Tech Camp', ticketsSold: 100, commissionRate: '10%', commissionEarned: 30000, status: 'Completed' },
  { id: '2', event: 'Music Fest 2026', ticketsSold: 105, commissionRate: '10%', commissionEarned: 14000, status: 'Completed' },
  { id: '3', event: 'Business Catchup', ticketsSold: 56, commissionRate: '10%', commissionEarned: 20000, status: 'Cancelled' },
  { id: '4', event: 'Tech Connect Lagos', ticketsSold: 68, commissionRate: '10%', commissionEarned: 10000, status: 'Completed' },
  { id: '5', event: 'Food & Night Expo', ticketsSold: 35, commissionRate: '10%', commissionEarned: 20000, status: 'Pending' },
])

const filteredCommissions = computed(() => {
  return commissions.value.filter((item) => {
    const matchesSearch = !searchQuery.value || item.event.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
    const matchesStatus = filterStatus.value === 'All' || item.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const router = useRouter()

function handleWithdraw() {
  router.push('/promoters/withdrawal')
}
</script>

<style scoped>
.promoters-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Demo Nav */
.demo-nav-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.demo-nav-link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.15s ease;
}

.demo-nav-link:hover {
  border-color: #3FD246;
  color: #16a34a;
}

.demo-nav-link--active {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
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

/* Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.btn-create-link {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.25rem;
  border-radius: 0.65rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
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
  background: #FAFDFA;
  border: 1px solid rgba(63, 210, 70, 0.45);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: transform 0.2s, box-shadow 0.2s;
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
  color: #0E2615;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3FD246;
}

/* Controls (Search & Filter) */
.controls-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
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
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.25rem 0.6rem 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.85rem;
  color: #111827;
  outline: none;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.search-input:focus {
  border-color: #3FD246;
  background: #ffffff;
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
  padding: 0.6rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
}

.btn-control:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.btn-control--active {
  border-color: #3FD246;
  color: #16a34a;
}

.filter-active-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3FD246;
  margin-left: 0.5rem;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
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
  font-family: 'Outfit', sans-serif;
}

.filter-option:hover {
  background: #f3f4f6;
}

.filter-option--active {
  background: #f0fdf4;
  color: #16a34a;
  font-weight: 700;
}

.empty-cell {
  text-align: center;
  padding: 2.5rem 1rem !important;
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  border-top: 1px solid #eef2ee;
}

.promoters-table {
  width: 100%;
  border-collapse: collapse;
}

.promoters-table thead tr th {
  padding: 1rem 0.75rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3FD246;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.table-row {
  transition: background 0.1s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.promoters-table tbody tr td {
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.event-name {
  font-weight: 600;
  color: #111827;
}

.earned-cell {
  font-weight: 700;
  color: #0E2615;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--completed {
  background: #f0fdf4;
  color: #16a34a;
}

.status--cancelled {
  background: #fef2f2;
  color: #dc2626;
}

.status--pending {
  background: #fff7ed;
  color: #ea580c;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.footer-note {
  font-size: 0.82rem;
  color: #6b7280;
}

.btn-withdraw {
  padding: 0.65rem 1.5rem;
  border-radius: 0.65rem;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-withdraw:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.25);
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .btn-withdraw {
    width: 100%;
  }
}
</style>

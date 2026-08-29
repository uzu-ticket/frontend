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
        </div>

        <div class="stat-card">
          <span class="stat-label">Pending (After Event)</span>
          <div class="stat-value">12,842</div>
        </div>

        <div class="stat-card">
          <span class="stat-label">Available to Withdraw</span>
          <div class="stat-value">18,000</div>
        </div>

        <div class="stat-card">
          <span class="stat-label">Paid Out</span>
          <div class="stat-value">N75,000</div>
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
            <tr v-for="item in commissions" :key="item.id" class="table-row">
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
import { ref } from 'vue'
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

const commissions = ref<PromoterEventCommission[]>([
  { id: '1', event: 'Summer Tech Camp', ticketsSold: 100, commissionRate: '10%', commissionEarned: 30000, status: 'Completed' },
  { id: '2', event: 'Music Fest 2026', ticketsSold: 105, commissionRate: '10%', commissionEarned: 14000, status: 'Completed' },
  { id: '3', event: 'Business Catchup', ticketsSold: 56, commissionRate: '10%', commissionEarned: 20000, status: 'Cancelled' },
  { id: '4', event: 'Tech Connect Lagos', ticketsSold: 68, commissionRate: '10%', commissionEarned: 10000, status: 'Completed' },
  { id: '5', event: 'Food & Night Expo', ticketsSold: 35, commissionRate: '10%', commissionEarned: 20000, status: 'Pending' },
])

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
  background: #ffffff;
  border-radius: 0.85rem;
  border: 1px solid #eef2ee;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
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

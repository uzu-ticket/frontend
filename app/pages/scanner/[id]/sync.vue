<template>
  <div class="offline-sync-page">
    <!-- Main Container Card -->
    <div class="sync-container">
      <!-- Back Link -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Section Title & Subtitle -->
      <div class="section-header">
        <h2 class="section-title">Offline & Sync</h2>
        <p class="section-subtitle">{{ eventName }}</p>
      </div>

      <!-- Top 2 Cards Row -->
      <div class="top-cards-grid">
        <!-- Card 1: Offline Mode Banner -->
        <div class="info-card offline-mode-card">
          <div class="offline-header-row">
            <svg xmlns="http://www.w3.org/2000/svg" class="wifi-slash-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m2.828 2.828a6 6 0 018.485 0m-8.485 8.485a6 6 0 010-8.485m2.829 2.829a2 2 0 012.828 0M3 3l18 18" />
            </svg>
            <span class="offline-mode-title">Offline Mode</span>
          </div>

          <p class="offline-count-title">1 Scanner Offline</p>
          <p class="offline-desc">Scanner will continue scanning and sync when back online</p>
        </div>

        <!-- Card 2: Last Synced & Auto Sync Info -->
        <div class="info-card last-synced-card">
          <div class="sync-info-block">
            <span class="info-label">Last Synced</span>
            <span class="info-value font-semibold">Sept 12, 2026 - 9:46 AM</span>
          </div>

          <div class="sync-info-block">
            <span class="info-label">Auto Sync</span>
            <span class="info-value auto-sync-status">Enabled</span>
          </div>
        </div>
      </div>

      <!-- Bottom 2 Cards Grid -->
      <div class="bottom-grid">
        <!-- Left: Scanner Status Table -->
        <div class="grid-card scanner-status-card">
          <h3 class="card-title">Scanner Status</h3>

          <div class="table-responsive">
            <table class="status-table">
              <thead>
                <tr>
                  <th>SCANNER</th>
                  <th>GATE</th>
                  <th>STATUS</th>
                  <th>PENDING SYNC</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in scannerStatuses" :key="idx">
                  <td class="font-bold">{{ row.scanner }}</td>
                  <td class="font-medium text-gray-700">{{ row.gate }}</td>
                  <td>
                    <span
                      class="badge-pill"
                      :class="row.status.toLowerCase() === 'valid' ? 'badge-pill--valid' : 'badge-pill--invalid'"
                    >
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="font-bold text-gray-900 text-center">{{ row.pendingSync }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Sync Queue Card -->
        <div class="grid-card sync-queue-card">
          <h3 class="card-title">Sync Queue</h3>

          <div class="queue-list">
            <div class="queue-row queue-total-row">
              <span class="queue-label-bold">Total Pending</span>
              <span class="queue-count-bold">12</span>
            </div>

            <div class="queue-row">
              <span class="badge-pill badge-pill--valid">Valid</span>
              <span class="queue-count">8</span>
            </div>

            <div class="queue-row">
              <span class="badge-pill badge-pill--invalid">Invalid</span>
              <span class="queue-count">2</span>
            </div>

            <div class="queue-row">
              <span class="badge-pill badge-pill--duplicate">Duplicate</span>
              <span class="queue-count">2</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Right Action Button -->
      <div class="page-footer-actions">
        <button type="button" class="btn-sync-now" @click="handleSync">
          <span>Sync Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="refresh-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Offline & Sync — Ticket Scanner',
})

const route = useRoute()
const router = useRouter()

const eventId = computed(() => (route.params.id as string) || '1')

function goBack() {
  router.push(`/scanner/${eventId.value}`)
}

const eventName = ref('Summer Tech Growth Summit')

const scannerStatuses = ref([
  { scanner: 'Scanner 01', gate: 'Gate B', status: 'Invalid', pendingSync: 0 },
  { scanner: 'Scanner 02', gate: 'Gate A', status: 'Valid', pendingSync: 1 },
  { scanner: 'Scanner 01', gate: 'Gate C', status: 'Valid', pendingSync: 2 },
  { scanner: 'Scanner 02', gate: 'Gate B', status: 'Invalid', pendingSync: 2 },
])

function handleSync() {
  alert('Sync initiated successfully!')
}
</script>

<style scoped>
.offline-sync-page {
  max-width: 1200px;
  margin: 0 auto;
}

.sync-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  position: relative;
}

/* Back Link */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 800;
  color: #16A34A;
  cursor: pointer;
  width: fit-content;
  transition: color 0.15s ease;
}

.back-button:hover {
  color: #15803D;
}

.back-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.section-subtitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
}

/* Top 2 Cards Grid */
.top-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .top-cards-grid {
    grid-template-columns: 1fr;
  }
}

.info-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.offline-mode-card {
  border-color: #FEE2E2;
}

.offline-header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.wifi-slash-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #EF4444;
}

.offline-mode-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #EF4444;
}

.offline-count-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.35rem 0;
}

.offline-desc {
  font-size: 0.825rem;
  color: #6B7280;
  margin: 0;
}

/* Last Synced Card */
.last-synced-card {
  justify-content: space-between;
  gap: 1.5rem;
}

.sync-info-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B7280;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
}

.auto-sync-status {
  color: #16A34A;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

.grid-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1.25rem 0;
}

/* Table */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.status-table th {
  padding: 0.75rem 0.5rem;
  font-size: 0.725rem;
  font-weight: 800;
  color: #6B7280;
  border-bottom: 1px solid #F3F4F6;
  background: #F9FAFB;
}

.status-table td {
  padding: 1rem 0.5rem;
  font-size: 0.85rem;
  color: #374151;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
}

.status-table tr:last-child td {
  border-bottom: none;
}

/* Queue List */
.queue-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.queue-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.queue-label-bold {
  font-size: 0.9rem;
  font-weight: 800;
  color: #111827;
}

.queue-count-bold {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
}

.queue-count {
  font-size: 0.9rem;
  font-weight: 800;
  color: #111827;
}

/* Badges */
.badge-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-pill--valid {
  background: #DCFCE7;
  color: #16A34A;
}

.badge-pill--invalid {
  background: #FEE2E2;
  color: #EF4444;
}

.badge-pill--duplicate {
  background: #FEF3C7;
  color: #D97706;
}

/* Page Footer Actions */
.page-footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-sync-now {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.7rem 1.4rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.btn-sync-now:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.refresh-icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

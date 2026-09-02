<template>
  <div class="scanner-page">
    <!-- Main Container Card -->
    <div class="scanner-container">
      <!-- Select Event Section Header -->
      <div class="filter-section">
        <p class="filter-prompt">
          Select an event to start monitoring scanners and scan activity in real-time.
        </p>

        <div class="filter-controls-row">
          <div class="event-select-wrapper">
            <AppSelect
              v-model="selectedEventId"
              :options="eventOptions"
              placeholder="Select event"
              @update:model-value="handleEventChange"
            />
          </div>

          <div class="date-picker-wrapper">
            <DatePicker
              v-model="dateRange"
              placeholder="Aug 24 - Sept 10, 2026"
            />
          </div>
        </div>
      </div>

      <!-- Stat Cards Row -->
      <div class="stats-section">
        <ScannerStatGroup />
      </div>

      <!-- Content Grid: Live Scan Activity & Scan Summary -->
      <div class="dashboard-grid">
        <!-- Live Scan Activity Box -->
        <div class="activity-card">
          <div class="activity-header">
            <h3 class="activity-title">Live Scan Activity</h3>
            <NuxtLink to="/scanner/1/activity" class="view-all-link">
              View All
            </NuxtLink>
          </div>

          <div class="activity-list">
            <LiveScanActivityItem
              v-for="item in recentScans"
              :key="item.id"
              :name="item.name"
              :email="item.email"
              :status="item.status"
              :time="item.time"
              :avatar-color="item.avatarColor"
              @click="openScanModal(item)"
            />
          </div>
        </div>

        <!-- Scan Summary Box -->
        <div class="summary-card">
          <h3 class="summary-title">Scan Summary</h3>
          <div class="summary-chart-placeholder">
            <div class="placeholder-graphic">
              <svg xmlns="http://www.w3.org/2000/svg" class="chart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="placeholder-text">Real-time scan statistics breakdown</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scan Detail Modal -->
    <ScanDetailModal
      v-model="isModalOpen"
      :scan="selectedScan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSelect from '~/components/ui/AppSelect.vue'
import DatePicker from '~/components/ui/DatePicker.vue'
import ScannerStatGroup from '~/components/scanner/ScannerStatGroup.vue'
import LiveScanActivityItem, { type ScanItem } from '~/components/scanner/LiveScanActivityItem.vue'
import ScanDetailModal from '~/components/scanner/ScanDetailModal.vue'
import { useScanner } from '~/composables/useScanner'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Ticket Scanner — Uzu Ticket',
})

const router = useRouter()
const toast = useToast()
const scannerStore = useScanner()

const selectedEventId = ref<string | number>('')
const dateRange = ref('')
const eventOptions = ref<{ value: string; label: string }[]>([])
const recentScans = ref<ScanItem[]>([])

onMounted(async () => {
  try {
    eventOptions.value = await scannerStore.fetchEventOptions()
  } catch {
    toast.show({
      title: 'Failed to load events',
      message: 'Could not load events for scanner selection',
      type: 'error',
    })
  }
})

function handleEventChange(val: string | number | null) {
  if (val) {
    router.push(`/scanner/${val}`)
  }
}

const isModalOpen = ref(false)
const selectedScan = ref<ScanItem | null>(null)

function openScanModal(scan: ScanItem) {
  selectedScan.value = scan
  isModalOpen.value = true
}
</script>

<style scoped>
.scanner-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.scanner-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Filter Controls Header */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filter-prompt {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.filter-controls-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.event-select-wrapper {
  width: 24rem;
  max-width: 100%;
}

.date-picker-wrapper {
  width: 16rem;
  max-width: 100%;
  margin-left: auto;
}

@media (max-width: 768px) {
  .date-picker-wrapper {
    margin-left: 0;
  }
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

/* Activity Card */
.activity-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.activity-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.view-all-link {
  font-size: 0.825rem;
  font-weight: 700;
  color: #16A34A;
  text-decoration: none;
  transition: color 0.15s;
}

.view-all-link:hover {
  color: #15803D;
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

/* Summary Card */
.summary-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.summary-chart-placeholder {
  flex: 1;
  min-height: 240px;
  border: 2px dashed #E5E7EB;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #FAFAFA;
}

.chart-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #9CA3AF;
  margin-bottom: 0.75rem;
}

.placeholder-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
}
</style>

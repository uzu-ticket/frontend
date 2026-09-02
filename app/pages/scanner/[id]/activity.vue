<template>
  <div class="scan-activity-page">
    <!-- Main Container Card -->
    <div class="activity-container">
      <!-- Back Button -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Section Title & Event Metadata -->
      <div class="section-meta-header">
        <h2 class="section-title">Live Scan Activity</h2>
        <p class="event-subtitle-text">
          <span class="event-name">{{ eventName }}</span>
          <span class="event-date">{{ eventDate }}</span>
        </p>
      </div>

      <!-- Search & Status Filter Pills Control Row -->
      <div class="controls-row">
        <!-- Search Input -->
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-field"
            placeholder="Search events..."
          />
        </div>

        <!-- Filter Pills -->
        <div class="filter-pills">
          <button
            v-for="status in statusFilters"
            :key="status"
            type="button"
            class="pill-btn"
            :class="{ 'pill-btn--active': activeFilter === status }"
            @click="activeFilter = status"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-card">
        <AppDataTable
          :columns="columns"
          :items="filteredScans"
          :page-size="10"
          :clickable-rows="true"
          @row-click="openScanModal"
        >
          <!-- Custom Cell Slots -->
          <template #cell-time="{ item }">
            <span class="font-medium text-gray-700">{{ item.time }}</span>
          </template>

          <template #cell-name="{ item }">
            <span class="font-bold text-gray-900 group-hover:text-green-600">
              {{ item.name }}
            </span>
          </template>

          <template #cell-ticketType="{ item }">
            <span class="font-semibold text-gray-700">{{ item.ticketType }}</span>
          </template>

          <template #cell-status="{ item }">
            <span
              class="badge-pill"
              :class="getStatusClass(item.status)"
            >
              {{ item.status }}
            </span>
          </template>

          <template #cell-gate="{ item }">
            <span class="font-semibold text-gray-700">{{ item.gate }}</span>
          </template>

          <template #cell-scanner="{ item }">
            <span class="font-semibold text-gray-700">{{ item.scanner }}</span>
          </template>
        </AppDataTable>
      </div>
    </div>

    <!-- Scan Detail Modal (Screen 5) -->
    <ScanDetailModal
      v-model="isModalOpen"
      :scan="selectedScan"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppDataTable, { type TableColumn } from '~/components/ui/AppDataTable.vue'
import ScanDetailModal from '~/components/scanner/ScanDetailModal.vue'
import type { ScanItem } from '~/components/scanner/LiveScanActivityItem.vue'
import { useScanner } from '~/composables/useScanner'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Live Scan Activity — Ticket Scanner',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const scannerStore = useScanner()

const eventId = computed(() => route.params.id as string)

function goBack() {
  router.push(`/scanner/${eventId.value}`)
}

const eventName = ref('')
const eventDate = ref('')

const searchQuery = ref('')
const activeFilter = ref('All')
const statusFilters = ['All', 'Valid', 'Invalid', 'Duplicate']

const isModalOpen = ref(false)
const selectedScan = ref<ScanItem | null>(null)

function openScanModal(item: ScanItem) {
  selectedScan.value = item
  isModalOpen.value = true
}

const columns: TableColumn[] = [
  { key: 'time', label: 'TIME', width: '12%' },
  { key: 'name', label: 'ATTENDEE', width: '22%' },
  { key: 'ticketType', label: 'TICKET', width: '18%' },
  { key: 'status', label: 'TICKETS', width: '16%' },
  { key: 'gate', label: 'GATE', width: '16%' },
  { key: 'scanner', label: 'SCANNER', width: '16%' },
]

const scans = ref<ScanItem[]>([])

onMounted(async () => {
  await loadActivityData()
})

watch(eventId, async () => {
  await loadActivityData()
})

async function loadActivityData() {
  try {
    const [evt, report] = await Promise.all([
      scannerStore.fetchEvent(eventId.value),
      scannerStore.fetchIntegrityReport(eventId.value, true),
    ])

    eventName.value = evt.title
    eventDate.value = new Date(evt.startsAt).toLocaleString('en-US', {
      month: 'short',
      day: 'd',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    scans.value = report.conflicts.map(scannerStore.mapConflictToScanItem) as ScanItem[]
  } catch (e) {
    toast.show({
      title: 'Failed to load scan activity',
      message: 'Could not load scan activity for this event',
      type: 'error',
    })
  }
}

const filteredScans = computed(() => {
  return scans.value.filter((item) => {
    if (activeFilter.value !== 'All' && item.status.toLowerCase() !== activeFilter.value.toLowerCase()) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.ticketType?.toLowerCase().includes(q) ?? false) ||
        (item.gate?.toLowerCase().includes(q) ?? false) ||
        (item.scanner?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })
})

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'valid':
      return 'badge-pill--valid'
    case 'invalid':
      return 'badge-pill--invalid'
    case 'duplicate':
    case 'used':
      return 'badge-pill--duplicate'
    default:
      return 'badge-pill--default'
  }
}
</script>

<style scoped>
.scan-activity-page {
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

.activity-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Section Header Meta */
.section-meta-header {
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

.event-subtitle-text {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.event-name {
  font-weight: 700;
  color: #374151;
}

.event-date {
  font-weight: 600;
  color: #6B7280;
}

/* Controls Row */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.search-input-wrapper {
  position: relative;
  width: 24rem;
  max-width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #9CA3AF;
}

.search-field {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.6rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-field:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

/* Filter Pills */
.filter-pills {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pill-btn {
  padding: 0.55rem 1.15rem;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
  background: #ffffff;
  font-size: 0.825rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pill-btn:hover {
  background: #F9FAFB;
}

.pill-btn--active {
  background: #DCFCE7;
  border-color: #BBF7D0;
  color: #16A34A;
}

/* Table Badge Pills */
.badge-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
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

.badge-pill--default {
  background: #F3F4F6;
  color: #4B5563;
}
</style>

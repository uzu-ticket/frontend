<template>
  <div class="event-scanner-page">
    <!-- Main Container Card -->
    <div class="scanner-container">
      <!-- Back Link -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Active Event Banner Card -->
      <div class="event-banner-wrapper">
        <ScannerEventCard
          :title="event.title"
          :date-time="event.dateTime"
          :location="event.location"
          :image-url="event.imageUrl"
          :status="event.status"
          :clickable="false"
        />
      </div>

      <!-- Stat Group Cards -->
      <div class="stats-section">
        <ScannerStatGroup :stats="stats" />
      </div>

      <!-- Device Stats & Gate Throughput 2-Column Grid -->
      <div class="metrics-grid">
        <div class="grid-col">
          <ScannerDeviceCard
            :online="devices.online"
            :offline="devices.offline"
          />
        </div>

        <div class="grid-col">
          <GateThroughputCard :gates="throughputGates" />
        </div>
      </div>

       <!-- Load More / Full Activity Action Link -->
      <div class="footer-actions">
        <NuxtLink :to="`/scanner/${eventId}/scan`" class="action-link">
          Scan Tickets
        </NuxtLink>

        <NuxtLink :to="`/scanner/${eventId}/activity`" class="action-link">
          Load More Activity
        </NuxtLink>

        <NuxtLink :to="`/scanner/${eventId}/sync`" class="action-link">
          Offline & Sync
        </NuxtLink>

        <NuxtLink :to="`/scanner/${eventId}/conflicts`" class="action-link">
          Conflict Review
        </NuxtLink>

        <NuxtLink :to="`/scanner/${eventId}/settings`" class="action-link">
          Scanner Settings
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScannerEventCard from '~/components/scanner/ScannerEventCard.vue'
import ScannerStatGroup from '~/components/scanner/ScannerStatGroup.vue'
import ScannerDeviceCard from '~/components/scanner/ScannerDeviceCard.vue'
import GateThroughputCard from '~/components/scanner/GateThroughputCard.vue'
import { useScanner } from '~/composables/useScanner'
import { useToast } from '~/composables/useToast'
import { formatEventDate } from '~/types/scanner'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Event Scanner Monitor — Uzu Ticket',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const scannerStore = useScanner()

const eventId = computed(() => route.params.id as string)

function goBack() {
  router.push('/scanner/select')
}

const event = ref({
  id: '',
  title: '',
  dateTime: '',
  location: '',
  imageUrl: '',
  status: 'Live',
})

const stats = ref({
  ticketSold: 0,
  scanned: 0,
  valid: 0,
  duplicate: 0,
  invalid: 0,
})

const devices = ref({
  online: 0,
  offline: 0,
})

const throughputGates = ref([])

const isLoading = ref(true)

onMounted(async () => {
  await loadScannerData()
})

watch(eventId, async () => {
  await loadScannerData()
})

async function loadScannerData() {
  isLoading.value = true
  try {
    const evt = await scannerStore.fetchEvent(eventId.value)

    let report: any = null
    let deviceList: any[] = []
    try {
      report = await scannerStore.fetchIntegrityReport(eventId.value, true)
    } catch (e) {
      console.warn("Integrity report fetch failed:", e)
    }
    try {
      deviceList = await scannerStore.fetchDevices(true)
    } catch (e) {
      console.warn("Device list fetch failed:", e)
    }

    event.value = {
      id: evt.id,
      title: evt.title,
      dateTime: formatEventDate(evt.startsAt),
      location: evt.venueName || evt.city || '',
      imageUrl: evt.images?.[0]?.url || '',
      status: (evt.status as string) === 'live' ? 'Live' : 'Upcoming',
    }

    if (report) {
      stats.value = {
        ticketSold: 0,
        scanned: report.totalScans,
        valid: report.admitted,
        duplicate: Math.floor(report.conflictCount / 2),
        invalid: report.conflictCount - Math.floor(report.conflictCount / 2),
      }
    }

    const now = Date.now()
    const recentThreshold = 5 * 60 * 1000
    const allDevices = deviceList || []
    devices.value = {
      online: allDevices.filter((d) => d.lastSyncedAt && now - new Date(d.lastSyncedAt).getTime() < recentThreshold).length,
      offline: allDevices.filter((d) => !d.lastSyncedAt || now - new Date(d.lastSyncedAt).getTime() >= recentThreshold).length,
    }
  } catch (e: any) {
    console.error("Scanner monitor load error:", e?.message || e, e)
    toast.show({
      title: 'Failed to load scanner data',
      message: e?.message || 'Could not load scanner monitor data for this event',
      type: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.event-scanner-page {
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
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

.event-banner-wrapper {
  width: 100%;
}

/* Metrics 2-column grid */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

.grid-col {
  display: flex;
  flex-direction: column;
}

/* Footer Link */
.footer-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.action-link {
  font-size: 0.9rem;
  font-weight: 800;
  color: #16A34A;
  text-decoration: none;
  transition: color 0.15s ease;
}

.action-link:hover {
  color: #15803D;
  text-decoration: underline;
}
</style>

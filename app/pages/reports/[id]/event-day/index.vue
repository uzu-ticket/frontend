<template>
  <div class="event-day-page">
    <!-- Main Card Container -->
    <div class="reports-container">

      <!-- Back Link -->
      <NuxtLink :to="`/reports/${eventId}`" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-back" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to event details</span>
      </NuxtLink>

      <!-- Event Header Row -->
      <div class="event-header-row">
        <div class="event-title-group">
          <div class="title-with-badge">
            <h2 class="event-name">{{ eventData.name }}</h2>
            <span class="live-badge">
              <span class="live-dot">●</span> Live
            </span>
          </div>

          <div class="event-meta">
            <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>May 1 – May 31, 2026 - 11:00AM • The Hier Arena, Lagos.</span>
          </div>
        </div>

        <button class="btn-end-event-day" @click="endEventDayMode">
          <svg xmlns="http://www.w3.org/2000/svg" class="stop-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
          </svg>
          <span>End Event-day-mode</span>
        </button>
      </div>

      <!-- 4 Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Gross Revenue</span>
          <span class="metric-value">₦5,756,200</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 22.8%
          </span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Tickets Sold</span>
          <span class="metric-value">2,812</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 19.2%
          </span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Orders</span>
          <span class="metric-value">1,125</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 16.7%
          </span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Refunds</span>
          <span class="metric-value">₦96,300</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 4.1%
          </span>
        </div>
      </div>

      <!-- Live Scan Activity Chart + Gate Capacity Bars Grid -->
      <div class="charts-grid">
        <div class="chart-left">
          <ReportsSalesChart title="Live Scan Activity" period-label="last 6 hours" />
        </div>

        <div class="chart-right gate-capacity-card">
          <h3 class="chart-title">Total Sold by Type</h3>

          <div class="gate-list">
            <div v-for="gate in gateCapacity" :key="gate.name" class="gate-item">
              <div class="gate-label-row">
                <span class="gate-name">{{ gate.name }}</span>
                <span class="gate-pct">{{ gate.pct }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: gate.pct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Duplicate Attempt Alert Section -->
      <div class="table-section">
        <div class="section-header-row">
          <div class="title-with-count">
            <h3 class="table-title">Duplicate Attempt Alert</h3>
            <span class="count-badge">8</span>
          </div>
          <button class="btn-view-all">View All</button>
        </div>

        <div class="table-responsive">
          <table class="alert-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>GATE</th>
                <th>TICKETS</th>
                <th>BUYER</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="alert in duplicateAlerts"
                :key="alert.scanId"
                class="clickable-row"
                @click="viewAlertDetail(alert.scanId)"
              >
                <td class="font-semibold">{{ alert.time }}</td>
                <td class="font-semibold">{{ alert.gate }}</td>
                <td class="font-bold text-dark">{{ alert.ticketId }}</td>
                <td class="font-semibold text-dark">{{ alert.buyer }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="{
                      'status-resolved': alert.status === 'Resolved',
                      'status-needs-review': alert.status === 'Needs Review',
                    }"
                  >
                    {{ alert.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ReportsSalesChart from '~/components/reports/ReportsSalesChart.vue'
import { useReports } from '~/composables/useReports'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { eventsList, duplicateAlerts } = useReports()

const eventId = computed(() => (route.params.id as string) || 'summer-fest-2026')

const eventData = computed(() => {
  return eventsList.find((e) => e.id === eventId.value) || {
    id: eventId.value,
    name: 'Summer Fest 2026',
    date: 'July 20, 2026',
  }
})

useHead({
  title: `Event-day Mode — ${eventData.value.name}`,
})

const gateCapacity = [
  { name: 'Gate A', pct: 82 },
  { name: 'Gate B', pct: 64 },
  { name: 'Gate C', pct: 43 },
  { name: 'Gate D', pct: 32 },
]

function endEventDayMode() {
  toast.info('Event-day mode ended.')
  router.push(`/reports/${eventId.value}`)
}

function viewAlertDetail(scanId: string) {
  router.push(`/reports/${eventId.value}/event-day/${scanId}`)
}
</script>

<style scoped>
.event-day-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.page-heading {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.reports-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  text-decoration: none;
  transition: color 0.15s;
}
.back-link:hover {
  color: #3FD246;
}
.arrow-back {
  width: 1.1rem;
  height: 1.1rem;
}

.event-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.event-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.event-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: #DCFCE7;
  color: #15803D;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.5rem;
  border: 1px solid #BBF7D0;
}

.live-dot {
  font-size: 0.6rem;
  color: #3FD246;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #6B7280;
  font-weight: 500;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  color: #9CA3AF;
}

.btn-end-event-day {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #ffffff;
  color: #EF4444;
  border: 1px solid #FECACA;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-end-event-day:hover {
  background: #FEF2F2;
}

.stop-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #EF4444;
}

/* 4 Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.metric-card {
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #6B7280;
  font-weight: 500;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3FD246;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
}

.gate-capacity-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

}

.chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.gate-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.gate-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.gate-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: #F3F4F6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3FD246;
  border-radius: 9999px;
}

/* Table Section */
.table-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-with-count {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.table-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.65rem;
  background: #FEF2F2;
  color: #EF4444;
  border: 1px solid #FCA5A5;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
}

.btn-view-all {
  padding: 0.35rem 0.85rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.alert-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.alert-table th {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6B7280;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #E5E7EB;
  letter-spacing: 0.05em;
}

.alert-table td {
  padding: 1.15rem 1rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.15s;
}
.clickable-row:hover {
  background: #F9FAFB;
}

.font-bold {
  font-weight: 700;
}
.font-semibold {
  font-weight: 600;
}
.text-dark {
  color: #111827;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.775rem;
  font-weight: 700;
}

.status-resolved {
  background: #DCFCE7;
  color: #15803D;
}

.status-needs-review {
  background: #FEF2F2;
  color: #EF4444;
  border: 1px solid #FCA5A5;
}

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>

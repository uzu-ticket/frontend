<template>
  <div class="reports-detail-page">
    <!-- Main Card Container -->
    <div class="reports-container">

      <!-- Back Link -->
      <NuxtLink to="/reports" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-back" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Sales & Report</span>
      </NuxtLink>

      <!-- Event Header Row -->
      <div class="event-header-row">
        <div class="event-title-group">
          <h2 class="event-name">{{ eventData.name }}</h2>
          <div class="event-meta">
            <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>May 1 – May 31, 2026 - 11:00AM</span>
          </div>
        </div>

        <button class="btn-event-day-mode" @click="goToEventDayMode">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Event-day-mode</span>
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

      <!-- Charts Grid -->
      <div class="charts-grid">
        <div class="chart-left">
          <ReportsSalesChart title="Orders Overtime" period-label="Daily" />
        </div>
        <div class="chart-right">
          <ReportsPieChart />
        </div>
      </div>

      <!-- Top Ticket Types Table -->
      <div class="table-section">
        <h3 class="table-title">Top Ticket Types</h3>

        <div class="table-responsive">
          <table class="ticket-types-table">
            <thead>
              <tr>
                <th>TICKETS</th>
                <th>PRICE</th>
                <th>TICKETS SOLD</th>
                <th>ORDERS</th>
                <th>GROSS REVENUE</th>
                <th>% OF TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ticketTypesList" :key="item.type">
                <td class="font-bold text-dark">{{ item.type }}</td>
                <td class="font-semibold">{{ item.price }}</td>
                <td class="font-semibold">{{ item.ticketsSold.toLocaleString() }}</td>
                <td class="font-semibold">{{ item.orders.toLocaleString() }}</td>
                <td class="font-bold text-dark">{{ item.grossRevenue }}</td>
                <td class="font-semibold text-dark">{{ item.pctOfTotal }}</td>
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
import ReportsPieChart from '~/components/reports/ReportsPieChart.vue'
import { useReports } from '~/composables/useReports'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const { eventsList, ticketTypesList } = useReports()

const eventId = computed(() => (route.params.id as string) || 'summer-fest-2026')

const eventData = computed(() => {
  return eventsList.find((e) => e.id === eventId.value) || {
    id: eventId.value,
    name: 'Summer Fest 2026',
    date: 'July 20, 2026',
  }
})

useHead({
  title: `${eventData.value.name} Reports — Uzu Ticket`,
})

function goToEventDayMode() {
  router.push(`/reports/${eventId.value}/event-day`)
}
</script>

<style scoped>
.reports-detail-page {
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

.event-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
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

.btn-event-day-mode {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.7rem 1.35rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s;
}
.btn-event-day-mode:hover {
  background: #36bd3d;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
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

/* Table Section */
.table-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.table-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.ticket-types-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.ticket-types-table th {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6B7280;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #E5E7EB;
  letter-spacing: 0.05em;
}

.ticket-types-table td {
  padding: 1.15rem 1rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
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

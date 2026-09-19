<template>
  <div class="reports-page">
    <!-- Main Card Container -->
    <div class="reports-container">

      <!-- Section Title & Top Controls Row -->
      <div class="overview-header">
        <h2 class="overview-title">Sales & Reports Overview</h2>

        <div class="top-controls">
          <!-- Date Filter Dropdown -->
          <div class="filter-dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>May 1 – May 31, 2026</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="chevron-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Roles / Scope Dropdown -->
          <div class="filter-dropdown">
            <span>All Roles</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="chevron-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Export CSV Button -->
          <button class="btn-export-csv" @click="openExportModal">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- 4 Metric Cards Row -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Gross Revenue</span>
          <span class="metric-value">₦12,496,780</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 18.6%
          </span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Tickets Sold</span>
          <span class="metric-value">6,842</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 12.4%
          </span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Orders</span>
          <span class="metric-value">2,318</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 14.1%
          </span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Refunds</span>
          <span class="metric-value">₦246,500</span>
          <span class="metric-trend">
            <span class="trend-icon">↑</span> 5.3%
          </span>
        </div>
      </div>

      <!-- Charts Grid (Sales Over Time + Donut Chart) -->
      <div class="charts-grid">
        <div class="chart-left">
          <ReportsSalesChart title="Sales Over Time" period-label="Daily" />
        </div>
        <div class="chart-right">
          <ReportsPieChart />
        </div>
      </div>

      <!-- Event Performance Table -->
      <div class="table-section">
        <h3 class="table-title">Event Performance</h3>

        <div class="table-responsive">
          <table class="performance-table">
            <thead>
              <tr>
                <th>EVENT</th>
                <th>DATE</th>
                <th>TICKETS SOLD</th>
                <th>ORDERS</th>
                <th>GROSS REVENUE</th>
                <th class="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in eventsList" :key="item.id">
                <td class="font-bold text-dark">{{ item.name }}</td>
                <td class="text-muted">{{ item.date }}</td>
                <td class="font-semibold">{{ item.ticketsSold.toLocaleString() }}</td>
                <td class="font-semibold">{{ item.orders.toLocaleString() }}</td>
                <td class="font-bold text-dark">{{ item.grossRevenue }}</td>
                <td class="text-right">
                  <NuxtLink :to="`/reports/${item.id}`" class="btn-view">View</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Export Modal -->
    <ExportSalesReportModal
      v-if="isExportModalOpen"
      @close="closeExportModal"
      @export="handleExportAction"
    />

  </div>
</template>

<script setup lang="ts">
import ReportsSalesChart from '~/components/reports/ReportsSalesChart.vue'
import ReportsPieChart from '~/components/reports/ReportsPieChart.vue'
import ExportSalesReportModal from '~/components/reports/ExportSalesReportModal.vue'
import { useReports } from '~/composables/useReports'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Sales & Reports — Uzu Ticket',
})

const toast = useToast()
const { eventsList, isExportModalOpen, openExportModal, closeExportModal } = useReports()

function handleExportAction(data: any) {
  closeExportModal()
  toast.success('Sales report CSV exported successfully!')
}
</script>

<style scoped>
.reports-page {
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

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.overview-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.top-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.dropdown-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #9CA3AF;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  color: #6B7280;
}

.btn-export-csv {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s;
}
.btn-export-csv:hover {
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

.performance-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.performance-table th {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6B7280;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #E5E7EB;
  letter-spacing: 0.05em;
}

.performance-table td {
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
.text-muted {
  color: #6B7280;
}
.text-right {
  text-align: right;
}

.btn-view {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1.25rem;
  background: #ffffff;
  border: 1px solid #3FD246;
  color: #3FD246;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.15s;
}
.btn-view:hover {
  background: #F0FDF4;
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

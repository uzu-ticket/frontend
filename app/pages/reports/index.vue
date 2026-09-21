<template>
  <div class="reports-page">
    <!-- Main Card Container -->
    <div class="reports-container">
      <!-- Section Title & Top Controls Row -->
      <div class="overview-header">
        <h2 class="overview-title">Sales &amp; Reports Overview</h2>

        <div class="top-controls">
          <!-- Date Range Pill -->
          <button class="date-pill" @click="cycleDateRange">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="pill-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{{ activeDateLabel }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="pill-chevron"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Channel / Role Filter -->
          <AppSelect
            v-model="channel"
            class="report-filter-select"
            :options="channelOptions"
            placeholder="All Roles"
          />

          <!-- Export CSV Button -->
          <button class="btn-export-csv" @click="openExportModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="btn-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- 4 Metric Cards Row -->
      <div class="metrics-grid">
        <!-- Gross Revenue -->
        <div class="metric-card">
          <span class="metric-label">Gross Revenue</span>
          <span class="metric-value">₦{{ grossRevenueFormatted }}</span>
          <span class="metric-trend trend--up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="trend-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            {{ revenueGrowth }}%
          </span>
        </div>

        <!-- Tickets Sold -->
        <div class="metric-card">
          <span class="metric-label">Tickets Sold</span>
          <span class="metric-value">{{
            reportMetrics.ticketsSold.toLocaleString()
          }}</span>
          <span class="metric-trend trend--up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="trend-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            12.4%
          </span>
        </div>

        <!-- Orders -->
        <div class="metric-card">
          <span class="metric-label">Orders</span>
          <span class="metric-value">{{
            reportMetrics.orders.toLocaleString()
          }}</span>
          <span class="metric-trend trend--up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="trend-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            14.1%
          </span>
        </div>

        <!-- Refunds -->
        <div class="metric-card">
          <span class="metric-label">Refunds</span>
          <span class="metric-value">₦{{ refundsFormatted }}</span>
          <span class="metric-trend trend--up">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="trend-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            5.3%
          </span>
        </div>
      </div>

      <!-- Charts Grid (Sales Over Time + Pie Chart) -->
      <div class="charts-grid">
        <div class="chart-left">
          <ReportsSalesChart
            title="Sales Over Time"
            period-label="Daily"
            :data="salesOverTime"
          />
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
              <tr v-for="item in displayedEvents" :key="item.id">
                <td class="font-bold text-dark">{{ item.name }}</td>
                <td class="text-muted">{{ item.date }}</td>
                <td class="font-semibold">
                  {{ item.ticketsSold.toLocaleString() }}
                </td>
                <td class="font-semibold">
                  {{ item.orders.toLocaleString() }}
                </td>
                <td class="font-bold text-dark">{{ item.grossRevenue }}</td>
                <td class="text-right">
                  <NuxtLink :to="`/reports/${item.id}`" class="btn-view"
                    >View</NuxtLink
                  >
                </td>
              </tr>
              <tr v-if="displayedEvents.length === 0">
                <td colspan="6" class="empty-report-cell">
                  <div class="empty-report-state">
                    <span class="empty-report-title">No event sales yet</span>
                    <span class="empty-report-copy"
                      >Paid event performance will appear here.</span
                    >
                  </div>
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
import { computed, onMounted, ref, watch } from "vue";
import AppSelect from "~/components/ui/AppSelect.vue";
import ReportsSalesChart from "~/components/reports/ReportsSalesChart.vue";
import ReportsPieChart from "~/components/reports/ReportsPieChart.vue";
import ExportSalesReportModal from "~/components/reports/ExportSalesReportModal.vue";
import { useReports } from "~/composables/useReports";
import { useOrgState } from "~/composables/useOrgState";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Sales & Reports — Uzu Ticket",
});

const toast = useToast();
const { activeOrgId } = useOrgState();
const {
  eventsList,
  reportMetrics,
  salesOverTime,
  isExportModalOpen,
  openExportModal,
  closeExportModal,
  fetchSalesReport,
  exportSalesReport,
} = useReports();

// ---------- Date range ----------
const dateRangeIndex = ref(0);
const dateRangeOptions = [
  { value: "all", label: "All dates", display: "All Dates" },
  {
    value: "may-2026",
    label: "May 1 – May 31, 2026",
    display: "May 1 – May 31, 2026",
  },
  {
    value: "last-30-days",
    label: "Last 30 days",
    display: "Last 30 days",
  },
  {
    value: "this-month",
    label: "This month",
    display: "This month",
  },
];
const activeDateLabel = computed(
  () => dateRangeOptions[dateRangeIndex.value].display,
);
function cycleDateRange() {
  dateRangeIndex.value = (dateRangeIndex.value + 1) % dateRangeOptions.length;
}

// ---------- Channel filter ----------
const channel = ref("all");
const channelOptions = [
  { value: "all", label: "All Roles" },
  { value: "direct", label: "Direct sales" },
  { value: "promoter", label: "Promoter sales" },
  { value: "embed", label: "Embedded sales" },
  { value: "recommendation", label: "Recommendations" },
  { value: "search", label: "Search" },
];

// ---------- Derived values ----------
const grossRevenueFormatted = computed(() =>
  (Number(reportMetrics.value.grossRevenueMinor) / 100).toLocaleString("en-NG"),
);

const refundsFormatted = computed(() =>
  (Number(reportMetrics.value.refundsMinor) / 100).toLocaleString("en-NG"),
);

const revenueGrowth = computed(() => "18.6");

const displayedEvents = computed(() => eventsList.value);

// ---------- Filters & fetch ----------
const filters = computed(() => {
  const now = new Date();
  let from: Date | undefined;
  const range = dateRangeOptions[dateRangeIndex.value].value;
  if (range === "this-month")
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  if (range === "last-30-days")
    from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from: from?.toISOString(), channel: channel.value };
});

onMounted(() => fetchSalesReport(filters.value));
watch([activeOrgId, dateRangeIndex, channel], () =>
  fetchSalesReport(filters.value),
);

async function handleExportAction() {
  try {
    await exportSalesReport(filters.value);
    closeExportModal();
    toast.success("Sales report CSV exported successfully!");
  } catch (error) {
    toast.error(
      "Sales report export failed",
      error instanceof Error ? error.message : "Unable to export report",
    );
  }
}
</script>

<style scoped>
.reports-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* Main card */
.reports-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Header row */
.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.overview-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.top-controls {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

/* Date pill */
.date-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.45rem;
  padding: 0 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.855rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.date-pill:hover {
  border-color: #3fd246;
}
.pill-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: #6b7280;
  flex-shrink: 0;
}
.pill-chevron {
  width: 0.85rem;
  height: 0.85rem;
  color: #6b7280;
  flex-shrink: 0;
}

/* Constrain the AppSelect to a fixed width and matching height */
.report-filter-select {
  width: 140px;
  flex-shrink: 0;
}
/* Force AppSelect trigger to match pill height */
.report-filter-select :deep(.select-trigger) {
  height: 2.45rem;
  padding-top: 0;
  padding-bottom: 0;
}

/* Export button */
.btn-export-csv {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.45rem;
  padding: 0 1.25rem;
  background: #3fd246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-export-csv:hover {
  background: #36bd3d;
}
.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* 4 Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.metric-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.15;
}

/* Trend badge */
.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 0.1rem;
}
.trend--up {
  color: #16a34a;
}
.trend--down {
  color: #dc2626;
}
.trend-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
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
}

.table-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0e2615;
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
  color: #6b7280;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: 0.05em;
}

.performance-table td {
  padding: 1.1rem 1rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #f3f4f6;
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
  color: #6b7280;
}
.text-right {
  text-align: right;
}

.btn-view {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 1.1rem;
  background: #ffffff;
  border: 1.5px solid #3fd246;
  color: #3fd246;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.15s;
}
.btn-view:hover {
  background: #f0fdf4;
}

/* Empty state */
.empty-report-cell {
  padding: 3rem 1rem !important;
  text-align: center;
}
.empty-report-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.35rem;
  color: #6b7280;
}
.empty-report-title {
  color: #374151;
  font-size: 0.95rem;
  font-weight: 700;
}
.empty-report-copy {
  font-size: 0.85rem;
}

/* Responsive */
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
  .reports-container {
    padding: 1.25rem;
  }
}
</style>

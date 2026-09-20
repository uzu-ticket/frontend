<template>
  <div class="event-day-page">
    <AppPageSkeleton
      v-if="isLoading"
      layout="event"
      :show-actions="true"
      action-count="2"
    />

    <div v-else class="reports-container">
      <!-- Back Link -->
      <NuxtLink :to="`/reports/${eventId}`" class="back-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="arrow-back"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="meta-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{{ eventMetaLabel }}</span>
          </div>
        </div>

        <button class="btn-end-event-day" @click="endEventDayMode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stop-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
              clip-rule="evenodd"
            />
          </svg>
          <span>End Event</span>
        </button>
      </div>

      <!-- 4 Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Gross Revenue</span>
          <span class="metric-value">₦{{ grossRevenueLabel }}</span>
          <span class="metric-trend">Live summary</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Tickets Sold</span>
          <span class="metric-value">{{ totalTicketsSold }}</span>
          <span class="metric-trend">{{ liveThroughput }} scanned in 5m</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Orders</span>
          <span class="metric-value">{{ paidOrderCount }}</span>
          <span class="metric-trend">Paid orders</span>
        </div>

        <div class="metric-card">
          <span class="metric-label">Refunds</span>
          <span class="metric-value">₦{{ refundedRevenueLabel }}</span>
          <span class="metric-trend">Refunds</span>
        </div>
      </div>

      <!-- Live Scan Activity Chart + Gate Capacity Bars Grid -->
      <div class="charts-grid">
        <div class="chart-left">
          <ReportsSalesChart
            title="Live Scan Activity"
            period-label="last 6 hours"
          />
        </div>

        <div class="chart-right gate-capacity-card">
          <h3 class="chart-title">Total Sold by Type</h3>

          <div class="gate-list">
            <div
              v-for="ticket in ticketTypeBreakdown"
              :key="ticket.name"
              class="gate-item"
            >
              <div class="gate-label-row">
                <span class="gate-name">{{ ticket.name }}</span>
                <span class="gate-pct">{{ ticket.pct }}%</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{ width: ticket.pct + '%' }"
                ></div>
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
            <span class="count-badge">{{ alertList.length }}</span>
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
              <tr v-if="alertList.length === 0">
                <td colspan="5" class="empty-state-cell">
                  No duplicate attempts captured for this event yet.
                </td>
              </tr>

              <tr
                v-else
                v-for="alert in alertList"
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
import { computed, onMounted, ref, watch } from "vue";
import AppPageSkeleton from "~/components/ui/AppPageSkeleton.vue";
import ReportsSalesChart from "~/components/reports/ReportsSalesChart.vue";
import { useApi } from "~/composables/useApi";
import { useOrgState } from "~/composables/useOrgState";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { instance } = useApi();
const { activeOrgId } = useOrgState();
const eventSummary = ref<any>(null);
const eventDayMode = ref<any>(null);
const isLoading = ref(true);
const loadError = ref<string | null>(null);

const eventId = computed(
  () => (route.params.id as string) || "summer-fest-2026",
);

const liveThroughput = computed(() =>
  Number(eventDayMode.value?.gateThroughputLast5Min ?? 0),
);

const grossRevenueLabel = computed(() => {
  const value = Number(eventSummary.value?.grossRevenueMinor ?? 0);
  return (value / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

const totalTicketsSold = computed(() => {
  const soldCount = Number(eventDayMode.value?.soldCount ?? 0);
  if (soldCount > 0) return soldCount;

  return (eventSummary.value?.ticketsSoldByType ?? []).reduce(
    (sum: number, item: any) => sum + Number(item.quantitySold ?? 0),
    0,
  );
});

const paidOrderCount = computed(() => {
  return Number(eventSummary.value?.paidOrderCount ?? 0);
});

const refundedRevenueLabel = computed(() => {
  return Number(eventSummary.value?.refundedOrderCount ?? 0).toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );
});

const alertList = computed(() => {
  return (eventDayMode.value?.duplicateAlerts ?? []).map((alert: any) => ({
    scanId: alert.id,
    time: new Date(alert.scannedAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    gate: alert.scannerDevice?.deviceLabel ?? "Gate",
    ticketId: alert.ticketId,
    buyer: "—",
    email: "—",
    phone: "—",
    status: alert.isConflict ? "Needs Review" : "Resolved",
    ticketType: "Ticket",
    scanTime: new Date(alert.scannedAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    scanHistory: [
      {
        time: new Date(alert.scannedAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        gate: alert.scannerDevice?.deviceLabel ?? "Gate",
        device: alert.scannerDevice?.deviceLabel ?? "Device",
        isDuplicate: true,
      },
    ],
  }));
});

const eventData = computed(() => ({
  id: eventId.value,
  name: eventSummary.value?.eventTitle ?? "Event report",
  date: "Live event",
}));

const eventMetaLabel = computed(() => {
  const startsAt = eventSummary.value?.eventStartsAt
    ? new Date(eventSummary.value.eventStartsAt)
    : null;

  const dateText = startsAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(startsAt)
    : "Date unavailable";

  const timeText = startsAt
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(startsAt)
    : "Time unavailable";

  const locationParts = [
    eventSummary.value?.eventVenueName,
    eventSummary.value?.eventVenueAddress,
    eventSummary.value?.eventCity,
    eventSummary.value?.eventState,
    eventSummary.value?.eventCountry,
  ].filter(Boolean);

  const locationText =
    locationParts.length > 0
      ? locationParts.join(" • ")
      : "Location unavailable";

  return `${dateText} • ${timeText} • ${locationText}`;
});

const gateCapacity = computed(() => {
  const soldByType = eventSummary.value?.ticketsSoldByType ?? [];
  const totalSold = soldByType.reduce(
    (sum: number, item: any) => sum + Number(item.quantitySold ?? 0),
    0,
  );

  if (!soldByType.length || totalSold === 0) {
    return [{ name: "No ticket types yet", pct: 0 }];
  }

  return soldByType.slice(0, 4).map((item: any) => ({
    name: item.name,
    pct: Math.max(
      5,
      Math.min(
        100,
        Math.round((Number(item.quantitySold ?? 0) / totalSold) * 100),
      ),
    ),
  }));
});

const ticketTypeBreakdown = computed(() => gateCapacity.value);

async function loadEventDayData() {
  if (!activeOrgId.value) return;

  isLoading.value = true;
  loadError.value = null;

  try {
    const [summaryResponse, liveResponse] = await Promise.all([
      instance.get(
        `/organisations/${activeOrgId.value}/events/${eventId.value}/dashboard`,
      ),
      instance.get(
        `/organisations/${activeOrgId.value}/events/${eventId.value}/dashboard/live`,
      ),
    ]);

    eventSummary.value =
      summaryResponse.data?.data ?? summaryResponse.data ?? null;
    eventDayMode.value = liveResponse.data?.data ?? liveResponse.data ?? null;
  } catch (error: any) {
    console.error("Failed to load event-day mode", error);
    loadError.value =
      error?.response?.data?.message || "Unable to load live event-day data.";
    eventSummary.value = null;
    eventDayMode.value = null;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadEventDayData();
});

watch([activeOrgId, eventId], () => {
  loadEventDayData();
});

useHead({
  title: `Event-day Mode — ${eventData.value.name}`,
});

function endEventDayMode() {
  toast.info("Event-day mode ended.");
  router.push(`/reports/${eventId.value}`);
}

function viewAlertDetail(scanId: string) {
  router.push(`/reports/${eventId.value}/event-day/${scanId}`);
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
  color: #0e2615;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.reports-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
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
  color: #3fd246;
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
  color: #0e2615;
  margin: 0;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: #dcfce7;
  color: #15803d;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.5rem;
  border: 1px solid #bbf7d0;
}

.live-dot {
  font-size: 0.6rem;
  color: #3fd246;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.btn-end-event-day {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #ffffff;
  color: #ef4444;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-end-event-day:hover {
  background: #fef2f2;
}

.stop-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #ef4444;
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
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3fd246;
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
  border: 1px solid #e5e7eb;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0e2615;
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
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3fd246;
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
  color: #0e2615;
  margin: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.65rem;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fca5a5;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
}

.btn-view-all {
  padding: 0.35rem 0.85rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
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
  color: #6b7280;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: 0.05em;
}

.alert-table td {
  padding: 1.15rem 1rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.empty-state-cell {
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;
  font-weight: 600;
  background: #f9fafb;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.15s;
}
.clickable-row:hover {
  background: #f9fafb;
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
  background: #dcfce7;
  color: #15803d;
}

.status-needs-review {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fca5a5;
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

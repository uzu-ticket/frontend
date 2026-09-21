<template>
  <div class="event-scanner-page">
    <AppPageSkeleton
      v-if="isLoading"
      layout="event"
      :show-actions="true"
      action-count="3"
    />

    <div v-else class="scanner-container">
      <!-- Top Navigation Row (Back link & Primary Start Scan CTA) -->
      <div class="top-nav-row">
        <button type="button" class="back-button" @click="goBack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="back-icon"
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
          <span>Back to Scanner Selection</span>
        </button>

        <NuxtLink :to="`/scanner/${eventId}/scan`" class="btn-start-scan">
          <svg
            class="scan-btn-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          Start Scanning
        </NuxtLink>
      </div>

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

      <!-- Scanner Control Hub / Action Cards Grid -->
      <div class="quick-actions-section">
        <h3 class="section-heading">Scanner Management & Controls</h3>
        <div class="action-cards-grid">
          <NuxtLink
            :to="`/scanner/${eventId}/scan`"
            class="action-card action-card--primary"
          >
            <div class="card-icon-wrapper card-icon--green">
              <svg
                class="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div class="card-content">
              <div class="card-title-row">
                <span class="card-title">Live Ticket Scanner</span>
                <span class="card-arrow">&rarr;</span>
              </div>
              <p class="card-desc">
                Scan QR codes in real-time with camera or Bluetooth barcode reader
              </p>
            </div>
          </NuxtLink>

          <NuxtLink :to="`/scanner/${eventId}/activity`" class="action-card">
            <div class="card-icon-wrapper card-icon--blue">
              <svg
                class="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="card-content">
              <div class="card-title-row">
                <span class="card-title">Scan Activity Log</span>
                <span class="card-arrow">&rarr;</span>
              </div>
              <p class="card-desc">
                View live admit records, timestamps & attendee check-in details
              </p>
            </div>
          </NuxtLink>

          <NuxtLink :to="`/scanner/${eventId}/sync`" class="action-card">
            <div class="card-icon-wrapper card-icon--orange">
              <svg
                class="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 014.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div class="card-content">
              <div class="card-title-row">
                <span class="card-title">Offline & Sync</span>
                <span class="card-arrow">&rarr;</span>
              </div>
              <p class="card-desc">
                Manage cached ticket manifests & pending cloud sync queue
              </p>
            </div>
          </NuxtLink>

          <NuxtLink :to="`/scanner/${eventId}/conflicts`" class="action-card">
            <div class="card-icon-wrapper card-icon--red">
              <svg
                class="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="card-content">
              <div class="card-title-row">
                <span class="card-title">Conflict Review</span>
                <span class="card-arrow">&rarr;</span>
              </div>
              <p class="card-desc">
                Inspect duplicate scans, rejected entries & validation alerts
              </p>
            </div>
          </NuxtLink>

          <NuxtLink :to="`/scanner/${eventId}/settings`" class="action-card">
            <div class="card-icon-wrapper card-icon--gray">
              <svg
                class="card-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              </svg>
            </div>
            <div class="card-content">
              <div class="card-title-row">
                <span class="card-title">Scanner Settings</span>
                <span class="card-arrow">&rarr;</span>
              </div>
              <p class="card-desc">
                Configure sound effects, auto-admit, device profile & gate names
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPageSkeleton from "~/components/ui/AppPageSkeleton.vue";
import ScannerEventCard from "~/components/scanner/ScannerEventCard.vue";
import ScannerStatGroup from "~/components/scanner/ScannerStatGroup.vue";
import ScannerDeviceCard from "~/components/scanner/ScannerDeviceCard.vue";
import GateThroughputCard from "~/components/scanner/GateThroughputCard.vue";
import { useScanner } from "~/composables/useScanner";
import { useToast } from "~/composables/useToast";
import { formatEventDate } from "~/types/scanner";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Event Scanner Monitor — Uzu Ticket",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const scannerStore = useScanner();

const eventId = computed(() => route.params.id as string);

function goBack() {
  router.push("/scanner/select");
}

const event = ref({
  id: "",
  title: "",
  dateTime: "",
  location: "",
  imageUrl: "",
  status: "Live",
});

const stats = ref({
  ticketSold: 0,
  scanned: 0,
  valid: 0,
  duplicate: 0,
  invalid: 0,
});

const devices = ref({
  online: 0,
  offline: 0,
});

const throughputGates = ref([]);

const isLoading = ref(true);

onMounted(async () => {
  await loadScannerData();
});

watch(eventId, async () => {
  await loadScannerData();
});

async function loadScannerData() {
  isLoading.value = true;
  try {
    const evt = await scannerStore.fetchEvent(eventId.value);

    let report: any = null;
    let deviceList: any[] = [];
    try {
      report = await scannerStore.fetchIntegrityReport(eventId.value, true);
    } catch (e) {
      console.warn("Integrity report fetch failed:", e);
    }
    try {
      deviceList = await scannerStore.fetchDevices(true);
    } catch (e) {
      console.warn("Device list fetch failed:", e);
    }

    event.value = {
      id: evt.id,
      title: evt.title,
      dateTime: formatEventDate(evt.startsAt),
      location: evt.venueName || evt.city || "",
      imageUrl: evt.images?.[0]?.url || "",
      status: (evt.status as string) === "live" ? "Live" : "Upcoming",
    };

    if (report) {
      stats.value = {
        ticketSold: 0,
        scanned: report.totalScans,
        valid: report.admitted,
        duplicate: Math.floor(report.conflictCount / 2),
        invalid: report.conflictCount - Math.floor(report.conflictCount / 2),
      };
    }

    const now = Date.now();
    const recentThreshold = 5 * 60 * 1000;
    const allDevices = deviceList || [];
    devices.value = {
      online: allDevices.filter(
        (d) =>
          d.lastSyncedAt &&
          now - new Date(d.lastSyncedAt).getTime() < recentThreshold,
      ).length,
      offline: allDevices.filter(
        (d) =>
          !d.lastSyncedAt ||
          now - new Date(d.lastSyncedAt).getTime() >= recentThreshold,
      ).length,
    };
  } catch (e: any) {
    console.error("Scanner monitor load error:", e?.message || e, e);
    toast.show({
      title: "Failed to load scanner data",
      message:
        e?.message || "Could not load scanner monitor data for this event",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.event-scanner-page {
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
}

.scanner-container {
  background: #ffffff;
  border: 1px solid #eef2ee;
  border-radius: 1.25rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

/* Top Nav Row */
.top-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: color 0.15s ease;
}

.back-button:hover {
  color: #16a34a;
}

.back-icon {
  width: 1.05rem;
  height: 1.05rem;
}

.btn-start-scan {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  border-radius: 0.75rem;
  background: #3fd246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.btn-start-scan:hover {
  background: #2bb832;
  box-shadow: 0 6px 18px rgba(63, 210, 70, 0.35);
  transform: translateY(-1px);
}

.scan-btn-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.event-banner-wrapper {
  width: 100%;
}

/* Metrics 2-column grid */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
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

/* Quick Actions Section & Cards */
.quick-actions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.action-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1024px) {
  .action-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .action-cards-grid {
    grid-template-columns: 1fr;
  }
}

.action-card {
  background: #fafdfa;
  border: 1px solid #eef2ee;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: #3fd246;
  box-shadow: 0 8px 24px rgba(63, 210, 70, 0.1);
  background: #ffffff;
}

.action-card--primary {
  background: #f0fdf4;
  border-color: rgba(63, 210, 70, 0.4);
}

.card-icon-wrapper {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.card-icon--green {
  background: #dcfce7;
  color: #16a34a;
}

.card-icon--blue {
  background: #eff6ff;
  color: #2563eb;
}

.card-icon--orange {
  background: #fff7ed;
  color: #ea580c;
}

.card-icon--red {
  background: #fef2f2;
  color: #dc2626;
}

.card-icon--gray {
  background: #f3f4f6;
  color: #4b5563;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
}

.card-arrow {
  font-size: 1.1rem;
  color: #3fd246;
  transition: transform 0.15s ease;
}

.action-card:hover .card-arrow {
  transform: translateX(4px);
}

.card-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.35;
}
</style>

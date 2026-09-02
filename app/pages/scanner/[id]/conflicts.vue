<template>
  <div class="conflict-review-page">
    <!-- Main Container Card -->
    <div class="conflict-container">
      <!-- Back Link -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Conflict Review</h2>
        <p class="section-subtitle">{{ eventName }}</p>
      </div>

      <!-- Offline Scan Conflict Detected Alert Box -->
      <div class="conflict-alert-box">
        <div class="alert-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="alert-text-content">
          <h4 class="alert-title">Offline Scan Conflict Detected</h4>
          <p class="alert-description">First scan min. Review the conflict details below</p>
        </div>
      </div>

      <!-- Ticket & Attendee Meta Row -->
      <div class="conflict-meta-row">
        <div class="meta-col">
          <span class="meta-label">Ticket</span>
          <span class="meta-value font-mono font-bold">{{ activeConflict.ticketId }}</span>
        </div>

        <div class="meta-col meta-col--right">
          <span class="meta-label">Attendee</span>
          <div class="attendee-name-badge">
            <span class="meta-value font-bold">{{ activeConflict.attendeeName }}</span>
            <span class="badge-vip">{{ activeConflict.ticketType }}</span>
          </div>
        </div>
      </div>

      <!-- First Scan Card (Accepted - Green Card) -->
      <div class="scan-card scan-card--first">
        <h3 class="scan-card-header text-green-600 font-bold">First Scan (Accepted)</h3>

        <div class="scan-details-stack">
          <div class="detail-row">
            <span class="detail-label">Time</span>
            <span class="detail-value">{{ activeConflict.firstScan.time }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Gate/device</span>
            <span class="detail-value">{{ activeConflict.firstScan.device }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value text-green-600 font-bold">{{ activeConflict.firstScan.status }}</span>
          </div>
        </div>
      </div>

      <!-- Second Scan Card (Flagged - Red Card) -->
      <div class="scan-card scan-card--second">
        <h3 class="scan-card-header text-red-600 font-bold">Second Scan (Flagged)</h3>

        <div class="scan-details-stack">
          <div class="detail-row">
            <span class="detail-label">Time</span>
            <span class="detail-value">{{ activeConflict.secondScan.time }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Gate/device</span>
            <span class="detail-value">{{ activeConflict.secondScan.device }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value text-red-600 font-bold">{{ activeConflict.secondScan.status }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Right Action Button -->
      <div class="page-footer-actions">
        <button type="button" class="btn-mark-reviewed" @click="handleMarkReviewed">
          Mark as Reviewed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScanner } from '~/composables/useScanner'
import { useToast } from '~/composables/useToast'
import { formatDateTime } from '~/types/scanner'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Conflict Review — Ticket Scanner',
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
const activeConflict = ref({
  ticketId: '',
  attendeeName: '',
  ticketType: '',
  firstScan: {
    time: '',
    device: '',
    status: '',
  },
  secondScan: {
    time: '',
    device: '',
    status: '',
  },
  reason: '',
  firstScannedAt: '',
  firstScannedBy: '',
  gate: '',
  scanner: '',
  scannedAt: '',
})

onMounted(async () => {
  await loadConflictData()
})

watch(eventId, async () => {
  await loadConflictData()
})

async function loadConflictData() {
  try {
    const [evt, report] = await Promise.all([
      scannerStore.fetchEvent(eventId.value),
      scannerStore.fetchIntegrityReport(eventId.value, true),
    ])

    eventName.value = evt.title

    if (report.conflicts.length > 0) {
      const conflict = report.conflicts[0]
      const deviceLabel = conflict.scannerDevice?.deviceLabel || conflict.scannerDeviceId
      const reasonMap: Record<string, string> = {
        duplicate: 'Ticket already used',
        invalid: 'Ticket is invalid',
        wrong_event: 'Wrong event',
        admitted: 'Already admitted',
      }

      activeConflict.value = {
        ticketId: conflict.ticket?.id || conflict.id,
        attendeeName: conflict.ticket?.recipientName || 'Unknown',
        ticketType: conflict.ticket?.ticketTypeId || '',
        firstScan: {
          time: formatDateTime(conflict.scannedAt) || 'Sept 20, 2026 - 9:46 AM',
          device: deviceLabel || '',
          status: 'Accepted',
        },
        secondScan: {
          time: formatDateTime(conflict.scannedAt) || 'Sept 20, 2026 - 9:46 AM',
          device: deviceLabel || '',
          status: 'Flagged',
        },
        reason: reasonMap[conflict.result] || conflict.result,
        firstScannedAt: formatDateTime(conflict.scannedAt) || '',
        firstScannedBy: conflict.scannedBy || deviceLabel || '',
        gate: deviceLabel || '',
        scanner: deviceLabel || '',
        scannedAt: formatDateTime(conflict.scannedAt) || '',
      }
    }
  } catch (e) {
    toast.show({
      title: 'Failed to load conflict data',
      message: 'Could not load conflict review data for this event',
      type: 'error',
    })
  }
}

function handleMarkReviewed() {
  toast.show({
    title: 'Conflict Marked as Reviewed',
    message: `${activeConflict.value.ticketId} has been marked as reviewed`,
    type: 'success',
  })
  goBack()
}
</script>

<style scoped>
.conflict-review-page {
  max-width: 1200px;
  margin: 0 auto;
}

.conflict-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Conflict Alert Banner */
.conflict-alert-box {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.alert-icon-wrapper {
  margin-top: 0.1rem;
}

.alert-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #D97706;
}

.alert-text-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.alert-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #C2410C;
  margin: 0;
}

.alert-description {
  font-size: 0.825rem;
  font-weight: 600;
  color: #D97706;
  margin: 0;
}

/* Meta Row */
.conflict-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.5rem 0.25rem;
}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4B5563;
}

.meta-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
}

.attendee-name-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-vip {
  background: #DCFCE7;
  color: #16A34A;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

/* Scan Cards */
.scan-card {
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.scan-card--first {
  background: #F0FDF4;
  border: 1px solid #DCFCE7;
}

.scan-card--second {
  background: #FEF2F2;
  border: 1px solid #FEE2E2;
}

.scan-card-header {
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
}

.scan-details-stack {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4B5563;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

/* Page Footer Actions */
.page-footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-mark-reviewed {
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.btn-mark-reviewed:hover {
  background: #34c03b;
  transform: translateY(-1px);
}
</style>

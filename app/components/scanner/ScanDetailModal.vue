<template>
  <AppModal
    :model-value="modelValue"
    size="md"
    :closable="true"
    :no-padding="true"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="scan" class="scan-detail-modal-body">
      <!-- Status Icon & Title -->
      <div class="status-header">
        <div class="icon-ring" :class="isValid ? 'icon-ring--valid' : 'icon-ring--invalid'">
          <div class="icon-circle" :class="isValid ? 'icon-circle--valid' : 'icon-circle--invalid'">
            <svg
              v-if="isValid"
              xmlns="http://www.w3.org/2000/svg"
              class="status-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="status-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h2 class="status-title" :class="isValid ? 'status-title--valid' : 'status-title--invalid'">
          {{ isValid ? 'Valid Ticket' : 'InValid Ticket' }}
        </h2>
        <p class="status-subtitle">
          {{ isValid ? 'Entry allowed' : 'Entry denied' }}
        </p>
      </div>

      <!-- VALID TICKET CONTENT -->
      <template v-if="isValid">
        <!-- Attendee Box Card -->
        <div class="attendee-card">
          <div class="attendee-avatar">
            {{ initials }}
          </div>
          <div class="attendee-info">
            <span class="attendee-name">{{ scan.name }}</span>
            <span class="attendee-email">{{ scan.email }}</span>
          </div>
          <span class="ticket-type-badge">
            {{ scan.purchased || scan.ticketType || 'VIP Access' }}
          </span>
        </div>

        <!-- Details Key-Value List -->
        <div class="details-list">
          <div class="detail-row">
            <span class="detail-label">Ticket ID</span>
            <span class="detail-value font-mono">{{ scan.ticketId || '#UZT-B2HA-H7D9' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Ticket Type</span>
            <span class="detail-value font-mono">{{ scan.orderId || '#ORD-39281' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Purchased</span>
            <span class="detail-value uppercase">{{ scan.purchased || scan.ticketType || 'VIP ACCESS' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Order ID</span>
            <span class="detail-value">{{ scan.orderDate || 'Sept 12, 2026 - 9:46 AM' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Scanned At</span>
            <span class="detail-value">{{ scan.scannedAt || 'Sept 20, 2026 - 9:46 AM' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Gate</span>
            <span class="detail-value">{{ scan.gate || 'Gate C' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Scanner</span>
            <span class="detail-value">{{ scan.scanner || 'Scanner 01' }}</span>
          </div>
        </div>
      </template>

      <!-- INVALID TICKET CONTENT (Matching Image 2) -->
      <template v-else>
        <!-- Red Bordered Reason Box -->
        <div class="invalid-reason-box">
          <span class="reason-header-title">Reason</span>
          <span class="reason-error-text">{{ scan.reason || 'Ticket already used' }}</span>

          <div class="reason-details-stack">
            <div class="detail-row">
              <span class="detail-label">First Scanned At</span>
              <span class="detail-value">{{ scan.firstScannedAt || 'Sept 12, 2026 - 9:46 AM' }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">First Scanned At</span>
              <span class="detail-value">{{ scan.firstScannedBy || scan.name || 'Divine Emmanuel' }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Gate</span>
              <span class="detail-value">{{ scan.gate || 'Gate C' }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Scanner</span>
              <span class="detail-value">{{ scan.scanner || 'Scanner 01' }}</span>
            </div>
          </div>
        </div>

        <!-- Outside Detail Row -->
        <div class="details-list invalid-bottom-list">
          <div class="detail-row">
            <span class="detail-label">Scanned At</span>
            <span class="detail-value">{{ scan.scannedAt || 'Sept 12, 2026 - 9:46 AM' }}</span>
          </div>
        </div>
      </template>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppModal from '~/components/AppModal.vue'
import type { ScanItem } from './LiveScanActivityItem.vue'

interface ScanDetailProps extends ScanItem {
  orderDate?: string
  reason?: string
  firstScannedAt?: string
  firstScannedBy?: string
}

const props = defineProps<{
  modelValue: boolean
  scan: ScanDetailProps | null
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isValid = computed(() => props.scan?.status.toLowerCase() === 'valid')

const initials = computed(() => {
  if (!props.scan?.name) return 'DE'
  const parts = props.scan.name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return props.scan.name.substring(0, 2).toUpperCase()
})
</script>

<style scoped>
.scan-detail-modal-body {
  padding: 2rem 2.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Status Header */
.status-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.75rem;
  text-align: center;
}

.icon-ring {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.icon-ring--valid {
  background: #DCFCE7;
}

.icon-ring--invalid {
  background: #FEE2E2;
}

.icon-circle {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.icon-circle--valid {
  background: #3FD246;
}

.icon-circle--invalid {
  background: #EF4444;
}

.status-svg {
  width: 2rem;
  height: 2rem;
}

.status-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
}

.status-title--valid {
  color: #16A34A;
}

.status-title--invalid {
  color: #DC2626;
}

.status-subtitle {
  font-size: 0.95rem;
  font-weight: 700;
  color: #4B5563;
  margin: 0;
}

/* Attendee Card */
.attendee-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.875rem;
  padding: 1.15rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.attendee-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: #2563EB;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.attendee-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.attendee-name {
  font-size: 0.925rem;
  font-weight: 800;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attendee-email {
  font-size: 0.775rem;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-type-badge {
  background: #DCFCE7;
  color: #16A34A;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
}

/* Invalid Reason Box */
.invalid-reason-box {
  width: 100%;
  background: #ffffff;
  border: 1px solid #FEE2E2;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.reason-header-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.35rem;
}

.reason-error-text {
  font-size: 0.875rem;
  font-weight: 800;
  color: #EF4444;
  margin-bottom: 1.75rem;
}

.reason-details-stack {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

/* Details Key Value List */
.details-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.invalid-bottom-list {
  border-top: 1px solid #F3F4F6;
  padding-top: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4B5563;
}

.detail-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  text-align: right;
}
</style>

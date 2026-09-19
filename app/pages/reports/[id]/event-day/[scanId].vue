<template>
  <div class="duplicate-detail-page">
    <!-- Main Container Card -->
    <div class="reports-container">

      <!-- Back Link -->
      <NuxtLink :to="`/reports/${eventId}/event-day`" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-back" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Event-day Mode</span>
      </NuxtLink>

      <!-- Red Alert Banner -->
      <div
        class="alert-banner"
        :class="{ 'alert-banner--resolved': currentAlert.status === 'Resolved' }"
      >
        <div class="alert-banner-left">
          <div class="alert-icon-shell">
            <svg xmlns="http://www.w3.org/2000/svg" class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="alert-text-block">
            <h3 class="alert-heading">
              {{ currentAlert.status === 'Resolved' ? 'Duplicate Attempt Resolved' : 'Duplicate Attempt Detected' }}
            </h3>
            <p class="alert-subheading">This ticket has already been scanned at another gate or device.</p>
          </div>
        </div>

        <span
          class="alert-status-badge"
          :class="{
            'badge-needs-review': currentAlert.status === 'Needs Review',
            'badge-resolved': currentAlert.status === 'Resolved',
          }"
        >
          {{ currentAlert.status }}
        </span>
      </div>

      <!-- Ticket Meta Info Card -->
      <div class="ticket-meta-card">
        <div class="meta-col meta-col-left">
          <span class="meta-label">Ticket ID</span>
          <div class="ticket-id-row">
            <span class="ticket-id-text">{{ currentAlert.ticketId }}</span>
            <span class="ticket-tag">{{ currentAlert.ticketType }}</span>
          </div>
        </div>

        <div class="meta-col">
          <div class="meta-subitem">
            <span class="meta-label">Event</span>
            <span class="meta-val font-bold">Summer Fest 2026</span>
          </div>
          <div class="meta-subitem">
            <span class="meta-label">Ticket</span>
            <span class="meta-val font-bold">{{ currentAlert.ticketType }}</span>
          </div>
        </div>

        <div class="meta-col">
          <div class="meta-subitem">
            <span class="meta-label">Scan Time</span>
            <span class="meta-val">{{ currentAlert.scanTime }}</span>
          </div>
          <div class="meta-subitem">
            <span class="meta-label">Gate</span>
            <span class="meta-val font-bold">{{ currentAlert.gate }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Info Grid (Buyer Information + Scan History) -->
      <div class="bottom-grid">

        <!-- Buyer Information Card -->
        <div class="info-card">
          <h3 class="card-title">Buyer Information</h3>

          <div class="buyer-profile">
            <div class="buyer-avatar">
              <img src="/uzu-logo.png" alt="Buyer Avatar" class="avatar-img" />
            </div>

            <div class="buyer-details">
              <span class="buyer-name">{{ currentAlert.buyer }}</span>
              <span class="buyer-meta">{{ currentAlert.email }}</span>
              <span class="buyer-meta">{{ currentAlert.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Scan History Timeline Card -->
        <div class="info-card">
          <h3 class="card-title">Scan History</h3>

          <div class="timeline-list">
            <div
              v-for="(item, idx) in currentAlert.scanHistory"
              :key="idx"
              class="timeline-item"
            >
              <div class="timeline-node" :class="{ 'node-dup': item.isDuplicate }"></div>
              <div class="timeline-content">
                <span class="timeline-time">{{ item.time }} - {{ item.gate }}</span>
                <span
                  class="timeline-desc"
                  :class="{ 'text-red': item.isDuplicate }"
                >
                  {{ item.isDuplicate ? 'Duplicate attempt' : `Scanned (${item.device})` }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Action Buttons Row -->
      <div class="footer-actions">
        <button class="btn-ticket-details" @click="viewFullTicketDetails">View full ticket details</button>
        <button
          v-if="currentAlert.status === 'Needs Review'"
          class="btn-resolve"
          @click="resolveAlert"
        >
          Mark as resolved
        </button>
        <button
          v-else
          class="btn-resolved-disabled"
          disabled
        >
          ✓ Resolved
        </button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReports } from '~/composables/useReports'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const toast = useToast()
const { duplicateAlerts, markAlertResolved } = useReports()

const eventId = computed(() => (route.params.id as string) || 'summer-fest-2026')
const scanId = computed(() => (route.params.scanId as string) || 'scan-1')

const currentAlert = computed(() => {
  return duplicateAlerts.value.find((a) => a.scanId === scanId.value) || duplicateAlerts.value[0]
})

useHead({
  title: `Duplicate Scan — ${currentAlert.value.ticketId}`,
})

function viewFullTicketDetails() {
  toast.info(`Viewing full details for ticket ${currentAlert.value.ticketId}`)
}

function resolveAlert() {
  markAlertResolved(currentAlert.value.scanId)
  toast.success(`Duplicate alert for ${currentAlert.value.ticketId} marked as resolved!`)
}
</script>

<style scoped>
.duplicate-detail-page {
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

/* Alert Banner */
.alert-banner {
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.alert-banner--resolved {
  background: #F0FDF4;
  border-color: #86EFAC;
}

.alert-banner-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.alert-icon-shell {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: #EF4444;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-banner--resolved .alert-icon-shell {
  background: #3FD246;
}

.alert-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.alert-text-block {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.alert-heading {
  font-size: 1.1rem;
  font-weight: 800;
  color: #DC2626;
  margin: 0;
}

.alert-banner--resolved .alert-heading {
  color: #15803D;
}

.alert-subheading {
  font-size: 0.85rem;
  color: #4B5563;
  margin: 0;
}

.alert-status-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.badge-needs-review {
  background: #ffffff;
  color: #EF4444;
  border: 1px solid #FCA5A5;
}

.badge-resolved {
  background: #DCFCE7;
  color: #15803D;
  border: 1px solid #86EFAC;
}

/* Ticket Meta Info Card */
.ticket-meta-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem 1.75rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 1.5rem;

}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meta-col-left {
  border-right: 1px solid #F3F4F6;
  padding-right: 1.5rem;
}

.meta-label {
  font-size: 0.8rem;
  color: #6B7280;
  font-weight: 500;
}

.ticket-id-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ticket-id-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.ticket-tag {
  padding: 0.2rem 0.65rem;
  background: #FFF7ED;
  color: #C2410C;
  border: 1px solid #FFEDD5;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.375rem;
}

.meta-subitem {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.meta-val {
  font-size: 0.95rem;
  color: #111827;
}

.font-bold {
  font-weight: 700;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.buyer-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.buyer-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  overflow: hidden;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buyer-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.buyer-name {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.buyer-meta {
  font-size: 0.85rem;
  color: #6B7280;
}

/* Scan History Timeline */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  padding-left: 0.5rem;
}

.timeline-list::before {
  content: '';
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 0.95rem;
  width: 2px;
  background: #E5E7EB;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.timeline-node {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #374151;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.timeline-node.node-dup {
  border-color: #EF4444;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.timeline-time {
  font-size: 0.9rem;
  font-weight: 800;
  color: #111827;
}

.timeline-desc {
  font-size: 0.85rem;
  color: #6B7280;
}

.text-red {
  color: #EF4444;
  font-weight: 700;
}

/* Footer Actions */
.footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-ticket-details {
  padding: 0.8rem 1.35rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-ticket-details:hover {
  background: #F9FAFB;
}

.btn-resolve {
  padding: 0.8rem 1.5rem;
  background: #3FD246;
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s;
}
.btn-resolve:hover {
  background: #36bd3d;
}

.btn-resolved-disabled {
  padding: 0.8rem 1.5rem;
  background: #DCFCE7;
  color: #15803D;
  border: 1px solid #86EFAC;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: default;
}

@media (max-width: 900px) {
  .ticket-meta-card {
    grid-template-columns: 1fr;
  }
  .meta-col-left {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #F3F4F6;
    padding-bottom: 1rem;
  }
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>

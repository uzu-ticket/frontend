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

      <!-- Table Section -->
      <div class="conflict-table-wrapper">
        <div class="table-headers">
          <span class="th-cell">Ticket</span>
          <span class="th-cell">Attendee</span>
        </div>

        <div class="table-rows-container">
          <div v-for="item in conflictItems" :key="item.id" class="conflict-row">
            <div class="ticket-cell">
              <span class="ticket-id-text">{{ item.ticketId }}</span>
              <span class="ticket-type-text">{{ item.ticketType }}</span>
            </div>

            <div class="attendee-cell">
              <span class="attendee-name-text">{{ item.attendeeName }}</span>
              <span class="attendee-email-text">{{ item.attendeeEmail }}</span>
            </div>
          </div>

          <div v-if="conflictItems.length === 0" class="empty-conflicts">
            No unresolved conflicts found.
          </div>
        </div>
      </div>

      <!-- Bottom Right Action Button -->
      <div class="page-footer-actions">
        <button type="button" class="btn-sync-now" @click="handleSync">
          <span>Sync Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="refresh-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 04.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Conflict Review — Ticket Scanner',
})

const route = useRoute()
const router = useRouter()

const eventId = computed(() => (route.params.id as string) || '1')

function goBack() {
  router.push(`/scanner/${eventId.value}`)
}

const eventName = ref('Summer Tech Growth Summit')

const conflictItems = ref([
  {
    id: 'c1',
    ticketId: '#UZT-B2HA-H7D9',
    ticketType: 'VIP Access',
    attendeeName: 'Divine Emmanuel',
    attendeeEmail: 'divineemmanuel777@gmail.com',
  },
  {
    id: 'c2',
    ticketId: '#UZT-C4K1-P9A2',
    ticketType: 'Regular',
    attendeeName: 'Paschal Ugo',
    attendeeEmail: 'gracepeter@gmail.com',
  },
])

function handleSync() {
  alert('Sync and conflict resolution triggered successfully!')
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
  gap: 1.75rem;
  position: relative;
  min-height: 500px;
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
  color: #B45309;
  margin: 0;
}

.alert-description {
  font-size: 0.825rem;
  font-weight: 600;
  color: #D97706;
  margin: 0;
}

/* Table Section */
.conflict-table-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
}

.table-headers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.75rem 1rem;
}

.th-cell {
  font-size: 0.85rem;
  font-weight: 800;
  color: #374151;
}

.table-rows-container {
  display: flex;
  flex-direction: column;
}

.conflict-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #F3F4F6;
  align-items: center;
}

.conflict-row:last-child {
  border-bottom: none;
}

.ticket-cell, .attendee-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ticket-id-text, .attendee-name-text {
  font-size: 0.875rem;
  font-weight: 800;
  color: #111827;
}

.ticket-type-text, .attendee-email-text {
  font-size: 0.775rem;
  color: #6B7280;
}

.empty-conflicts {
  padding: 3rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #9CA3AF;
  font-weight: 600;
}

/* Page Footer Actions */
.page-footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 1rem;
}

.btn-sync-now {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.7rem 1.4rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.btn-sync-now:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.refresh-icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

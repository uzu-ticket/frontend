<template>
  <div class="ticket-detail-page">
    <!-- Back -->
    <div class="back-row">
      <button type="button" class="back-link" @click="$router.back()">
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>

    <!-- Ticket Header -->
    <div class="ticket-header-card">
      <div class="ticket-header-left">
        <div class="ticket-number-row">
          <h1 class="ticket-number">{{ ticket.ticketNumber }}</h1>
          <span class="ticket-subtype">{{ ticket.ticketType }}</span>
          <span class="sent-badge">{{ ticket.status }}</span>
        </div>
      </div>
      <div class="ticket-header-right">
        <span class="order-id-label">Order ID</span>
        <div class="order-id-value">{{ ticket.orderId }}</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="ticket-content-grid">
      <!-- Left: Ticket Information + Recipient -->
      <div class="ticket-left-col">
        <!-- Ticket Information -->
        <div class="info-card">
          <h2 class="info-title">Ticket Information</h2>
          <div class="info-fields">
            <div class="info-row">
              <span class="info-label">Ticket Type</span>
              <span class="info-value">{{ ticket.ticketInfo.type }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Purchased At</span>
              <span class="info-value">{{ ticket.ticketInfo.purchasedAt }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status</span>
              <span class="info-value">{{ ticket.ticketInfo.status }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Scanned At</span>
              <span class="info-value">{{ ticket.ticketInfo.scannedAt }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Gate</span>
              <span class="info-value">{{ ticket.ticketInfo.gate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Scanner</span>
              <span class="info-value">{{ ticket.ticketInfo.scanner }}</span>
            </div>
          </div>
        </div>

        <!-- Recipient -->
        <div class="info-card">
          <h2 class="info-title">Recipient</h2>
          <div class="info-fields">
            <div class="info-row">
              <span class="info-label">Name</span>
              <span class="info-value">{{ ticket.recipient.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ ticket.recipient.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ ticket.recipient.phone }}</span>
            </div>
          </div>

          <div class="resend-row">
            <button type="button" class="btn-resend" @click="resendTicket">
              Resend Ticket
            </button>
          </div>
        </div>
      </div>

      <!-- Right: QR Card -->
      <div class="ticket-right-col">
        <div class="qr-card">
          <div class="qr-event-name">{{ ticket.event.name }}</div>
          <div class="qr-event-meta">
            {{ ticket.event.date }}
            <span class="meta-bullet">•</span>
            {{ ticket.event.time }}
          </div>
          <div class="qr-event-venue">{{ ticket.event.venue }}</div>

          <!-- QR Code -->
          <div class="qr-code-wrapper">
            <svg viewBox="0 0 100 100" class="qr-svg" xmlns="http://www.w3.org/2000/svg">
              <!-- Top-left finder pattern -->
              <rect x="10" y="10" width="25" height="25" fill="#111827" rx="2"/>
              <rect x="14" y="14" width="17" height="17" fill="white" rx="1"/>
              <rect x="18" y="18" width="9" height="9" fill="#111827" rx="1"/>
              <!-- Top-right finder pattern -->
              <rect x="65" y="10" width="25" height="25" fill="#111827" rx="2"/>
              <rect x="69" y="14" width="17" height="17" fill="white" rx="1"/>
              <rect x="73" y="18" width="9" height="9" fill="#111827" rx="1"/>
              <!-- Bottom-left finder pattern -->
              <rect x="10" y="65" width="25" height="25" fill="#111827" rx="2"/>
              <rect x="14" y="69" width="17" height="17" fill="white" rx="1"/>
              <rect x="18" y="73" width="9" height="9" fill="#111827" rx="1"/>
              <!-- Data modules (simulated) -->
              <rect x="40" y="10" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="48" y="10" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="10" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="18" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="18" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="26" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="48" y="26" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="10" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="18" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="26" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="48" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="64" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="72" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="80" y="40" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="10" y="48" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="26" y="48" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="48" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="48" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="72" y="48" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="80" y="48" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="10" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="18" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="26" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="48" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="64" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="72" y="56" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="65" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="48" y="65" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="65" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="64" y="65" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="72" y="65" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="80" y="65" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="73" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="56" y="73" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="80" y="73" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="40" y="80" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="48" y="80" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="64" y="80" width="5" height="5" fill="#111827" rx="1"/>
              <rect x="72" y="80" width="5" height="5" fill="#111827" rx="1"/>
            </svg>
          </div>

          <div class="qr-ticket-id-label">Ticket ID</div>
          <div class="qr-ticket-id-value">{{ ticket.ticketId }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import type { CustomerTicket } from '~/types/customers'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Ticket Detail — Customers — Uzu Ticket',
  meta: [
    { name: 'description', content: 'View ticket details for this customer.' },
  ],
})

const route = useRoute()
const toast = useToast()

// Mock data - in production fetched by route.params.ticketId
const ticket = ref<CustomerTicket>({
  id: 'tkt-1',
  ticketNumber: 'Ticket #1',
  ticketType: 'VIP Access',
  status: 'Sent',
  orderId: '#ORD-39261',
  ticketInfo: {
    type: 'Regular',
    purchasedAt: 'Sept 12, 2026 - 9:46 AM',
    status: 'Valid',
    scannedAt: 'Sept 20, 2026 - 9:46 AM',
    gate: 'Gate C',
    scanner: 'Scanner 01',
  },
  event: {
    name: 'Summer Tech Camp',
    date: 'Dec 24, 2026',
    time: '4:00 PM',
    venue: 'Echo Convention Centre, Lagos',
  },
  ticketId: '#UZT-B2XA-HTD9',
  recipient: {
    name: 'Divine Emmanuel',
    email: 'divineemma@gmail.com',
    phone: '+2348023424532',
  },
})

function resendTicket() {
  toast.show({
    title: 'Ticket Resent',
    message: `Ticket resent to ${ticket.value.recipient.email}`,
    type: 'success',
  })
}
</script>

<style scoped>
.ticket-detail-page {
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Back row */
.back-row {
  margin-bottom: 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  gap: 0.25rem;
  transition: color 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.back-link:hover {
  color: #0E2615;
}

/* Ticket header */
.ticket-header-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.ticket-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ticket-number-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ticket-number {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.ticket-subtype {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.sent-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: #f0fdf4;
  color: #16a34a;
}

.ticket-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.order-id-label {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 500;
}

.order-id-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
}

/* Content grid */
.ticket-content-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.25rem;
  align-items: start;
}

/* Left column */
.ticket-left-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.75rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.info-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
}

.info-fields {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 0.85rem 0;
  border-bottom: 1px solid #f9fafb;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 160px;
  flex-shrink: 0;
  font-size: 0.85rem;
  color: #9ca3af;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #0E2615;
  font-weight: 600;
}

.resend-row {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-resend {
  padding: 0.65rem 1.75rem;
  border-radius: 0.65rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-resend:hover {
  border-color: #3FD246;
  color: #16a34a;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.1);
}

/* Right column — QR Card */
.ticket-right-col {
  position: sticky;
  top: 1.5rem;
}

.qr-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.qr-event-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
}

.qr-event-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.meta-bullet {
  color: #d1d5db;
}

.qr-event-venue {
  font-size: 0.78rem;
  color: #9ca3af;
}

.qr-code-wrapper {
  width: 160px;
  height: 160px;
  margin: 1rem 0;
}

.qr-svg {
  width: 100%;
  height: 100%;
}

.qr-ticket-id-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.qr-ticket-id-value {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
}

@media (max-width: 900px) {
  .ticket-content-grid {
    grid-template-columns: 1fr;
  }
  .ticket-right-col {
    position: static;
    order: -1;
  }
}
</style>

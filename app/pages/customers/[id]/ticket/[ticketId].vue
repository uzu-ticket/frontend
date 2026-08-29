<template>
  <div class="ticket-detail-page">
    <!-- Single unified card -->
    <div class="main-card">

      <!-- Header section -->
      <div class="ticket-header">
        <div class="back-row">
          <button type="button" class="back-link" @click="$router.back()">
            <svg class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div class="ticket-header-content">
          <div class="ticket-header-left">
            <div class="ticket-title-row">
              <h1 class="ticket-number">{{ ticket.ticketNumber }}</h1>
              <span class="sent-badge">{{ ticket.status }}</span>
            </div>
            <div class="ticket-subtype">{{ ticket.ticketType }}</div>
          </div>
          <div class="ticket-order-id">
            <span class="order-id-label">Order ID</span>
            <div class="order-id-value">{{ ticket.orderId }}</div>
          </div>
        </div>
      </div>

      <!-- Body: two-column layout, border-separated from header -->
      <div class="ticket-body">

        <!-- Left column: Ticket Info + Recipient -->
        <div class="ticket-left">

          <!-- Ticket Information section -->
          <div class="info-section">
            <h2 class="section-title">Ticket Information</h2>
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

          <!-- Recipient section — border-separated within the same card -->
          <div class="info-section info-section--bordered">
            <h2 class="section-title">Recipient</h2>
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
              <button type="button" class="btn-resend" @click="openResendModal">
                Resend Ticket
              </button>
            </div>
          </div>
        </div>

        <!-- Right column: QR code box -->
        <div class="ticket-right">
          <div class="qr-box">
            <div class="qr-event-name">{{ ticket.event.name }}</div>
            <div class="qr-event-meta">
              {{ ticket.event.date }}
              <span class="meta-bullet">•</span>
              {{ ticket.event.time }}
            </div>
            <div class="qr-event-venue">{{ ticket.event.venue }}</div>

            <div class="qr-code-wrapper">
              <svg viewBox="0 0 100 100" class="qr-svg" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="25" height="25" fill="#111827" rx="2"/>
                <rect x="14" y="14" width="17" height="17" fill="white" rx="1"/>
                <rect x="18" y="18" width="9" height="9" fill="#111827" rx="1"/>
                <rect x="65" y="10" width="25" height="25" fill="#111827" rx="2"/>
                <rect x="69" y="14" width="17" height="17" fill="white" rx="1"/>
                <rect x="73" y="18" width="9" height="9" fill="#111827" rx="1"/>
                <rect x="10" y="65" width="25" height="25" fill="#111827" rx="2"/>
                <rect x="14" y="69" width="17" height="17" fill="white" rx="1"/>
                <rect x="18" y="73" width="9" height="9" fill="#111827" rx="1"/>
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

    <!-- ───────────────────────────────────────────────────── -->
    <!-- Resend Tickets Modal                                  -->
    <!-- ───────────────────────────────────────────────────── -->
    <AppModal v-model="showResendModal" :closable="true" size="sm" @close="resetResendModal">

      <!-- Step 1: Select & send -->
      <template v-if="!resendSuccess">
        <div class="rm-header">
          <div class="rm-title">Resend Tickets</div>
          <div class="rm-subtitle">Select tickets to resend to <strong>{{ ticket.recipient.name }}</strong></div>
        </div>

        <div class="rm-section">
          <div class="rm-section-label">Select Tickets</div>
          <div class="rm-ticket-list">
            <label
              v-for="t in resendableTickets"
              :key="t.id"
              class="rm-ticket-item"
              :class="{ 'rm-ticket-item--checked': selectedTickets.includes(t.id) }"
            >
              <input type="checkbox" class="rm-checkbox-input" :value="t.id" v-model="selectedTickets" />
              <span class="rm-custom-checkbox" :class="{ 'rm-custom-checkbox--checked': selectedTickets.includes(t.id) }">
                <svg v-if="selectedTickets.includes(t.id)" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <div class="rm-ticket-info">
                <span class="rm-ticket-name">{{ t.name }}</span>
                <span class="rm-ticket-type">{{ t.type }}</span>
              </div>
              <span class="rm-ticket-price">{{ t.price }}</span>
            </label>
          </div>
        </div>

        <div class="rm-divider" />

        <div class="rm-section">
          <div class="rm-section-label">Delivery Method</div>
          <div class="rm-delivery-list">
            <label class="rm-radio-item">
              <input type="radio" v-model="deliveryMethod" value="original" class="rm-radio-input" />
              <span class="rm-custom-radio" :class="{ 'rm-custom-radio--active': deliveryMethod === 'original' }">
                <span v-if="deliveryMethod === 'original'" class="rm-radio-dot" />
              </span>
              <span class="rm-radio-label">Original delivery method (Email)</span>
            </label>
            <label class="rm-radio-item">
              <input type="radio" v-model="deliveryMethod" value="alternate" class="rm-radio-input" />
              <span class="rm-custom-radio" :class="{ 'rm-custom-radio--active': deliveryMethod === 'alternate' }">
                <span v-if="deliveryMethod === 'alternate'" class="rm-radio-dot" />
              </span>
              <span class="rm-radio-label">Use alternate contact</span>
            </label>
          </div>
        </div>

        <div class="rm-divider" />

        <div class="rm-section">
          <div class="rm-section-label">Recipient Email</div>
          <input v-model="recipientEmail" type="email" class="rm-email-input" :placeholder="ticket.recipient.email" />
        </div>

        <div class="rm-footer">
          <button type="button" class="rm-btn-cancel" @click="showResendModal = false">Cancel</button>
          <button type="button" class="rm-btn-resend" :disabled="selectedTickets.length === 0" @click="handleResend">
            Resend Tickets
          </button>
        </div>
      </template>

      <!-- Step 2: Success -->
      <template v-else>
        <div class="rm-success">
          <div class="rm-success-icon-wrap">
            <svg class="rm-success-check" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="36" fill="#3FD246" fill-opacity="0.12"/>
              <circle cx="36" cy="36" r="28" fill="#3FD246"/>
              <path d="M22 37l9 9 18-18" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="rm-success-title">Tickets Resent Successfully</h2>
          <p class="rm-success-body">
            {{ selectedTickets.length }} ticket{{ selectedTickets.length !== 1 ? 's' : '' }} have been resent to<br />
            <strong>{{ recipientEmail || ticket.recipient.email }}</strong>
          </p>
          <button type="button" class="rm-btn-view-order" @click="goToOrders">
            View order details
          </button>
          <button type="button" class="rm-btn-back-customers" @click="goBackToCustomers">
            Back to Customers
          </button>
        </div>
      </template>

    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()

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

// ── Resend modal ──────────────────────────────────────────────
const showResendModal = ref(false)
const resendSuccess = ref(false)
const deliveryMethod = ref<'original' | 'alternate'>('original')
const recipientEmail = ref('')
const selectedTickets = ref<string[]>(['t1', 't2'])

const resendableTickets = [
  { id: 't1', name: 'Ticket 01', type: 'General Admission', price: '₦10,000' },
  { id: 't2', name: 'Ticket 01', type: 'General Admission', price: '₦10,000' },
]

function openResendModal() {
  recipientEmail.value = ticket.value.recipient.email
  selectedTickets.value = resendableTickets.map(t => t.id)
  deliveryMethod.value = 'original'
  resendSuccess.value = false
  showResendModal.value = true
}

function handleResend() {
  resendSuccess.value = true
}

function resetResendModal() {
  resendSuccess.value = false
}

function goToOrders() {
  router.push('/orders')
}

function goBackToCustomers() {
  router.push('/customers')
}
</script>

<style scoped>
.ticket-detail-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Back */
.back-row {
  margin-bottom: 1.25rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  gap: 0.35rem;
  transition: color 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.back-link:hover {
  color: #2bb832;
}

.back-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

/* ── Single unified card ── */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

/* Header section */
.ticket-header {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-bottom: 1px solid #eef2ee;
}

.ticket-header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.ticket-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ticket-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ticket-number {
  font-size: 1.2rem;
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

.ticket-order-id {
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
  font-size: 1.2rem;
  font-weight: 800;
  color: #0E2615;
}

/* Body: two-column layout */
.ticket-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 0;
}

/* Left column */
.ticket-left {
  border-right: 1px solid #eef2ee;
}

/* Info section */
.info-section {
  padding: 1.5rem;
}

.info-section--bordered {
  border-top: 1px solid #eef2ee;
}

.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
}

.info-fields {
  display: flex;
  flex-direction: column;
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

/* Right column: QR box */
.ticket-right {
  display: flex;
  flex-direction: column;
}

.qr-box {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  border: 1px solid #eef2ee;
  border-radius: 0.75rem;
  margin: 1rem;
  background: #fff;
}

.qr-event-name {
  font-size: 1rem;
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

.meta-bullet { color: #d1d5db; }

.qr-event-venue {
  font-size: 0.75rem;
  color: #9ca3af;
}

.qr-code-wrapper {
  width: 150px;
  height: 150px;
  margin: 0.75rem 0;
}

.qr-svg {
  width: 100%;
  height: 100%;
}

.qr-ticket-id-label {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 500;
}

.qr-ticket-id-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
}

/* ─── Resend Modal ─────────────────────────────────────────── */
.rm-header {
  margin-bottom: 1.5rem;
}

.rm-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin-bottom: 0.3rem;
}

.rm-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
}

.rm-subtitle strong {
  color: #0E2615;
  font-weight: 700;
}

.rm-section {
  margin-bottom: 0;
}

.rm-section-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
  margin-bottom: 0.85rem;
}

.rm-ticket-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
}

.rm-ticket-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  background: #fff;
}

.rm-ticket-item--checked {
  border-color: #3FD246;
  background: #f0fdf4;
}

.rm-checkbox-input { display: none; }

.rm-custom-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
  background: #fff;
}

.rm-custom-checkbox--checked {
  background: #3FD246;
  border-color: #3FD246;
}

.rm-custom-checkbox svg {
  width: 12px;
  height: 12px;
}

.rm-ticket-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.rm-ticket-name { font-size: 0.875rem; font-weight: 700; color: #0E2615; }
.rm-ticket-type { font-size: 0.78rem; color: #9ca3af; }
.rm-ticket-price { font-size: 0.875rem; font-weight: 700; color: #0E2615; flex-shrink: 0; }

.rm-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 1.25rem 0;
}

.rm-delivery-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rm-radio-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.rm-radio-input { display: none; }

.rm-custom-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s ease;
  background: #fff;
}

.rm-custom-radio--active { border-color: #3FD246; }

.rm-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3FD246;
}

.rm-radio-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.rm-email-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: 'Outfit', sans-serif;
  color: #374151;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.rm-email-input:focus { border-color: #3FD246; }
.rm-email-input::placeholder { color: #9ca3af; }

.rm-footer {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.rm-btn-cancel {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.rm-btn-cancel:hover { background: #f9fafb; }

.rm-btn-resend {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: none;
  background: #3FD246;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.rm-btn-resend:hover:not(:disabled) {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.3);
}

.rm-btn-resend:disabled { opacity: 0.5; cursor: not-allowed; }

/* Success */
.rm-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0 0.5rem;
  gap: 0.5rem;
}

.rm-success-icon-wrap { margin-bottom: 0.75rem; }

.rm-success-check {
  width: 72px;
  height: 72px;
}

.rm-success-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.35rem;
}

.rm-success-body {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 1.25rem;
}

.rm-success-body strong { color: #0E2615; font-weight: 700; }

.rm-btn-view-order {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0E2615;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
  margin-bottom: 0.5rem;
}

.rm-btn-view-order:hover { background: #f9fafb; }

.rm-btn-back-customers {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  color: #3FD246;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  padding: 0.4rem;
  transition: color 0.15s ease;
}

.rm-btn-back-customers:hover { color: #2bb832; text-decoration: underline; }

@media (max-width: 900px) {
  .ticket-body {
    grid-template-columns: 1fr;
  }
  .ticket-left {
    border-right: none;
    border-bottom: 1px solid #eef2ee;
  }
}
</style>

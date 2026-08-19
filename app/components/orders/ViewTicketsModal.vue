<template>
  <AppModal
    :model-value="modelValue"
    size="xl"
    :closable="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="order" class="view-tickets-container">
      <!-- Back Link Header -->
      <div class="top-nav-row">
        <button type="button" class="back-link" @click="close">
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to orders
        </button>
      </div>

      <h1 class="modal-main-title">View Tickets</h1>

      <!-- Order Summary Bar -->
      <div class="order-summary-header">
        <div class="order-id-title">{{ order.orderNumber }}</div>
        <div class="order-ticket-count">{{ order.tickets.count }} Tickets</div>
      </div>

      <div class="event-details-box">
        <div class="event-title-text">{{ order.event.title }}</div>
        <div class="event-date-text">{{ order.event.date }}</div>
        <div class="event-sub-text">{{ order.tickets.count }} Tickets &bull; {{ order.tickets.tier }}</div>
      </div>

      <!-- Ticket Cards List -->
      <div class="tickets-list">
        <div
          v-for="ticket in ticketsList"
          :key="ticket.id"
          class="ticket-row-container"
        >
          <!-- Left Details Card -->
          <div
            class="ticket-card"
            :class="`ticket-card--${ticket.type.toLowerCase()}`"
          >
            <div class="ticket-primary-info">
              <div class="ticket-tier-row">
                <span class="ticket-type-label" :class="`label--${ticket.type.toLowerCase()}`">
                  {{ ticket.type }}
                </span>
                <div class="available-badge">
                  <span class="available-label">Available</span>
                  <span class="available-val">{{ ticket.available }}</span>
                </div>
              </div>

              <div class="ticket-price-val">₦{{ ticket.price.toLocaleString() }}</div>

              <div class="ticket-sales-grid">
                <!-- Sales Start -->
                <div class="sales-col">
                  <span class="sales-label">Sales Start</span>
                  <div class="sales-pill">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ ticket.salesStart }}</span>
                  </div>
                </div>

                <!-- Sales End -->
                <div class="sales-col">
                  <span class="sales-label">Sales End</span>
                  <div class="sales-pill">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ ticket.salesEnd }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right View QR Code Box -->
          <div class="qr-button-box">
            <button
              type="button"
              class="btn-qr"
              @click="openQrModal(ticket)"
            >
              View QR Code
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="view-tickets-footer">
        <button type="button" class="btn-close-outline" @click="close">
          Close
        </button>
      </div>
    </div>
  </AppModal>

  <!-- Ticket QR Code Modal -->
  <TicketQrModal
    v-model="showQrModal"
    :ticket="activeQrTicket"
    :order="order"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '~/components/AppModal.vue'
import TicketQrModal from '~/components/orders/TicketQrModal.vue'
import type { Order, TicketItem } from '~/types/orders'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const showQrModal = ref(false)
const activeQrTicket = ref<TicketItem | null>(null)

const ticketsList = computed<TicketItem[]>(() => {
  if (props.order?.ticketItems && props.order.ticketItems.length > 0) {
    return props.order.ticketItems
  }
  return [
    {
      id: 'tkt-1',
      type: 'REGULAR',
      price: 10000,
      available: 500,
      totalQuantity: 1,
      salesStart: 'Aug 24, 2026 • 9:00 AM',
      salesEnd: 'Aug 24, 2026 • 9:00 AM',
    },
    {
      id: 'tkt-2',
      type: 'VIP',
      price: 20000,
      available: 200,
      totalQuantity: 1,
      salesStart: 'Aug 24, 2026 • 9:00 AM',
      salesEnd: 'Aug 24, 2026 • 9:00 AM',
    },
  ]
})

function close() {
  emit('update:modelValue', false)
}

function openQrModal(ticket: TicketItem) {
  activeQrTicket.value = ticket
  showQrModal.value = true
}
</script>

<style scoped>
.view-tickets-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.top-nav-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.15rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s ease;
}

.back-link:hover {
  opacity: 0.8;
}

.modal-main-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.order-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.order-id-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0E2615;
}

.order-ticket-count {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
}

.event-details-box {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.25rem;
}

.event-title-text {
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
}

.event-date-text, .event-sub-text {
  font-size: 0.825rem;
  color: #6b7280;
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.ticket-row-container {
  display: flex;
  align-items: stretch;
  gap: 1.25rem;
  width: 100%;
}

.ticket-card {
  flex: 1;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  padding: 1.25rem 1.5rem 1.25rem 1.75rem;
  min-width: 0;
}

.ticket-card::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  background: #3FD246;
}

.ticket-card--regular::before {
  background: #3FD246;
}

.ticket-card--vip::before {
  background: #06B6D4;
}

.ticket-primary-info {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
}

.ticket-tier-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.ticket-type-label {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.label--regular {
  color: #3FD246;
}

.label--vip {
  color: #06B6D4;
}

.available-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.available-label {
  font-size: 0.775rem;
  font-weight: 700;
  color: #6b7280;
}

.available-val {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
}

.ticket-price-val {
  font-size: 1.2rem;
  font-weight: 800;
  color: #16A34A;
}

.ticket-sales-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.sales-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sales-label {
  font-size: 0.775rem;
  font-weight: 700;
  color: #374151;
}

.sales-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.775rem;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
}

.qr-button-box {
  width: 190px;
  flex-shrink: 0;
  border-radius: 0.875rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.qr-button-box:hover {
  border-color: #3FD246;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.1);
}

.btn-qr {
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: none;
  background: transparent;
  color: #0E2615;
  font-weight: 800;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  width: 100%;
  text-align: center;
}

.btn-qr:hover {
  color: #3FD246;
}

.view-tickets-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.btn-close-outline {
  min-width: 140px;
  padding: 0.65rem 2.25rem;
  border-radius: 0.65rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-close-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

@media (max-width: 768px) {
  .ticket-row-container {
    flex-direction: column;
  }
  .qr-button-box {
    width: 100%;
  }
  .ticket-sales-grid {
    grid-template-columns: 1fr;
  }
}
</style>

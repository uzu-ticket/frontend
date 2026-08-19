<template>
  <AppModal
    :model-value="modelValue"
    size="md"
    title="View Order"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="order" class="view-order-container">
      <!-- Order Title & Status Badge Header -->
      <div class="order-main-header">
        <div class="header-top-row">
          <h2 class="order-num">{{ order.orderNumber }}</h2>
          <span class="status-badge" :class="`status--${order.status.toLowerCase()}`">
            {{ order.status === 'Published' ? 'Completed' : order.status }}
          </span>
        </div>
        <div class="order-meta-info">
          <div>Ref: {{ order.reference }}</div>
          <div>{{ order.event.date }}</div>
        </div>
      </div>

      <div class="divider" />

      <!-- Section 1: Buyer -->
      <div class="detail-section">
        <h3 class="section-title">Buyer</h3>
        <div class="section-content">
          <div class="buyer-name">{{ order.buyer.name }}</div>
          <div class="buyer-email">{{ order.buyer.email }}</div>
          <div class="buyer-phone">{{ order.buyer.phone }}</div>
        </div>
      </div>

      <!-- Section 2: Payment -->
      <div class="detail-section">
        <h3 class="section-title">Payment</h3>
        <div class="section-content">
          <div class="payment-sub">Paid with</div>
          <div class="payment-detail">{{ order.payment.details }}</div>
        </div>
      </div>

      <!-- Section 3: Summary -->
      <div class="detail-section">
        <h3 class="section-title">Summary</h3>
        <div class="section-content">
          <div class="event-name">{{ order.event.title }}</div>
          <div class="event-date">{{ order.event.date }}</div>
          <div class="ticket-summary">
            {{ order.tickets.count }} Tickets &bull; {{ order.tickets.tier }}
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="view-order-footer">
        <button type="button" class="btn-close-outline" @click="close">
          Close
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from '~/components/AppModal.vue'
import type { Order } from '~/types/orders'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.view-order-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.25rem;
}

.order-main-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.header-top-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.order-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.status-badge {
  padding: 0.2rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.725rem;
  font-weight: 700;
}

.status--published,
.status--completed {
  background: #DCFCE7;
  color: #16A34A;
}

.status--draft {
  background: #FEF9C3;
  color: #CA8A04;
}

.status--refunded,
.status--cancelled {
  background: #FEE2E2;
  color: #DC2626;
}

.order-meta-info {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.divider {
  height: 1px;
  background: #f3f4f6;
  width: 100%;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
}

.buyer-name {
  font-weight: 700;
  color: #111827;
}

.buyer-email, .buyer-phone {
  color: #6b7280;
}

.payment-sub {
  color: #9ca3af;
  font-size: 0.8rem;
}

.payment-detail {
  color: #374151;
  font-weight: 600;
}

.event-name {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.event-date, .ticket-summary {
  color: #6b7280;
}

.view-order-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.btn-close-outline {
  min-width: 120px;
  padding: 0.6rem 2rem;
  border-radius: 9999px;
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
</style>

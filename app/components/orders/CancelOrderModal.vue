<template>
  <AppModal
    :model-value="modelValue"
    size="md"
    title="Cancel Order"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="order" class="cancel-order-container">
      <!-- Section 1: Order Ref & Status -->
      <div class="cancel-section">
        <h3 class="section-title">Cancel Order</h3>
        <div class="order-ref-row">
          <span class="order-number-title">{{ order.orderNumber }}</span>
          <span class="status-badge status--pending">
            Pending
          </span>
        </div>
      </div>

      <!-- Section 2: Warning Alert Card -->
      <div class="warning-alert-box">
        <div class="alert-icon-wrapper">
          <svg class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="alert-message-text">
          This action will cancel the order and stop any further processing. Tickets will not be issued
        </div>
      </div>

      <!-- Section 3: Reason for Cancellation (Custom AppSelect) -->
      <div class="cancel-section">
        <label class="field-label">Reason for cancellation (Optional)</label>
        <AppSelect
          v-model="selectedReason"
          :options="cancelReasonOptions"
          placeholder="Select reason"
        />
      </div>

      <!-- Footer Buttons -->
      <div class="cancel-actions-row">
        <button type="button" class="btn-keep-outline" @click="close">
          Keep Order
        </button>
        <button type="button" class="btn-cancel-confirm" @click="handleCancelOrder">
          Cancel Order
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppSelect from '~/components/ui/AppSelect.vue'
import type { Order } from '~/types/orders'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'order-cancelled': [order: Order, reason: string]
}>()

const selectedReason = ref<string | null>(null)
const toast = useToast()

const cancelReasonOptions = [
  { value: 'Payment processing error', label: 'Payment processing error' },
  { value: 'Customer requested cancellation', label: 'Customer requested cancellation' },
  { value: 'Event cancelled by organizer', label: 'Event cancelled by organizer' },
  { value: 'Suspected fraudulent activity', label: 'Suspected fraudulent activity' },
  { value: 'Other', label: 'Other' },
]

function close() {
  emit('update:modelValue', false)
}

function handleCancelOrder() {
  if (!props.order) return
  emit('order-cancelled', props.order, selectedReason.value || '')
  toast.show({
    title: 'Order Cancelled',
    message: `${props.order.orderNumber} has been cancelled successfully.`,
    type: 'error',
  })
  close()
}
</script>

<style scoped>
.cancel-order-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.25rem;
  font-family: 'Outfit', sans-serif;
}

.cancel-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
}

.order-ref-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.order-number-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0E2615;
}

.status-badge {
  padding: 0.2rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.725rem;
  font-weight: 700;
}

.status--pending {
  background: #FEF9C3;
  color: #D97706;
}

.warning-alert-box {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.25rem 1.25rem;
  border-radius: 0.75rem;
  background: #FFF5F5;
  border: 1px solid #FCA5A5;
}

.alert-icon-wrapper {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #EF4444;
}

.alert-message-text {
  font-size: 0.85rem;
  color: #DC2626;
  font-weight: 600;
  line-height: 1.4;
}

.cancel-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-keep-outline {
  flex: 1;
  padding: 0.65rem 1.5rem;
  border-radius: 0.65rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-keep-outline:hover {
  background: #f9fafb;
}

.btn-cancel-confirm {
  flex: 1;
  padding: 0.65rem 1.5rem;
  border-radius: 0.65rem;
  border: none;
  background: #EF4444;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
  transition: all 0.15s ease;
}

.btn-cancel-confirm:hover {
  background: #dc2626;
}
</style>

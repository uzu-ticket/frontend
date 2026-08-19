<template>
  <AppModal
    :model-value="modelValue"
    size="sm"
    :title="actionType === 'refund' ? 'Issue Refund' : 'Cancel Order'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="order" class="confirm-modal-container">
      <div class="icon-circle" :class="actionType === 'refund' ? 'icon--warning' : 'icon--danger'">
        <svg v-if="actionType === 'refund'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      <div class="confirm-text-group">
        <p class="confirm-message">
          Are you sure you want to {{ actionType === 'refund' ? 'issue a full refund for' : 'cancel' }}
          <strong>{{ order.orderNumber }}</strong> ({{ order.buyer.name }})?
        </p>
        <p class="confirm-subtext">
          {{ actionType === 'refund' 
              ? 'This will process a refund back to the customer card and update order status to Refunded.' 
              : 'This action will invalidate all associated tickets for this order.' 
          }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="close">
          Dismiss
        </button>
        <button
          type="button"
          class="btn-confirm"
          :class="actionType === 'refund' ? 'btn--refund' : 'btn--cancel-order'"
          @click="handleConfirm"
        >
          Confirm {{ actionType === 'refund' ? 'Refund' : 'Cancellation' }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from '~/components/AppModal.vue'
import type { Order } from '~/types/orders'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
  actionType: 'refund' | 'cancel'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [order: Order, type: 'refund' | 'cancel']
}>()

const toast = useToast()

function close() {
  emit('update:modelValue', false)
}

function handleConfirm() {
  if (!props.order) return
  emit('confirm', props.order, props.actionType)
  toast.show({
    title: props.actionType === 'refund' ? 'Refund Processed' : 'Order Cancelled',
    message: `${props.order.orderNumber} status updated to ${props.actionType === 'refund' ? 'Refunded' : 'Cancelled'}`,
    type: props.actionType === 'refund' ? 'info' : 'error',
  })
  close()
}
</script>

<style scoped>
.confirm-modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding-top: 0.5rem;
}

.icon-circle {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon--warning {
  background: #FEF9C3;
  color: #CA8A04;
}

.icon--danger {
  background: #FEE2E2;
  color: #DC2626;
}

.confirm-text-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.confirm-message {
  font-size: 0.95rem;
  color: #111827;
  margin: 0;
}

.confirm-subtext {
  font-size: 0.775rem;
  color: #6b7280;
  margin: 0;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  width: 100%;
}

.btn-cancel {
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-confirm {
  padding: 0.6rem 1.35rem;
  border-radius: 9999px;
  border: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn--refund {
  background: #d97706;
}
.btn--refund:hover {
  background: #b45309;
}

.btn--cancel-order {
  background: #dc2626;
}
.btn--cancel-order:hover {
  background: #b91c1c;
}
</style>

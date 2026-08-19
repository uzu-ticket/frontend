<template>
  <AppModal
    :model-value="modelValue"
    size="md"
    title="Issue Refund"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="order" class="issue-refund-container">
      <!-- Section 1: Refund Order Header -->
      <div class="refund-section">
        <h3 class="section-title">Refund Order</h3>
        <div class="order-ref-row">
          <span class="order-number-title">{{ order.orderNumber }}</span>
          <span class="status-badge" :class="`status--${order.status.toLowerCase()}`">
            {{ order.status === 'Published' ? 'Completed' : order.status }}
          </span>
        </div>
      </div>

      <!-- Section 2: Refund Amount Header -->
      <div class="refund-section">
        <h3 class="section-title">Refund Amount</h3>
        <div class="amount-val-display">
          N{{ formattedAmount }}
        </div>
        <div class="amount-date-sub">
          {{ refundDate }}
        </div>
      </div>

      <!-- Section 3: Refund Amount Selection -->
      <div class="refund-section">
        <h3 class="section-title">Refund Amount</h3>
        <div class="refund-type-options">
          <!-- Full Refund Radio -->
          <label class="radio-option" @click="refundType = 'full'">
            <div class="radio-indicator" :class="{ 'radio-indicator--selected': refundType === 'full' }">
              <span v-if="refundType === 'full'" class="radio-dot" />
            </div>
            <span class="radio-label">N{{ formattedAmount }}</span>
          </label>

          <!-- Partial Refund Radio -->
          <label class="radio-option" @click="refundType = 'partial'">
            <div class="radio-indicator" :class="{ 'radio-indicator--selected': refundType === 'partial' }">
              <span v-if="refundType === 'partial'" class="radio-dot" />
            </div>
            <span class="radio-label">Partial Refund</span>
          </label>
        </div>

        <!-- Partial Amount Input if selected -->
        <div v-if="refundType === 'partial'" class="partial-input-wrapper">
          <label class="input-sublabel">Enter Partial Amount (₦)</label>
          <input
            v-model.number="partialAmount"
            type="number"
            placeholder="e.g. 50000"
            class="partial-input"
          />
        </div>
      </div>

      <!-- Section 4: Reason for Refund (Custom AppSelect) -->
      <div class="refund-section">
        <label class="section-title field-label">Reason for refund (Optional)</label>
        <AppSelect
          v-model="selectedReason"
          :options="refundReasonOptions"
          placeholder="Select reason"
        />
      </div>

      <!-- Footer Buttons -->
      <div class="refund-actions-row">
        <button type="button" class="btn-cancel-outline" @click="close">
          Cancel
        </button>
        <button type="button" class="btn-issue-refund" @click="handleIssueRefund">
          Issue Refund
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  'refund-issued': [order: Order, amount: number, reason: string]
}>()

const refundType = ref<'full' | 'partial'>('full')
const partialAmount = ref<number | null>(null)
const selectedReason = ref<string | null>(null)
const toast = useToast()

const refundReasonOptions = [
  { value: 'Customer requested cancellation', label: 'Customer requested cancellation' },
  { value: 'Event date changed or cancelled', label: 'Event date changed or cancelled' },
  { value: 'Duplicate order error', label: 'Duplicate order error' },
  { value: 'Unsatisfied attendee', label: 'Unsatisfied attendee' },
  { value: 'Other', label: 'Other' },
]

const formattedAmount = computed(() => {
  if (!props.order) return '150, 000'
  return props.order.totalAmount ? props.order.totalAmount.toLocaleString() : '150, 000'
})

const refundDate = computed(() => {
  return 'Aug, 24, 2026'
})

function close() {
  emit('update:modelValue', false)
}

function handleIssueRefund() {
  if (!props.order) return
  const finalAmount = refundType.value === 'full' 
    ? (props.order.totalAmount || 150000) 
    : (partialAmount.value || 0)

  emit('refund-issued', props.order, finalAmount, selectedReason.value || '')
  toast.show({
    title: 'Refund Processed',
    message: `Refund of ₦${finalAmount.toLocaleString()} issued for ${props.order.orderNumber}`,
    type: 'success',
  })
  close()
}
</script>

<style scoped>
.issue-refund-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.25rem;
  font-family: 'Outfit', sans-serif;
}

.refund-section {
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

.amount-val-display {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
}

.amount-date-sub {
  font-size: 0.825rem;
  color: #6b7280;
}

.refund-type-options {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.15rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  user-select: none;
}

.radio-indicator {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.radio-indicator--selected {
  border-color: #3FD246;
}

.radio-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #3FD246;
}

.radio-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

.partial-input-wrapper {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-sublabel {
  font-size: 0.775rem;
  color: #6b7280;
  font-weight: 600;
}

.partial-input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: 0.65rem;
  border: 1px solid #d1d5db;
  font-size: 0.85rem;
  outline: none;
}

.partial-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 2px rgba(63, 210, 70, 0.2);
}

.refund-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-cancel-outline {
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

.btn-cancel-outline:hover {
  background: #f9fafb;
}

.btn-issue-refund {
  flex: 1;
  padding: 0.65rem 1.5rem;
  border-radius: 0.65rem;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}

.btn-issue-refund:hover {
  background: #34be3b;
}
</style>

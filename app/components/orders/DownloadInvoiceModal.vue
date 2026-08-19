<template>
  <AppModal
    :model-value="modelValue"
    size="md"
    title="Download Invoice"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="order" class="download-invoice-container">
      <!-- Invoice Main Header -->
      <div class="invoice-header-row">
        <div>
          <h2 class="invoice-number">{{ invoiceNumber }}</h2>
          <div class="invoice-subtitle">Invoice for Order {{ order.orderNumber.replace('B', '') }}</div>
        </div>
        <div class="invoice-ticket-count">{{ order.tickets.count }} Tickets</div>
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

      <!-- Section 2: Amount -->
      <div class="detail-section">
        <h3 class="section-title">Amount</h3>
        <div class="section-content">
          <div class="amount-val">N50, 000</div>
          <div class="amount-date">Aug, 24, 2026</div>
        </div>
      </div>

      <!-- Section 3: Choose Format -->
      <div class="detail-section">
        <h3 class="section-title">Choose Format</h3>
        <div class="format-grid">
          <!-- PDF Option -->
          <div
            class="format-radio-card"
            :class="{ 'format-radio-card--selected': selectedFormat === 'PDF' }"
            @click="selectedFormat = 'PDF'"
          >
            <div class="radio-indicator">
              <span v-if="selectedFormat === 'PDF'" class="radio-dot" />
            </div>
            <span class="format-label">PDF</span>
          </div>

          <!-- PNG Option -->
          <div
            class="format-radio-card"
            :class="{ 'format-radio-card--selected': selectedFormat === 'PNG' }"
            @click="selectedFormat = 'PNG'"
          >
            <div class="radio-indicator">
              <span v-if="selectedFormat === 'PNG'" class="radio-dot" />
            </div>
            <span class="format-label">PNG</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="invoice-modal-actions">
        <button type="button" class="btn-cancel-outline" @click="close">
          Cancel
        </button>
        <button type="button" class="btn-download-fill" @click="handleDownload">
          <span>Download</span>
          <svg class="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '~/components/AppModal.vue'
import type { Order } from '~/types/orders'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const selectedFormat = ref<'PDF' | 'PNG'>('PDF')
const toast = useToast()

const invoiceNumber = computed(() => {
  if (!props.order) return '#INV-1248B'
  return props.order.orderNumber.replace('#ORD-', '#INV-')
})

function close() {
  emit('update:modelValue', false)
}

function handleDownload() {
  toast.show({
    title: 'Invoice Downloaded',
    message: `Downloaded ${invoiceNumber.value} as ${selectedFormat.value}`,
    type: 'success',
  })
  close()
}
</script>

<style scoped>
.download-invoice-container {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding-top: 0.25rem;
}

.invoice-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.invoice-number {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.invoice-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.15rem;
}

.invoice-ticket-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
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
  font-size: 1.05rem;
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

.amount-val {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
}

.amount-date {
  color: #6b7280;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
  margin-top: 0.25rem;
}

.format-radio-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.format-radio-card:hover {
  border-color: #3FD246;
  background: #fafdfa;
}

.format-radio-card--selected {
  border-color: #3FD246;
  background: #F0FDF1;
  box-shadow: 0 0 0 1px #3FD246;
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
}

.format-radio-card--selected .radio-indicator {
  border-color: #3FD246;
}

.radio-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #3FD246;
}

.format-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0E2615;
}

.invoice-modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.btn-cancel-outline {
  flex: 1;
  padding: 0.65rem 1.5rem;
  border-radius: 9999px;
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

.btn-download-fill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.5rem;
  border-radius: 9999px;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}

.btn-download-fill:hover {
  background: #34be3b;
}
</style>

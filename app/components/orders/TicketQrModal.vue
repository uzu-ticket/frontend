<template>
  <AppModal
    :model-value="modelValue"
    size="sm"
    title="Ticket QR Code"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="ticket && order" class="qr-modal-container">
      <div class="qr-badge-tier" :class="`tier--${ticket.type.toLowerCase()}`">
        {{ ticket.type }} TICKET
      </div>

      <div class="qr-code-box">
        <!-- SVG Generated QR Code representation -->
        <svg class="qr-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white" rx="12"/>
          <!-- Position Detection Patterns -->
          <!-- Top Left -->
          <rect x="20" y="20" width="50" height="50" fill="#0E2615"/>
          <rect x="28" y="28" width="34" height="34" fill="white"/>
          <rect x="36" y="36" width="18" height="18" fill="#0E2615"/>
          <!-- Top Right -->
          <rect x="130" y="20" width="50" height="50" fill="#0E2615"/>
          <rect x="138" y="28" width="34" height="34" fill="white"/>
          <rect x="146" y="36" width="18" height="18" fill="#0E2615"/>
          <!-- Bottom Left -->
          <rect x="20" y="130" width="50" height="50" fill="#0E2615"/>
          <rect x="28" y="138" width="34" height="34" fill="white"/>
          <rect x="36" y="146" width="18" height="18" fill="#0E2615"/>
          <!-- QR Data Matrix elements -->
          <rect x="80" y="20" width="10" height="10" fill="#0E2615"/>
          <rect x="100" y="20" width="10" height="10" fill="#0E2615"/>
          <rect x="80" y="40" width="10" height="10" fill="#3FD246"/>
          <rect x="90" y="50" width="10" height="10" fill="#0E2615"/>
          <rect x="110" y="40" width="10" height="10" fill="#0E2615"/>

          <rect x="20" y="80" width="10" height="10" fill="#0E2615"/>
          <rect x="40" y="80" width="10" height="10" fill="#0E2615"/>
          <rect x="60" y="80" width="10" height="10" fill="#3FD246"/>
          <rect x="80" y="80" width="10" height="10" fill="#0E2615"/>
          <rect x="100" y="80" width="20" height="10" fill="#0E2615"/>
          <rect x="130" y="80" width="10" height="10" fill="#0E2615"/>
          <rect x="160" y="80" width="10" height="10" fill="#3FD246"/>

          <rect x="30" y="100" width="10" height="10" fill="#0E2615"/>
          <rect x="50" y="100" width="10" height="10" fill="#0E2615"/>
          <rect x="80" y="100" width="10" height="10" fill="#0E2615"/>
          <rect x="110" y="100" width="10" height="10" fill="#0E2615"/>
          <rect x="140" y="100" width="10" height="10" fill="#0E2615"/>
          <rect x="170" y="100" width="10" height="10" fill="#0E2615"/>

          <rect x="80" y="120" width="10" height="10" fill="#0E2615"/>
          <rect x="100" y="120" width="10" height="10" fill="#3FD246"/>
          <rect x="120" y="120" width="10" height="10" fill="#0E2615"/>

          <rect x="80" y="140" width="10" height="10" fill="#0E2615"/>
          <rect x="100" y="140" width="10" height="10" fill="#0E2615"/>
          <rect x="120" y="140" width="10" height="10" fill="#0E2615"/>
          <rect x="150" y="140" width="10" height="10" fill="#0E2615"/>
          <rect x="170" y="140" width="10" height="10" fill="#3FD246"/>

          <rect x="80" y="160" width="10" height="10" fill="#0E2615"/>
          <rect x="110" y="160" width="10" height="10" fill="#0E2615"/>
          <rect x="130" y="160" width="20" height="10" fill="#0E2615"/>
          <rect x="160" y="160" width="10" height="10" fill="#0E2615"/>
        </svg>
      </div>

      <div class="qr-details">
        <div class="ticket-code font-mono">TKT-{{ order.reference }}-01</div>
        <div class="attendee-name">{{ order.buyer.name }}</div>
        <div class="event-name">{{ order.event.title }}</div>
      </div>

      <div class="qr-actions">
        <button type="button" class="btn-download-qr" @click="downloadQr">
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Pass
        </button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from '~/components/AppModal.vue'
import type { Order, TicketItem } from '~/types/orders'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
  ticket: TicketItem | null
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toast = useToast()

function downloadQr() {
  toast.show({
    title: 'Downloading Pass',
    message: `Downloaded ${props.ticket?.type} Ticket QR Code pass for ${props.order?.buyer.name}`,
    type: 'success',
  })
}
</script>

<style scoped>
.qr-modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  text-align: center;
}

.qr-badge-tier {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.25rem 0.85rem;
  border-radius: 9999px;
  letter-spacing: 0.05em;
}

.tier--regular {
  background: #F0FDF1;
  color: #16A34A;
}

.tier--vip {
  background: #ECFEFF;
  color: #0891B2;
}

.qr-code-box {
  width: 170px;
  height: 170px;
  padding: 0.5rem;
  border-radius: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.qr-svg {
  width: 100%;
  height: 100%;
}

.qr-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.ticket-code {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0E2615;
}

.attendee-name {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.event-name {
  font-size: 0.8rem;
  color: #6b7280;
}

.qr-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-download-qr {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.65rem 1.25rem;
  border-radius: 9999px;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}

.btn-download-qr:hover {
  background: #34be3b;
}
</style>

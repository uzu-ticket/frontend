<template>
  <AppModal
    :model-value="modelValue"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="export-modal-header">
        <h2 class="modal-title">Export Orders</h2>
        <p class="modal-subtitle">Choose the format and data you want to export.</p>
      </div>
    </template>

    <div class="export-modal-body">
      <div class="section-label">Export Format</div>

      <div class="format-options">
        <!-- CSV Card -->
        <div
          class="format-card"
          :class="{ 'format-card--selected': selectedFormat === 'CSV' }"
          @click="selectedFormat = 'CSV'"
        >
          <div class="radio-indicator">
            <span v-if="selectedFormat === 'CSV'" class="radio-dot" />
          </div>
          <div class="format-info">
            <div class="format-name">CSV</div>
            <div class="format-desc">Best for spreadsheet</div>
          </div>
        </div>

        <!-- Excel Card -->
        <div
          class="format-card"
          :class="{ 'format-card--selected': selectedFormat === 'Excel (XLSX)' }"
          @click="selectedFormat = 'Excel (XLSX)'"
        >
          <div class="radio-indicator">
            <span v-if="selectedFormat === 'Excel (XLSX)'" class="radio-dot" />
          </div>
          <div class="format-info">
            <div class="format-name">Excel (XLSX)</div>
            <div class="format-desc">Best for analysis</div>
          </div>
        </div>

        <!-- PDF Card -->
        <div
          class="format-card"
          :class="{ 'format-card--selected': selectedFormat === 'PDF' }"
          @click="selectedFormat = 'PDF'"
        >
          <div class="radio-indicator">
            <span v-if="selectedFormat === 'PDF'" class="radio-dot" />
          </div>
          <div class="format-info">
            <div class="format-name">PDF</div>
            <div class="format-desc">Best for report</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="close">
          Cancel
        </button>
        <button type="button" class="btn-export" @click="handleExport">
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export {{ selectedFormat }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '~/components/AppModal.vue'
import type { ExportFormat } from '~/types/orders'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'export': [format: ExportFormat]
}>()

const selectedFormat = ref<ExportFormat>('CSV')
const toast = useToast()

function close() {
  emit('update:modelValue', false)
}

function handleExport() {
  emit('export', selectedFormat.value)
  toast.show({
    title: 'Export Started',
    message: `Exporting order records as ${selectedFormat.value}...`,
    type: 'success',
  })
  close()
}
</script>

<style scoped>
.export-modal-header {
  padding-right: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  letter-spacing: -0.01em;
}

.modal-subtitle {
  font-size: 0.825rem;
  color: #6b7280;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.export-modal-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-top: 0.5rem;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0E2615;
}

.format-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.format-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.format-card:hover {
  border-color: #3FD246;
  background: #fafdfa;
}

.format-card--selected {
  border-color: #3FD246;
  background: #F0FDF1;
  box-shadow: 0 0 0 1px #3FD246;
}

.radio-indicator {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.format-card--selected .radio-indicator {
  border-color: #3FD246;
}

.radio-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: #3FD246;
}

.format-info {
  display: flex;
  flex-direction: column;
}

.format-name {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0E2615;
}

.format-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.1rem;
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

.btn-export {
  display: flex;
  align-items: center;
  padding: 0.6rem 1.35rem;
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

.btn-export:hover {
  background: #34be3b;
}
</style>

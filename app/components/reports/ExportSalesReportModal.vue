<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">

      <!-- Close Button -->
      <button class="btn-close" @click="$emit('close')" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Header -->
      <div class="modal-header">
        <h3 class="modal-title">Export sales report</h3>
        <p class="modal-subtitle">Choose the scope and the range for your report.</p>
      </div>

      <div class="modal-body">

        <!-- 1. Report Scope -->
        <div class="form-group">
          <label class="group-title">1. Report scope</label>

          <div class="radio-options">
            <label class="radio-label">
              <input
                v-model="scope"
                type="radio"
                value="all"
                class="radio-input"
              />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-main">All events in an organization (Recommended)</span>
                <span class="radio-sub">Includes all events across your organization.</span>
              </div>
            </label>

            <label class="radio-label">
              <input
                v-model="scope"
                type="radio"
                value="specific"
                class="radio-input"
              />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-main">Specific event</span>
              </div>
            </label>
          </div>

          <!-- Select Event Dropdown (visible if specific selected) -->
          <div v-if="scope === 'specific'" class="select-wrapper">
            <select v-model="selectedEventId" class="form-select">
              <option value="" disabled>Select event</option>
              <option value="summer-fest-2026">Summer Fest 2026</option>
              <option value="zeenom-live-concert">Zeenom Live Concert</option>
              <option value="kareoke-live-concert">Kareoke Live Concert</option>
            </select>
          </div>
        </div>

        <!-- 2. Date Range -->
        <div class="form-group">
          <label class="group-title">2. Date range</label>

          <div class="select-wrapper date-range-select">
            <select v-model="dateRangeType" class="form-select">
              <option value="custom">Custom range</option>
              <option value="this-month">This Month</option>
              <option value="last-30">Last 30 Days</option>
              <option value="all-time">All Time</option>
            </select>
          </div>

          <div v-if="dateRangeType === 'custom'" class="date-pickers-row">
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input v-model="startDate" type="text" class="date-input" placeholder="Sept 10, 2026" />
            </div>

            <span class="arrow-sep">→</span>

            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input v-model="endDate" type="text" class="date-input" placeholder="Sept 10, 2026" />
            </div>
          </div>
        </div>

        <!-- 3. Include -->
        <div class="form-group">
          <label class="group-title">3. Include</label>

          <div class="checkbox-grid">
            <label class="checkbox-label">
              <input v-model="includes.salesRevenue" type="checkbox" class="checkbox-input" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text">Sales & revenue</span>
            </label>

            <label class="checkbox-label">
              <input v-model="includes.refunds" type="checkbox" class="checkbox-input" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text">Refunds</span>
            </label>

            <label class="checkbox-label">
              <input v-model="includes.ticketsByType" type="checkbox" class="checkbox-input" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text">Tickets sold by type</span>
            </label>

            <label class="checkbox-label">
              <input v-model="includes.channelDist" type="checkbox" class="checkbox-input" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text">Channel distribution</span>
            </label>

            <label class="checkbox-label">
              <input v-model="includes.order" type="checkbox" class="checkbox-input" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text">Order</span>
            </label>

            <label class="checkbox-label">
              <input v-model="includes.eventBreakdown" type="checkbox" class="checkbox-input" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text">Event breakdown</span>
            </label>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn-export" @click="handleExport">Export Report</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'close': []
  'export': [data: any]
}>()

const scope = ref<'all' | 'specific'>('all')
const selectedEventId = ref('')
const dateRangeType = ref('custom')
const startDate = ref('Sept 10, 2026')
const endDate = ref('Sept 10, 2026')

const includes = ref({
  salesRevenue: true,
  refunds: true,
  ticketsByType: true,
  channelDist: true,
  order: true,
  eventBreakdown: true,
})

const router = useRouter()

function handleExport() {
  emit('export', {
    scope: scope.value,
    selectedEventId: selectedEventId.value,
    startDate: startDate.value,
    endDate: endDate.value,
    includes: includes.value,
  })
  router.push('/reports/export-success')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.btn-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: color 0.15s;
}
.btn-close:hover {
  color: #111827;
}
.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.radio-input {
  display: none;
}

.radio-custom {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  border: 2px solid #D1D5DB;
  position: relative;
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: border-color 0.15s;
}
.radio-input:checked + .radio-custom {
  border-color: #3FD246;
}
.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: #3FD246;
  border-radius: 50%;
}

.radio-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.radio-main {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
}

.radio-sub {
  font-size: 0.8rem;
  color: #6B7280;
}

.select-wrapper {
  width: 100%;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  outline: none;
  background: #ffffff;
  color: #111827;
}

.date-pickers-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.input-with-icon {
  position: relative;
  flex: 1;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #9CA3AF;
  pointer-events: none;
}

.date-input {
  width: 100%;
  padding: 0.7rem 0.85rem 0.7rem 2.5rem;
  font-size: 0.85rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  outline: none;
  color: #111827;
  box-sizing: border-box;
}

.arrow-sep {
  color: #9CA3AF;
  font-weight: 700;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-box {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.35rem;
  border: 1.5px solid #D1D5DB;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.checkbox-input:checked + .checkbox-box {
  background: #0E2615;
  border-color: #0E2615;
}
.checkbox-input:checked + .checkbox-box::after {
  content: '✓';
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 800;
}

.checkbox-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.modal-footer {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.8rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  cursor: pointer;
}

.btn-export {
  flex: 1.2;
  padding: 0.8rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  background: #3FD246;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s;
}
.btn-export:hover {
  background: #36bd3d;
}
</style>

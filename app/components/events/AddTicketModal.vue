<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal-card">
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <h3 class="modal-title">Add Ticket Type</h3>
          <p class="modal-subtitle">Create a ticket type for your event</p>
        </div>
        <button class="btn-close" aria-label="Close" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form class="modal-body" @submit.prevent="handleSave">
        <!-- Ticket Name -->
        <div class="field-group">
          <label class="field-label">Ticket Name <span class="required-star">*</span></label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="e.g Early bird"
            class="form-input"
            required
          />
        </div>

        <!-- Price -->
        <div class="field-group">
          <label class="field-label">Price <span class="required-star">*</span></label>
          <input
            v-model="formData.price"
            type="text"
            placeholder="₦ 0.00"
            class="form-input"
            required
          />
        </div>

        <!-- Available Quantity & Max per Order -->
        <div class="two-col-grid">
          <div class="field-group">
            <label class="field-label">Available Quantity <span class="required-star">*</span></label>
            <input
              v-model="formData.quantity"
              type="number"
              placeholder="0"
              class="form-input"
              required
            />
          </div>

          <div class="field-group">
            <label class="field-label">Max per Order <span class="required-star">*</span></label>
            <input
              v-model="formData.maxPerOrder"
              type="number"
              placeholder="1"
              class="form-input"
              required
            />
          </div>
        </div>

        <!-- Sales Start -->
        <div class="field-group">
          <label class="field-label">Sales Start <span class="required-star">*</span></label>
          <div class="date-time-row">
            <DatePicker v-model="formData.startDate" placeholder="Sales start date" />
            <TimePicker v-model="formData.startTime" placeholder="Sales start time" />
          </div>
        </div>

        <!-- Sales End -->
        <div class="field-group">
          <label class="field-label">Sales End <span class="required-star">*</span></label>
          <div class="date-time-row">
            <DatePicker v-model="formData.endDate" placeholder="Sales end date" />
            <TimePicker v-model="formData.endTime" placeholder="Sales end time" />
          </div>
        </div>

        <!-- Description -->
        <div class="field-group">
          <label class="field-label">Description <span class="required-star">*</span></label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Describe this ticket type and what it includes"
            class="form-textarea"
          />
        </div>

        <!-- Modal Footer Actions -->
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-submit">
            Create Ticket Type
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DatePicker from '~/components/ui/DatePicker.vue'
import TimePicker from '~/components/ui/TimePicker.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  save: [ticket: typeof formData]
}>()

const formData = reactive({
  name: '',
  price: '₦ 10,000',
  quantity: '500',
  maxPerOrder: '1',
  startDate: null as Date | null,
  startTime: '',
  endDate: null as Date | null,
  endTime: '',
  description: '',
})

function close() {
  emit('update:modelValue', false)
}

function handleSave() {
  emit('save', { ...formData })
  close()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1.5rem;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: visible;
  animation: popIn 0.15s ease-out;
}

/* Date + Time stacked within a field group */
.date-time-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  padding: 1.5rem 1.75rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.modal-subtitle {
  font-size: 0.825rem;
  color: #6b7280;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.35rem;
  transition: background 0.15s;
}

.btn-close:hover { background: #f3f4f6; color: #0E2615; }
.close-icon { width: 1.25rem; height: 1.25rem; }

.modal-body {
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  max-height: 80vh;
  overflow-y: auto;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0E2615;
}

.required-star { color: #ef4444; }

.form-input, .form-textarea {
  width: 100%;
  padding: 0.7rem 0.85rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  color: #1f2937;
  outline: none;
}

.form-input:focus, .form-textarea:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.combined-date-time-box {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  background: #ffffff;
  overflow: hidden;
}

.date-part, .time-part {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  flex: 1;
}

.combined-input {
  width: 100%;
  border: none;
  padding: 0.65rem 0.25rem;
  font-size: 0.8rem;
  color: #1f2937;
  outline: none;
}

.divider {
  width: 1px;
  height: 1.75rem;
  background: #e5e7eb;
}

.input-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: #6b7280;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.65rem 1.35rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
}

.btn-submit {
  padding: 0.65rem 1.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
}
</style>

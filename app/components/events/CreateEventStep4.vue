<template>
  <div class="step4-form">
    <!-- Section 1: Ticket Sales Close -->
    <div class="form-section">
      <h3 class="section-title">Ticket Sales Close</h3>
      <p class="section-subtitle">When should ticket sales close?</p>

      <div class="radio-options-list">
        <label
          v-for="opt in salesCloseOptions"
          :key="opt.value"
          class="radio-option-item"
          :class="{ 'radio-option-item--selected': salesClose === opt.value }"
          @click="salesClose = opt.value"
        >
          <div class="radio-circle">
            <div v-if="salesClose === opt.value" class="radio-inner-dot" />
          </div>
          <span class="radio-label">{{ opt.label }}</span>
        </label>
      </div>

      <!-- Custom Date & Time Inputs (shown when 'custom' is selected) -->
      <Transition name="fade-slide">
        <div v-if="salesClose === 'custom'" class="custom-datetime-box">
          <div class="field-group">
            <label class="field-label">Custom Close Date & Time</label>
            <div class="datetime-row">
              <DatePicker v-model="customCloseDate" placeholder="Select close date" />
              <TimePicker v-model="customCloseTime" placeholder="Select close time" />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Horizontal Divider -->
    <div class="section-divider" />

    <!-- Section 2: Email Reminders -->
    <div class="form-section">
      <h3 class="section-title">Email Reminders</h3>
      <p class="section-subtitle">Send email reminders to buyers</p>

      <div class="checkbox-options-list">
        <label
          v-for="opt in reminderOptions"
          :key="opt.value"
          class="checkbox-option-item"
          @click="toggleReminder(opt.value)"
        >
          <div class="custom-checkbox" :class="{ 'custom-checkbox--checked': reminders.includes(opt.value) }">
            <svg v-if="reminders.includes(opt.value)" xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="checkbox-label">{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <button class="btn-next" @click="handleNext">
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '~/components/ui/DatePicker.vue'
import TimePicker from '~/components/ui/TimePicker.vue'

const emit = defineEmits<{
  back: []
  next: [data: any]
}>()

const salesCloseOptions = [
  { value: '1h', label: '1 hour before event' },
  { value: '3h', label: '3 hours before event' },
  { value: '6h', label: '6 hours before event' },
  { value: 'custom', label: 'Custom date & time' },
]

const reminderOptions = [
  { value: '24h', label: '24 hours before event' },
  { value: '1h', label: '1 hour before event' },
]

const salesClose = ref('1h')
const customCloseDate = ref<Date | null>(null)
const customCloseTime = ref('')

const reminders = ref<string[]>(['24h', '1h'])

function toggleReminder(val: string) {
  const idx = reminders.value.indexOf(val)
  if (idx >= 0) reminders.value.splice(idx, 1)
  else reminders.value.push(val)
}

function handleNext() {
  emit('next', {
    salesClose: salesClose.value,
    customCloseDate: customCloseDate.value,
    customCloseTime: customCloseTime.value,
    reminders: reminders.value,
  })
}
</script>

<style scoped>
.step4-form {
  display: flex;
  flex-direction: column;
  min-height: 480px;
}

.form-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
}

/* Radio Options List */
.radio-options-list {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.radio-option-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  user-select: none;
}

.radio-circle {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  border: 1.8px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.radio-option-item--selected .radio-circle {
  border-color: #3FD246;
}

.radio-inner-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: #3FD246;
}

.radio-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

/* Custom Datetime Box */
.custom-datetime-box {
  margin-top: 1.25rem;
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  max-width: 480px;
}

.datetime-row {
  display: flex;
  gap: 0.75rem;
}

/* Divider */
.section-divider {
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  margin: 2.25rem 0;
}

/* Checkbox Options List */
.checkbox-options-list {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.checkbox-option-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #ffffff;
  border: 1.8px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.custom-checkbox--checked {
  background: #3FD246;
  border-color: #3FD246;
}

.check-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: #ffffff;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

/* Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.75rem;
  margin-top: auto;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.75rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-back:hover { background: #f9fafb; }

.btn-next {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 2rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-next:hover { background: #34c03b; transform: translateY(-1px); }
.btn-arrow { width: 1rem; height: 1rem; }

/* Transition */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

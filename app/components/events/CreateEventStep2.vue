<template>
  <form class="step2-form" novalidate @submit.prevent="handleSubmit">
    <!-- Form Header -->
    <div class="form-header">
      <h3 class="form-title">Venue & Schedule</h3>
      <p class="form-subtitle">Where and when is your event happening?.</p>
    </div>

    <!-- 2-Column Layout -->
    <div class="form-body-grid">
      <!-- Left Column: Form Fields -->
      <div class="form-left-col">
        <!-- Venue Name -->
        <div class="field-group">
          <label for="input-venue-name" class="field-label">
            Venue Name <span class="required-star">*</span>
          </label>
          <input
            id="input-venue-name"
            v-model="formData.venueName"
            type="text"
            placeholder="Enter venue name"
            class="form-input"
          />
        </div>

        <!-- Address -->
        <div class="field-group">
          <label for="input-address" class="field-label">
            Address <span class="required-star">*</span>
          </label>
          <input
            id="input-address"
            v-model="formData.address"
            type="text"
            placeholder="13, Adebayo Doherty Street"
            class="form-input"
          />
        </div>

        <!-- City & State -->
        <div class="two-col-grid">
          <div class="field-group">
            <label for="input-city" class="field-label">
              City <span class="required-star">*</span>
            </label>
            <input
              id="input-city"
              v-model="formData.city"
              type="text"
              placeholder="Victoria Island"
              class="form-input"
            />
          </div>

          <div class="field-group">
            <label class="field-label">
              State <span class="required-star">*</span>
            </label>
            <AppSelect
              v-model="formData.state"
              :options="stateOptions"
              placeholder="Select state"
              searchable
            />
          </div>
        </div>

        <!-- Country -->
        <div class="field-group">
          <label class="field-label">
            Country <span class="required-star">*</span>
          </label>
          <AppSelect
            v-model="formData.country"
            :options="countryOptions"
            placeholder="Select country"
            searchable
          />
        </div>

        <!-- Start & End Date + Time -->
        <div class="two-col-grid">
          <!-- Start Date & Time -->
          <div class="field-group">
            <label class="field-label">
              Start Date & Time <span class="required-star">*</span>
            </label>
            <div class="date-time-row">
              <DatePicker v-model="formData.startDate" placeholder="Start date" />
              <TimePicker v-model="formData.startTime" placeholder="Start time" />
            </div>
          </div>

          <!-- End Date & Time -->
          <div class="field-group">
            <label class="field-label">
              End Date & Time <span class="required-star">*</span>
            </label>
            <div class="date-time-row">
              <DatePicker v-model="formData.endDate" placeholder="End date" />
              <TimePicker v-model="formData.endTime" placeholder="End time" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Map Graphic -->
      <div class="form-right-col">
        <div class="map-card">
          <div class="map-graphic">
            <!-- Simulated Map roads and pin -->
            <div class="map-road map-road-1" />
            <div class="map-road map-road-2" />
            <div class="map-pin-box">
              <div class="map-tooltip">Victoria Island, Lagos 106104, Lagos, Nigeria</div>
              <div class="pin-icon-wrap">📍</div>
            </div>
          </div>
        </div>
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

      <button type="submit" class="btn-save-continue">
        <span>Save & Continue</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppSelect from '~/components/ui/AppSelect.vue'
import DatePicker from '~/components/ui/DatePicker.vue'
import TimePicker from '~/components/ui/TimePicker.vue'

const emit = defineEmits<{
  back: []
  next: [data: typeof formData]
}>()

const stateOptions = [
  { value: 'Lagos', label: 'Lagos' },
  { value: 'Abuja', label: 'Abuja' },
  { value: 'Rivers', label: 'Rivers' },
  { value: 'Ogun', label: 'Ogun' },
  { value: 'Oyo', label: 'Oyo' },
  { value: 'Kano', label: 'Kano' },
  { value: 'Anambra', label: 'Anambra' },
  { value: 'Enugu', label: 'Enugu' },
]

const countryOptions = [
  { value: 'Nigeria', label: '🇳🇬  Nigeria' },
  { value: 'Ghana', label: '🇬🇭  Ghana' },
  { value: 'Kenya', label: '🇰🇪  Kenya' },
  { value: 'South Africa', label: '🇿🇦  South Africa' },
  { value: 'United Kingdom', label: '🇬🇧  United Kingdom' },
  { value: 'United States', label: '🇺🇸  United States' },
]

const formData = reactive({
  venueName: '',
  address: '',
  city: '',
  state: 'Lagos',
  country: 'Nigeria',
  startDate: null as Date | null,
  startTime: '',
  endDate: null as Date | null,
  endTime: '',
})

function handleSubmit() {
  emit('next', { ...formData })
}
</script>

<style scoped>
.step2-form {
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 1.75rem;
}

.form-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.form-body-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.25rem;
  margin-bottom: 2.25rem;
}

.form-left-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Date + Time stacked side-by-side within a field */
.date-time-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #0E2615;
}

.required-star {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  transition: all 0.15s ease;
}

.form-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Select */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #6b7280;
  pointer-events: none;
}

/* Combined Date Time Box */
.combined-date-time-box {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  background: #ffffff;
  overflow: hidden;
}

.date-part, .time-part {
  display: flex;
  align-items: center;
  padding: 0 0.65rem;
  flex: 1;
}

.combined-input {
  width: 100%;
  border: none;
  padding: 0.75rem 0.35rem;
  font-size: 0.8rem;
  color: #1f2937;
  outline: none;
}

.divider {
  width: 1px;
  height: 2rem;
  background: #e5e7eb;
}

.input-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  flex-shrink: 0;
}

/* Map Card */
.map-card {
  width: 100%;
  height: 100%;
  min-height: 320px;
  border-radius: 1.15rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  position: relative;
}

.map-graphic {
  width: 100%;
  height: 100%;
  background: #fde68a; /* soft warm map styling */
  background-image: radial-gradient(#fcd34d 1.5px, transparent 1.5px), radial-gradient(#fcd34d 1.5px, #fef3c7 1.5px);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-road-1 {
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  height: 24px;
  background: #ffffff;
  transform: rotate(-15deg);
}

.map-road-2 {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 55%;
  width: 24px;
  background: #ffffff;
}

.map-pin-box {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-tooltip {
  background: #000000;
  color: #ffffff;
  font-size: 0.675rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 0.35rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
}

.pin-icon-wrap {
  font-size: 1.75rem;
}

/* Footer Actions */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
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

.btn-save-continue {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.75rem;
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

.btn-save-continue:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-arrow { width: 1rem; height: 1rem; }

@media (max-width: 900px) {
  .form-body-grid { grid-template-columns: 1fr; }
  .two-col-grid { grid-template-columns: 1fr; }
}
</style>

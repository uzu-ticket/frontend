<template>
  <form class="step3-form" novalidate @submit.prevent="handleSubmit">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Contact Details</h3>
      <p class="form-subtitle">Where is your organization located ?</p>
    </div>

    <div class="fields-stack">
      <!-- Country -->
      <div class="field-group">
        <label for="select-country" class="field-label">
          Country <span class="required-star">*</span>
        </label>
        <div class="select-wrapper">
          <input
            id="select-country"
            v-model="formData.country"
            type="text"
            placeholder="Enter country name"
            class="form-input"
            :class="{ 'form-input--error': errors.country }"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="select-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <span v-if="errors.country" class="field-error">{{ errors.country }}</span>
      </div>

      <!-- State & City -->
      <div class="two-col-row">
        <div class="field-group">
          <label for="input-state" class="field-label">
            State <span class="required-star">*</span>
          </label>
          <input
            id="input-state"
            v-model="formData.state"
            type="text"
            placeholder="Lagos"
            class="form-input"
            :class="{ 'form-input--error': errors.state }"
          />
          <span v-if="errors.state" class="field-error">{{ errors.state }}</span>
        </div>

        <div class="field-group">
          <label for="input-city" class="field-label">
            City <span class="required-star">*</span>
          </label>
          <input
            id="input-city"
            v-model="formData.city"
            type="text"
            placeholder="Lekki"
            class="form-input"
            :class="{ 'form-input--error': errors.city }"
          />
          <span v-if="errors.city" class="field-error">{{ errors.city }}</span>
        </div>
      </div>

      <!-- Office Address -->
      <div class="field-group">
        <label for="input-address" class="field-label">
          Office Address <span class="required-star">*</span>
        </label>
        <input
          id="input-address"
          v-model="formData.address"
          type="text"
          placeholder="Please select industry"
          class="form-input"
          :class="{ 'form-input--error': errors.address }"
        />
        <span v-if="errors.address" class="field-error">{{ errors.address }}</span>
      </div>

      <!-- Support Email & Support Phone -->
      <div class="two-col-row">
        <div class="field-group">
          <label for="input-support-email" class="field-label">
            Support Email <span class="required-star">*</span>
          </label>
          <input
            id="input-support-email"
            v-model="formData.supportEmail"
            type="email"
            placeholder="support@gmail.com"
            class="form-input"
            :class="{ 'form-input--error': errors.supportEmail }"
          />
          <span v-if="errors.supportEmail" class="field-error">{{ errors.supportEmail }}</span>
        </div>

        <div class="field-group">
          <label for="input-support-phone" class="field-label">
            Support Phone <span class="required-star">*</span>
          </label>
          <div class="phone-input-wrapper" :class="{ 'phone-input-wrapper--error': errors.supportPhone }">
            <div class="country-prefix">
              <span class="flag-icon">🇳🇬</span>
            </div>
            <input
              id="input-support-phone"
              v-model="formData.supportPhone"
              type="tel"
              placeholder="+234 8114 456 7864"
              class="phone-input"
            />
          </div>
          <span v-if="errors.supportPhone" class="field-error">{{ errors.supportPhone }}</span>
        </div>
      </div>
    </div>

    <!-- Form Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow-left" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <div class="footer-right-actions">
        <button type="button" class="btn-skip" @click="handleSkip">Skip</button>
        <button type="submit" class="btn-next">
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  back: []
  skip: []
  next: [data: typeof formData]
}>()

const formData = reactive({
  country: '',
  state: '',
  city: '',
  address: '',
  supportEmail: '',
  supportPhone: '',
})

const errors = reactive({
  country: '',
  state: '',
  city: '',
  address: '',
  supportEmail: '',
  supportPhone: '',
})

function validate() {
  let valid = true
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''))

  if (!formData.country.trim()) { errors.country = 'Country is required.'; valid = false }
  if (!formData.state.trim()) { errors.state = 'State is required.'; valid = false }
  if (!formData.city.trim()) { errors.city = 'City is required.'; valid = false }
  if (!formData.address.trim()) { errors.address = 'Office address is required.'; valid = false }
  if (!formData.supportEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
    errors.supportEmail = 'Valid support email is required.'; valid = false
  }
  if (!formData.supportPhone.trim()) { errors.supportPhone = 'Support phone is required.'; valid = false }

  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('next', { ...formData })
}

function handleSkip() {
  emit('skip')
}
</script>

<style scoped>
.step3-form { display: flex; flex-direction: column; }

.form-header { margin-bottom: 1.75rem; }
.form-title { font-size: 1.05rem; font-weight: 800; color: #0E2615; margin: 0 0 0.25rem; }
.form-subtitle { font-size: 0.85rem; color: #6b7280; margin: 0; }

.fields-stack { display: flex; flex-direction: column; gap: 1.35rem; margin-bottom: 2.25rem; }
.two-col-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.field-group { display: flex; flex-direction: column; gap: 0.4rem; }

.field-label { font-size: 0.825rem; font-weight: 700; color: #0E2615; }
.required-star { color: #ef4444; }

.form-input {
  width: 100%; padding: 0.75rem 1rem; background: #ffffff;
  border: 1px solid #e5e7eb; border-radius: 0.65rem;
  font-size: 0.875rem; color: #1f2937; outline: none; transition: all 0.15s ease;
}
.form-input::placeholder { color: #9ca3af; }
.form-input:focus { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.form-input--error { border-color: #ef4444 !important; }

.select-wrapper { position: relative; }
.select-arrow { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); width: 1.1rem; height: 1.1rem; color: #6b7280; pointer-events: none; }

.phone-input-wrapper { display: flex; align-items: center; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.65rem; overflow: hidden; transition: all 0.15s ease; }
.phone-input-wrapper:focus-within { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.country-prefix { padding: 0.75rem 0.75rem 0.75rem 1rem; display: flex; align-items: center; }
.flag-icon { font-size: 1.1rem; }
.phone-input { flex: 1; border: none; outline: none; padding: 0.75rem 1rem 0.75rem 0.25rem; font-size: 0.875rem; color: #1f2937; background: transparent; }

.field-error { font-size: 0.75rem; color: #ef4444; }

.form-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 1.5rem; }

.btn-back { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.75rem; background: #ffffff; border: 1px solid #e5e7eb; color: #0E2615; font-weight: 700; font-size: 0.85rem; border-radius: 0.65rem; cursor: pointer; transition: all 0.15s ease; }
.btn-back:hover { background: #f9fafb; border-color: #d1d5db; }

.footer-right-actions { display: flex; align-items: center; gap: 1rem; }

.btn-skip { padding: 0.65rem 1.25rem; background: transparent; border: none; color: #6b7280; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: underline; transition: color 0.15s; }
.btn-skip:hover { color: #0E2615; }

.btn-next { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.75rem; background: #3FD246; color: #ffffff; font-weight: 700; font-size: 0.85rem; border-radius: 0.65rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22); transition: all 0.15s ease; }
.btn-next:hover { background: #34c03b; transform: translateY(-1px); }
.btn-arrow, .btn-arrow-left { width: 1rem; height: 1rem; }

@media (max-width: 640px) { .two-col-row { grid-template-columns: 1fr; } }
</style>

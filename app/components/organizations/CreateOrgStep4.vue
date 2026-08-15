<template>
  <form class="step4-form" novalidate @submit.prevent="handleSubmit">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Settlement Details</h3>
      <p class="form-subtitle">Add your bank details to receive payouts. You can do this later</p>
    </div>

    <div class="fields-stack">
      <!-- Bank Name -->
      <div class="field-group">
        <label for="select-bank" class="field-label">
          Bank Name <span class="required-star">*</span>
        </label>
        <div class="select-wrapper">
          <select
            id="select-bank"
            v-model="formData.bankName"
            class="form-select"
            :class="{ 'form-select--error': errors.bankName }"
          >
            <option value="" disabled>Select bank name</option>
            <option value="access">Access Bank</option>
            <option value="gtb">Guaranty Trust Bank</option>
            <option value="zenith">Zenith Bank</option>
            <option value="uba">United Bank for Africa</option>
            <option value="first">First Bank Nigeria</option>
            <option value="sterling">Sterling Bank</option>
            <option value="kuda">Kuda Bank</option>
            <option value="opay">OPay</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="select-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <span v-if="errors.bankName" class="field-error">{{ errors.bankName }}</span>
      </div>

      <!-- Account Number -->
      <div class="field-group">
        <label for="input-account-number" class="field-label">
          Account Number <span class="required-star">*</span>
        </label>
        <input
          id="input-account-number"
          v-model="formData.accountNumber"
          type="text"
          inputmode="numeric"
          maxlength="10"
          placeholder="0123456789"
          class="form-input"
          :class="{ 'form-input--error': errors.accountNumber }"
        />
        <span v-if="errors.accountNumber" class="field-error">{{ errors.accountNumber }}</span>
      </div>

      <!-- Account Name -->
      <div class="field-group">
        <label for="input-account-name" class="field-label">
          Account Name <span class="required-star">*</span>
        </label>
        <input
          id="input-account-name"
          v-model="formData.accountName"
          type="text"
          placeholder="Zeenom Events Limited"
          class="form-input"
          :class="{ 'form-input--error': errors.accountName }"
        />
        <span v-if="errors.accountName" class="field-error">{{ errors.accountName }}</span>

        <!-- Match Banner -->
        <div v-if="formData.accountName && formData.registeredBusinessName && formData.accountName.toLowerCase() === formData.registeredBusinessName.toLowerCase()" class="match-banner">
          <svg xmlns="http://www.w3.org/2000/svg" class="match-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Account Name matches Registered Business Name</span>
        </div>
      </div>

      <!-- Business Registration Number (CAC) -->
      <div class="field-group">
        <label for="input-cac" class="field-label">
          Business Registration Number (CAC) <span class="required-star">*</span>
        </label>
        <input
          id="input-cac"
          v-model="formData.cacNumber"
          type="text"
          placeholder="RC1234567"
          class="form-input"
          :class="{ 'form-input--error': errors.cacNumber }"
        />
        <span v-if="errors.cacNumber" class="field-error">{{ errors.cacNumber }}</span>
      </div>

      <!-- Registered Business Name -->
      <div class="field-group">
        <label for="input-registered-name" class="field-label">
          Registered Business Name <span class="required-star">*</span>
        </label>
        <input
          id="input-registered-name"
          v-model="formData.registeredBusinessName"
          type="text"
          placeholder="Zeenom Events Limited"
          class="form-input"
          :class="{ 'form-input--error': errors.registeredBusinessName }"
        />
        <span v-if="errors.registeredBusinessName" class="field-error">{{ errors.registeredBusinessName }}</span>
      </div>

      <!-- Checkbox Confirmation -->
      <label class="checkbox-label">
        <input
          id="checkbox-confirm"
          v-model="formData.confirmed"
          type="checkbox"
          class="checkbox-input"
        />
        <span class="checkbox-text">I confirm that the bank account belongs to this registered business.</span>
      </label>
    </div>

    <!-- Form Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow-left" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <button type="submit" class="btn-create">
        Create Organization
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits<{
  back: []
  submit: [data: typeof formData]
}>()

const formData = reactive({
  bankName: '',
  accountNumber: '',
  accountName: '',
  cacNumber: '',
  registeredBusinessName: '',
  confirmed: false,
})

const errors = reactive({
  bankName: '',
  accountNumber: '',
  accountName: '',
  cacNumber: '',
  registeredBusinessName: '',
})

function validate() {
  let valid = true
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''))

  if (!formData.bankName) { errors.bankName = 'Please select a bank.'; valid = false }
  if (!formData.accountNumber.trim() || formData.accountNumber.length < 10) { errors.accountNumber = 'Enter a valid 10-digit account number.'; valid = false }
  if (!formData.accountName.trim()) { errors.accountName = 'Account name is required.'; valid = false }
  if (!formData.cacNumber.trim()) { errors.cacNumber = 'CAC number is required.'; valid = false }
  if (!formData.registeredBusinessName.trim()) { errors.registeredBusinessName = 'Registered business name is required.'; valid = false }

  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...formData })
}
</script>

<style scoped>
.step4-form { display: flex; flex-direction: column; }

.form-header { margin-bottom: 1.75rem; }
.form-title { font-size: 1.05rem; font-weight: 800; color: #0E2615; margin: 0 0 0.25rem; }
.form-subtitle { font-size: 0.85rem; color: #6b7280; margin: 0; }

.fields-stack { display: flex; flex-direction: column; gap: 1.35rem; margin-bottom: 2.25rem; }
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
.form-select { width: 100%; padding: 0.75rem 2.5rem 0.75rem 1rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.65rem; font-size: 0.875rem; color: #1f2937; outline: none; appearance: none; cursor: pointer; transition: all 0.15s ease; }
.form-select:focus { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.select-arrow { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); width: 1.1rem; height: 1.1rem; color: #6b7280; pointer-events: none; }

/* Match Banner */
.match-banner {
  display: flex; align-items: center; gap: 0.5rem;
  background: #DCFCE7; color: #16a34a;
  font-size: 0.8rem; font-weight: 700;
  padding: 0.65rem 1rem; border-radius: 0.5rem;
  margin-top: 0.25rem;
}
.match-icon { width: 1rem; height: 1rem; flex-shrink: 0; }

/* Checkbox */
.checkbox-label { display: flex; align-items: flex-start; gap: 0.65rem; cursor: pointer; }
.checkbox-input { width: 1rem; height: 1rem; accent-color: #3FD246; margin-top: 0.125rem; flex-shrink: 0; cursor: pointer; }
.checkbox-text { font-size: 0.825rem; color: #4b5563; line-height: 1.4; }

.field-error { font-size: 0.75rem; color: #ef4444; }

.form-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 1.5rem; }

.btn-back { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.75rem; background: #ffffff; border: 1px solid #e5e7eb; color: #0E2615; font-weight: 700; font-size: 0.85rem; border-radius: 0.65rem; cursor: pointer; transition: all 0.15s ease; }
.btn-back:hover { background: #f9fafb; border-color: #d1d5db; }

.btn-create { padding: 0.65rem 1.75rem; background: #3FD246; color: #ffffff; font-weight: 700; font-size: 0.85rem; border-radius: 0.65rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22); transition: all 0.15s ease; }
.btn-create:hover { background: #34c03b; transform: translateY(-1px); }
.btn-arrow-left { width: 1rem; height: 1rem; }
</style>

<template>
  <div class="withdrawal-form-container">
    <!-- Main Full-Width White Card Container -->
    <div class="withdrawal-card">
      <!-- Back Arrow Top Left inside Card -->
      <button class="back-btn" title="Go back to overview" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div class="form-content-wrapper">
        <!-- Top Available Balance Card -->
        <div class="balance-card">
          <div class="balance-icon-bg">
            <svg xmlns="http://www.w3.org/2000/svg" class="store-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-9 0v-7.5A.75.75 0 019 12.75h3a.75.75 0 01.75.75V21M3 9.75L4.5 4.5h15l1.5 5.25M3 9.75h18M3 9.75v10.125c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
          </div>
          <div class="balance-info">
            <span class="balance-label">Available Balance</span>
            <div class="balance-amount-row">
              <span class="currency-symbol">₦</span>
              <span class="amount-val">{{ formattedBalance }}</span>
            </div>
          </div>
        </div>

        <!-- Form Inputs -->
        <form class="form-body" @submit.prevent="handleSubmit">
          <!-- 1. Withdrawal Amount -->
          <div class="form-group">
            <label class="form-label">Withdrawal Amount</label>
            <div class="input-wrapper amount-input-wrapper">
              <span class="currency-prefix">₦</span>
              <input
                v-model="formattedAmountInput"
                type="text"
                class="form-input amount-input"
                placeholder="500,000"
                required
                @input="handleAmountInput"
              />
            </div>
            <span class="helper-text">Minimum withdrawal ₦5,000</span>
          </div>

          <!-- 2. Bank Name -->
          <div class="form-group">
            <div class="label-row">
              <label class="form-label">Bank Name</label>
              <button type="button" class="change-link" @click="toggleBankChange">Change</button>
            </div>
            <div class="select-wrapper">
              <select v-model="selectedBank" class="form-select">
                <option value="Zenith Bank">Zenith Bank..</option>
                <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
                <option value="Access Bank">Access Bank</option>
                <option value="First Bank">First Bank of Nigeria</option>
                <option value="UBA">United Bank for Africa (UBA)</option>
                <option value="Kuda Bank">Kuda Microfinance Bank</option>
                <option value="OPay">OPay Digital Bank</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" class="select-chevron" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="helper-text">Minimum withdrawal ₦5,000</span>
          </div>

          <!-- 3. Account Number -->
          <div class="form-group">
            <label class="form-label">Account Number</label>
            <input
              v-model="accountNumber"
              type="text"
              class="form-input"
              placeholder="0145661098"
              maxlength="10"
              required
            />

            <!-- Account Name Verified Callout Box -->
            <div v-if="accountName" class="account-name-pill">
              <span class="account-name-text">{{ accountName }}</span>
            </div>
          </div>

          <!-- Deduction Notice Banner -->
          <div class="deduction-notice-card">
            <div class="calc-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="calc-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="notice-text">
              A withdrawal of <strong>₦{{ feeAmount.toLocaleString() }}</strong> will be deducted. You will receive <strong>₦{{ netAmount.toLocaleString() }}</strong>
            </div>
          </div>

          <!-- Submit Button -->
          <button id="btn-withdraw-continue" type="submit" class="btn-continue">
            <span>Continue</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  formattedBalance: string
  rawBalance: number
}>()

const emit = defineEmits<{
  back: []
  continue: [data: { amount: number; bankName: string; accountNumber: string; accountName: string }]
}>()

const numericAmount = ref(500000)
const formattedAmountInput = ref('500,000')

const selectedBank = ref('Zenith Bank')
const accountNumber = ref('0145661098')
const accountName = ref('Divine Emmanuel NyenneAbasi')

const feeAmount = ref(500)

const netAmount = computed(() => {
  return Math.max(0, numericAmount.value - feeAmount.value)
})

function handleAmountInput(e: Event) {
  const input = e.target as HTMLInputElement
  const rawDigits = input.value.replace(/\D/g, '')
  if (!rawDigits) {
    numericAmount.value = 0
    formattedAmountInput.value = ''
    return
  }
  const val = parseInt(rawDigits, 10)
  numericAmount.value = val
  formattedAmountInput.value = val.toLocaleString('en-US')
}

function toggleBankChange() {
  const banks = ['Zenith Bank', 'GTBank', 'Access Bank', 'First Bank', 'UBA']
  const nextIdx = (banks.indexOf(selectedBank.value) + 1) % banks.length
  selectedBank.value = banks[nextIdx]
}

function handleSubmit() {
  if (numericAmount.value < 5000) {
    alert('Minimum withdrawal amount is ₦5,000')
    return
  }
  emit('continue', {
    amount: numericAmount.value,
    bankName: selectedBank.value,
    accountNumber: accountNumber.value,
    accountName: accountName.value,
  })
}
</script>

<style scoped>
.withdrawal-form-container {
  width: 100%;
}

/* Main Full-Width Card Body */
.withdrawal-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2.25rem 2.5rem 3rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: #111827;
  border-radius: 0.5rem;
  transition: background 0.15s;
  margin-bottom: 1.5rem;
}
.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
.back-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.form-content-wrapper {
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Balance Card */
.balance-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid #E8F5EB;
  background: #F8FCF9;
}

.balance-icon-bg {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  background: #E8F8EA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.store-icon {
  width: 1.8rem;
  height: 1.8rem;
  color: #15803D;
}

.balance-info {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.balance-amount-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.currency-symbol {
  font-size: 1.8rem;
  font-weight: 800;
  color: #3FD246;
}

.amount-val {
  font-size: 2.1rem;
  font-weight: 800;
  color: #0E2615;
  letter-spacing: -0.5px;
}

/* Form Styling */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.change-link {
  background: none;
  border: none;
  color: #3FD246;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}
.change-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-prefix {
  position: absolute;
  left: 1.1rem;
  font-weight: 800;
  font-size: 1.1rem;
  color: #111827;
}

.amount-input {
  padding-left: 2.5rem !important;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.form-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.85rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.form-select:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

.select-chevron {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6B7280;
  pointer-events: none;
}

.helper-text {
  font-size: 0.8rem;
  color: #6B7280;
  margin-top: 0.4rem;
}

.account-name-pill {
  margin-top: 0.6rem;
  background: #C8F5D2;
  padding: 0.75rem 1.1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.account-name-text {
  font-size: 0.925rem;
  font-weight: 700;
  color: #0E2615;
}

/* Deduction Notice Card */
.deduction-notice-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: #EAF8ED;
  padding: 1rem 1.25rem;
  border-radius: 0.85rem;
}

.calc-icon-wrapper {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.calc-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3FD246;
}

.notice-text {
  font-size: 0.875rem;
  color: #0E2615;
  line-height: 1.4;
}

/* Submit Button */
.btn-continue {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem 2.25rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  width: fit-content;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s ease, transform 0.15s ease;
  margin-top: 0.5rem;
}
.btn-continue:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}

.arrow-icon {
  width: 1.2rem;
  height: 1.2rem;
}
</style>

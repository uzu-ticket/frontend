<template>
  <div class="withdrawal-page">
    <!-- Demo Nav -->
    <div class="demo-nav-row">
      <NuxtLink to="/promoters" class="demo-nav-link">Dashboard</NuxtLink>
      <NuxtLink to="/promoters/withdrawal" class="demo-nav-link demo-nav-link--active">Withdrawal</NuxtLink>
      <NuxtLink to="/promoters/payout-details" class="demo-nav-link">Payout Details</NuxtLink>
      <NuxtLink to="/promoters/payout-history" class="demo-nav-link">Payout History</NuxtLink>
      <NuxtLink to="/promoters/create" class="demo-nav-link">+ Create Link</NuxtLink>
      <NuxtLink to="/promoters/link-ready" class="demo-nav-link">Link Ready</NuxtLink>
      <NuxtLink to="/promoters/invite" class="demo-nav-link">Invite Flow</NuxtLink>
    </div>

    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Back Button & Header -->
      <div class="card-header">
        <div class="back-row">
          <button type="button" class="back-link" @click="$router.push('/promoters')">
            <svg class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <h1 class="card-title">Withdrawal</h1>
        <p class="card-subtitle">You can now request withdrawal</p>
      </div>

      <!-- 2-Column Grid -->
      <div class="withdrawal-grid">
        <!-- Left Main Column -->
        <div class="main-col">
          <!-- Available Balance Card Banner -->
          <div class="balance-card">
            <div class="balance-bg-decor">
              <svg viewBox="0 0 100 100" class="decor-svg" fill="none">
                <circle cx="80" cy="20" r="30" stroke="#3FD246" stroke-opacity="0.2" stroke-width="6"/>
                <circle cx="90" cy="80" r="25" stroke="#3FD246" stroke-opacity="0.2" stroke-width="6"/>
              </svg>
            </div>

            <div class="balance-header">
              <span class="balance-label">Available Balance</span>
              <button type="button" class="btn-eye-toggle" @click="showBalance = !showBalance">
                <svg v-if="showBalance" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="eye-icon">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="eye-icon">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>

            <div class="balance-amount">
              {{ showBalance ? '₦ 35,000' : '₦ •••••••' }}
            </div>

            <div class="balance-footer-text">
              Only commissions from completed events are available.
            </div>
          </div>

          <!-- Form Fields -->
          <form class="withdrawal-form" @submit.prevent="handleWithdrawalSubmit">
            <!-- Amount -->
            <div class="form-group">
              <label class="form-label">Withdrawal Amount</label>
              <input
                v-model="amount"
                type="text"
                class="form-input"
                placeholder="N18,500"
              />
            </div>

            <!-- Bank Account -->
            <div class="form-group">
              <label class="form-label">Bank Account</label>
              <input
                v-model="bankName"
                type="text"
                class="form-input"
                placeholder="GTB Bank"
              />
            </div>

            <!-- Account Name -->
            <div class="form-group">
              <label class="form-label">Bank Name</label>
              <input
                v-model="accountName"
                type="text"
                class="form-input"
                placeholder="Jane May"
              />
              <!-- Verified badge box -->
              <div class="verified-name-pill">
                Jane May Eze
              </div>
            </div>

            <!-- Action Button -->
            <button type="submit" class="btn-submit-withdraw">
              + Request Withdrawal
            </button>
          </form>
        </div>

        <!-- Right Side Column: Tips -->
        <div class="side-col">
          <div class="tips-card">
            <h2 class="tips-title">Withdrawal Tips</h2>

            <div class="tips-list">
              <div class="tip-item">
                <span class="tip-text">Ensure your bank details are correct</span>
                <label class="toggle-switch">
                  <input type="checkbox" checked disabled />
                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="tip-item">
                <span class="tip-text">Minimum withdrawal is N5,000</span>
                <label class="toggle-switch">
                  <input type="checkbox" checked disabled />
                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="tip-item">
                <span class="tip-text">Processing time is 24–72 hours.</span>
                <label class="toggle-switch">
                  <input type="checkbox" checked disabled />
                  <span class="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Request Withdrawal — Promoters — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Request promoter commission withdrawal' },
  ],
})

const router = useRouter()
const showBalance = ref(true)
const amount = ref('N18,500')
const bankName = ref('GTB Bank')
const accountName = ref('Jane May')

const toast = useToast()

function handleWithdrawalSubmit() {
  toast.show({
    title: 'Withdrawal Requested',
    message: `Request of ${amount.value} submitted successfully.`,
    type: 'success',
  })
  router.push('/promoters/payout-history')
}
</script>

<style scoped>
.withdrawal-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Demo Nav */
.demo-nav-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.demo-nav-link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.15s ease;
}

.demo-nav-link:hover {
  border-color: #3FD246;
  color: #16a34a;
}

.demo-nav-link--active {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
}

/* Main Unified Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.back-row {
  margin-bottom: 0.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  gap: 0.35rem;
  transition: color 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.back-link:hover {
  color: #2bb832;
}

.back-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* 2-Column Grid */
.withdrawal-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Available Balance Card */
.balance-card {
  position: relative;
  background: linear-gradient(135deg, #e8fbe9 0%, #f0fdf4 100%);
  border: 1px solid #dcfce7;
  border-radius: 1.25rem;
  padding: 1.75rem 2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.balance-bg-decor {
  position: absolute;
  top: 0;
  right: 0;
  width: 160px;
  height: 100%;
  pointer-events: none;
}

.decor-svg {
  width: 100%;
  height: 100%;
}

.balance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.balance-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0E2615;
}

.btn-eye-toggle {
  background: transparent;
  border: none;
  color: #0E2615;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.balance-amount {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0E2615;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
}

.balance-footer-text {
  font-size: 0.8rem;
  color: #6b7280;
  position: relative;
  z-index: 1;
}

/* Form */
.withdrawal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: 'Outfit', sans-serif;
  color: #0E2615;
  font-weight: 600;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3FD246;
}

.verified-name-pill {
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.btn-submit-withdraw {
  width: max-content;
  padding: 0.85rem 2rem;
  border-radius: 0.75rem;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
  margin-top: 0.5rem;
}

.btn-submit-withdraw:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.3);
}

/* Side Column — Tips */
.tips-card {
  background: #ffffff;
  border: 1.5px solid #eef2ee;
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tips-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.tip-text {
  font-size: 0.82rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.4;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #3FD246;
  transition: 0.2s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
  transform: translateX(18px);
}

@media (max-width: 900px) {
  .withdrawal-grid {
    grid-template-columns: 1fr;
  }
}
</style>

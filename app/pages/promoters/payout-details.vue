<template>
  <div class="payout-details-page">
    <!-- Demo Nav -->
    <div class="demo-nav-row">
      <NuxtLink to="/promoters" class="demo-nav-link">Dashboard</NuxtLink>
      <NuxtLink to="/promoters/withdrawal" class="demo-nav-link">Withdrawal</NuxtLink>
      <NuxtLink to="/promoters/payout-details" class="demo-nav-link demo-nav-link--active">Payout Details</NuxtLink>
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

        <h1 class="card-title">Payout Details</h1>
        <p class="card-subtitle">You can now request withdrawal</p>
      </div>

      <!-- 2-Column Grid -->
      <div class="payout-grid">
        <!-- Left Column: Bank Details Form -->
        <div class="main-col">
          <h2 class="section-title">Bank Details</h2>

          <form class="bank-form" @submit.prevent="handleUpdate">
            <div class="form-group">
              <label class="form-label">Bank Name</label>
              <input
                v-model="bankName"
                type="text"
                class="form-input"
                placeholder="GTB Bank"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Bank Number</label>
              <input
                v-model="accountNumber"
                type="text"
                class="form-input"
                placeholder="0112233455"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Bank Name</label>
              <input
                v-model="accountName"
                type="text"
                class="form-input"
                placeholder="Jane May"
              />
            </div>

            <button type="submit" class="btn-update-details">
              Update Details
            </button>
          </form>
        </div>

        <!-- Right Column: Verification & Preferences -->
        <div class="side-col">
          <!-- Card 1: Verification Status -->
          <div class="side-card">
            <h2 class="card-title-sm">Verification Status</h2>
            <div class="verification-pill">
              Verified
            </div>
            <p class="verification-note">Your bank account is verified</p>
          </div>

          <!-- Card 2: Payout Preferences -->
          <div class="side-card">
            <h2 class="card-title-sm">Payout Preferences</h2>

            <div class="pref-list">
              <div class="pref-item">
                <span class="pref-label">Email me when I make a sale</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="notifySale" />
                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="pref-item">
                <span class="pref-label">Email me when commission is available</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="notifyAvailable" />
                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="pref-item">
                <span class="pref-label">Email me when payout is processed</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="notifyProcessed" />
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

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Payout Details — Promoters — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Promoter bank payout details' },
  ],
})

const bankName = ref('GTB Bank')
const accountNumber = ref('0112233455')
const accountName = ref('Jane May')

const notifySale = ref(true)
const notifyAvailable = ref(true)
const notifyProcessed = ref(true)

const toast = useToast()

function handleUpdate() {
  toast.show({
    title: 'Bank Details Updated',
    message: 'Your bank details have been saved successfully.',
    type: 'success',
  })
}
</script>

<style scoped>
.payout-details-page {
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
.payout-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.main-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

/* Form */
.bank-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 520px;
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

.btn-update-details {
  width: max-content;
  padding: 0.75rem 2.5rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #3FD246;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
  margin-top: 1rem;
}

.btn-update-details:hover {
  border-color: #3FD246;
  background: #f0fdf4;
}

/* Side Column */
.side-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.side-card {
  background: #ffffff;
  border: 1.5px solid #eef2ee;
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-title-sm {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.verification-pill {
  display: inline-flex;
  align-items: center;
  width: max-content;
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 0.78rem;
  font-weight: 700;
}

.verification-note {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

/* Preferences */
.pref-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pref-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pref-label {
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
  background-color: #e5e7eb;
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
}

input:checked + .toggle-slider {
  background-color: #3FD246;
}

input:checked + .toggle-slider:before {
  transform: translateX(18px);
}

@media (max-width: 900px) {
  .payout-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="create-promoter-page">
    <!-- Demo Nav -->
    <div class="demo-nav-row">
      <NuxtLink to="/promoters" class="demo-nav-link">Dashboard</NuxtLink>
      <NuxtLink to="/promoters/create" class="demo-nav-link demo-nav-link--active">+ Create Link</NuxtLink>
      <NuxtLink to="/promoters/link-ready" class="demo-nav-link">Link Ready</NuxtLink>
      <NuxtLink to="/promoters/invite" class="demo-nav-link">Invite Flow</NuxtLink>
    </div>

    <!-- Main Unified Card -->
    <div class="main-card">
      <h1 class="card-title">Create Promoter Link</h1>

      <form class="create-form" @submit.prevent="handleSubmit">
        <!-- Select Event -->
        <div class="form-group">
          <label class="form-label">Select Event</label>
          <div class="select-wrapper">
            <select v-model="selectedEvent" class="form-select">
              <option value="music-fest">Music Fest 2026</option>
              <option value="summer-tech">Summer Tech Camp</option>
              <option value="business-catchup">Business Catchup</option>
              <option value="tech-connect">Tech Connect Lagos</option>
            </select>
            <svg class="select-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Commission Type -->
        <div class="form-group">
          <label class="form-label">Commission Type</label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="commissionType" value="percentage" class="radio-input" />
              <span class="custom-radio" :class="{ 'custom-radio--active': commissionType === 'percentage' }">
                <span v-if="commissionType === 'percentage'" class="radio-dot" />
              </span>
              <span class="radio-label">Percentage</span>
            </label>

            <label class="radio-item">
              <input type="radio" v-model="commissionType" value="fixed" class="radio-input" />
              <span class="custom-radio" :class="{ 'custom-radio--active': commissionType === 'fixed' }">
                <span v-if="commissionType === 'fixed'" class="radio-dot" />
              </span>
              <span class="radio-label">Fixed Amount</span>
            </label>
          </div>
        </div>

        <!-- Rate / Value Input -->
        <div class="form-group">
          <label class="form-label">Commission Value</label>
          <div class="input-with-suffix">
            <input
              v-model="commissionValue"
              type="text"
              class="form-input"
              placeholder="10"
            />
            <span class="input-suffix">{{ commissionType === 'percentage' ? '%' : 'NGN' }}</span>
          </div>
        </div>

        <!-- Link Expires -->
        <div class="form-group">
          <label class="form-label">Link Expires (Optional)</label>
          <div class="select-wrapper">
            <select v-model="expiration" class="form-select">
              <option value="never">Never expires</option>
              <option value="7days">In 7 days</option>
              <option value="30days">In 30 days</option>
              <option value="event-end">When event ends</option>
            </select>
            <svg class="select-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="handleCancel">
            Cancel
          </button>
          <button type="submit" class="btn-submit">
            + Create Link
          </button>
        </div>
      </form>
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
  title: 'Create Promoter Link — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Create a new promoter link' },
  ],
})

const router = useRouter()

const selectedEvent = ref('music-fest')
const commissionType = ref<'percentage' | 'fixed'>('percentage')
const commissionValue = ref('10')
const expiration = ref('never')

function handleCancel() {
  router.push('/promoters')
}

function handleSubmit() {
  router.push('/promoters/link-ready')
}
</script>

<style scoped>
.create-promoter-page {
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

/* Select wrapper */
.select-wrapper {
  position: relative;
  width: 100%;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: 'Outfit', sans-serif;
  color: #374151;
  background: #ffffff;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.form-select:focus {
  border-color: #3FD246;
}

.select-chevron {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
  pointer-events: none;
}

/* Radio Group */
.radio-group {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
}

.radio-input {
  display: none;
}

.custom-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s ease;
  background: #fff;
}

.custom-radio--active {
  border-color: #3FD246;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3FD246;
}

.radio-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

/* Input with suffix */
.input-with-suffix {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: 'Outfit', sans-serif;
  color: #374151;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3FD246;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  pointer-events: none;
}

/* Actions */
.form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-cancel:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.btn-submit {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.65rem;
  border: none;
  background: #3FD246;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-submit:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.25);
}
</style>

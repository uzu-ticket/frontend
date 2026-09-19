<template>
  <div class="status-container">
    <!-- Main Full-Width White Card Container -->
    <div class="status-card">
      <!-- Back Arrow Top Left inside Card -->
      <button class="back-btn" title="Go back to overview" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div class="status-content-wrapper">
        <!-- Top Initiated Header Block -->
        <div class="header-block">
          <div class="status-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" class="status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-9 0v-7.5A.75.75 0 019 12.75h3a.75.75 0 01.75.75V21M3 9.75L4.5 4.5h15l1.5 5.25M3 9.75h18M3 9.75v10.125c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V9.75" />
            </svg>
          </div>
          <div class="header-text">
            <h2 class="header-title">Withdrawal Initiated</h2>
            <p class="header-subtitle">Your request has been received and is being processed</p>
          </div>
        </div>

        <div class="divider" />

        <!-- Key Details Breakdown Grid -->
        <div class="details-grid">
          <div class="detail-row">
            <span class="detail-label">Amount</span>
            <span class="detail-value">₦{{ withdrawal.amount.toLocaleString() }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Destination Bank</span>
            <span class="detail-value">{{ withdrawal.bankName }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Fee</span>
            <span class="detail-value">₦{{ withdrawal.fee.toLocaleString() }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Net Amount</span>
            <span class="detail-value">₦{{ withdrawal.netAmount.toLocaleString() }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Reference ID</span>
            <span class="detail-value ref-code">{{ withdrawal.referenceId }}</span>
          </div>
        </div>

        <div class="divider" />

        <!-- Processing Updates Timeline Stepper -->
        <div class="timeline-section">
          <h3 class="timeline-heading">Processing Updates</h3>

          <div class="stepper">
            <div
              v-for="(step, idx) in withdrawal.timeline"
              :key="idx"
              class="stepper-item"
              :class="[`stepper-item--${step.status}`]"
            >
              <!-- Vertical Line Connecting Steps -->
              <div v-if="idx < withdrawal.timeline.length - 1" class="stepper-line" />

              <!-- Icon Indicator -->
              <div class="stepper-icon">
                <!-- Completed Check Icon -->
                <svg v-if="step.status === 'completed'" xmlns="http://www.w3.org/2000/svg" class="icon-check" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>

                <!-- In Progress Dot Icon -->
                <div v-else-if="step.status === 'in_progress'" class="icon-progress">
                  <div class="inner-dot" />
                </div>

                <!-- Pending Empty Ring Icon -->
                <div v-else class="icon-pending" />
              </div>

              <!-- Content -->
              <div class="stepper-content">
                <span class="step-title">{{ step.title }}</span>
                <span class="step-time">{{ step.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Notification Banner -->
        <div class="notice-banner">
          <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>You'll be notified when the withdrawal is complete</span>
        </div>

        <!-- Action Button -->
        <div class="bottom-actions">
          <button id="btn-status-continue" class="btn-proceed" @click="$emit('complete')">
            Simulate Completion →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WithdrawalDetails } from '~/composables/useFinance'

defineProps<{
  withdrawal: WithdrawalDetails
}>()

defineEmits<{
  back: []
  complete: []
}>()
</script>

<style scoped>
.status-container {
  width: 100%;
}

.status-card {
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
  margin-bottom: 1.5rem;
}
.back-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.status-content-wrapper {
  max-width: 680px;
}

/* Header Block */
.header-block {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.status-icon-wrapper {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background: #E8F8EA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-icon {
  width: 2rem;
  height: 2rem;
  color: #15803D;
}

.header-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.header-subtitle {
  font-size: 0.9rem;
  color: #6B7280;
  margin: 0;
}

.divider {
  height: 1px;
  background: #F3F4F6;
  margin: 1.5rem 0;
}

/* Details Grid */
.details-grid {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-label {
  font-size: 0.9rem;
  color: #6B7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0E2615;
}

.ref-code {
  font-family: monospace;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}

/* Stepper */
.timeline-heading {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.5rem;
}

.stepper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 0.25rem;
}

.stepper-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
}

.stepper-line {
  position: absolute;
  left: 0.85rem;
  top: 1.75rem;
  bottom: -1.25rem;
  width: 2px;
  background: #E5E7EB;
}

.stepper-icon {
  position: relative;
  z-index: 2;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-check {
  width: 1.75rem;
  height: 1.75rem;
  color: #3FD246;
}

.icon-progress {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 2px solid #0E2615;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 9999px;
  background: #0E2615;
}

.icon-pending {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 9999px;
  border: 2px solid #9CA3AF;
  background: #ffffff;
}

.stepper-content {
  display: flex;
  flex-direction: column;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0E2615;
}

.step-time {
  font-size: 0.78rem;
  color: #6B7280;
  margin-top: 0.15rem;
}

/* Notice Banner */
.notice-banner {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #C8F5D2;
  padding: 0.85rem 1.1rem;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0E2615;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #15803D;
  flex-shrink: 0;
}

.bottom-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-proceed {
  background: none;
  border: 1px solid #3FD246;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-proceed:hover {
  background: #E8F8EA;
}
</style>

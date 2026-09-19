<template>
  <div class="tx-detail-container">
    <!-- Main Full-Width White Card Container -->
    <div class="tx-detail-card">
      <!-- Back Arrow Top Left inside Card -->
      <button class="back-btn" title="Go back to transactions" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div class="tx-content-wrapper">
        <!-- Top Header Block -->
        <div class="header-row">
          <div class="header-left">
            <div class="store-icon-bg">
              <svg xmlns="http://www.w3.org/2000/svg" class="store-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-9 0v-7.5A.75.75 0 019 12.75h3a.75.75 0 01.75.75V21M3 9.75L4.5 4.5h15l1.5 5.25M3 9.75h18M3 9.75v10.125c0 .621.504 1.125 1.125 1.125h15.75c.621 0 1.125-.504 1.125-1.125V9.75" />
              </svg>
            </div>
            <div class="title-meta">
              <h2 class="tx-title">{{ transaction.description }}</h2>
              <span class="tx-timestamp">{{ transaction.timestamp || transaction.date }}</span>
            </div>
          </div>
          <span class="type-pill" :class="{ 'type-pill--credit': transaction.type === 'Credit', 'type-pill--debit': transaction.type === 'Debit' }">
            {{ transaction.type }}
          </span>
        </div>

        <!-- Big Amount Display -->
        <div class="big-amount-row" :class="{ 'amount--credit': transaction.type === 'Credit', 'amount--debit': transaction.type === 'Debit' }">
          <span v-if="transaction.type === 'Credit'">+{{ transaction.amountFormatted.replace('₦', '') }}</span>
          <span v-else>-{{ transaction.amountFormatted.replace('₦', '') }}</span>
        </div>

        <div class="divider" />

        <!-- Key-Value Breakdown List -->
        <div class="details-list">
          <div v-if="transaction.event" class="detail-item">
            <span class="detail-label">Event</span>
            <span class="detail-value">{{ transaction.event }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Transaction ID</span>
            <span class="detail-value mono-text">{{ transaction.transactionId || transaction.id }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Reference ID</span>
            <span class="detail-value mono-text">{{ transaction.referenceId || 'EB-20260914-006' }}</span>
          </div>

          <div v-if="transaction.fee" class="detail-item">
            <span class="detail-label">Fee</span>
            <span class="detail-value">{{ transaction.fee }}</span>
          </div>

          <div v-if="transaction.netAmount" class="detail-item">
            <span class="detail-label">Net Amount</span>
            <span class="detail-value">{{ transaction.netAmount }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Status</span>
            <div class="status-badge-green">
              <span>{{ transaction.status }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="check-badge-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Download Receipt Action Button -->
        <div class="receipt-action-row">
          <button id="btn-download-tx-receipt" class="btn-download-receipt" @click="handleDownloadReceipt">
            <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Receipt</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FinanceTransaction } from '~/composables/useFinance'

const props = defineProps<{
  transaction: FinanceTransaction
}>()

defineEmits<{
  back: []
}>()

function handleDownloadReceipt() {
  const content = `TRANSACTION RECEIPT\n-------------------\nDescription: ${props.transaction.description}\nAmount: ${props.transaction.amountFormatted}\nDate: ${props.transaction.timestamp || props.transaction.date}\nStatus: ${props.transaction.status}\nReference: ${props.transaction.referenceId || props.transaction.id}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `receipt-${props.transaction.id}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
}
</script>

<style scoped>
.tx-detail-container {
  width: 100%;
}

.tx-detail-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2.25rem 2.5rem 3.5rem;
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

.tx-content-wrapper {
  max-width: 680px;
}

/* Header Row */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.store-icon-bg {
  width: 3.75rem;
  height: 3.75rem;
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

.title-meta {
  display: flex;
  flex-direction: column;
}

.tx-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.2rem;
}

.tx-timestamp {
  font-size: 0.85rem;
  color: #6B7280;
}

.type-pill {
  padding: 0.4rem 1.1rem;
  border-radius: 9999px;
  font-size: 0.825rem;
  font-weight: 700;
}

.type-pill--credit {
  background: #E8F8EA;
  color: #15803D;
}

.type-pill--debit {
  background: #FEE2E2;
  color: #DC2626;
}

/* Big Amount */
.big-amount-row {
  font-size: 2.35rem;
  font-weight: 800;
  margin-bottom: 1.75rem;
  letter-spacing: -0.5px;
}

.amount--credit {
  color: #0E2615;
}

.amount--debit {
  color: #DC2626;
}

.divider {
  height: 1px;
  background: #F3F4F6;
  margin: 1.75rem 0;
}

/* Details List */
.details-list {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  margin-bottom: 2.5rem;
}

.detail-item {
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

.mono-text {
  font-family: monospace;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}

.status-badge-green {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #DCFCE7;
  color: #16A34A;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.check-badge-icon {
  width: 1.1rem;
  height: 1.1rem;
}

/* Download Button */
.receipt-action-row {
  display: flex;
}

.btn-download-receipt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: #ffffff;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 2rem;
  border-radius: 0.65rem;
  border: 1px solid #D1D5DB;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  width: 100%;
}

.btn-download-receipt:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
}

.download-icon {
  width: 1.2rem;
  height: 1.2rem;
}
</style>

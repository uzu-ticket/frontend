<template>
  <div class="export-success-page">
    <div class="success-card">
      <div class="success-inner">

        <!-- Green Checkmark Badge Icon -->
        <div class="badge-wrapper">
          <div class="badge-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Heading & Subtitle -->
        <h2 class="success-title">Report exported successfully!</h2>
        <p class="success-subtitle">Your sales report has been generated and will be downloaded shortly.</p>

        <!-- File Details Card -->
        <div class="file-info-card">
          <h3 class="file-card-title">File</h3>

          <div class="file-meta-list">
            <div class="meta-row">
              <span class="meta-key">File name</span>
              <span class="meta-val font-bold">sales-report-2026-09-13.csv</span>
            </div>

            <div class="meta-row">
              <span class="meta-key">Size</span>
              <span class="meta-val">2.4 MB</span>
            </div>

            <div class="meta-row">
              <span class="meta-key">Generated</span>
              <span class="meta-val">Sept, 2026 . 11: 42 AM</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons-row">
          <button class="btn-download" @click="handleDownload">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download File</span>
          </button>

          <NuxtLink to="/reports" class="btn-close-link">Close</NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Report Exported Successfully — Uzu Ticket',
})

const toast = useToast()

function handleDownload() {
  toast.success('Downloading sales-report-2026-09-13.csv...')
}
</script>

<style scoped>
.export-success-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - 120px);
}

.success-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 3.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.success-inner {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

/* Badge Icon */
.badge-wrapper {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background: #DCFCE7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.badge-circle {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #3FD246;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.3);
}

.check-icon {
  width: 2.2rem;
  height: 2.2rem;
}

.success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.success-subtitle {
  font-size: 0.95rem;
  color: #6B7280;
  margin: 0;
}

/* File Info Box */
.file-info-card {
  width: 100%;
  background: #F9FAFB;
  border: 1px solid #86EFAC;
  border-radius: 1rem;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1.25rem;
  margin-top: 1rem;
}

.file-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.file-meta-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
}

.meta-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  font-size: 0.9rem;
}

.meta-key {
  color: #6B7280;
  font-weight: 500;
}

.meta-val {
  color: #111827;
}

.font-bold {
  font-weight: 700;
}

/* Action Buttons */
.action-buttons-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  margin-top: 1rem;
}

.btn-download {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s;
}
.btn-download:hover {
  background: #36bd3d;
}

.btn-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.btn-close-link {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
  text-decoration: none;
  transition: background 0.15s;
}
.btn-close-link:hover {
  background: #F9FAFB;
}

@keyframes popIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 600px) {
  .action-buttons-row {
    flex-direction: column;
  }
  .meta-row {
    grid-template-columns: 100px 1fr;
  }
}
</style>

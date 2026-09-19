<template>
  <div class="export-container">
    <!-- Main Full-Width White Card Container -->
    <div class="export-card">
      <!-- Back Arrow Top Left inside Card -->
      <button class="back-btn" title="Go back to overview" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div class="export-content-wrapper">
        <h2 class="export-title">Export Statement</h2>

        <!-- Tab Switcher -->
        <div class="tab-switcher-pill">
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'download' }"
            @click="activeTab = 'download'"
          >
            Download Statement
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'schedule' }"
            @click="activeTab = 'schedule'"
          >
            Schedule Reports
          </button>
        </div>

        <!-- 1. Date Range Selector -->
        <div class="form-group">
          <div class="select-wrapper">
            <select v-model="selectedDateRange" class="form-select">
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
              <option value="90">Last 90 days</option>
              <option value="year">This year</option>
              <option value="custom">Custom date range</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="select-chevron" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- 2. Format Option Cards -->
        <div class="format-section">
          <h3 class="section-label">Format</h3>

          <div class="format-cards-col">
            <!-- Option 1: CSV -->
            <div
              class="format-card"
              :class="{ 'format-card--selected': selectedFormat === 'csv' }"
              @click="selectedFormat = 'csv'"
            >
              <div class="radio-circle" :class="{ 'radio-circle--selected': selectedFormat === 'csv' }">
                <div v-if="selectedFormat === 'csv'" class="radio-dot" />
              </div>
              <div class="format-info">
                <span class="format-title">CSV</span>
                <span class="format-subtitle">Best for spreadsheet</span>
              </div>
            </div>

            <!-- Option 2: Excel -->
            <div
              class="format-card"
              :class="{ 'format-card--selected': selectedFormat === 'xlsx' }"
              @click="selectedFormat = 'xlsx'"
            >
              <div class="radio-circle" :class="{ 'radio-circle--selected': selectedFormat === 'xlsx' }">
                <div v-if="selectedFormat === 'xlsx'" class="radio-dot" />
              </div>
              <div class="format-info">
                <span class="format-title">Excel (XLSX)</span>
                <span class="format-subtitle">Best for analysis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Summary Breakdown Card -->
        <div class="summary-card">
          <div class="summary-row">
            <span class="summary-label">Total Transactions</span>
            <span class="summary-val bold-dark">24</span>
          </div>

          <div class="summary-row">
            <span class="summary-label text-green">Total Credit</span>
            <span class="summary-val text-green">+2,340,000.00</span>
          </div>

          <div class="summary-row">
            <span class="summary-label text-green">Total Debit</span>
            <span class="summary-val text-green">+1,120,000.00</span>
          </div>
        </div>

        <!-- Main CTA Button -->
        <button id="btn-do-export-statement" class="btn-download" @click="handleDownload">
          <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download Statement</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  back: []
  download: []
}>()

const activeTab = ref<'download' | 'schedule'>('download')
const selectedDateRange = ref('30')
const selectedFormat = ref<'csv' | 'xlsx'>('csv')

function handleDownload() {
  emit('download')
}
</script>

<style scoped>
.export-container {
  width: 100%;
}

.export-card {
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

.export-content-wrapper {
  max-width: 540px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.export-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

/* Tab Switcher */
.tab-switcher-pill {
  background: #0B2813;
  padding: 0.35rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
}

.tab-btn {
  flex: 1;
  background: transparent;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.tab-btn--active {
  background: #3FD246;
  color: #ffffff;
}

/* Form Styling */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.85rem 1.1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  appearance: none;
  cursor: pointer;
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

/* Format Section */
.format-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.format-cards-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.format-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.format-card--selected {
  border-color: #3FD246;
  background: #E8F8EA;
}

.radio-circle {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 9999px;
  border: 1.5px solid #D1D5DB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-circle--selected {
  border-color: #3FD246;
  background: #ffffff;
}

.radio-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 9999px;
  background: #3FD246;
}

.format-info {
  display: flex;
  flex-direction: column;
}

.format-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0E2615;
}

.format-subtitle {
  font-size: 0.78rem;
  color: #6B7280;
}

/* Summary Card */
.summary-card {
  border: 1px solid #E5E7EB;
  border-radius: 0.85rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-label {
  font-size: 0.875rem;
  color: #4B5563;
  font-weight: 500;
}

.text-green {
  color: #15803D !important;
  font-weight: 700;
}

.summary-val {
  font-size: 0.95rem;
  font-weight: 700;
}

.bold-dark {
  color: #0E2615;
}

/* Download Button */
.btn-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem 2.25rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s ease, transform 0.15s ease;
  width: 100%;
}

.btn-download:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}

.download-icon {
  width: 1.2rem;
  height: 1.2rem;
}
</style>

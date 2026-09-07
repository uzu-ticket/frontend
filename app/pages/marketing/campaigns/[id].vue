<template>
  <div class="campaign-detail-page">
    <div class="main-card">

      <!-- Back Link -->
      <div class="back-row">
        <NuxtLink to="/marketing" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to campaign
        </NuxtLink>
      </div>

      <!-- Campaign Title & Meta -->
      <div class="campaign-meta">
        <div class="campaign-title-row">
          <h1 class="campaign-title">Summer Tech Growth Summit</h1>
          <span class="status-badge status--sent">Sent</span>
        </div>
        <p class="campaign-date">Sent on 27 Sept, 2026 at 10:00 AM (WAT)</p>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content: Overview -->
      <div v-if="activeTab === 'overview'" class="tab-content">

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Total Campaigns</span>
            <div class="stat-value">5,245</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Delivered</span>
            <div class="stat-value">5,102</div>
          </div>
          <div class="stat-card">
            <span class="stat-label">Open Rate</span>
            <div class="stat-value">32.5%</div>
          </div>
          <div class="stat-card stat-card--empty">
            <span class="stat-label">Click Rate</span>
            <div class="stat-value stat-value--muted">—</div>
          </div>
        </div>

        <!-- Bottom Two-Col Grid -->
        <div class="bottom-grid">
          <!-- Performance Chart -->
          <div class="chart-section">
            <div class="chart-header">
              <h3 class="chart-title">Performance Overtime</h3>
              <div class="period-select">
                <span>7 Days</span>
                <svg class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div class="chart-wrapper">
              <!-- Y-axis labels -->
              <div class="y-axis">
                <span>800</span>
                <span>700</span>
                <span>600</span>
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>

              <div class="chart-inner">
                <svg class="chart-svg" viewBox="0 0 600 240" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#3FD246" stop-opacity="0.5" />
                      <stop offset="100%" stop-color="#3FD246" stop-opacity="0.03" />
                    </linearGradient>
                  </defs>

                  <!-- Grid Lines -->
                  <line x1="0" y1="20"  x2="600" y2="20"  stroke="#f3f4f6" stroke-dasharray="4 4" />
                  <line x1="0" y1="60"  x2="600" y2="60"  stroke="#f3f4f6" stroke-dasharray="4 4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#f3f4f6" stroke-dasharray="4 4" />
                  <line x1="0" y1="140" x2="600" y2="140" stroke="#f3f4f6" stroke-dasharray="4 4" />
                  <line x1="0" y1="180" x2="600" y2="180" stroke="#f3f4f6" stroke-dasharray="4 4" />
                  <line x1="0" y1="220" x2="600" y2="220" stroke="#e5e7eb" />

                  <!-- Area Fill -->
                  <path
                    d="M 0,220 L 0,50 C 50,30 100,90 150,40 C 200,70 250,140 300,55 C 350,45 400,150 450,45 C 490,100 540,55 600,40 L 600,220 Z"
                    fill="url(#perfGradient)"
                  />

                  <!-- Line Curve -->
                  <path
                    d="M 0,50 C 50,30 100,90 150,40 C 200,70 250,140 300,55 C 350,45 400,150 450,45 C 490,100 540,55 600,40"
                    fill="none"
                    stroke="#3FD246"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />

                  <!-- Data Node Dots -->
                  <circle cx="0"   cy="50"  r="4" fill="#3FD246" stroke="#fff" stroke-width="2" />
                  <circle cx="150" cy="40"  r="4" fill="#3FD246" stroke="#fff" stroke-width="2" />
                  <circle cx="300" cy="55"  r="4" fill="#3FD246" stroke="#fff" stroke-width="2" />
                  <circle cx="450" cy="45"  r="4" fill="#3FD246" stroke="#fff" stroke-width="2" />
                  <circle cx="600" cy="40"  r="4" fill="#3FD246" stroke="#fff" stroke-width="2" />
                </svg>

                <!-- X-axis Labels -->
                <div class="x-axis">
                  <span>Aug 5</span>
                  <span>Aug 6</span>
                  <span>Aug 7</span>
                  <span>Aug 8</span>
                  <span>Aug 9</span>
                  <span>Aug 7</span>
                  <span>InDesign</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Links Clicked -->
          <div class="links-section">
            <h3 class="links-title">Top Links Clicked</h3>
            <div class="links-list">
              <div v-for="link in topLinks" :key="link.label" class="link-item">
                <div class="link-info">
                  <span class="link-label">{{ link.label }}</span>
                  <span class="link-url">{{ link.url }}</span>
                  <div class="link-bar-track">
                    <div
                      class="link-bar-fill"
                      :style="{ width: `${(link.clicks / 212) * 100}%` }"
                    />
                  </div>
                </div>
                <span class="link-clicks">{{ link.clicks }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Recipient -->
      <div v-if="activeTab === 'recipient'" class="tab-content tab-empty">
        <div class="empty-state">
          <p class="empty-text">Recipient details will appear here once the campaign is sent.</p>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-if="activeTab === 'activity'" class="tab-content tab-empty">
        <div class="empty-state">
          <p class="empty-text">Activity log will appear here once the campaign is sent.</p>
        </div>
      </div>

      <!-- Tab Content: Clicks -->
      <div v-if="activeTab === 'clicks'" class="tab-content tab-empty">
        <div class="empty-state">
          <p class="empty-text">Click analytics will appear here once the campaign is sent.</p>
        </div>
      </div>

      <!-- Tab Content: Bounces -->
      <div v-if="activeTab === 'bounces'" class="tab-content tab-empty">
        <div class="empty-state">
          <p class="empty-text">Bounce details will appear here once the campaign is sent.</p>
        </div>
      </div>

      <!-- Tab Content: Unsubscribes -->
      <div v-if="activeTab === 'unsubscribes'" class="tab-content tab-empty">
        <div class="empty-state">
          <p class="empty-text">Unsubscribe data will appear here once the campaign is sent.</p>
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
  title: 'Summer Tech Growth Summit — Uzu Ticket',
  meta: [
    { name: 'description', content: 'View campaign analytics, performance, and engagement metrics.' },
  ],
})

const activeTab = ref('overview')

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'activity', label: 'Activity' },
  { value: 'clicks', label: 'Clicks' },
  { value: 'bounces', label: 'Bounces' },
  { value: 'unsubscribes', label: 'Unsubscribes' },
]

const topLinks = [
  { label: 'Get My Tickets', url: 'uzutickets.com/events/summer-festival', clicks: 212 },
  { label: 'View Event Details', url: 'uzutickets.com/events/summer-festival', clicks: 92 },
  { label: 'Meet The Artist', url: 'uzutickets.com/events/summer-festival', clicks: 78 },
]
</script>

<style scoped>
.campaign-detail-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Back */
.back-row {
  margin-bottom: -0.25rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: #374151;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* Campaign Meta */
.campaign-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.campaign-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.campaign-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  letter-spacing: -0.02em;
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status--sent {
  background: #dcfce7;
  color: #16a34a;
}

.campaign-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Tabs */
.tabs-bar {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #f3f4f6;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.65rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -2px;
  font-family: inherit;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn--active {
  color: #3FD246;
  border-bottom-color: #3FD246;
}

/* Tab Content */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tab-empty {
  min-height: 200px;
  justify-content: center;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.empty-text {
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #FAFDFA;
  border: 1px solid rgba(63, 210, 70, 0.45);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 210, 70, 0.08);
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
}

.stat-value {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stat-value--muted {
  color: #d1d5db;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;
  align-items: start;
}

/* Chart */
.chart-section {
  background: #f9fafb;
  border: 1px solid #eef2ee;
  border-radius: 0.85rem;
  padding: 1.25rem;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.period-select {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
}

.arrow-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: #6b7280;
}

.chart-wrapper {
  position: relative;
  display: flex;
  gap: 0.5rem;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #9ca3af;
  padding-bottom: 1.25rem;
  flex-shrink: 0;
  width: 2rem;
  text-align: right;
}

.chart-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chart-svg {
  width: 100%;
  height: 200px;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #9ca3af;
  padding: 0 0.25rem;
}

/* Top Links */
.links-section {
  background: #f9fafb;
  border: 1px solid #eef2ee;
  border-radius: 0.85rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.links-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.link-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.link-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
}

.link-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

.link-url {
  font-size: 0.72rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-bar-track {
  height: 5px;
  background: #e5e7eb;
  border-radius: 999px;
  margin-top: 0.35rem;
  overflow: hidden;
}

.link-bar-fill {
  height: 100%;
  background: #3FD246;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.link-clicks {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .campaign-title {
    font-size: 1.2rem;
  }

  .tabs-bar {
    overflow-x: auto;
  }
}
</style>

<template>
  <div class="overview-page">
    <!-- State Toggle Bar for Demo Switcher -->
    <div class="view-toggle-bar">
      <span class="toggle-label">Preview Mode:</span>
      <div class="toggle-pills">
        <button
          class="toggle-pill"
          :class="{ 'toggle-pill--active': !hasActiveOrg }"
          @click="hasActiveOrg = false"
        >
          Getting Started State
        </button>
        <button
          class="toggle-pill"
          :class="{ 'toggle-pill--active': hasActiveOrg }"
          @click="hasActiveOrg = true"
        >
          Active Org Data State
        </button>
      </div>
    </div>

    <!-- 1. GETTING STARTED STATE (EMPTY ORG) -->
    <template v-if="!hasActiveOrg">
      <!-- Top Hero Banner -->
      <OverviewHero />

      <!-- Bottom 2-Column Grid -->
      <div class="overview-grid">
        <OverviewCapabilities />
        <OverviewChecklist />
      </div>
    </template>

    <!-- 2. ACTIVE ORGANIZATION DATA STATE -->
    <template v-else>
      <!-- Top 4 Stat Cards Grid -->
      <OverviewMetrics />

      <!-- Middle 2-Column Row: Sales Summary Chart & Upcoming Events -->
      <div class="data-grid-row margin-bottom-row">
        <div class="grid-col-left">
          <OverviewSalesChart />
        </div>
        <div class="grid-col-right">
          <OverviewUpcomingEvents />
        </div>
      </div>

      <!-- Bottom 2-Column Row: Recent Orders & Activity Feed -->
      <div class="data-grid-row">
        <div class="grid-col-left">
          <OverviewRecentOrders />
        </div>
        <div class="grid-col-right">
          <OverviewActivityFeed />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import OverviewHero from '~/components/dashboard/OverviewHero.vue'
import OverviewCapabilities from '~/components/dashboard/OverviewCapabilities.vue'
import OverviewChecklist from '~/components/dashboard/OverviewChecklist.vue'

import OverviewMetrics from '~/components/dashboard/OverviewMetrics.vue'
import OverviewSalesChart from '~/components/dashboard/OverviewSalesChart.vue'
import OverviewUpcomingEvents from '~/components/dashboard/OverviewUpcomingEvents.vue'
import OverviewRecentOrders from '~/components/dashboard/OverviewRecentOrders.vue'
import OverviewActivityFeed from '~/components/dashboard/OverviewActivityFeed.vue'

import { useOrgState } from '~/composables/useOrgState'

definePageMeta({
  layout: 'dashboard',
})

const { hasActiveOrg } = useOrgState()

useHead({
  title: 'Overview — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your organization activity and track key metrics.' },
  ],
})
</script>

<style scoped>
.overview-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* View State Switcher */
.view-toggle-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.toggle-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}

.toggle-pills {
  display: flex;
  background: #e5e7eb;
  padding: 0.2rem;
  border-radius: 9999px;
  gap: 0.2rem;
}

.toggle-pill {
  padding: 0.35rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4b5563;
  background: transparent;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-pill--active {
  background: #ffffff;
  color: #0E2615;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Empty Getting Started Grid */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

/* Data State Rows */
.data-grid-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 1.25rem;
  align-items: stretch;
}

.margin-bottom-row {
  margin-bottom: 1.25rem;
}

.grid-col-left, .grid-col-right {
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .data-grid-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="overview-page">
    <!-- 1. GETTING STARTED STATE (EMPTY / NO ACTIVE ORG) -->
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
      <OverviewMetrics
        :loading="isOrgDashboardLoading"
        :total-events="totalEventsCount"
        :tickets-sold="3672"
        :total-revenue="5742200"
        :wallet-balance="1245600"
      />

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
import { ref, watch, onMounted } from 'vue'
import OverviewHero from '~/components/dashboard/OverviewHero.vue'
import OverviewCapabilities from '~/components/dashboard/OverviewCapabilities.vue'
import OverviewChecklist from '~/components/dashboard/OverviewChecklist.vue'

import OverviewMetrics from '~/components/dashboard/OverviewMetrics.vue'
import OverviewSalesChart from '~/components/dashboard/OverviewSalesChart.vue'
import OverviewUpcomingEvents from '~/components/dashboard/OverviewUpcomingEvents.vue'
import OverviewRecentOrders from '~/components/dashboard/OverviewRecentOrders.vue'
import OverviewActivityFeed from '~/components/dashboard/OverviewActivityFeed.vue'

import { useOrgState } from '~/composables/useOrgState'
import { useEvents } from '~/composables/useEvents'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Overview — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your organization activity and track key metrics.' },
  ],
})

const { hasActiveOrg, activeOrgId } = useOrgState()
const { fetchEvents } = useEvents()

const isOrgDashboardLoading = ref(false)
const totalEventsCount = ref(0)

async function loadDashboardData() {
  if (!activeOrgId.value) return
  isOrgDashboardLoading.value = true
  try {
    const eventsList = await fetchEvents(true)
    totalEventsCount.value = eventsList.length
  } catch (e) {
    console.error('Failed to load dashboard data:', e)
  } finally {
    isOrgDashboardLoading.value = false
  }
}

onMounted(() => {
  if (hasActiveOrg.value) {
    loadDashboardData()
  }
})

watch(activeOrgId, (newId) => {
  if (newId) {
    loadDashboardData()
  }
})
</script>

<style scoped>
.overview-page {
  max-width: 1200px;
  margin: 0 auto;
}
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

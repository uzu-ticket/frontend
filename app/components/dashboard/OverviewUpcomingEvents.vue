<template>
  <div class="upcoming-events-card">
    <!-- Header -->
    <div class="card-header">
      <h3 class="card-title">Upcoming Events</h3>
      <NuxtLink to="/events" class="view-all-link">View All</NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && itemsList.length === 0" class="events-list">
      <div v-for="i in 3" :key="i" class="event-item loading-item">
        <AppSkeleton variant="circle" width="3.5rem" height="3.5rem" style="border-radius: 0.65rem;" />
        <div class="event-info" style="width: 70%;">
          <AppSkeleton variant="text" width="90%" height="0.9rem" class="mb-1" />
          <AppSkeleton variant="text" width="60%" height="0.75rem" class="mb-1" />
          <AppSkeleton variant="text" width="40%" height="0.7rem" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="itemsList.length === 0" class="empty-state">
      <div class="empty-icon-badge">
        <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="empty-text">No upcoming events found</p>
      <NuxtLink to="/events" class="create-event-link">+ Create an Event</NuxtLink>
    </div>

    <!-- Scrollable Event List -->
    <div v-else class="events-list-container" @scroll="onScroll">
      <div class="events-list">
        <NuxtLink
          v-for="(event, idx) in itemsList"
          :key="event.id"
          to="/events"
          class="event-item"
        >
          <!-- Thumbnail -->
          <div class="event-thumbnail">
            <div class="thumbnail-placeholder" :style="{ background: getGradient(idx) }">
              <svg xmlns="http://www.w3.org/2000/svg" class="thumb-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </div>

          <!-- Details -->
          <div class="event-info">
            <div class="title-row">
              <h4 class="event-name">{{ event.title }}</h4>
              <span v-if="event.status" class="status-badge" :class="statusBadgeClass(event.status)">
                {{ formatStatus(event.status) }}
              </span>
            </div>
            <span class="event-date">{{ formatDate(event.startsAt) }}</span>
            <span class="event-location">{{ formatLocation(event) }}</span>
          </div>
        </NuxtLink>

        <!-- Infinite Scroll Bottom Loader -->
        <div v-if="loadingMore" class="infinite-loader">
          <div class="spinner"></div>
          <span>Loading more events...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import { useDashboard } from '~/composables/useDashboard'
import type { DashboardUpcomingEvent } from '~/composables/useDashboard'

const props = defineProps<{
  events?: DashboardUpcomingEvent[]
  loading?: boolean
}>()

const { upcomingEvents: fallbackEvents, loading: dashboardLoading, fetchMoreUpcomingEvents } = useDashboard()

const isLoading = computed(() => props.loading ?? dashboardLoading.value)
const itemsList = ref<DashboardUpcomingEvent[]>([])
const loadingMore = ref(false)
const hasMore = ref(true)

watch(
  () => [props.events, fallbackEvents.value],
  () => {
    const initial = props.events && props.events.length > 0 ? props.events : fallbackEvents.value
    if (itemsList.value.length === 0 || initial.length > itemsList.value.length) {
      itemsList.value = [...initial]
      hasMore.value = initial.length >= 10
    }
  },
  { immediate: true, deep: true },
)

async function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (!el || loadingMore.value || !hasMore.value) return
  const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  if (scrollBottom < 50) {
    await loadMore()
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const nextBatch = await fetchMoreUpcomingEvents(itemsList.value.length, 10)
    if (nextBatch.length < 10) {
      hasMore.value = false
    }
    if (nextBatch.length > 0) {
      const existingIds = new Set(itemsList.value.map((item) => item.id))
      const filtered = nextBatch.filter((item) => !existingIds.has(item.id))
      if (filtered.length > 0) {
        itemsList.value = [...itemsList.value, ...filtered]
      } else {
        hasMore.value = false
      }
    }
  } catch (err) {
    console.error('Failed to load more upcoming events:', err)
  } finally {
    loadingMore.value = false
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Date TBD'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatLocation(event: DashboardUpcomingEvent): string {
  if (event.venueName && event.city) return `${event.venueName}, ${event.city}`
  if (event.venueName) return event.venueName
  if (event.city) return event.city
  return 'Venue TBD'
}

const gradients = [
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
]

function getGradient(index: number): string {
  return gradients[index % gradients.length]
}

function statusBadgeClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'published':
    case 'live':
      return 'badge--published'
    case 'draft':
      return 'badge--draft'
    case 'sales_closed':
      return 'badge--closed'
    default:
      return 'badge--default'
  }
}

function formatStatus(status: string): string {
  if (!status) return ''
  return status.replace(/_/g, ' ')
}
</script>

<style scoped>
.upcoming-events-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.view-all-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3FD246;
  text-decoration: none;
}
.view-all-link:hover { text-decoration: underline; }

.events-list-container {
  max-height: 380px;
  overflow-y: auto;
  padding-right: 0.35rem;
}

/* Custom Scrollbar */
.events-list-container::-webkit-scrollbar {
  width: 5px;
}
.events-list-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.events-list-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.75rem;
  transition: background 0.15s ease;
}
.event-item:hover {
  background: #f9fafb;
}

.event-thumbnail {
  width: 4rem;
  height: 3.5rem;
  border-radius: 0.65rem;
  overflow: hidden;
  flex-shrink: 0;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.thumb-icon {
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0.9;
}

.event-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.event-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
  margin: 0 0 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  text-transform: capitalize;
  white-space: nowrap;
}

.badge--published, .badge--live {
  background: #DCFCE7;
  color: #16A34A;
}

.badge--draft {
  background: #F3F4F6;
  color: #6B7280;
}

.badge--closed {
  background: #FEF9C3;
  color: #CA8A04;
}

.badge--default {
  background: #F3F4F6;
  color: #4B5563;
}

.event-date, .event-location {
  font-size: 0.775rem;
  color: #6b7280;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.infinite-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  text-align: center;
  flex: 1;
}

.empty-icon-badge {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #F0FDF1;
  color: #3FD246;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.empty-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.empty-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
}

.create-event-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3FD246;
  text-decoration: none;
}
.create-event-link:hover {
  text-decoration: underline;
}

.mb-1 { margin-bottom: 0.25rem; }
</style>
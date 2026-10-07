<template>
  <div class="activity-feed-card">
    <!-- Header -->
    <div class="card-header">
      <h3 class="card-title">Activity Feed</h3>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && itemsList.length === 0" class="feed-list">
      <div v-for="i in 4" :key="i" class="feed-item loading-item">
        <AppSkeleton variant="circle" width="2rem" height="2rem" style="border-radius: 0.5rem;" />
        <div style="flex: 1;">
          <AppSkeleton variant="text" width="85%" height="0.8rem" class="mb-1" />
          <AppSkeleton variant="text" width="30%" height="0.65rem" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="itemsList.length === 0" class="empty-state">
      <div class="empty-icon-badge">
        <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <p class="empty-text">No activity recorded yet.</p>
    </div>

    <!-- Scrollable Feed List -->
    <div v-else class="feed-list-container" @scroll="onScroll">
      <div class="feed-list">
        <div v-for="item in itemsList" :key="item.id" class="feed-item">
          <div class="feed-badge" :class="getBadgeClass(item.action)">
            <svg v-if="getBadgeType(item.action) === 'order'" xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <svg v-else-if="getBadgeType(item.action) === 'scan'" xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <svg v-else-if="getBadgeType(item.action) === 'member'" xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="feed-content">
            <span class="feed-text">{{ formatActivityText(item) }}</span>
            <span class="feed-time">{{ formatTimeAgo(item.createdAt) }}</span>
          </div>
        </div>

        <!-- Infinite Scroll Bottom Loader -->
        <div v-if="loadingMore" class="infinite-loader">
          <div class="spinner"></div>
          <span>Loading more activities...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import { useDashboard } from '~/composables/useDashboard'
import type { DashboardRecentActivity } from '~/composables/useDashboard'

const props = defineProps<{
  activities?: DashboardRecentActivity[]
  loading?: boolean
}>()

const { recentActivities: fallbackActivities, loading: dashboardLoading, fetchMoreActivities } = useDashboard()

const isLoading = computed(() => props.loading ?? dashboardLoading.value)
const itemsList = ref<DashboardRecentActivity[]>([])
const loadingMore = ref(false)
const hasMore = ref(true)

watch(
  () => [props.activities, fallbackActivities.value],
  () => {
    const initial = props.activities && props.activities.length > 0 ? props.activities : fallbackActivities.value
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
    const nextBatch = await fetchMoreActivities(itemsList.value.length, 10)
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
    console.error('Failed to load more activities:', err)
  } finally {
    loadingMore.value = false
  }
}

function formatActivityText(item: DashboardRecentActivity): string {
  const actor = item.actorName ? item.actorName : 'A user'
  const actionMap: Record<string, string> = {
    'event.created': `${actor} created an event`,
    'event.published': `${actor} published an event`,
    'event.updated': `${actor} updated event details`,
    'event.cancelled': `${actor} cancelled an event`,
    'order.created': `New ticket order placed`,
    'order.paid': `New ticket order paid`,
    'ticket.scanned': `Ticket scanned at gate`,
    'member.invited': `${actor} invited a team member`,
    'member.added': `${actor} joined the team`,
    'withdrawal.requested': `${actor} requested a payout`,
    'wallet.payout': `Payout processed`,
  }

  if (actionMap[item.action]) {
    return actionMap[item.action]
  }

  const formatted = item.action
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return item.actorName ? `${item.actorName}: ${formatted}` : formatted
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  const now = new Date()
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffSec < 60) return 'just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getBadgeType(action: string): 'order' | 'scan' | 'member' | 'default' {
  if (action.startsWith('order.')) return 'order'
  if (action.startsWith('ticket.')) return 'scan'
  if (action.startsWith('member.')) return 'member'
  return 'default'
}

function getBadgeClass(action: string): string {
  const type = getBadgeType(action)
  switch (type) {
    case 'order':
      return 'badge--order'
    case 'scan':
      return 'badge--scan'
    case 'member':
      return 'badge--member'
    default:
      return 'badge--default'
  }
}
</script>

<style scoped>
.activity-feed-card {
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

.feed-list-container {
  max-height: 380px;
  overflow-y: auto;
  padding-right: 0.35rem;
}

/* Custom Scrollbar */
.feed-list-container::-webkit-scrollbar {
  width: 5px;
}
.feed-list-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.feed-list-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feed-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.feed-badge {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge--default {
  background: #F0FDF1;
  color: #3FD246;
}

.badge--order {
  background: #EFF6FF;
  color: #3B82F6;
}

.badge--scan {
  background: #FEF3C7;
  color: #D97706;
}

.badge--member {
  background: #F3E8FF;
  color: #9333EA;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}

.feed-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.feed-text {
  font-size: 0.775rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.35;
}

.feed-time {
  font-size: 0.7rem;
  color: #9ca3af;
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
  margin: 0;
}

.mb-1 { margin-bottom: 0.25rem; }
</style>
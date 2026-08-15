<template>
  <div class="event-card">
    <!-- Cover Image Header -->
    <div class="card-cover" :style="{ background: event.bgGradient }">
      <!-- Background Image if available -->
      <img v-if="event.coverImage" :src="event.coverImage" :alt="event.title" class="cover-img" />

      <!-- Top Right 3-Dots Action Button & Dropdown -->
      <div class="action-menu-wrapper" @click.stop>
        <button
          class="dots-btn"
          aria-label="Event Options"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="dots-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <!-- Context Actions Dropdown -->
        <div v-if="isMenuOpen" class="context-menu">
          <button class="menu-item" @click="handleAction('edit')">
            <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          <button class="menu-item" @click="handleAction('duplicate')">
            <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Duplicate</span>
          </button>

          <button class="menu-item" @click="handleAction('analytics')">
            <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>View analytics</span>
          </button>

          <button class="menu-item" @click="handleAction('close-sales')">
            <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Close sales</span>
          </button>

          <button class="menu-item menu-item--delete" @click="handleAction('delete')">
            <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <!-- Bottom Left Status Badge -->
      <div class="status-badge-wrapper">
        <span
          class="status-badge"
          :class="event.status === 'Published' ? 'status-badge--published' : 'status-badge--closed'"
        >
          {{ event.status }}
        </span>
      </div>
    </div>

    <!-- Card Body Content -->
    <div class="card-body">
      <h3 class="event-title">{{ event.title }}</h3>

      <div class="info-row">
        <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="info-text">{{ event.location }}</span>
      </div>

      <div class="info-row">
        <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="info-text">{{ event.date }}</span>
      </div>

      <!-- Metrics Row -->
      <div class="card-metrics-row">
        <div class="metric-col">
          <span class="metric-num">{{ event.ticketsSold }}</span>
          <span class="metric-label">Tickets sold</span>
        </div>

        <div class="metric-col text-right">
          <span class="metric-num">{{ event.revenue }}</span>
          <span class="metric-label">Revenue</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface EventItem {
  id: number
  title: string
  location: string
  date: string
  status: 'Published' | 'Sales closed'
  ticketsSold: number
  revenue: string
  coverImage?: string
  bgGradient?: string
}

const props = defineProps<{
  event: EventItem
}>()

const emit = defineEmits<{
  action: [type: string, eventId: number]
}>()

const isMenuOpen = ref(false)

function handleAction(type: string) {
  isMenuOpen.value = false
  emit('action', type, props.event.id)
}

function closeMenu() {
  isMenuOpen.value = false
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('click', closeMenu)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', closeMenu)
  }
})
</script>

<style scoped>
.event-card {
  position: relative;
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  overflow: visible;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  z-index: 30;
}

/* Cover Image Header */
.card-cover {
  position: relative;
  height: 180px;
  width: 100%;
  border-radius: 1.25rem 1.25rem 0 0;
  overflow: visible;
  background-size: cover;
  background-position: center;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.25rem 1.25rem 0 0;
}

/* Dots Action Button */
.action-menu-wrapper {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  z-index: 50;
}

.dots-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: transform 0.15s ease;
}

.dots-btn:hover {
  transform: scale(1.05);
}

.dots-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #374151;
}

/* Context Menu */
.context-menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  right: 0;
  width: 160px;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  padding: 0.4rem 0;
  z-index: 20;
  animation: popoverFade 0.15s ease-out;
}

@keyframes popoverFade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.55rem 0.85rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f9fafb;
  color: #0E2615;
}

.menu-item--delete {
  color: #EF4444;
}

.menu-item--delete:hover {
  background: #FEF2F2;
  color: #DC2626;
}

.item-icon {
  width: 1rem;
  height: 1rem;
}

/* Status Badge */
.status-badge-wrapper {
  position: absolute;
  bottom: 0.85rem;
  left: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.status-badge--published {
  background: #0E2615;
  color: #3FD246;
}

.status-badge--closed {
  background: #FEF3C7;
  color: #D97706;
}

/* Card Body */
.card-body {
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.event-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.6rem;
  line-height: 1.3;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
}

.info-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.info-text {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Metrics Row */
.card-metrics-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 1.25rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f3f4f6;
}

.metric-col {
  display: flex;
  flex-direction: column;
}

.text-right {
  text-align: right;
}

.metric-num {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>

<template>
  <div class="upcoming-events-card">
    <!-- Header -->
    <div class="card-header">
      <h3 class="card-title">Upcoming Events</h3>
      <NuxtLink to="/events" class="view-all-link">View All</NuxtLink>
    </div>

    <!-- Event List -->
    <div class="events-list">
      <div v-for="event in events" :key="event.id" class="event-item">
        <!-- Thumbnail -->
        <div class="event-thumbnail">
          <div class="thumbnail-placeholder" :style="{ background: event.bgGradient }">
            <svg xmlns="http://www.w3.org/2000/svg" class="thumb-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>

        <!-- Details -->
        <div class="event-info">
          <h4 class="event-name">{{ event.title }}</h4>
          <span class="event-date">{{ event.date }}</span>
          <span class="event-location">{{ event.location }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const events = [
  {
    id: 1,
    title: 'Summer Tech Conference',
    date: 'August 24, 2026 - 9:00 AM',
    location: 'Victoria Island, Lagos',
    bgGradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  },
  {
    id: 2,
    title: 'Summer Tech Conference',
    date: 'August 24, 2026 - 9:00 AM',
    location: 'Victoria Island, Lagos',
    bgGradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  },
  {
    id: 3,
    title: 'Summer Tech Conference',
    date: 'August 24, 2026 - 9:00 AM',
    location: 'Victoria Island, Lagos',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  },
]
</script>

<style scoped>
.upcoming-events-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  height: 100%;
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

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
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
}

.event-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
  margin: 0 0 0.15rem;
}

.event-date, .event-location {
  font-size: 0.775rem;
  color: #6b7280;
  line-height: 1.3;
}
</style>

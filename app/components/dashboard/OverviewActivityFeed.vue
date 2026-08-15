<template>
  <div class="activity-feed-card">
    <!-- Header -->
    <div class="card-header">
      <h3 class="card-title">Activity Feed</h3>
      <NuxtLink to="/activity" class="view-all-link">View All</NuxtLink>
    </div>

    <!-- Feed List -->
    <div class="feed-list">
      <div v-for="item in activities" :key="item.id" class="feed-item">
        <div class="feed-badge">
          <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <span class="feed-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activities = [
  { id: 1, text: 'Early Bird Ticket for Summer Tech Conference Sold out' },
  { id: 2, text: 'Early Bird Ticket for Summer Tech Conference Sold out' },
  { id: 3, text: 'Early Bird Ticket for Summer Tech Conference Sold out' },
  { id: 4, text: 'Early Bird Ticket for Summer Tech Conference Sold out' },
]
</script>

<style scoped>
.activity-feed-card {
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

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.feed-badge {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #F0FDF1;
  color: #3FD246;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}

.feed-text {
  font-size: 0.775rem;
  color: #4b5563;
  line-height: 1.35;
}
</style>

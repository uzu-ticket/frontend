<template>
  <div class="topic-card">
    <div class="topic-badge" :style="{ backgroundColor: badgeBg, color: badgeColor }">
      <!-- Scanner Icon -->
      <svg v-if="icon === 'scanner'" xmlns="http://www.w3.org/2000/svg" class="topic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>

      <!-- Organization Icon -->
      <svg v-else-if="icon === 'organization'" xmlns="http://www.w3.org/2000/svg" class="topic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H7m4 0h2m-6 4h2m4 0h2" />
      </svg>

      <!-- Events Icon -->
      <svg v-else-if="icon === 'events'" xmlns="http://www.w3.org/2000/svg" class="topic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>

      <!-- Payments Icon -->
      <svg v-else-if="icon === 'payments'" xmlns="http://www.w3.org/2000/svg" class="topic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>

      <!-- Marketing Icon -->
      <svg v-else-if="icon === 'marketing'" xmlns="http://www.w3.org/2000/svg" class="topic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.684A1.761 1.761 0 013 12V8a1.761 1.761 0 012.436-1.684l.266.096M18 13l-4.5 3.5m0-11L18 9" />
      </svg>

      <!-- Tickets Icon -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="topic-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    </div>

    <div class="topic-info">
      <h4 class="topic-title">{{ title }}</h4>
      <p class="topic-description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon?: string
  badgeBg?: string
  badgeColor?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'events',
  badgeBg: '#e8f9e9',
  badgeColor: '#3FD246',
})
</script>

<style scoped>
.topic-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  background: #ffffff;
  border-radius: 0.875rem;
  border: 1px solid #eef2ee;
  cursor: pointer;
  transition: all 0.2s ease;
}

.topic-card:hover {
  border-color: #3FD246;
  box-shadow: 0 8px 24px rgba(63, 210, 70, 0.08);
  transform: translateY(-2px);
}

.topic-badge {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topic-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.topic-info {
  display: flex;
  flex-direction: column;
}

.topic-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
  line-height: 1.2;
}

.topic-description {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.45;
}
</style>

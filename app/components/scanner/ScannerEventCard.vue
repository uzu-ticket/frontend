<template>
  <div
    class="scanner-event-card"
    :class="{ 'scanner-event-card--clickable': clickable }"
    @click="clickable && $emit('click')"
  >
    <!-- Event Image Thumbnail -->
    <div class="event-image-wrapper">
      <img :src="imageUrl" :alt="title" class="event-image" />
    </div>

    <!-- Event Info Stack -->
    <div class="event-info">
      <h3 class="event-title">{{ title }}</h3>
      <p class="event-meta-datetime">{{ dateTime }}</p>
      <p class="event-meta-location">{{ location }}</p>
    </div>

    <!-- Right Side Actions & Badge -->
    <div class="event-right-slot">
      <span
        class="status-pill"
        :class="status === 'Live' ? 'status-pill--live' : 'status-pill--upcoming'"
      >
        {{ status }}
      </span>

      <svg
        v-if="clickable"
        xmlns="http://www.w3.org/2000/svg"
        class="chevron-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EventItem {
  id: string | number
  title: string
  dateTime: string
  location: string
  imageUrl: string
  status: 'Live' | 'Upcoming' | string
}

interface Props {
  title: string
  dateTime: string
  location: string
  imageUrl: string
  status?: string
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  status: 'Live',
  clickable: true,
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.scanner-event-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #F0FDF4;
  border: 1px solid #DCFCE7;
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  transition: all 0.2s ease;
  user-select: none;
}

.scanner-event-card--clickable {
  cursor: pointer;
}

.scanner-event-card--clickable:hover {
  border-color: #BBF7D0;
  box-shadow: 0 6px 16px rgba(14, 38, 21, 0.06);
  transform: translateY(-1px);
}

/* Image */
.event-image-wrapper {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 0.875rem;
  overflow: hidden;
  flex-shrink: 0;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info */
.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-meta-datetime {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
}

.event-meta-location {
  font-size: 0.825rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Right Side */
.event-right-slot {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.status-pill {
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.775rem;
  font-weight: 700;
}

.status-pill--live {
  background: #DCFCE7;
  color: #16A34A;
}

.status-pill--upcoming {
  background: #DCFCE7;
  color: #15803D;
  opacity: 0.9;
}

.chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #374151;
}
</style>

<template>
  <div class="scanner-select-page">
    <!-- Main Card Container -->
    <div class="select-container">
      <!-- Back Link -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <p class="select-prompt">Select event to monitor</p>

      <!-- Select Dropdown -->
      <div class="select-dropdown-wrapper">
        <AppSelect
          v-model="selectedEventId"
          :options="eventOptions"
          placeholder="Select event"
          @update:model-value="handleEventSelect"
        />
      </div>

      <!-- Events List Cards -->
      <div class="events-list">
        <ScannerEventCard
          v-for="event in events"
          :key="event.id"
          :title="event.title"
          :date-time="event.dateTime"
          :location="event.location"
          :image-url="event.imageUrl"
          :status="event.status"
          @click="selectEvent(event.id)"
        />
      </div>

      <!-- Footer Link -->
      <div class="footer-actions">
        <NuxtLink to="/events" class="view-all-events-link">
          View all events
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSelect from '~/components/ui/AppSelect.vue'
import ScannerEventCard, { type EventItem } from '~/components/scanner/ScannerEventCard.vue'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Select Event — Ticket Scanner',
})

const router = useRouter()

const selectedEventId = ref<string | number>('')

function goBack() {
  router.push('/scanner')
}

const eventOptions = [
  { value: 'summer-tech', label: 'Summer Tech Growth Summit' },
  { value: 'music-fest-2026', label: 'Music Festival 2026' },
]

function handleEventSelect(val: string | number | null) {
  if (val) selectEvent(val)
}

function selectEvent(id: string | number) {
  router.push(`/scanner/${id}`)
}

const events = ref<EventItem[]>([
  {
    id: 'summer-tech-1',
    title: 'Summer Tech Growth Summit',
    dateTime: 'Aug, 30 • 10:00AM',
    location: 'Victoria Island, Lagos, Nigeria.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80',
    status: 'Live',
  },
  {
    id: 'music-festival-2026',
    title: 'Music Festival 2026',
    dateTime: 'Aug, 30 • 10:00AM',
    location: 'Maryland Yaba, Lagos, Nigeria.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    status: 'Live',
  },
  {
    id: 'summer-tech-2',
    title: 'Summer Tech Growth Summit',
    dateTime: 'Aug, 30 • 10:00AM',
    location: 'Victoria Island, Lagos, Nigeria.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80',
    status: 'Upcoming',
  },
])
</script>

<style scoped>
.scanner-select-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.select-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Back Link */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 800;
  color: #16A34A;
  cursor: pointer;
  width: fit-content;
  transition: color 0.15s ease;
}

.back-button:hover {
  color: #15803D;
}

.back-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.select-prompt {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.select-dropdown-wrapper {
  max-width: 24rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.footer-actions {
  margin-top: 1rem;
}

.view-all-events-link {
  font-size: 0.9rem;
  font-weight: 800;
  color: #16A34A;
  text-decoration: none;
  transition: color 0.15s ease;
}

.view-all-events-link:hover {
  color: #15803D;
  text-decoration: underline;
}
</style>

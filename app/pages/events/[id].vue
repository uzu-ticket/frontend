<template>
  <div class="event-detail-page">
    <div class="event-detail-card">
      <!-- Back Link -->
      <div class="back-row">
        <NuxtLink to="/events" class="btn-back-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Back to events</span>
        </NuxtLink>
      </div>

      <!-- Top Hero Section (2-Column Layout) -->
      <div class="hero-section">
        <!-- Left: Cover Banner -->
        <div class="banner-wrapper">
          <div class="banner-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" class="banner-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Right: Event Info Stack -->
        <div class="info-stack">
          <div class="title-header-row">
            <h1 class="detail-event-title">The Startup Growth Summit</h1>
            <span class="status-badge">Published</span>
          </div>

          <p class="event-description">
            A one day gathering of top innovators, leaders and career experts, to talk about the futurue of finance
          </p>

          <div class="meta-list">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Saturday, August 24</span>
            </div>

            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>9:00 AM - 2:00 PM</span>
            </div>

            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Victoria Island, Lagos</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="hero-actions-row">
            <button class="btn-edit" @click="router.push('/events/create')">
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Event</span>
            </button>

            <button class="btn-share" @click="shareEvent">
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{{ copied ? 'Link Copied!' : 'Share Event' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Event Information Section -->
      <div class="section-block">
        <h2 class="section-heading">Event Information</h2>

        <div class="info-cards-grid">
          <!-- Card 1: Event Details -->
          <div class="detail-card">
            <h3 class="card-subheading">Event Details</h3>
            <div class="kv-stack">
              <div class="kv-row">
                <span class="kv-key">Category</span>
                <span class="kv-val">Technology</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Event Type</span>
                <span class="kv-val">Conference</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Visibility</span>
                <span class="kv-val">Public</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Time Zone</span>
                <span class="kv-val">West Africa Time (WAT)</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Schedule -->
          <div class="detail-card">
            <h3 class="card-subheading">Schedule</h3>
            <div class="kv-stack">
              <div class="kv-row">
                <span class="kv-key">Start Date & Time</span>
                <span class="kv-val">Aug 24, 2026 10:00 AM</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">End Date & Time</span>
                <span class="kv-val">Aug 24, 2026 3:00 PM</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Doors Open</span>
                <span class="kv-val">9:00 AM</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Doors Close</span>
                <span class="kv-val">Aug 23, 2026 11:59 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Media Section -->
      <div class="section-block">
        <h2 class="section-heading">Media</h2>

        <div class="media-grid">
          <div class="media-thumb-card media-thumb--1">
            <div class="media-thumb-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" class="media-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="media-thumb-card media-thumb--2">
            <div class="media-thumb-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" class="media-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Add More Card -->
          <div class="add-media-card" @click="triggerUpload">
            <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span class="add-text">Add More</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()
const copied = ref(false)

async function shareEvent() {
  try {
    await navigator.clipboard.writeText('https://uzuticket.com/events/startup-growth-summit-2026')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

function triggerUpload() {
  alert('Upload media dialog triggered')
}

useHead({
  title: 'The Startup Growth Summit — Uzu Ticket',
})
</script>

<style scoped>
.event-detail-page {
  width: 100%;
}

.event-detail-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.back-row {
  margin-bottom: 1.75rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.15s ease;
}
.btn-back-link:hover { color: #0E2615; }
.back-icon { width: 1rem; height: 1rem; }

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.25rem;
  margin-bottom: 3rem;
}

.banner-wrapper {
  width: 100%;
  height: 300px;
  border-radius: 1.25rem;
  overflow: hidden;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.banner-icon {
  width: 4rem;
  height: 4rem;
  opacity: 0.75;
}

.info-stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.detail-event-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.status-badge {
  background: #DCFCE7;
  color: #16A34A;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.event-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.meta-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6b7280;
}

/* Actions Row */
.hero-actions-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0E2615;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-edit:hover { background: #f9fafb; border-color: #d1d5db; }

.btn-share {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}
.btn-share:hover { background: #34c03b; transform: translateY(-1px); }

.btn-action-icon {
  width: 1rem;
  height: 1rem;
}

/* Sections */
.section-block {
  margin-bottom: 2.75rem;
}

.section-heading {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
}

/* Info Cards Grid */
.info-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.detail-card {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.card-subheading {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
}

.kv-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.kv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.kv-key {
  font-size: 0.825rem;
  color: #6b7280;
}

.kv-val {
  font-size: 0.825rem;
  font-weight: 700;
  color: #374151;
  text-align: right;
}

/* Media Section */
.media-grid {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.media-thumb-card {
  width: 140px;
  height: 120px;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
}

.media-thumb--1 {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.media-thumb--2 {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.media-thumb-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.media-icon {
  width: 2rem;
  height: 2rem;
  opacity: 0.8;
}

.add-media-card {
  width: 140px;
  height: 120px;
  border-radius: 1rem;
  border: 1.5px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #6b7280;
}

.add-media-card:hover {
  border-color: #3FD246;
  color: #3FD246;
  background: #f0fdf1;
}

.plus-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.add-text {
  font-size: 0.775rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .hero-section {
    grid-template-columns: 1fr;
  }
  .info-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>

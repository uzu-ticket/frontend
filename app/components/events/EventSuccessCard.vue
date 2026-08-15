<template>
  <div class="success-card-wrapper">
    <div class="success-card-content">
      <!-- Celebration Image -->
      <div class="illustration-box">
        <img src="/event-live.png" alt="Your Event is Live!" class="success-img" />
      </div>

      <!-- Heading Stack -->
      <h2 class="success-heading">Your Event is Live!</h2>
      <p class="success-subheading">Your organization is all set up and ready to go</p>

      <!-- Event Link Card Box -->
      <div class="event-link-box">
        <label class="link-label">Event Link</label>
        <div class="link-input-pill">
          <span class="link-url">{{ eventLink }}</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="success-buttons-row">
        <button class="btn-copy-link" @click="copyLink">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{{ copied ? 'Link Copied!' : 'Copy Event Link' }}</span>
        </button>

        <NuxtLink to="/events" class="btn-back-event">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Back to Event</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const eventLink = 'https://uzuticket.com/events/summer-tech-conference'
const copied = ref(false)

function copyLink() {
  if (import.meta.client) {
    navigator.clipboard.writeText(eventLink)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  }
}
</script>

<style scoped>
.success-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1.5rem;
}

.success-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 520px;
  width: 100%;
}

.illustration-box {
  width: 100%;
  max-width: 220px;
  margin-bottom: 1.25rem;
}

.success-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.success-heading {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

.success-subheading {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 2rem;
}

/* Event Link Box */
.event-link-box {
  width: 100%;
  background: #F0F4F8;
  border-radius: 0.875rem;
  padding: 1.25rem 1.5rem;
  text-align: left;
  margin-bottom: 2rem;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.link-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.65rem;
  display: block;
}

.link-input-pill {
  background: #E0E7FF;
  border-radius: 0.5rem;
  padding: 0.65rem 1rem;
}

.link-url {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2563EB;
  text-decoration: underline;
  word-break: break-all;
}

/* Buttons */
.success-buttons-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-copy-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-copy-link:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-back-event {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.65rem;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-back-event:hover {
  background: #f9fafb;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

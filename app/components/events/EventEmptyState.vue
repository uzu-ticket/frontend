<template>
  <div class="event-empty-card">
    <div class="empty-content">
      <!-- Empty Event Image -->
      <div class="illustration-wrapper">
        <img src="/empty-event.png" alt="No Event Yet" class="empty-event-img" />
      </div>

      <!-- Text -->
      <h2 class="empty-title">No Event Yet</h2>
      <p class="empty-subtitle">Create your first event in minutes.</p>

      <!-- Action Button -->
      <button id="btn-create-event-empty" class="btn-create-event" @click="$emit('create')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Create Event</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  create: []
}>()
</script>

<style scoped>
.event-empty-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 4rem 2rem;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 480px;
}

.illustration-wrapper {
  width: 260px;
  max-width: 100%;
  margin-bottom: 2rem;
}

.empty-event-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.empty-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 2rem;
}

.btn-create-event {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 2.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
  width: 100%;
  max-width: 360px;
}

.btn-create-event:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

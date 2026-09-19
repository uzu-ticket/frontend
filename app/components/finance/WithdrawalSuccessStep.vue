<template>
  <div class="success-container">
    <!-- Main Full-Width White Card Container -->
    <div class="success-card">
      <!-- Back Arrow Top Left inside Card -->
      <button class="back-btn" title="Go back to overview" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <!-- Centered Content Wrapper -->
      <div class="success-content-wrapper">
        <!-- Illustration -->
        <img src="/wallet-success.png" alt="Withdrawal Successful" class="success-illustration-img" />

        <!-- Text Header -->
        <h2 class="success-title">Withdrawal Successful</h2>
        <p class="success-subtitle">Withdrawal is complete and you will receive your payment shortly</p>

        <!-- Action Button -->
        <button id="btn-success-view-details" class="btn-view-details" @click="$emit('view-details')">
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
  'view-details': []
}>()
</script>

<style scoped>
.success-container {
  width: 100%;
}

.success-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2.25rem 2.5rem 4rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: #111827;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
.back-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.success-content-wrapper {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-illustration-img {
  width: 100%;
  max-width: 340px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 20px rgba(63, 210, 70, 0.15));
}

.success-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 1.75rem 0 0.5rem;
}

.success-subtitle {
  font-size: 0.95rem;
  color: #4B5563;
  margin: 0 0 2rem;
  max-width: 460px;
}

.btn-view-details {
  background: #3FD246;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.85rem 3rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s ease, transform 0.15s ease;
}
.btn-view-details:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}
</style>

<template>
  <div class="fp-page">
    <!-- Background image -->
    <div class="fp-bg" />

    <!-- Card -->
    <div class="fp-card-wrapper">
      <div class="fp-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="fp-heading">
          <h1>Forgot Password</h1>
          <p>Choose how you'd like to receive your password reset instructions.</p>
        </div>

        <!-- Reset Method Options -->
        <div class="fp-options">
          <!-- Email Option -->
          <div
            id="opt-email"
            class="fp-option-card"
            :class="{ 'fp-option-card--active': selectedMethod === 'email' }"
            @click="selectedMethod = 'email'"
          >
            <div class="fp-option-icon-badge">
              <!-- Envelope icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-UzuTBlack" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div class="fp-option-text">
              <h3>Email</h3>
              <p>Receive a reset link via email</p>
            </div>
          </div>

          <!-- Phone Number Option -->
          <div
            id="opt-phone"
            class="fp-option-card"
            :class="{ 'fp-option-card--active': selectedMethod === 'phone' }"
            @click="selectedMethod = 'phone'"
          >
            <div class="fp-option-icon-badge">
              <!-- Phone icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-UzuTBlack" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div class="fp-option-text">
              <h3>Phone Number</h3>
              <p>Receive a verification code via SMS</p>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="fp-action">
          <AppButton
            id="btn-continue"
            type="button"
            variant="primary"
            size="lg"
            block
            :loading="loading"
            @click="handleContinue"
          >
            Continue
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Forgot Password — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Choose how you would like to receive your password reset instructions.' },
  ],
})

const router = useRouter()
const selectedMethod = ref<'email' | 'phone'>('email')
const loading = ref(false)

async function handleContinue() {
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  loading.value = false

  if (selectedMethod.value === 'email') {
    router.push('/auth/reset-email')
  } else {
    router.push('/auth/reset-phone')
  }
}
</script>

<style scoped>
/* ── Page Shell ── */
.fp-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.fp-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.fp-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.fp-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.75rem 2.5rem 5.5rem;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

/* ── Back Button ── */
.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  color: #1a1a1a;
  cursor: pointer;
  margin-bottom: 1.5rem;
  margin-left: -0.25rem;
  transition: background 0.15s;
}
.back-btn:hover {
  background: #f3f4f6;
}

/* ── Heading ── */
.fp-heading {
  margin-bottom: 2rem;
}
.fp-heading h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.fp-heading p {
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}

/* ── Options Stack ── */
.fp-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.fp-option-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9fafb;
  border: 1.5px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.25rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fp-option-card:hover {
  background: #ffffff;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.fp-option-card--active {
  background: #ffffff;
  border-color: #3FD246;
  box-shadow: 0 4px 16px rgba(63, 210, 70, 0.12);
}

.fp-option-icon-badge {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.fp-option-text h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #0E2615;
  margin: 0 0 0.2rem;
}

.fp-option-text p {
  font-size: 0.85rem;
  color: #9ca3af;
  margin: 0;
}

/* ── Action ── */
.fp-action {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .fp-card {
    padding: 2rem 1.5rem 3.5rem;
  }
  .fp-heading h1 {
    font-size: 1.5rem;
  }
}
</style>

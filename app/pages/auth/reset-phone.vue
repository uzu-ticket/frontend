<template>
  <div class="rp-page">
    <!-- Background image -->
    <div class="rp-bg" />

    <!-- Card -->
    <div class="rp-card-wrapper">
      <div class="rp-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="rp-heading">
          <h1>Reset via Phone</h1>
          <p>Enter your phone number and we'll send you a verification code.</p>
        </div>

        <!-- Form -->
        <form id="reset-phone-form" class="rp-form" novalidate @submit.prevent="handleSubmit">
          <AppInput
            id="input-phone"
            v-model="phone"
            type="tel"
            placeholder="Enter your phone number"
            :error="error"
          />

          <div class="rp-action">
            <AppButton
              id="btn-send-code"
              type="submit"
              variant="primary"
              size="lg"
              block
              :loading="loading"
            >
              Send Code
            </AppButton>
          </div>
        </form>

        <!-- Footer -->
        <p class="rp-footer-link">
          Remember your password?
          <NuxtLink id="link-signin" to="/auth/signin" class="signin-anchor">Sign In</NuxtLink>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Reset via Phone — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Enter your phone number and we will send you a verification code.' },
  ],
})

const router = useRouter()
const phone = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!phone.value || phone.value.trim().length < 7) {
    error.value = 'Please enter a valid phone number.'
    return
  }
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  loading.value = false
  router.push(`/auth/verify-code?phone=${encodeURIComponent(phone.value)}`)
}
</script>

<style scoped>
/* ── Page Shell ── */
.rp-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.rp-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.rp-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.rp-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.75rem 2.5rem 5.5rem;
  min-height: 560px;
  display: flex;
  flex-direction: column;
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
.rp-heading {
  margin-bottom: 2rem;
}
.rp-heading h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.rp-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* ── Form ── */
.rp-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.rp-action {
  margin-top: 1rem;
}

/* ── Footer ── */
.rp-footer-link {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: auto;
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
}
.signin-anchor {
  color: #3FD246;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}
.signin-anchor:hover {
  color: #2db83a;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .rp-card {
    padding: 2rem 1.5rem 3.5rem;
  }
  .rp-heading h1 {
    font-size: 1.5rem;
  }
}
</style>

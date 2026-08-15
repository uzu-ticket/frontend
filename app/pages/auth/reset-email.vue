<template>
  <div class="re-page">
    <!-- Background image -->
    <div class="re-bg" />

    <!-- Card -->
    <div class="re-card-wrapper">
      <div class="re-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="handleBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- STATE 1: Reset via Email Form -->
        <template v-if="!isSent">
          <div class="re-heading">
            <h1>Reset via Email</h1>
            <p>Enter your email to receive a password reset link.</p>
          </div>

          <form id="reset-email-form" class="re-form" novalidate @submit.prevent="handleSubmit">
            <AppInput
              id="input-reset-email"
              v-model="email"
              type="email"
              placeholder="Enter your email address"
              :error="error"
            />

            <div class="re-action">
              <AppButton
                id="btn-send-reset-link"
                type="submit"
                variant="primary"
                size="lg"
                block
                :loading="loading"
              >
                Send Reset Link
              </AppButton>
            </div>
          </form>

          <p class="re-footer-link">
            Remember your password?
            <NuxtLink id="link-signin" to="/auth/signin" class="signin-anchor">Sign In</NuxtLink>
          </p>
        </template>

        <!-- STATE 2: Check Your Email (Sent Confirmation) -->
        <template v-else>
          <div class="re-heading">
            <h1>Check Your Email</h1>
            <p>We've sent a password reset link to <strong>{{ email || 'favour@gmail.com' }}</strong></p>
          </div>

          <!-- Envelope illustration (Click image to simulate opening email link) -->
          <div class="re-illustration" title="Click to simulate opening reset link from email" @click="goToResetPassword">
            <img src="/check-email.jpg" alt="Check Your Email" class="re-illustration-img" aria-hidden="true" />
          </div>

          <!-- Info callout box -->
          <div class="re-info-box">
            <svg xmlns="http://www.w3.org/2000/svg" class="re-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            <p>The link will expire in 15 seconds. Don't forget to check your spam folder.</p>
          </div>

          <p class="re-resend">
            Didn't receive the email?
            <button
              id="btn-resend"
              type="button"
              class="resend-anchor"
              :disabled="resendCooldown > 0"
              @click="handleResend"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend' }}
            </button>
          </p>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

useHead({
  title: 'Reset via Email — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Enter your email to receive a password reset link.' },
  ],
})

const router = useRouter()
const email = ref('')
const error = ref('')
const loading = ref(false)
const isSent = ref(false)
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function handleBack() {
  if (isSent.value) {
    isSent.value = false
  } else {
    router.back()
  }
}

async function handleSubmit() {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
  isSent.value = true
}

function goToResetPassword() {
  router.push('/auth/reset-password')
}

function handleResend() {
  if (resendCooldown.value > 0) return
  resendCooldown.value = 15
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<style scoped>
/* ── Page Shell ── */
.re-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.re-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.re-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.re-card {
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
.re-heading {
  margin-bottom: 2rem;
}
.re-heading h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.re-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}
.re-heading strong {
  color: #0E2615;
  font-weight: 700;
}

/* ── Form ── */
.re-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.re-action {
  margin-top: 1rem;
}

/* ── Illustration ── */
.re-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 1.5rem;
  cursor: pointer;
}
.re-illustration-img {
  width: 220px;
  height: auto;
  display: block;
  transition: transform 0.2s ease;
}
.re-illustration:hover .re-illustration-img {
  transform: scale(1.03);
  filter: drop-shadow(0 10px 20px rgba(248, 205, 83, 0.25));
}

/* ── Info Box ── */
.re-info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f0fdf1;
  border-radius: 0.875rem;
  padding: 1rem 1.125rem;
  margin-bottom: 1.5rem;
}
.re-info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #374151;
  flex-shrink: 0;
  margin-top: 0.05rem;
}
.re-info-box p {
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

/* ── Footers ── */
.re-footer-link {
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

.re-resend {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: auto;
  margin-bottom: 1.5rem;
}
.resend-anchor {
  background: none;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 0.2rem;
}
.resend-anchor:hover:not(:disabled) {
  color: #2db83a;
}
.resend-anchor:disabled {
  color: #9ca3af;
  cursor: default;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .re-card {
    padding: 2rem 1.5rem 3.5rem;
  }
  .re-heading h1 {
    font-size: 1.5rem;
  }
}
</style>

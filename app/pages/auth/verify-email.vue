<template>
  <div class="ve-page">
    <!-- Background -->
    <div class="ve-bg" />

    <div class="ve-card-wrapper">
      <!-- ═════════════════════════════════════════════════════
           STATE 1: VERIFYING LOADER (when token exists & verifying)
           ═════════════════════════════════════════════════════ -->
      <div v-if="token && isVerifying" class="ve-card ve-card-verifying">
        <div class="loader-content">
          <div class="spinner-ring" />
          <h2>Verifying your email...</h2>
          <p>Please wait while we confirm your account.</p>
        </div>
      </div>

      <!-- ═════════════════════════════════════════════════════
           STATE 2: EMAIL VERIFIED PAGE (exact design from screenshot)
           ═════════════════════════════════════════════════════ -->
      <div v-else-if="isVerified" class="ve-card ve-card-verified">
        <!-- Back button -->
        <button id="btn-back-verified" class="back-btn" aria-label="Go back" @click="goToLogin">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="verified-heading">
          <h1>Email verified</h1>
          <p>Your email has been successfully verified.<br>You can now <strong>sign in</strong> to your account</p>
        </div>

        <!-- Shield + Stars Illustration -->
        <div class="verified-illustration">
          <img src="/email-verified.png" alt="" class="verified-stars-img" aria-hidden="true" />
          <div class="verified-shield-bg">
            <img src="/shield-mark.png" alt="Email verified" class="verified-shield-mark" />
          </div>
        </div>

        <!-- Action CTA -->
        <div class="verified-actions">
          <AppButton
            id="btn-continue-login"
            type="button"
            variant="primary"
            size="lg"
            block
            @click="goToLogin"
          >
            Continue to Login
          </AppButton>
        </div>
      </div>

      <!-- ═════════════════════════════════════════════════════
           STATE 3: VERIFICATION ERROR (token invalid/expired)
           ═════════════════════════════════════════════════════ -->
      <div v-else-if="token && verificationError" class="ve-card ve-card-error">
        <!-- Back button -->
        <button id="btn-back-error" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div class="ve-heading">
          <h1>Verification link expired</h1>
          <p>{{ verificationError }}</p>
        </div>

        <div class="ve-info-box error-box">
          <p>Please request a new verification link to complete your account registration.</p>
        </div>

        <div class="ve-actions">
          <AppButton
            id="btn-resend-error"
            type="button"
            variant="primary"
            size="lg"
            block
            :loading="auth.loading.value"
            @click="handleResend"
          >
            Resend Verification Link
          </AppButton>
        </div>
      </div>

      <!-- ═════════════════════════════════════════════════════
           STATE 4: CHECK YOUR EMAIL (no token, after sign up)
           ═════════════════════════════════════════════════════ -->
      <div v-else class="ve-card">
        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="ve-heading">
          <h1>Check your email</h1>
          <p>We've sent a verification link to <strong>{{ email }}</strong></p>
        </div>

        <!-- Paper-plane illustration -->
        <div class="ve-illustration">
          <img src="/verify-email.png" alt="" class="ve-illustration-img" aria-hidden="true" />
        </div>

        <!-- Info box -->
        <div class="ve-info-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="ve-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          <p>Click the link in the email to verify your account and get started.</p>
        </div>

        <!-- Actions -->
        <div class="ve-actions">
          <AppButton
            id="btn-open-gmail"
            type="button"
            variant="primary"
            size="lg"
            block
            @click="openGmail"
          >
            Open Gmail
          </AppButton>

          <p class="ve-resend">
            Didn't receive the email?
            <button
              id="btn-resend"
              type="button"
              class="resend-link"
              :disabled="resendCooldown > 0"
              @click="handleResend"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

useHead({
  title: 'Verify Email — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Verify your Uzu Ticket account.' },
  ],
})

definePageMeta({
  layout: 'auth',
})

const auth = useAuth()
const route = useRoute()
const toast = useToast()

const email = computed(() => (route.query.email as string) || 'you@example.com')
const token = computed(() => (route.query.token as string) || '')

const isVerifying = ref(false)
const isVerified = ref(false)
const verificationError = ref('')
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function openGmail() {
  window.open('https://mail.google.com', '_blank', 'noopener')
}

async function handleResend() {
  if (resendCooldown.value > 0) return
  try {
    await auth.requestEmailVerification(email.value)
    toast.show({
      title: 'Verification Email Sent',
      message: `A new verification link has been sent to ${email.value}.`,
      type: 'success',
    })
    resendCooldown.value = 60
    cooldownTimer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0 && cooldownTimer) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
      }
    }, 1000)
  } catch {
    toast.show({
      title: 'Failed to Resend',
      message: auth.error.value || 'Could not resend the verification email. Please try again.',
      type: 'error',
    })
  }
}

async function runEmailVerification() {
  if (!token.value) return
  isVerifying.value = true
  verificationError.value = ''
  try {
    await auth.verifyEmail(email.value, token.value)
    isVerified.value = true
  } catch {
    verificationError.value = auth.error.value || 'The verification link is invalid or has expired.'
  } finally {
    isVerifying.value = false
  }
}

async function goToLogin() {
  await auth.logout()
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

watch(() => token.value, (newToken) => {
  if (newToken) {
    runEmailVerification()
  }
}, { immediate: true })
</script>

<style scoped>
/* ── Page Shell ── */
.ve-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.ve-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.ve-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Base Card ── */
.ve-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.5rem 2.5rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  min-height: 560px;
  justify-content: space-between;
}

/* ── Back button ── */
.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  color: #111827;
  cursor: pointer;
  margin-bottom: 1.25rem;
  margin-left: -0.25rem;
  transition: background 0.15s;
}
.back-btn:hover {
  background: #f3f4f6;
}

/* ── Check Email State Headings ── */
.ve-heading {
  margin-bottom: 1.5rem;
}
.ve-heading h1 {
  font-size: 1.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.4rem;
  line-height: 1.2;
}
.ve-heading p {
  font-size: 0.975rem;
  color: #6b7280;
  margin: 0;
}
.ve-heading strong {
  color: #0E2615;
  font-weight: 700;
}

/* ── Check Email Illustration ── */
.ve-illustration {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.ve-illustration-img {
  width: 290px;
  height: auto;
  display: block;
}

/* ── Info Box ── */
.ve-info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f0fdf1;
  border-radius: 0.875rem;
  padding: 1.05rem 1.2rem;
  margin-bottom: 1.5rem;
}
.ve-info-icon {
  width: 1.35rem;
  height: 1.35rem;
  color: #374151;
  flex-shrink: 0;
  margin-top: 0.05rem;
}
.ve-info-box p {
  font-size: 0.9rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}
.error-box {
  background: #fef2f2;
}
.error-box p {
  color: #991b1b;
}

/* ── Actions ── */
.ve-actions {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 0;
}
.ve-resend {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}
.resend-link {
  background: none;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 0.2rem;
  transition: color 0.15s;
}
.resend-link:hover:not(:disabled) {
  color: #2db83a;
}
.resend-link:disabled {
  color: #9ca3af;
  cursor: default;
}

/* ══════════════════════════════════════
   VERIFYING LOADER STATE
   ══════════════════════════════════════ */
.ve-card-verifying {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.spinner-ring {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: ve-spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}
@keyframes ve-spin {
  to {
    transform: rotate(360deg);
  }
}
.loader-content h2 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}
.loader-content p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

/* ══════════════════════════════════════
   EMAIL VERIFIED STATE (Matching Screenshot)
   ══════════════════════════════════════ */
.ve-card-verified {
  padding: 2.5rem 2.25rem 2.5rem;
  min-height: 560px;
  justify-content: space-between;
}

.verified-heading {
  margin-bottom: 1rem;
}
.verified-heading h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.verified-heading p {
  font-size: 0.975rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}
.verified-heading strong {
  color: #0E2615;
  font-weight: 700;
}

/* Illustration matching screenshot */
.verified-illustration {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 2rem;
}
.verified-stars-img {
  width: 290px;
  height: auto;
  display: block;
}
.verified-shield-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 148px;
  height: 148px;
  background-color: #EEF7EE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(63, 210, 70, 0.2);
}
.verified-shield-mark {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

/* Footer CTA */
.verified-actions {
  margin-top: 0.5rem;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .ve-card {
    padding: 2rem 1.5rem 2rem;
  }
  .verified-heading h1 {
    font-size: 1.85rem;
  }
}
</style>

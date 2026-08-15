<template>
  <div class="ve-page">
    <!-- Background -->
    <div class="ve-bg" />

    <!-- Card -->
    <div class="ve-card-wrapper">
      <div class="ve-card">

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

    <!-- ── Email Verified Modal ── -->
    <AppModal
      v-model="showVerifiedModal"
      size="sm"
      :closable="false"
      :close-on-backdrop="false"
      no-padding
    >
      <div class="evm">
        <!-- Back / close -->
        <button class="back-btn evm-back" aria-label="Close" @click="showVerifiedModal = false">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="evm-heading">
          <h2>Email verified</h2>
          <p>Your email has been successfully verified.<br>You can now <strong>sign in</strong> to your account</p>
        </div>

        <!-- Shield + sparkles illustration -->
        <div class="evm-illustration">
          <img src="/email-verified.png" alt="" class="evm-illustration-img" aria-hidden="true" />
          <div class="evm-shield-bg">
            <img src="/shield-mark.png" alt="" class="evm-shield-mark" aria-hidden="true" />
          </div>
        </div>

        <!-- CTA -->
        <div class="evm-footer">
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
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

useHead({
  title: 'Verify Email — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Check your email to verify your Uzu Ticket account.' },
  ],
})

const router = useRouter()
const route  = useRoute()

// Email passed as query param from signup, fallback to placeholder
const email = computed(() => (route.query.email as string) || 'you@example.com')

// Modal state
const showVerifiedModal = ref(false)

// Resend cooldown
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function openGmail() {
  window.open('https://mail.google.com', '_blank', 'noopener')
}

function handleResend() {
  if (resendCooldown.value > 0) return
  // TODO: call API resend endpoint
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

function goToLogin() {
  router.push('/auth/signin')
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

// ── Dev helper: expose so you can call showVerifiedModal = true from devtools ──
// In production, trigger this after polling confirms email verified
if (import.meta.dev) {
  // Auto-open after 3 s in dev so you can see the modal immediately
  // Remove this block before going to production
  setTimeout(() => { showVerifiedModal.value = false }, 0)
}
</script>

<style scoped>
/* ── Page shell ── */
.ve-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
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

/* ── Card ── */
.ve-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}
.ve-card {
  background: #fff;
  border-radius: 0;
  padding: 2.5rem 2.5rem 5.5rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
}

/* ── Back button (shared) ── */
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
.back-btn:hover { background: #f3f4f6; }

/* ── Heading ── */
.ve-heading {
  margin-bottom: 1.75rem;
}
.ve-heading h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.4rem;
  line-height: 1.2;
}
.ve-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}
.ve-heading strong { color: #0E2615; font-weight: 700; }

/* ── Illustration ── */
.ve-illustration {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
}
.ve-illustration-img {
  width: 320px;
  height: auto;
  display: block;
}

/* ── Info box ── */
.ve-info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f0fdf1;
  border-radius: 0.875rem;
  padding: 1rem 1.125rem;
  margin-bottom: 2rem;
}
.ve-info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #374151;
  flex-shrink: 0;
  margin-top: 0.05rem;
}
.ve-info-box p {
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

/* ── Actions ── */
.ve-actions { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
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
.resend-link:hover:not(:disabled) { color: #2db83a; }
.resend-link:disabled { color: #9ca3af; cursor: default; }

/* ══════════════════════════════════════
   Email Verified Modal inner content
   ══════════════════════════════════════ */
.evm {
  padding: 2.5rem 2.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  min-height: 560px;
  justify-content: space-between;
}
.evm-back {
  margin-bottom: 1rem;
}

/* Heading */
.evm-heading {
  margin-bottom: 1.5rem;
}
.evm-heading h2 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.4rem;
}
.evm-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}
.evm-heading strong { color: #0E2615; font-weight: 700; }

/* Illustration */
.evm-illustration {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
}
.evm-illustration-img {
  width: 290px;
  height: auto;
  display: block;
}
.evm-shield-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 152px;
  height: 152px;
  background-color: #EEF7EE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(63, 210, 70, 0.22);
}
.evm-shield-mark {
  width: 94px;
  height: 94px;
  object-fit: contain;
}

/* CTA */
.evm-footer { margin-top: 0.5rem; }

/* ── Responsive ── */
@media (max-width: 540px) {
  .ve-card { padding: 2rem 1.5rem 3.5rem; }
  .ve-heading h1 { font-size: 1.4rem; }
  .evm { padding: 1.75rem 1.5rem 2rem; }
}
</style>

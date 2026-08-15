<template>
  <div class="vc-page">
    <!-- Background image -->
    <div class="vc-bg" />

    <!-- Card -->
    <div class="vc-card-wrapper">
      <div class="vc-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="vc-heading">
          <h1>Enter Verification Code</h1>
          <p>We've sent a 6-digit code to <strong>{{ phoneNumber }}</strong></p>
        </div>

        <!-- OTP Boxes -->
        <div class="vc-otp-section">
          <AppOtpInput
            v-model="code"
            :length="6"
            @complete="handleCodeComplete"
          />
        </div>

        <p v-if="error" class="vc-error-msg">{{ error }}</p>

        <!-- Timer & Resend -->
        <div class="vc-timer-section">
          <p class="vc-timer-text">
            Code expires in <span class="vc-timer-counter">{{ formattedTimer }}</span>
          </p>
          <p class="vc-resend-text">
            Didn't receive the code?
            <button
              id="btn-resend-code"
              type="button"
              class="resend-anchor"
              :disabled="cooldown > 0"
              @click="handleResend"
            >
              Resend
            </button>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'Enter Verification Code — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Enter the 6-digit verification code sent to your phone.' },
  ],
})

const router = useRouter()
const route  = useRoute()

const phoneNumber = computed(() => (route.query.phone as string) || '+2346165924531')
const code = ref('')
const error = ref('')
const timerSeconds = ref(165) // 02:45
const cooldown = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

const formattedTimer = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

function handleCodeComplete(val: string) {
  if (val === '123456') {
    error.value = ''
    router.push('/auth/reset-password')
  } else {
    error.value = 'Invalid code. Use 123456 to test.'
  }
}

function handleResend() {
  if (cooldown.value > 0) return
  timerSeconds.value = 165
  cooldown.value = 30
  const cdInterval = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(cdInterval)
  }, 1000)
}

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--
    } else if (timerInterval) {
      clearInterval(timerInterval)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
/* ── Page Shell ── */
.vc-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.vc-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.vc-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.vc-card {
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
.vc-heading {
  margin-bottom: 2.5rem;
}
.vc-heading h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.vc-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}
.vc-heading strong {
  color: #0E2615;
  font-weight: 700;
}

/* ── OTP Section ── */
.vc-otp-section {
  margin-bottom: 1.5rem;
}
.vc-error-msg {
  text-align: center;
  font-size: 0.875rem;
  color: #ef4444;
  margin: 0 0 1.5rem;
}

/* ── Timer & Resend ── */
.vc-timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  margin-bottom: 1.5rem;
}

.vc-timer-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #0E2615;
  margin: 0;
}

.vc-timer-counter {
  color: #3FD246;
  font-weight: 700;
}

.vc-resend-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.resend-anchor {
  background: none;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
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
  .vc-card {
    padding: 2rem 1.5rem 3.5rem;
  }
  .vc-heading h1 {
    font-size: 1.5rem;
  }
}
</style>

<template>
  <div class="otp-container">
    <!-- Main Full-Width White Card Container -->
    <div class="otp-card">
      <!-- Top Left Back Arrow inside Card -->
      <button class="back-btn" title="Go back" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <!-- Centered Content Wrapper -->
      <div class="otp-content-wrapper">
        <!-- Centered Badge Icon -->
        <div class="starburst-badge">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="starburst-svg">
            <!-- Scalloped Starburst Base shape -->
            <path
              d="M50 0 C55 10 65 5 70 15 C78 15 80 25 85 30 C95 35 90 45 95 50 C90 55 95 65 85 70 C80 75 78 85 70 85 C65 95 55 90 50 100 C45 90 35 95 30 85 C22 85 20 75 15 70 C5 65 10 55 5 50 C10 45 5 35 15 30 C20 25 22 15 30 15 C35 5 45 10 50 0 Z"
              fill="#3FD246"
            />
            <!-- Inner Dark Checkmark -->
            <path
              d="M32 50 L44 62 L68 38"
              stroke="#0E2615"
              stroke-width="8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- Heading & Subtitle -->
        <h2 class="otp-title">Confirm Your Identity</h2>
        <p class="otp-subtitle">
          We've sent a <strong>6-digit code</strong> to <strong>+234516784531</strong>
        </p>

        <!-- 6 Single-Digit Input Boxes -->
        <div class="otp-boxes-row" @paste="handlePaste">
          <input
            v-for="(digit, idx) in otpDigits"
            :key="idx"
            :ref="(el) => (inputRefs[idx] = el as HTMLInputElement)"
            v-model="otpDigits[idx]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="otp-box"
            :class="{ 'otp-box--filled': otpDigits[idx] }"
            @input="handleInput(idx, $event)"
            @keydown="handleKeyDown(idx, $event)"
          />
        </div>

        <!-- Resend Timer -->
        <div class="resend-row">
          <span v-if="resendTimer > 0" class="resend-text">
            Resend code in <strong>00:{{ resendTimer < 10 ? '0' + resendTimer : resendTimer }}</strong>
          </span>
          <button v-else class="resend-btn" @click="startResendTimer">
            Resend code now
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button id="btn-otp-verify" class="btn-verify" :disabled="!isOtpComplete" @click="handleVerify">
            Verify
          </button>
          <button class="btn-goback" @click="$emit('back')">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go back</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  back: []
  verify: [code: string]
}>()

const otpDigits = ref<string[]>(['6', '0', '2', '8', '0', '5'])
const inputRefs = ref<HTMLInputElement[]>([])

const resendTimer = ref(30)
let timerInterval: any = null

const isOtpComplete = computed(() => {
  return otpDigits.value.every((d) => d.length === 1)
})

function startResendTimer() {
  resendTimer.value = 30
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

onMounted(() => {
  startResendTimer()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function handleInput(idx: number, e: Event) {
  const target = e.target as HTMLInputElement
  const val = target.value.replace(/\D/g, '')
  otpDigits.value[idx] = val ? val[val.length - 1] : ''

  if (val && idx < 5) {
    inputRefs.value[idx + 1]?.focus()
  }
}

function handleKeyDown(idx: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !otpDigits.value[idx] && idx > 0) {
    inputRefs.value[idx - 1]?.focus()
  }
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6)
  if (pasted) {
    pasted.split('').forEach((char, i) => {
      if (i < 6) otpDigits.value[i] = char
    })
    inputRefs.value[Math.min(pasted.length, 5)]?.focus()
  }
}

function handleVerify() {
  const code = otpDigits.value.join('')
  emit('verify', code)
}
</script>

<style scoped>
.otp-container {
  width: 100%;
}

.otp-card {
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

.otp-content-wrapper {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Badge Icon */
.starburst-badge {
  width: 6.5rem;
  height: 6.5rem;
  margin-bottom: 1.75rem;
}

.starburst-svg {
  width: 100%;
  height: 100%;
}

.otp-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

.otp-subtitle {
  font-size: 0.95rem;
  color: #4B5563;
  margin: 0 0 2.25rem;
}

/* OTP Boxes */
.otp-boxes-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.otp-box {
  width: 3.5rem;
  height: 4rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  text-align: center;
  background: #ffffff;
  border: 1.5px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.otp-box:focus, .otp-box--filled {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

.resend-row {
  margin-bottom: 2.25rem;
}

.resend-text {
  font-size: 0.9rem;
  color: #4B5563;
}

.resend-btn {
  background: none;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}
.resend-btn:hover {
  text-decoration: underline;
}

/* Actions */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  max-width: 360px;
}

.btn-verify {
  width: 100%;
  background: #3FD246;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s ease;
}
.btn-verify:hover:not(:disabled) {
  background: #36bd3d;
}
.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-goback {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #ffffff;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-goback:hover {
  background: #F9FAFB;
}

.btn-arrow {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

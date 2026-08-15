<template>
  <div class="np-page">
    <!-- Background image -->
    <div class="np-bg" />

    <!-- Card -->
    <div class="np-card-wrapper">
      <div class="np-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="np-heading">
          <h1>Create your new password</h1>
          <p>Enter your new password below.</p>
        </div>

        <!-- Form -->
        <form id="new-password-form" class="np-form" novalidate @submit.prevent="handleSubmit">
          <!-- Password Input 1 -->
          <div class="np-field-group">
            <AppInput
              id="input-new-password"
              v-model="password"
              type="password"
              label="Enter your new password"
              placeholder="••••••••••••"
              :error="passwordError"
            />

            <!-- Live Validation Checklist -->
            <ul class="np-checklist">
              <li :class="{ 'checklist--valid': hasMinLength }">
                <svg xmlns="http://www.w3.org/2000/svg" class="checklist-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>At least 8 characters</span>
              </li>
              <li :class="{ 'checklist--valid': hasNumberOrSymbol }">
                <svg xmlns="http://www.w3.org/2000/svg" class="checklist-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>Includes a number or symbol</span>
              </li>
              <li :class="{ 'checklist--valid': hasUpperAndLower }">
                <svg xmlns="http://www.w3.org/2000/svg" class="checklist-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>Both uppercase and lowercase</span>
              </li>
            </ul>
          </div>

          <!-- Password Input 2 -->
          <AppInput
            id="input-confirm-password"
            v-model="confirmPassword"
            type="password"
            label="Confirm your new password"
            placeholder="••••••••••••"
            :error="confirmError"
          />

          <!-- Action Button -->
          <div class="np-action">
            <AppButton
              id="btn-reset-password"
              type="submit"
              variant="primary"
              size="lg"
              block
              :loading="loading"
            >
              Reset Password
            </AppButton>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Create New Password — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Enter and confirm your new password.' },
  ],
})

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const confirmError = ref('')
const loading = ref(false)

// Validation criteria
const hasMinLength = computed(() => password.value.length >= 8)
const hasNumberOrSymbol = computed(() => /[\d\W]/.test(password.value))
const hasUpperAndLower = computed(() => /[a-z]/.test(password.value) && /[A-Z]/.test(password.value))

function validate() {
  passwordError.value = ''
  confirmError.value = ''

  if (!hasMinLength.value || !hasNumberOrSymbol.value || !hasUpperAndLower.value) {
    passwordError.value = 'Please meet all password requirements.'
    return false
  }

  if (password.value !== confirmPassword.value) {
    confirmError.value = 'Passwords do not match.'
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false

  // Redirect to reset-success screen
  router.push('/auth/reset-success')
}
</script>

<style scoped>
/* ── Page Shell ── */
.np-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.np-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.np-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.np-card {
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
.np-heading {
  margin-bottom: 2rem;
}
.np-heading h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.np-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* ── Form ── */
.np-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.np-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ── Checklist ── */
.np-checklist {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.np-checklist li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #9ca3af;
  transition: color 0.15s ease;
}

.checklist-icon {
  width: 1rem;
  height: 1rem;
  color: #d1d5db;
  transition: color 0.15s ease;
}

.checklist--valid {
  color: #0E2615 !important;
  font-weight: 500;
}
.checklist--valid .checklist-icon {
  color: #3FD246 !important;
}

/* ── Action ── */
.np-action {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .np-card {
    padding: 2rem 1.5rem 3.5rem;
  }
  .np-heading h1 {
    font-size: 1.5rem;
  }
}
</style>

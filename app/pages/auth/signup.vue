<template>
  <div class="signup-page">
    <!-- Background image with overlay -->
    <div class="signup-bg" />

    <!-- Centered card -->
    <div class="signup-card-wrapper">
      <div class="signup-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Heading -->
        <div class="signup-heading">
          <h1>Create your account</h1>
          <p>Create an account to discover amazing events.</p>
        </div>

        <!-- Form -->
        <form id="signup-form" class="signup-form" novalidate @submit.prevent="handleSubmit">
          <AppInput
            id="input-fullname"
            v-model="form.fullName"
            type="text"
            placeholder="Full Name"
            :error="errors.fullName"
          />
          <AppInput
            id="input-email"
            v-model="form.email"
            type="email"
            placeholder="Email Address"
            :error="errors.email"
          />
          <AppInput
            id="input-phone"
            v-model="form.phone"
            type="tel"
            placeholder="Phone Number"
            :error="errors.phone"
          />
          <AppInput
            id="input-password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            :error="errors.password"
          />

          <AppButton
            id="btn-signup"
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="loading"
          >
            Sign Up
          </AppButton>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span class="divider-line" />
          <span class="divider-label">Or continue with</span>
          <span class="divider-line" />
        </div>

        <!-- Google button -->
        <button id="btn-google" type="button" class="google-btn" @click="handleGoogle">
          <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          <span>Google</span>
        </button>

        <!-- Sign in link -->
        <p class="signin-link">
          Already have an account?
          <NuxtLink to="/auth/signin" id="link-signin" class="signin-link-anchor">Sign In</NuxtLink>
        </p>

        <!-- Terms -->
        <p class="terms-text">
          By creating an account, you agree to our
          <NuxtLink to="/terms" id="link-terms" class="terms-anchor">Terms<br>&amp; Conditions</NuxtLink>
          and Privacy Policy.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

useHead({
  title: 'Create Account — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Sign up for Uzu Ticket and discover amazing events near you.' },
  ],
})

definePageMeta({
  layout: 'auth',
})

const auth = useAuth()
const router = useRouter()
const toast = useToast()

const loading = computed(() => auth.loading.value)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
})

const errors = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
})

function validate() {
  errors.fullName = form.fullName.trim() ? '' : 'Full name is required.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'A valid email is required.'
  errors.phone = form.phone.trim() ? '' : 'Phone number is required.'
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!validate()) return
  try {
    await auth.register(form.email, form.password, form.fullName, form.phone)
    toast.show({
      title: 'Account Created',
      message: 'A verification link has been sent to your email address.',
      type: 'success',
    })
    await router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`)
  } catch {
    toast.show({
      title: 'Sign Up Failed',
      message: auth.error.value || 'Unable to create your account. Please try again.',
      type: 'error',
    })
  }
}

async function handleGoogle() {
  try {
    const callbackUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback/google` : undefined
    await auth.initiateGoogleLogin(callbackUri)
  } catch (err: any) {
    toast.show({
      title: 'Google Sign Up',
      message: err.message || 'Unable to connect to Google at this time.',
      type: 'error',
    })
  }
}
</script>

<style scoped>
/* ── Layout ── */
.signup-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.signup-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card wrapper ── */
.signup-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.signup-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.5rem 2.5rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 0;
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
.signup-heading {
  margin-bottom: 2rem;
}
.signup-heading h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.2;
  margin: 0 0 0.5rem;
}
.signup-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

/* ── Form ── */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}

/* ── Divider ── */
.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.divider-label {
  font-size: 0.85rem;
  color: #6b7280;
  white-space: nowrap;
}

/* ── Google button ── */
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.875rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  margin-bottom: 1.5rem;
}
.google-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.google-btn:active {
  transform: scale(0.98);
}
.google-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* ── Sign in link ── */
.signin-link {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
}
.signin-link-anchor {
  color: #3FD246;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.15s;
}
.signin-link-anchor:hover {
  color: #2db83a;
}

/* ── Terms ── */
.terms-text {
  text-align: center;
  font-size: 0.78rem;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
}
.terms-anchor {
  color: #374151;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.terms-anchor:hover {
  color: #3FD246;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .signup-card {
    padding: 2rem 1.5rem 1.75rem;
  }
  .signup-heading h1 {
    font-size: 1.6rem;
  }
}
</style>

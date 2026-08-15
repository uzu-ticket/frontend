<template>
  <div class="signin-page">
    <!-- Background -->
    <div class="signin-bg" />

    <!-- Card -->
    <div class="signin-card-wrapper">
      <div class="signin-card">

        <!-- Logo -->
        <div class="logo">
          <img src="/uzu-logo.png" alt="Uzu Ticket" class="logo-img" />
        </div>

        <!-- Heading -->
        <div class="signin-heading">
          <p class="signin-welcome">Welcome!</p>
          <h1>What is your email&nbsp;?</h1>
        </div>

        <!-- Form -->
        <form id="signin-form" class="signin-form" novalidate @submit.prevent="handleSubmit">
          <AppInput
            id="input-email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email address"
            :error="errors.email"
          />
          <AppInput
            id="input-password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            :error="errors.password"
          />

          <!-- Forgot password -->
          <div class="forgot-row">
            <NuxtLink id="link-forgot" to="/auth/forgot-password" class="forgot-link">
              Forgot Password?
            </NuxtLink>
          </div>

          <AppButton
            id="btn-continue"
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="loading"
          >
            Continue
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
          <!-- Google G icon -->
          <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          <span>Google</span>
        </button>

        <!-- Sign up link -->
        <p class="signup-link">
          Don't have an account?
          <NuxtLink id="link-signup" to="/auth/signup" class="signup-link-anchor">Sign Up</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

useHead({
  title: 'Sign In — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Sign in to your Uzu Ticket account and discover amazing events.' },
  ],
})

const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

function validate() {
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'A valid email is required.'
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  // TODO: wire up API
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
}

function handleGoogle() {
  // TODO: wire up Google OAuth
}
</script>

<style scoped>
/* ── Layout ── */
.signin-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.signin-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card wrapper ── */
.signin-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.signin-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.5rem 2.5rem 2.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Logo ── */
.logo {
  margin-bottom: 2rem;
}
.logo-img {
  height: 56px;
  width: auto;
  display: block;
}

/* ── Heading ── */
.signin-heading {
  margin-bottom: 1.75rem;
}
.signin-welcome {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.1rem;
  line-height: 1.2;
}
.signin-heading h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  line-height: 1.2;
}

/* ── Form ── */
.signin-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}

/* ── Forgot password ── */
.forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.25rem;
}
.forgot-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3FD246;
  text-decoration: none;
  transition: color 0.15s;
}
.forgot-link:hover {
  color: #2db83a;
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

/* ── Sign up link ── */
.signup-link {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}
.signup-link-anchor {
  color: #3FD246;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.15s;
}
.signup-link-anchor:hover {
  color: #2db83a;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .signin-card {
    padding: 2rem 1.5rem 1.75rem;
  }
  .signin-welcome,
  .signin-heading h1 {
    font-size: 1.3rem;
  }
}
</style>

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
import { reactive, ref } from 'vue'

useHead({
  title: 'Create Account — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Sign up for Uzu Ticket and discover amazing events near you.' },
  ],
})

const loading = ref(false)

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
  loading.value = true
  // TODO: wire up API
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
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

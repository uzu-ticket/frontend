<template>
  <div class="callback-page">
    <!-- Background -->
    <div class="callback-bg" />

    <!-- Card -->
    <div class="callback-card-wrapper">
      <div class="callback-card">
        <!-- Logo -->
        <div class="logo">
          <img src="/uzu-logo.png" alt="Uzu Ticket" class="logo-img" />
        </div>

        <!-- Loading state -->
        <template v-if="status === 'loading'">
          <div class="status-icon loading-icon">
            <span class="spinner" />
          </div>
          <p class="status-title">Signing you in with Google…</p>
          <p class="status-subtitle">Please wait while we verify your account.</p>
        </template>

        <!-- Success state -->
        <template v-else-if="status === 'success'">
          <div class="status-icon success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p class="status-title">Signed in successfully!</p>
          <p class="status-subtitle">Taking you to your dashboard…</p>
        </template>

        <!-- Error state -->
        <template v-else-if="status === 'error'">
          <div class="status-icon error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p class="status-title">Authentication Failed</p>
          <p class="status-subtitle">{{ errorMessage }}</p>
          <div class="error-actions">
            <NuxtLink id="link-back-signin" to="/auth/signin" class="btn-primary">
              Back to Sign In
            </NuxtLink>
            <button id="btn-retry-google" class="btn-secondary" @click="retry">
              Try Again
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

useHead({
  title: 'Signing In — Uzu Ticket',
  meta: [
    { name: 'robots', content: 'noindex' },
  ],
})

definePageMeta({
  layout: 'auth',
})

const auth = useAuth()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('Something went wrong. Please try again.')

async function handleCallback() {
  const code = route.query.code as string | undefined
  const error = route.query.error as string | undefined
  const errorDescription = route.query.error_description as string | undefined

  // Google returned an error (e.g. user denied consent)
  if (error) {
    status.value = 'error'
    errorMessage.value =
      errorDescription ||
      (error === 'access_denied'
        ? 'You denied access to your Google account. Please try again if you meant to sign in.'
        : `Google returned an error: ${error}`)
    return
  }

  if (!code) {
    status.value = 'error'
    errorMessage.value = 'No authorization code received from Google. Please try again.'
    return
  }

  try {
    const redirectUri =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback/google`
        : undefined

    await auth.loginWithGoogle(code, redirectUri)

    status.value = 'success'

    toast.show({
      title: 'Signed In with Google',
      message: `Welcome${auth.user.value?.fullName ? `, ${auth.user.value.fullName.split(' ')[0]}` : ''}! Redirecting to your dashboard.`,
      type: 'success',
    })

    // Short delay so the success state is visible
    await new Promise(resolve => setTimeout(resolve, 900))
    await router.replace('/overview')
  } catch (e: any) {
    status.value = 'error'
    errorMessage.value =
      auth.error.value ||
      e?.response?.data?.message ||
      e?.message ||
      'Failed to authenticate with Google. Please try again.'
  }
}

function retry() {
  router.replace('/auth/signin')
}

// Run on mount (client side only — the code param comes in from Google redirect)
onMounted(() => {
  handleCallback()
})
</script>

<style scoped>
/* ── Layout ── */
.callback-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.callback-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card wrapper ── */
.callback-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
}

/* ── Card ── */
.callback-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.75rem 2.5rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  text-align: center;
}

/* ── Logo ── */
.logo {
  margin-bottom: 2rem;
  align-self: flex-start;
}
.logo-img {
  height: 48px;
  width: auto;
  display: block;
}

/* ── Status icon ── */
.status-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}
.status-icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

/* Loading */
.loading-icon {
  background: rgba(63, 210, 70, 0.08);
  border: 2px solid rgba(63, 210, 70, 0.25);
}
.spinner {
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  border: 2.5px solid rgba(63, 210, 70, 0.2);
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success */
.success-icon {
  background: rgba(63, 210, 70, 0.1);
  color: #3FD246;
  animation: pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes pop-in {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

/* Error */
.error-icon {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

/* ── Status text ── */
.status-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0E2615;
  margin: 0 0 0.5rem;
}
.status-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  max-width: 320px;
}

/* ── Error actions ── */
.error-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.75rem;
  width: 100%;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #3FD246;
  color: #0E2615;
  border: none;
  border-radius: 0.875rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover {
  background: #2db83a;
}
.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: #374151;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.875rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .callback-card {
    padding: 2rem 1.5rem 1.75rem;
  }
}
</style>

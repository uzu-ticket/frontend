<template>
  <div class="rs-page">
    <!-- Background image -->
    <div class="rs-bg" />

    <!-- Card -->
    <div class="rs-card-wrapper">
      <div class="rs-card">

        <!-- Back button -->
        <button id="btn-back" class="back-btn" aria-label="Go back" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Center Content Container -->
        <div class="rs-center-content">
          <!-- Success Icon Illustration -->
          <div class="rs-icon-wrapper">
            <div class="rs-icon-outer-ring">
              <div class="rs-icon-inner-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Heading -->
          <div class="rs-heading">
            <h1>Password Reset Successful</h1>
            <p>Your password has been updated successfully. You can now sign in with your new password.</p>
          </div>
        </div>

        <!-- Action Button -->
        <div class="rs-action">
          <AppButton
            id="btn-sign-in"
            type="button"
            variant="primary"
            size="lg"
            block
            @click="goToSignIn"
          >
            Sign In
          </AppButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Password Reset Successful — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Your password has been updated successfully. Sign in to your account.' },
  ],
})

const router = useRouter()

function goToSignIn() {
  router.push('/auth/signin')
}
</script>

<style scoped>
/* ── Page Shell ── */
.rs-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

/* ── Background ── */
.rs-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/event-bg.png');
  background-size: 100% 100%;
  background-position: center;
  filter: brightness(0.55);
}

/* ── Card Wrapper ── */
.rs-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

/* ── Card ── */
.rs-card {
  background: #ffffff;
  border-radius: 0;
  padding: 2.75rem 2.5rem 2.5rem;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  margin-bottom: 1rem;
  margin-left: -0.25rem;
  transition: background 0.15s;
}
.back-btn:hover {
  background: #f3f4f6;
}

/* ── Center Content ── */
.rs-center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: auto 0;
  padding: 1rem 0;
}

/* ── Success Icon ── */
.rs-icon-wrapper {
  margin-bottom: 2rem;
}

.rs-icon-outer-ring {
  width: 6.5rem;
  height: 6.5rem;
  border-radius: 9999px;
  background-color: #EEF7EE;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rs-icon-inner-circle {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: #3FD246;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(63, 210, 70, 0.35);
}

/* ── Heading ── */
.rs-heading {
  max-width: 380px;
}

.rs-heading h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

.rs-heading p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* ── Action Button ── */
.rs-action {
  margin-top: 1.5rem;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .rs-card {
    padding: 2rem 1.5rem 1.75rem;
  }
  .rs-heading h1 {
    font-size: 1.4rem;
  }
}
</style>

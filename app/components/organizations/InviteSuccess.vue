<template>
  <div class="invite-success-container">
    <!-- Top Back Row -->
    <div class="back-row">
      <button class="btn-back-link" @click="handleBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>
    </div>

    <!-- Centered Content -->
    <div class="success-content">
      <!-- 5-Avatar Cross / Diamond Layout -->
      <div class="diamond-avatars-wrapper">
        <!-- Top Avatar -->
        <div class="diamond-pos diamond-pos--top">
          <div class="avatar-ring avatar-ring--green">
            <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>

        <!-- Middle Row: Left, Center, Right -->
        <div class="diamond-middle-row">
          <!-- Left Avatar -->
          <div class="diamond-pos">
            <div class="avatar-ring avatar-ring--pink">
              <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>

          <!-- Center Avatar -->
          <div class="diamond-pos">
            <div class="avatar-ring avatar-ring--blue">
              <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>

          <!-- Right Avatar -->
          <div class="diamond-pos">
            <div class="avatar-ring avatar-ring--red">
              <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Bottom Avatar -->
        <div class="diamond-pos diamond-pos--bottom">
          <div class="avatar-ring avatar-ring--darkgreen">
            <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Success Heading & Text -->
      <h2 class="success-title">Invite Sent Out!</h2>
      <p class="success-subtitle">Invites have been sent out to team members</p>

      <!-- Action Button -->
      <div class="action-footer">
        <button id="btn-lets-go" class="btn-lets-go" @click="handleDone">
          Let's Go
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: []
  done: []
}>()

const router = useRouter()

function handleBack() {
  emit('back')
}

function handleDone() {
  emit('done')
  router.push('/organizations')
}
</script>

<style scoped>
.invite-success-container {
  width: 100%;
}

.back-row {
  margin-bottom: 1.5rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-back-link:hover { color: #0E2615; }
.back-icon { width: 1rem; height: 1rem; }

/* Centered Content */
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 540px;
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

/* Diamond / Cross Avatars Layout */
.diamond-avatars-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.25rem;
}

.diamond-middle-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.diamond-pos {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  padding: 5px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.avatar-ring--green { background: #DCFCE7; color: #16A34A; }
.avatar-ring--pink { background: #FCE7F3; color: #DB2777; }
.avatar-ring--blue { background: #E0F2FE; color: #0284C7; }
.avatar-ring--red { background: #FEE2E2; color: #DC2626; }
.avatar-ring--darkgreen { background: #E8F9E9; color: #0E2615; }

.avatar-icon {
  width: 2.75rem;
  height: 2.75rem;
  opacity: 0.85;
}

/* Success Heading & Text */
.success-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.success-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 2.25rem;
}

/* Footer Action */
.action-footer {
  width: 100%;
  max-width: 440px;
}

.btn-lets-go {
  width: 100%;
  padding: 0.85rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-lets-go:hover {
  background: #34c03b;
  transform: translateY(-1px);
}
</style>

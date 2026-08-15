<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="close">
      <div class="modal-card">
        <!-- Circular Red Icon Badge -->
        <div class="icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="exit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        <!-- Heading & Subtitle -->
        <h3 class="modal-title">Sign out of your account?</h3>
        <p class="modal-subtitle">You will be signed out on Uzutictet</p>

        <!-- Buttons Row -->
        <div class="modal-actions">
          <button id="btn-cancel-signout" class="btn-cancel" @click="close">
            Cancel
          </button>
          <button id="btn-confirm-signout" class="btn-logout" @click="confirmSignOut">
            Logout
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const router = useRouter()

function close() {
  emit('update:modelValue', false)
}

function confirmSignOut() {
  emit('confirm')
  close()
  router.push('/auth/signin')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(14, 38, 21, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

.modal-card {
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 4.5rem 2.5rem 3.5rem;
  width: 100%;
  max-width: 460px;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  animation: modalPop 0.2s ease-out;
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.icon-circle {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #FEF2F2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.exit-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #EF4444;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.4rem;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-logout {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #EF4444;
  border: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
  transition: all 0.15s ease;
}

.btn-logout:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
</style>

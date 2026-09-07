<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="close">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h3 class="modal-title">Revoke access</h3>
            <button type="button" class="btn-close" @click="close">&times;</button>
          </div>

          <!-- Body Content -->
          <div class="modal-body">
            <!-- Warning Prompt Row -->
            <div class="warning-prompt-row">
              <div class="warning-icon-badge">
                <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p class="warning-title-text">
                Are you sure you want to revoke access for <strong>{{ memberName || 'this member' }}</strong> ?
              </p>
            </div>

            <!-- Bullet Points -->
            <div class="consequences-box">
              <span class="action-will-label">This action will:</span>
              <ul class="bullet-list">
                <li>Immediately revoke their access to UzuTicket.</li>
                <li>Remove their role(s) and event access.</li>
                <li>For ticket scanner: access will be revoked on scanner devices at the next sync.</li>
              </ul>
            </div>

            <!-- Undone text -->
            <p class="undone-warning">This action cannot be undone.</p>

            <!-- Modal Actions Footer -->
            <div class="modal-footer">
              <button type="button" class="btn-cancel" :disabled="isSubmitting" @click="close">
                Cancel
              </button>
              <button type="button" class="btn-revoke-submit" :disabled="isSubmitting" @click="handleConfirm">
                <span v-if="isSubmitting" class="spinner"></span>
                <span>{{ isSubmitting ? 'Revoking...' : 'Save Changes' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  memberName?: string
  memberId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

const isSubmitting = ref(false)

function close() {
  emit('update:modelValue', false)
}

async function handleConfirm() {
  isSubmitting.value = true
  try {
    emit('confirm')
    close()
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 38, 21, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Outfit', sans-serif;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem 1rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 0 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.warning-prompt-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.warning-icon-badge {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.warning-title-text {
  font-size: 0.95rem;
  color: #111827;
  margin: 0;
  line-height: 1.45;
}

.consequences-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-will-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.bullet-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.bullet-list li {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.4;
}

.undone-warning {
  font-size: 0.85rem;
  color: #374151;
  margin: 0;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.7rem 1.5rem;
  border-radius: 0.65rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
}

.btn-revoke-submit {
  padding: 0.7rem 1.6rem;
  border-radius: 0.65rem;
  border: none;
  background: #ef4444;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-revoke-submit:hover {
  background: #dc2626;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

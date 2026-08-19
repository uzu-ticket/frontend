<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast--${toast.type || 'success'}`"
        >
          <div class="toast-icon">
            <svg v-if="toast.type === 'error'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast-msg">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click="remove(toast.id)">
            &times;
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #0E2615;
  color: #ffffff;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  font-family: 'Outfit', sans-serif;
  transition: all 0.25s ease;
}

.toast--error {
  background: #7f1d1d;
  color: #fef2f2;
}

.toast--warning {
  background: #78350f;
  color: #fffbeb;
}

.toast-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3FD246;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.toast--error .toast-icon {
  color: #fca5a5;
}

.toast--warning .toast-icon {
  color: #fde047;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
}

.toast-msg {
  font-size: 0.775rem;
  color: #d1d5db;
  margin-top: 0.2rem;
}

.toast-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.toast-close:hover {
  color: #ffffff;
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.25s ease;
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>

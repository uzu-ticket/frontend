<template>
  <div class="success-page">
    <div class="success-card">
      <div class="success-inner">

        <!-- Icon from provided image -->
        <img src="/api-key-success.png" alt="API Key Ready" class="success-icon" />

        <!-- Text -->
        <h2 class="success-title">Your API Key is ready</h2>
        <p class="success-subtitle">Copy and save it now, you won't be able to see it again</p>

        <!-- Key Display -->
        <div class="key-display-row">
          <code class="key-display-text">{{ displayKey }}</code>
          <button class="copy-btn" :class="{ 'copy-btn--done': copied }" @click="copyKey" title="Copy API key">
            <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="copy-icon copy-icon--done" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
          </button>
        </div>

        <!-- Done Button -->
        <button class="btn-done" @click="router.push('/apikeys')">
          Done
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKeys } from '~/composables/useApiKeys'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'API Key Created — Uzu Ticket',
})

const router = useRouter()
const { createdNewKey } = useApiKeys()
const copied = ref(false)

const fullKey = computed(() => createdNewKey.value?.fullKey || '')

const displayKey = computed(() => {
  const k = fullKey.value
  if (!k) return '••••••••••••••••••••••••••••••••'
  return k.length > 38 ? k.slice(0, 38) + '...' : k
})

async function copyKey() {
  try {
    await navigator.clipboard.writeText(fullKey.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {}
}
</script>

<style scoped>
.success-page {
  width: 100%;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - 80px);
}

/* Full-width full-height card */
.success-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  padding: 4rem 2rem 3.5rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Centered inner content */
.success-inner {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

/* Icon */
.success-icon {
  width: 110px;
  height: 110px;
  object-fit: contain;
  margin-bottom: 1.75rem;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes popIn {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

/* Text */
.success-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

.success-subtitle {
  font-size: 0.9rem;
  color: #6B7280;
  margin: 0 0 2rem;
  line-height: 1.5;
}

/* Key display */
.key-display-row {
  display: flex;
  align-items: center;
  background: #E8F8EA;
  border-radius: 0.75rem;
  padding: 0.85rem 1rem 0.85rem 1.25rem;
  width: 100%;
  margin-bottom: 1.25rem;
  gap: 0.5rem;
}

.key-display-text {
  flex: 1;
  font-family: 'SF Mono', 'Fira Code', 'Monaco', monospace;
  font-size: 0.875rem;
  color: #0E2615;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #15803D;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.35rem 0.5rem;
  border-radius: 0.4rem;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
  white-space: nowrap;
}
.copy-btn:hover {
  background: rgba(63, 210, 70, 0.1);
}
.copy-btn--done {
  color: #16A34A;
}

.copy-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
.copy-icon--done {
  color: #16A34A;
}

/* Done Button */
.btn-done {
  width: 100%;
  padding: 0.9rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s, transform 0.15s;
}
.btn-done:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}
</style>

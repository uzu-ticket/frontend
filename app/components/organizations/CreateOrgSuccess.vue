<template>
  <div class="success-page">
    <!-- Back Link -->
    <div class="back-row">
      <button class="btn-back-link" @click="router.push('/organizations')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>
    </div>

    <!-- Centered Content -->
    <div class="success-content">
      <!-- Celebration Illustration Slot -->
      <div class="illustration-area">
        <slot name="illustration">
          <!-- Placeholder until user provides image -->
          <div class="illustration-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" class="placeholder-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </slot>
      </div>

      <!-- Success Text -->
      <h2 class="success-title">Organization Created Successfully!</h2>
      <p class="success-subtitle">Your organization is all set and ready to go</p>

      <!-- Info Card -->
      <div class="info-card">
        <!-- Organization URL -->
        <div class="info-row">
          <span class="info-label">Your organization URL</span>
          <div class="url-row">
            <span class="org-url">{{ orgUrl }}</span>
            <button class="copy-btn" :class="{ 'copy-btn--copied': copied }" @click="copyUrl" title="Copy URL">
              <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="copy-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="info-divider" />

        <!-- Role -->
        <div class="info-row">
          <span class="info-label">Your Role</span>
          <div class="role-badge">
            <svg xmlns="http://www.w3.org/2000/svg" class="role-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Super Admin</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-continue" @click="router.push('/organizations')">
          Continue
        </button>
        <button class="btn-dashboard" @click="router.push('/overview')">
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  orgUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  orgUrl: 'https://zeenom-event.uzuticet.com',
})

const router = useRouter()
const copied = ref(false)

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(props.orgUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}
</script>

<style scoped>
.success-page {
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
  max-width: 520px;
  margin: 0 auto;
  padding: 1rem 0 2rem;
}

/* Illustration */
.illustration-area {
  margin-bottom: 1.5rem;
}

.illustration-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: #F0FDF1;
  border: 2px dashed #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 4rem;
  height: 4rem;
  color: #3FD246;
}

/* Text */
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
  margin: 0 0 2rem;
}

/* Info Card */
.info-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #eef2ee;
  border-radius: 0.875rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.75rem;
  text-align: left;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #0E2615;
}

.url-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.org-url {
  font-size: 0.85rem;
  color: #3FD246;
  font-weight: 600;
  flex: 1;
  word-break: break-all;
}

.copy-btn {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  color: #6b7280;
}
.copy-btn:hover { background: #e5e7eb; color: #0E2615; }
.copy-btn--copied { background: #dcfce7; color: #16a34a; }
.copy-icon { width: 1rem; height: 1rem; }

.info-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 1rem 0;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #DCFCE7;
  color: #16a34a;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 0.875rem;
  border-radius: 0.5rem;
}
.role-icon { width: 0.9rem; height: 0.9rem; }

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  width: 100%;
}

.btn-continue {
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
.btn-continue:hover { background: #34c03b; transform: translateY(-1px); }

.btn-dashboard {
  width: 100%;
  padding: 0.85rem;
  background: #ffffff;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-dashboard:hover { background: #f9fafb; }
</style>

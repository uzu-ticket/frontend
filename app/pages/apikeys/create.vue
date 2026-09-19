<template>
  <div class="create-apikey-page">
    <!-- Title block -->
    <div class="page-heading">
      <h2 class="page-title">Create API Key</h2>
      <p class="page-subtitle">Set up a new API key to access the Uzuticket API.</p>
    </div>

    <!-- Form Card -->
    <div class="form-card">
      <div class="form-inner">
      <form @submit.prevent="handleSubmit">

        <!-- Key Name -->
        <div class="form-group">
          <label class="form-label">Key Name <span class="required">*</span></label>
          <input
            v-model="keyName"
            type="text"
            class="form-input"
            placeholder="eg Production, Staging, Mobile App"
            required
          />
        </div>

        <!-- Environment -->
        <div class="form-group">
          <label class="form-label">Environment</label>
          <div class="radio-list">
            <label class="radio-row">
              <div class="radio-circle" :class="{ 'radio-circle--active': selectedEnv === 'Live (Production)' }">
                <div v-if="selectedEnv === 'Live (Production)'" class="radio-dot" />
              </div>
              <input v-model="selectedEnv" type="radio" value="Live (Production)" class="sr-only" />
              <span class="radio-label">Live (Production)</span>
            </label>

            <label class="radio-row">
              <div class="radio-circle" :class="{ 'radio-circle--active': selectedEnv === 'Test (Sand hook)' }">
                <div v-if="selectedEnv === 'Test (Sand hook)'" class="radio-dot" />
              </div>
              <input v-model="selectedEnv" type="radio" value="Test (Sand hook)" class="sr-only" />
              <span class="radio-label">Test (Sand hook)</span>
            </label>
          </div>
        </div>

        <!-- Permissions -->
        <div class="form-group">
          <label class="form-label">Permissions</label>
          <div class="checkbox-list">
            <label
              v-for="perm in allPermissions"
              :key="perm"
              class="checkbox-row"
              @click="togglePerm(perm)"
            >
              <div class="checkbox-box" :class="{ 'checkbox-box--checked': selectedPerms.includes(perm) }">
                <svg v-if="selectedPerms.includes(perm)" xmlns="http://www.w3.org/2000/svg" class="check-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="checkbox-label">{{ perm }}</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-verify"
            :disabled="!keyName.trim() || selectedPerms.length === 0"
          >
            Verify
          </button>
          <button type="button" class="btn-cancel" @click="router.push('/apikeys')">
            Cancel
          </button>
        </div>

      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApiKeys } from '~/composables/useApiKeys'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Create API Key — Uzu Ticket',
})

const router = useRouter()
const { createApiKey, createdNewKey } = useApiKeys()

const keyName = ref('')
const selectedEnv = ref<'Live (Production)' | 'Test (Sand hook)'>('Live (Production)')

const allPermissions = [
  'Read – View events, tickets, etc.',
  'Write – Create and update resources',
  'Webhook – Receive event notification',
]

const selectedPerms = ref<string[]>([...allPermissions])

function togglePerm(perm: string) {
  const idx = selectedPerms.value.indexOf(perm)
  if (idx === -1) {
    selectedPerms.value.push(perm)
  } else {
    selectedPerms.value.splice(idx, 1)
  }
}

function handleSubmit() {
  if (!keyName.value.trim() || selectedPerms.value.length === 0) return

  // Map display labels to the composable's permission strings
  const mappedPerms = selectedPerms.value.map((p) => {
    if (p.startsWith('Read')) return 'Read - View events, tickets, etc.'
    if (p.startsWith('Write')) return 'Write - Create and update resources'
    return 'Webhook - Receive event notification'
  })

  createApiKey({
    name: keyName.value.trim(),
    environment: selectedEnv.value,
    permissions: mappedPerms,
  })

  router.push('/apikeys/success')
}
</script>

<style scoped>
.create-apikey-page {
  width: 100%;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page heading */
.page-heading {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #6B7280;
  margin: 0;
}

/* Form Card */
.form-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  padding: 2rem 2.25rem 2.5rem;
}

.form-inner {
  max-width: 560px;
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 2rem;
}
.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
}

.required {
  color: #EF4444;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1.1rem;
  font-size: 0.95rem;
  color: #111827;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}
.form-input::placeholder {
  color: #9CA3AF;
}

/* Radio list */
.radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.radio-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
}

.radio-circle {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  border: 2px solid #D1D5DB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}
.radio-circle--active {
  border-color: #3FD246;
}

.radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3FD246;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.radio-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

/* Checkbox list */
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
}

.checkbox-box {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 0.3rem;
  border: 2px solid #D1D5DB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;
}
.checkbox-box--checked {
  border-color: #3FD246;
  background: #3FD246;
}

.check-svg {
  width: 0.75rem;
  height: 0.75rem;
  color: #ffffff;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

/* Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 2rem;
}

.btn-verify {
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
  transition: background 0.15s, transform 0.15s, opacity 0.15s;
}
.btn-verify:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  width: 100%;
  padding: 0.9rem;
  background: #ffffff;
  color: #374151;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 0.75rem;
  border: 1px solid #D1D5DB;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover {
  background: #F9FAFB;
}
</style>

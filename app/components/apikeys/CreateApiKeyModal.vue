<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-left">
          <div class="modal-icon-bg">
            <svg xmlns="http://www.w3.org/2000/svg" class="modal-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 class="modal-title">Generate New API Key</h3>
            <p class="modal-subtitle">Create a credential for programmatic API access</p>
          </div>
        </div>
        <button class="close-btn" title="Close" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-divider" />

      <!-- Form -->
      <form class="modal-form" @submit.prevent="handleSubmit">
        <!-- Key Name -->
        <div class="form-group">
          <label class="form-label">Key Name <span class="required">*</span></label>
          <input
            v-model="keyName"
            type="text"
            class="form-input"
            placeholder="e.g. Production Key, Mobile App, Analytics..."
            maxlength="60"
            required
          />
          <span class="helper-text">Give it a descriptive name so you remember what it's for.</span>
        </div>

        <!-- Environment -->
        <div class="form-group">
          <label class="form-label">Environment <span class="required">*</span></label>
          <div class="env-options">
            <label
              class="env-option"
              :class="{ 'env-option--active': selectedEnv === 'Live (Production)' }"
            >
              <input v-model="selectedEnv" type="radio" value="Live (Production)" class="radio-hidden" />
              <div class="env-option-content">
                <div class="env-icon-bg env-icon-bg--live">
                  <svg xmlns="http://www.w3.org/2000/svg" class="env-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span class="env-name">Live (Production)</span>
                  <span class="env-desc">Real transactions & data</span>
                </div>
              </div>
              <div class="radio-check" :class="{ 'radio-check--active': selectedEnv === 'Live (Production)' }" />
            </label>

            <label
              class="env-option"
              :class="{ 'env-option--active': selectedEnv === 'Test (Sand hook)' }"
            >
              <input v-model="selectedEnv" type="radio" value="Test (Sand hook)" class="radio-hidden" />
              <div class="env-option-content">
                <div class="env-icon-bg env-icon-bg--test">
                  <svg xmlns="http://www.w3.org/2000/svg" class="env-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <span class="env-name">Test (Sandbox)</span>
                  <span class="env-desc">Safe for testing only</span>
                </div>
              </div>
              <div class="radio-check" :class="{ 'radio-check--active': selectedEnv === 'Test (Sand hook)' }" />
            </label>
          </div>
        </div>

        <!-- Permissions -->
        <div class="form-group">
          <label class="form-label">Permissions</label>
          <div class="perms-list">
            <label
              v-for="perm in availablePermissions"
              :key="perm.id"
              class="perm-checkbox-row"
              :class="{ 'perm-checkbox-row--checked': selectedPerms.includes(perm.id) }"
            >
              <input
                v-model="selectedPerms"
                type="checkbox"
                :value="perm.id"
                class="radio-hidden"
              />
              <div class="perm-check" :class="{ 'perm-check--active': selectedPerms.includes(perm.id) }">
                <svg v-if="selectedPerms.includes(perm.id)" xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="perm-text-block">
                <span class="perm-name">{{ perm.name }}</span>
                <span class="perm-desc">{{ perm.description }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Notice -->
        <div class="notice-card">
          <svg xmlns="http://www.w3.org/2000/svg" class="notice-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>The full key will be shown <strong>once</strong> after generation. Copy it immediately and store it securely.</span>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-create" :disabled="!keyName.trim() || selectedPerms.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" class="create-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span>Generate Key</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
  create: [input: { name: string; environment: 'Live (Production)' | 'Test (Sand hook)'; permissions: string[] }]
}>()

const keyName = ref('')
const selectedEnv = ref<'Live (Production)' | 'Test (Sand hook)'>('Live (Production)')
const selectedPerms = ref<string[]>(['Read - View events, tickets, etc.', 'Write - Create and update resources'])

const availablePermissions = [
  {
    id: 'Read - View events, tickets, etc.',
    name: 'Read',
    description: 'View events, tickets, customers, and transaction data',
  },
  {
    id: 'Write - Create and update resources',
    name: 'Write',
    description: 'Create, update, and delete events and resources',
  },
  {
    id: 'Webhook - Receive event notification',
    name: 'Webhooks',
    description: 'Receive real-time event notifications via webhooks',
  },
]

function handleSubmit() {
  if (!keyName.value.trim() || selectedPerms.value.length === 0) return
  emit('create', {
    name: keyName.value.trim(),
    environment: selectedEnv.value,
    permissions: selectedPerms.value,
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 1.35rem;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 2rem 1.5rem;
  gap: 1rem;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon-bg {
  width: 3rem;
  height: 3rem;
  border-radius: 0.85rem;
  background: #EAF8ED;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon {
  width: 1.4rem;
  height: 1.4rem;
  color: #15803D;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.15rem;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0.35rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.15s, background 0.15s;
}
.close-btn:hover {
  color: #374151;
  background: #F3F4F6;
}

.close-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.modal-divider {
  height: 1px;
  background: #F3F4F6;
}

/* Form */
.modal-form {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
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
  font-weight: 600;
  color: #111827;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

.helper-text {
  font-size: 0.8rem;
  color: #9CA3AF;
}

/* Environment Options */
.env-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.env-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.env-option--active {
  border-color: #3FD246;
  background: #F0FDF4;
}

.env-option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.env-icon-bg {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.env-icon-bg--live {
  background: #DCFCE7;
}
.env-icon-bg--test {
  background: #DBEAFE;
}

.env-icon {
  width: 1.25rem;
  height: 1.25rem;
}
.env-icon-bg--live .env-icon {
  color: #16A34A;
}
.env-icon-bg--test .env-icon {
  color: #2563EB;
}

.env-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.15rem;
}

.env-desc {
  display: block;
  font-size: 0.8rem;
  color: #6B7280;
}

.radio-hidden {
  display: none;
}

.radio-check {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  border: 2px solid #D1D5DB;
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;
}
.radio-check--active {
  border-color: #3FD246;
  background: #3FD246;
  box-shadow: inset 0 0 0 3px #ffffff;
}

/* Permissions List */
.perms-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.perm-checkbox-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.1rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.perm-checkbox-row--checked {
  border-color: #3FD246;
  background: #F0FDF4;
}

.perm-check {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.3rem;
  border: 2px solid #D1D5DB;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}
.perm-check--active {
  border-color: #3FD246;
  background: #3FD246;
}

.check-icon {
  width: 0.8rem;
  height: 0.8rem;
  color: #ffffff;
}

.perm-text-block {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.perm-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

.perm-desc {
  font-size: 0.8rem;
  color: #6B7280;
}

/* Notice */
.notice-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #78350F;
  line-height: 1.45;
}

.notice-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #D97706;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.85rem;
}

.btn-cancel {
  background: #F9FAFB;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 1.75rem;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover {
  background: #F3F4F6;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 1.75rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s, transform 0.15s, opacity 0.15s;
}
.btn-create:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-create:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-icon {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

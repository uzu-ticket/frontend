<template>
  <div class="apikey-details-page">
    <!-- Back Navigation & Title -->
    <div class="header-nav">
      <button class="btn-back" title="Back to API Keys" @click="router.push('/apikeys')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="page-title">API Key Details</h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="details-card loading-card">
      <AppSkeleton variant="text" width="40%" height="1.8rem" class="mb-4" />
      <AppSkeleton variant="text" width="60%" height="1.2rem" class="mb-3" />
      <AppSkeleton variant="text" width="50%" height="1.2rem" class="mb-3" />
      <AppSkeleton variant="text" width="30%" height="1.2rem" />
    </div>

    <!-- Details Card (Matches Screenshot 2) -->
    <div v-else-if="apiKey" class="details-card">
      <!-- Top Row: Name, Secret Key Preview, Active Status Badge -->
      <div class="key-header-row">
        <div class="key-title-group">
          <h2 class="key-name">{{ apiKey.name }}</h2>
          <div class="key-code-row">
            <code class="key-code">{{ isRevealed ? (apiKey.fullKey || apiKey.keyMasked) : apiKey.keyMasked }}</code>
          </div>
        </div>
        <span
          class="status-pill"
          :class="apiKey.status === 'Active' ? 'status-pill--active' : 'status-pill--revoked'"
        >
          {{ apiKey.status }}
        </span>
      </div>

      <!-- Attributes List Grid -->
      <div class="attributes-grid">
        <!-- Created -->
        <div class="attr-row">
          <span class="attr-label">Created</span>
          <span class="attr-value">{{ apiKey.createdDateTime || apiKey.createdDate }}</span>
        </div>

        <!-- Environment -->
        <div class="attr-row">
          <span class="attr-label">Environment</span>
          <span class="attr-value">{{ apiKey.environment }}</span>
        </div>

        <!-- Permissions -->
        <div class="attr-row">
          <span class="attr-label">Permissions</span>
          <div class="permissions-badges">
            <span v-for="perm in formatPermissions(apiKey.permissions)" :key="perm" class="perm-pill">
              {{ perm }}
            </span>
          </div>
        </div>

        <!-- Last Used -->
        <div class="attr-row">
          <span class="attr-label">Last Used</span>
          <span class="attr-value">{{ apiKey.lastUsed || 'Never' }}</span>
        </div>

        <!-- Usage -->
        <div class="attr-row">
          <span class="attr-label">Usage</span>
          <div class="usage-col">
            <span class="usage-count">{{ (apiKey.usageRequests || 1248).toLocaleString() }}</span>
            <span class="usage-subtitle">{{ (apiKey.usageRequests || 1248).toLocaleString() }} requests (last 30 days)</span>
          </div>
        </div>
      </div>

      <!-- Bottom Action Buttons Row -->
      <div class="actions-row">
        <button class="btn-action-regen" @click="showRegenModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Regenerate</span>
        </button>

        <button
          v-if="apiKey.status === 'Active'"
          class="btn-action-revoke"
          @click="showRevokeModal = true"
        >
          <span>Revoke Key</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Regenerate Confirm Modal -->
    <div v-if="showRegenModal" class="modal-overlay" @click.self="showRegenModal = false">
      <div class="confirm-modal">
        <div class="confirm-icon-bg confirm-icon-bg--blue">
          <svg xmlns="http://www.w3.org/2000/svg" class="confirm-icon confirm-icon--blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 class="confirm-title">Regenerate API Key?</h3>
        <p class="confirm-text">
          Regenerating this key will immediately replace its secret value. Any apps using the old key will stop working.
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel-modal" @click="showRegenModal = false">Cancel</button>
          <button class="btn-confirm-regen" @click="handleRegenerate">Regenerate Key</button>
        </div>
      </div>
    </div>

    <!-- Revoke Confirm Modal -->
    <div v-if="showRevokeModal" class="modal-overlay" @click.self="showRevokeModal = false">
      <div class="confirm-modal">
        <div class="confirm-icon-bg">
          <svg xmlns="http://www.w3.org/2000/svg" class="confirm-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="confirm-title">Revoke API Key?</h3>
        <p class="confirm-text">
          Revoking this key will immediately invalidate it. Any app using this key will lose access.
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel-modal" @click="showRevokeModal = false">Cancel</button>
          <button class="btn-confirm-revoke" @click="handleRevoke">Revoke Key</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import { useApiKeys } from '~/composables/useApiKeys'
import type { ApiKey } from '~/composables/useApiKeys'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'API Key Details — Uzu Ticket',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchApiKey, regenerateApiKey, revokeApiKey } = useApiKeys()

const keyId = computed(() => route.params.id as string)
const apiKey = ref<ApiKey | null>(null)
const isLoading = ref(true)
const isRevealed = ref(false)
const showRegenModal = ref(false)
const showRevokeModal = ref(false)

async function loadData() {
  isLoading.value = true
  try {
    const res = await fetchApiKey(keyId.value)
    apiKey.value = res
  } catch (e) {
    console.error('Failed to load key:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

function formatPermissions(perms: string[] | undefined): string[] {
  if (!perms || perms.length === 0) return ['Read', 'Write', 'Webhook']
  return perms.map((p) => {
    if (p.startsWith('Read')) return 'Read'
    if (p.startsWith('Write')) return 'Write'
    if (p.startsWith('Webhook')) return 'Webhook'
    return p
  })
}

async function handleRegenerate() {
  showRegenModal.value = false
  try {
    const updated = await regenerateApiKey(keyId.value)
    if (updated) {
      apiKey.value = updated
      toast.success('API key regenerated successfully!')
    }
  } catch {
    toast.error('Failed to regenerate API key.')
  }
}

async function handleRevoke() {
  showRevokeModal.value = false
  try {
    await revokeApiKey(keyId.value)
    if (apiKey.value) apiKey.value.status = 'Revoked'
    toast.info('API key revoked and deactivated.')
  } catch {
    toast.error('Failed to revoke API key.')
  }
}
</script>

<style scoped>
.apikey-details-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2.5rem;
}

/* Header & Back Navigation */
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.75rem;
}

.btn-back {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.65rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.15s ease;
}
.btn-back:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.back-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

/* Main Details Card */
.details-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  padding: 2.5rem 2.5rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Top Header Row */
.key-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.key-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.key-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.key-code-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.key-code {
  font-family: 'SF Mono', 'Fira Code', 'Monaco', monospace;
  font-size: 0.925rem;
  color: #4B5563;
  letter-spacing: 0.02em;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.825rem;
  font-weight: 700;
}

.status-pill--active {
  background: #E8F8EA;
  color: #15803D;
}

.status-pill--revoked {
  background: #FEE2E2;
  color: #991B1B;
}

/* Attributes Grid */
.attributes-grid {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.attr-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
}

.attr-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6B7280;
}

.attr-value {
  font-size: 0.925rem;
  font-weight: 700;
  color: #111827;
}

/* Permissions Badges */
.permissions-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.perm-pill {
  background: #E8F8EA;
  color: #15803D;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 1rem;
  border-radius: 9999px;
}

/* Usage Stack */
.usage-col {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.usage-count {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
}

.usage-subtitle {
  font-size: 0.825rem;
  color: #6B7280;
}

/* Bottom Actions Row */
.actions-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
  padding-top: 1rem;
}

.btn-action-regen {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2.25rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  font-size: 0.925rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.15s ease;
  min-width: 170px;
}
.btn-action-regen:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.btn-action-revoke {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2.25rem;
  background: #EF4444;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.925rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
  transition: all 0.15s ease;
  min-width: 180px;
}
.btn-action-revoke:hover {
  background: #DC2626;
}

.action-icon {
  width: 1.15rem;
  height: 1.15rem;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.confirm-modal {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.confirm-icon-bg {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: #FEF3C7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-icon-bg--blue {
  background: #EFF6FF;
}

.confirm-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #D97706;
}
.confirm-icon--blue {
  color: #3B82F6;
}

.confirm-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.confirm-text {
  font-size: 0.875rem;
  color: #4B5563;
  line-height: 1.55;
  margin: 0;
}

.confirm-actions {
  display: flex;
  gap: 0.85rem;
  margin-top: 0.25rem;
  width: 100%;
}

.btn-cancel-modal {
  flex: 1;
  background: #F9FAFB;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.7rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: background 0.12s;
}
.btn-cancel-modal:hover {
  background: #F3F4F6;
}

.btn-confirm-regen {
  flex: 1;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.7rem 1.25rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.12s;
}
.btn-confirm-regen:hover {
  background: #36bd3d;
}

.btn-confirm-revoke {
  flex: 1;
  background: #EF4444;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.7rem 1.25rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.12s;
}
.btn-confirm-revoke:hover {
  background: #DC2626;
}

@media (max-width: 640px) {
  .details-card {
    padding: 1.5rem;
  }
  .attr-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
  .actions-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

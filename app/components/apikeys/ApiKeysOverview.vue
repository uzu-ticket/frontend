<template>
  <div class="apikeys-wrapper">
    <!-- Main Card -->
    <div class="apikeys-card">
      <!-- Card Header Row -->
      <div class="card-header-row">
        <h2 class="card-title">Your API Key ({{ apiKeysList.length }})</h2>
        <button id="btn-create-api-key" class="btn-create" @click="$emit('generate')">
          <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Create API Key</span>
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="keys-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="displayedApiKeysList.length > 0">
            <tr v-for="key in displayedApiKeysList" :key="key.id" class="table-row">
              <!-- Name -->
              <td class="td-name">{{ key.name }}</td>

              <!-- Key (masked with eye toggle) -->
              <td class="td-key">
                <div class="key-cell">
                  <code class="key-code">{{ (visibleKeys[key.id] && key.fullKey) ? key.fullKey : key.keyMasked }}</code>
                  <button
                    class="icon-btn"
                    :title="(visibleKeys[key.id] && key.fullKey) ? 'Hide key' : 'Reveal key'"
                    @click="toggleVisibility(key)"
                  >
                    <svg v-if="!(visibleKeys[key.id] && key.fullKey)" xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.092-4.092a3 3 0 11-4.243-4.243" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
                    </svg>
                  </button>
                </div>
              </td>

              <!-- Created -->
              <td class="td-created">{{ key.createdDate }}</td>

              <!-- Status -->
              <td class="td-status">
                <span
                  class="status-badge"
                  :class="key.status === 'Active' ? 'status-badge--active' : 'status-badge--revoked'"
                >
                  {{ key.status }}
                </span>
              </td>

              <!-- Actions (3-dot menu) -->
              <td class="td-actions">
                <div class="actions-wrapper">
                  <button
                    class="dots-btn"
                    :class="{ 'dots-btn--open': openMenuId === key.id }"
                    @click.stop="toggleMenu(key.id)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="dots-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div v-if="openMenuId === key.id" class="dropdown-menu">
                    <button class="dropdown-item" @click="handleCopy(key); closeMenu()">
                      <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Key
                    </button>
                    <button class="dropdown-item" @click="toggleVisibility(key); closeMenu()">
                      <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {{ (visibleKeys[key.id] && key.fullKey) ? 'Hide Key' : 'Reveal Key' }}
                    </button>
                    <div class="dropdown-divider" />
                    <button
                      v-if="key.status === 'Active'"
                      class="dropdown-item dropdown-item--danger"
                      @click="confirmRevoke(key.id, key.name); closeMenu()"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Revoke Key
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Loading state with AppSkeleton -->
          <tbody v-else-if="isLoading">
            <tr v-for="n in 3" :key="`skeleton-row-${n}`" class="table-row">
              <td class="td-name">
                <AppSkeleton variant="text" width="65%" height="0.9rem" />
              </td>
              <td class="td-key">
                <AppSkeleton variant="text" width="80%" height="0.9rem" />
              </td>
              <td class="td-created">
                <AppSkeleton variant="text" width="50%" height="0.9rem" />
              </td>
              <td class="td-status">
                <AppSkeleton variant="text" width="4.5rem" height="1.6rem" border-radius="9999px" />
              </td>
              <td class="td-actions">
                <div class="actions-wrapper">
                  <AppSkeleton variant="circle" width="1.5rem" height="1.5rem" />
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Empty state when no keys exist -->
          <tbody v-else>
            <tr>
              <td colspan="5" class="empty-cell">
                <div class="empty-state">
                  <div class="empty-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 class="empty-title">No API keys generated yet</h3>
                  <p class="empty-desc">Create your first API key to start integrating your custom applications and webhooks with Uzu Ticket.</p>
                  <button class="btn-create btn-create--empty" @click="$emit('generate')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    <span>Create API Key</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="apiKeysList.length > 0" class="card-footer">
        <AppPagination
          v-model="currentPage"
          :total-pages="totalPages"
          :total-items="apiKeysList.length"
          :page-size="pageSize"
        />
      </div>
    </div>

    <!-- Revoke Confirm Modal -->
    <div v-if="revokeTarget" class="modal-overlay" @click.self="revokeTarget = null">
      <div class="confirm-modal">
        <div class="confirm-icon-bg">
          <svg xmlns="http://www.w3.org/2000/svg" class="confirm-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="confirm-title">Revoke API Key?</h3>
        <p class="confirm-text">
          Revoking <strong>"{{ revokeTarget.name }}"</strong> will immediately
          invalidate it. Any app using this key will lose access.
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel-modal" @click="revokeTarget = null">Cancel</button>
          <button class="btn-confirm-revoke" @click="doRevoke">Revoke</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import AppPagination from '~/components/ui/AppPagination.vue'
import { useToast } from '~/composables/useToast'
import type { ApiKey } from '~/composables/useApiKeys'

const props = withDefaults(
  defineProps<{
    apiKeysList: ApiKey[]
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)

const emit = defineEmits<{
  generate: []
  revoke: [id: string]
  copy: [key: string]
}>()

const toast = useToast()
const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(props.apiKeysList.length / pageSize.value) || 1)

const displayedApiKeysList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.apiKeysList.slice(start, start + pageSize.value)
})

const visibleKeys = reactive<Record<string, boolean>>({})
const openMenuId = ref<string | null>(null)
const revokeTarget = ref<{ id: string; name: string } | null>(null)

function toggleVisibility(key: ApiKey) {
  if (!key.fullKey && !visibleKeys[key.id]) {
    toast.info('Secret keys are only displayed once upon generation for security.')
    return
  }
  visibleKeys[key.id] = !visibleKeys[key.id]
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeMenu() {
  openMenuId.value = null
}

function handleCopy(key: ApiKey) {
  emit('copy', key.fullKey || key.keyMasked)
}

function confirmRevoke(id: string, name: string) {
  revokeTarget.value = { id, name }
}

function doRevoke() {
  if (revokeTarget.value) {
    emit('revoke', revokeTarget.value.id)
    revokeTarget.value = null
  }
}

function onDocClick() {
  closeMenu()
}

onMounted(() => window.addEventListener('click', onDocClick))
onUnmounted(() => window.removeEventListener('click', onDocClick))
</script>

<style scoped>
.apikeys-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - 160px);
}

/* Main Card */
.apikeys-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.card-footer {
  padding: 1.25rem 2rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #F3F4F6;
  margin-top: auto;
}

/* Card Header */
.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 2rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.7rem 1.5rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s, transform 0.15s;
  white-space: nowrap;
}
.btn-create:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}

.plus-icon {
  width: 1rem;
  height: 1rem;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.keys-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.keys-table thead tr {
  border-top: 1px solid #F3F4F6;
  border-bottom: 1px solid #F3F4F6;
}

.keys-table th {
  font-size: 0.825rem;
  font-weight: 700;
  color: #6B7280;
  padding: 0.85rem 1.5rem;
  white-space: nowrap;
  background: #FAFAFA;
}

.keys-table th:last-child {
  text-align: right;
}

.table-row {
  border-bottom: 1px solid #F9FAFB;
  transition: background 0.12s;
}
.table-row:last-child {
  border-bottom: none;
}
.table-row:hover {
  background: #FAFAFA;
}

.keys-table td {
  padding: 1.25rem 1.5rem;
  vertical-align: middle;
}

/* Name */
.td-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

/* Key */
.td-key {
  min-width: 280px;
}

.key-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.key-code {
  font-family: 'SF Mono', 'Fira Code', 'Monaco', monospace;
  font-size: 0.875rem;
  color: #374151;
  letter-spacing: 0.01em;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 0.35rem;
  transition: color 0.12s, background 0.12s;
  flex-shrink: 0;
}
.icon-btn:hover {
  color: #374151;
  background: #F3F4F6;
}

.eye-icon {
  width: 1rem;
  height: 1rem;
}

/* Created */
.td-created {
  font-size: 0.875rem;
  color: #4B5563;
  white-space: nowrap;
}

/* Status */
.td-status {
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge--active {
  background: #DCFCE7;
  color: #15803D;
}

.status-badge--revoked {
  background: #FEE2E2;
  color: #991B1B;
}

/* Actions */
.td-actions {
  text-align: right;
}

.actions-wrapper {
  position: relative;
  display: inline-block;
}

.dots-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0.4rem 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transition: background 0.12s, color 0.12s;
}
.dots-btn:hover,
.dots-btn--open {
  background: #F3F4F6;
  color: #374151;
}

.dots-icon {
  width: 1.1rem;
  height: 1.1rem;
}

/* Dropdown */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 50;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 0.4rem 0;
  animation: dropIn 0.12s ease;
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s;
  white-space: nowrap;
}
.dropdown-item:hover {
  background: #F9FAFB;
}

.dropdown-item--danger {
  color: #EF4444;
}
.dropdown-item--danger:hover {
  background: #FFF5F5;
}

.dropdown-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background: #F3F4F6;
  margin: 0.3rem 0;
}

/* Revoke Confirm Modal */
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
  max-width: 400px;
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

.confirm-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #D97706;
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

/* Table Empty State */
.empty-cell {
  padding: 4rem 1.5rem !important;
  text-align: center;
  background: #ffffff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 440px;
  margin: 0 auto;
}

.empty-icon-wrapper {
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 1.15rem;
  background: #E8F8EA;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.12);
}

.empty-icon {
  width: 2.25rem;
  height: 2.25rem;
  color: #15803D;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

.empty-desc {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 1.5rem;
  line-height: 1.55;
  text-align: center;
}

.btn-create--empty {
  margin-top: 0.25rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #F3F4F6;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="close">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Invite Team Member</h3>
              <p class="modal-subtitle">Search registered users or enter an email address to invite someone to {{ activeOrgName || 'your organization' }}.</p>
            </div>
            <button class="btn-close" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form class="modal-body" @submit.prevent="handleSubmit">
            <!-- User Search & Email Field -->
            <div class="form-group">
              <label class="form-label">
                Search User or Enter Email <span class="required-star">*</span>
              </label>

              <!-- Search Bar -->
              <div v-if="!selectedUser" class="search-input-box">
                <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Type name or email address..."
                  class="form-input"
                  :disabled="isSubmitting"
                  @input="handleSearchInput"
                  @focus="isSearching = true"
                />
                <span v-if="searchingUsers" class="search-spinner"></span>
              </div>

              <!-- Selected Invitee Card -->
              <div v-else class="selected-user-card">
                <div class="selected-user-avatar">
                  {{ selectedUser.initials }}
                </div>
                <div class="selected-user-info">
                  <span class="selected-user-name">{{ selectedUser.name }}</span>
                  <span class="selected-user-email">{{ selectedUser.email }}</span>
                </div>
                <button type="button" class="btn-remove-selected" @click="clearSelectedUser">
                  Change
                </button>
              </div>

              <!-- Live Search Results Dropdown -->
              <div v-if="!selectedUser && searchQuery.trim() && isSearching" class="search-results-dropdown">
                <div v-if="searchResults.length > 0" class="results-list">
                  <div
                    v-for="user in searchResults"
                    :key="user.id"
                    class="user-result-item"
                    @click="selectUser(user)"
                  >
                    <div class="result-avatar">
                      {{ initialsFromName(user.fullName || user.email) }}
                    </div>
                    <div class="result-info">
                      <span class="result-name">{{ user.fullName || user.email.split('@')[0] }}</span>
                      <span class="result-email">{{ user.email }}</span>
                    </div>
                    <span class="btn-select-user">Select</span>
                  </div>
                </div>

                <!-- Custom Email Direct Option -->
                <div class="custom-email-option" @click="useCustomEmail">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Invite <strong>{{ searchQuery }}</strong> via email</span>
                </div>
              </div>
            </div>

            <!-- Role Selector -->
            <div class="form-group">
              <label class="form-label">Select Role</label>
              <div class="roles-grid">
                <div
                  v-for="roleOption in roleOptions"
                  :key="roleOption.id"
                  class="role-card"
                  :class="{ 'role-card--active': selectedRole === roleOption.id }"
                  @click="selectedRole = roleOption.id"
                >
                  <div class="role-card-header">
                    <span class="role-name">{{ roleOption.name }}</span>
                    <span v-if="selectedRole === roleOption.id" class="selected-check">✓</span>
                  </div>
                  <p class="role-description">{{ roleOption.description }}</p>
                </div>
              </div>
            </div>

            <!-- Share Link Section -->
            <div class="share-section">
              <div class="share-header">
                <span class="share-title">Or share organization invite link</span>
              </div>
              <div class="share-input-row">
                <input
                  type="text"
                  readonly
                  :value="inviteLink"
                  class="share-input"
                />
                <button type="button" class="btn-copy-link" @click="copyInviteLink">
                  <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="copy-icon check-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ copied ? 'Copied' : 'Copy Link' }}</span>
                </button>
              </div>
            </div>

            <!-- Error message -->
            <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

            <!-- Actions Footer -->
            <div class="modal-footer">
              <button type="button" class="btn-secondary" :disabled="isSubmitting" @click="close">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting || !email">
                <span v-if="isSubmitting" class="spinner"></span>
                <span>{{ isSubmitting ? 'Sending...' : 'Send Invitation' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'invited': [member: { email: string; role: string }]
}>()

const { activeOrgId, activeOrgName, inviteMember, searchUsers } = useOrgState()
const toast = useToast()

const email = ref('')
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchingUsers = ref(false)
const isSearching = ref(false)
const selectedUser = ref<{ id?: string; name: string; email: string; initials: string } | null>(null)

const selectedRole = ref('admin')
const isSubmitting = ref(false)
const errorMessage = ref('')
const copied = ref(false)

const roleOptions = [
  { id: 'admin', name: 'Admin', description: 'Full access to manage events, ticket sales, orders, and team.' },
  { id: 'sales', name: 'Manager / Sales', description: 'Can create events, manage ticket tiers, and view sales reports.' },
  { id: 'ticket_scanner', name: 'Event Staff', description: 'Ticket scanning and live check-in access only.' },
  { id: 'customer_support', name: 'Member / Support', description: 'General view-only access and customer support.' },
]

const inviteLink = computed(() => {
  const orgSlug = activeOrgName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'org'
  return `https://uzuticket.com/join/${orgSlug}?invite=tk_${activeOrgId.value || '12389'}`
})

function initialsFromName(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'U'
}

let searchTimeout: any = null

function handleSearchInput() {
  selectedUser.value = null
  isSearching.value = true
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!searchQuery.value.trim()) {
    searchResults.value = []
    searchingUsers.value = false
    email.value = ''
    return
  }

  // If user typed an email directly, set email value
  if (searchQuery.value.includes('@')) {
    email.value = searchQuery.value.trim()
  }

  searchingUsers.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const results = await searchUsers(searchQuery.value)
      searchResults.value = results || []
    } catch (e) {
      searchResults.value = []
    } finally {
      searchingUsers.value = false
    }
  }, 250)
}

function selectUser(user: any) {
  const name = user.fullName || user.email.split('@')[0]
  const emailVal = user.email
  selectedUser.value = {
    id: user.id,
    name,
    email: emailVal,
    initials: initialsFromName(name),
  }
  email.value = emailVal
  searchQuery.value = emailVal
  isSearching.value = false
}

function useCustomEmail() {
  const raw = searchQuery.value.trim()
  selectedUser.value = {
    name: raw.split('@')[0],
    email: raw,
    initials: initialsFromName(raw),
  }
  email.value = raw
  isSearching.value = false
}

function clearSelectedUser() {
  selectedUser.value = null
  email.value = ''
  searchQuery.value = ''
  isSearching.value = true
}

function close() {
  emit('update:modelValue', false)
  resetForm()
}

function resetForm() {
  email.value = ''
  searchQuery.value = ''
  searchResults.value = []
  selectedUser.value = null
  selectedRole.value = 'admin'
  errorMessage.value = ''
  isSubmitting.value = false
}

async function copyInviteLink() {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    copied.value = true
    toast.success('Invite link copied to clipboard!')
    setTimeout(() => { copied.value = false }, 2500)
  } catch (err) {
    toast.info('Link ready: ' + inviteLink.value)
  }
}

async function handleSubmit() {
  if (!email.value) {
    errorMessage.value = 'Please select a user or enter an email address.'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (!activeOrgId.value) {
      errorMessage.value = 'Please select or active an organization first.'
      return
    }
    await inviteMember(activeOrgId.value, {
      email: email.value,
      role: selectedRole.value,
    })
    toast.success(`Invitation sent to ${email.value}!`)
    emit('invited', { email: email.value, role: selectedRole.value })
    close()
  } catch (e: any) {
    console.error('API invite error:', e)
    const msg = e?.response?.data?.message || e?.message || 'Failed to send invite'
    errorMessage.value = Array.isArray(msg) ? msg.join(' ') : msg
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(14, 38, 21, 0.45);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 1.5rem 1.75rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.35;
}

.btn-close {
  background: #f3f4f6;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-close:hover {
  background: #e5e7eb;
  color: #0E2615;
}
.close-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.modal-body {
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f2937;
}

.required-star {
  color: #ef4444;
}

.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  width: 1.2rem;
  height: 1.2rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-spinner {
  position: absolute;
  right: 0.85rem;
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0.85rem 0.75rem 2.6rem;
  font-size: 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 0.65rem;
  outline: none;
  background: #ffffff;
  color: #111827;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

/* Selected User Card */
.selected-user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: #f0fdf4;
  border: 1.5px solid #3FD246;
  border-radius: 0.75rem;
}

.selected-user-avatar {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: #0E2615;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.selected-user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.selected-user-name {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0E2615;
}

.selected-user-email {
  font-size: 0.785rem;
  color: #15803D;
}

.btn-remove-selected {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4b5563;
  background: #ffffff;
  border: 1px solid #d1d5db;
  padding: 0.25rem 0.55rem;
  border-radius: 0.4rem;
  cursor: pointer;
}
.btn-remove-selected:hover {
  background: #f3f4f6;
  color: #0E2615;
}

/* Search Results Dropdown */
.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 0.35rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-height: 220px;
  overflow-y: auto;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.user-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.user-result-item:hover {
  background: #f4fbf4;
}

.result-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #DBEAFE;
  color: #1D4ED8;
  font-weight: 800;
  font-size: 0.785rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.result-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0E2615;
}

.result-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.btn-select-user {
  font-size: 0.75rem;
  font-weight: 800;
  color: #3FD246;
}

.custom-email-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.85rem;
  background: #f9fafb;
  font-size: 0.825rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.custom-email-option:hover {
  background: #f0fdf4;
  color: #0E2615;
}

.mail-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #3FD246;
}

/* Roles */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}

.role-card {
  padding: 0.75rem 0.85rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  background: #f9fafb;
  transition: all 0.15s ease;
}

.role-card:hover {
  border-color: #3FD246;
  background: #f4fbf4;
}

.role-card--active {
  border-color: #3FD246;
  background: #f0fdf4;
  box-shadow: 0 2px 8px rgba(63, 210, 70, 0.12);
}

.role-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
}

.role-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0E2615;
}

.selected-check {
  font-size: 0.85rem;
  font-weight: 900;
  color: #3FD246;
}

.role-description {
  font-size: 0.735rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

/* Share Section */
.share-section {
  background: #f8faf8;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.share-title {
  font-size: 0.785rem;
  font-weight: 700;
  color: #4b5563;
}

.share-input-row {
  display: flex;
  gap: 0.5rem;
}

.share-input {
  flex: 1;
  font-size: 0.8rem;
  font-family: monospace;
  padding: 0.45rem 0.65rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
}

.btn-copy-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  background: #0E2615;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-copy-link:hover {
  background: #183e23;
}

.copy-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.check-icon {
  color: #3FD246;
}

.error-msg {
  font-size: 0.8rem;
  color: #dc2626;
  margin: 0;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-secondary {
  padding: 0.65rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #4b5563;
  background: #f3f4f6;
  border: none;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: #0E2615;
  background: #3FD246;
  border: none;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}
.btn-primary:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(14, 38, 21, 0.25);
  border-top-color: #0E2615;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

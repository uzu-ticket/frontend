<template>
  <div class="join-page">
    <main class="join-container">
      <!-- Loading State -->
      <div v-if="loading" class="join-card text-center">
        <img src="/uzu-logo.png" alt="Uzu Ticket" class="modal-logo" />
        <div class="loading-spinner mt-4"></div>
        <p class="loading-text">Loading invitation...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="join-card text-center">
        <img src="/uzu-logo.png" alt="Uzu Ticket" class="modal-logo mb-4" />
        <div class="icon-circle icon-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="card-title">Invalid Invitation</h2>
        <p class="card-subtitle">{{ error }}</p>
        <NuxtLink to="/organizations" class="btn-primary">
          Back to Organizations
        </NuxtLink>
      </div>

      <!-- Accepted State -->
      <div v-else-if="accepted" class="join-card text-center">
        <img src="/uzu-logo.png" alt="Uzu Ticket" class="modal-logo mb-4" />
        <div class="icon-circle icon-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="card-title">Invitation Accepted!</h2>
        <p class="card-subtitle">
          You are now a member of <strong>{{ inviteInfo?.orgName }}</strong>.
        </p>
        <button class="btn-primary" @click="goToDashboard">
          Go to Organization Dashboard
        </button>
      </div>

      <!-- Active Invitation Card -->
      <div v-else-if="inviteInfo" class="join-card">
        <!-- Top Logo -->
        <div class="card-header-logo">
          <img src="/uzu-logo.png" alt="Uzu Ticket" class="modal-logo" />
        </div>

        <!-- Org Header Block -->
        <div class="org-header-box">
          <div class="org-avatar">
            {{ orgInitials }}
          </div>
          <div class="org-details">
            <h1 class="org-name">{{ inviteInfo.orgName }}</h1>
            <span class="invite-badge">Team Invitation</span>
          </div>
        </div>

        <p class="card-subtitle">
          <strong>{{ inviteInfo.invitedBy }}</strong> invited you to join <strong>{{ inviteInfo.orgName }}</strong> as <strong>{{ inviteInfo.role }}</strong>.
        </p>

        <!-- Authenticated Mismatch Warning -->
        <div v-if="isAuthenticated && isEmailMismatch" class="mismatch-warning">
          <p class="warning-text">
            You are signed in as <strong>{{ userEmail }}</strong>, but this invitation was sent to <strong>{{ inviteInfo.inviteeEmail }}</strong>.
          </p>
          <div class="button-group">
            <button class="btn-primary" @click="handleSwitchAccount">
              Switch Account & Sign In
            </button>
            <button class="btn-outline" :disabled="accepting" @click="handleAccept">
              <span v-if="accepting" class="spinner"></span>
              <span>Accept as {{ userEmail }}</span>
            </button>
          </div>
        </div>

        <!-- Unauthenticated Prompt -->
        <div v-else-if="!isAuthenticated" class="auth-prompt">
          <p class="auth-text">Sign in to your Uzu Ticket account to accept this invitation.</p>
          <div class="button-group">
            <NuxtLink :to="`/auth/signin?redirect=${encodeURIComponent($route.fullPath)}`" class="btn-primary">
              Sign In to Accept
            </NuxtLink>
            <NuxtLink :to="`/auth/signup?redirect=${encodeURIComponent($route.fullPath)}&email=${encodeURIComponent(inviteInfo.inviteeEmail || '')}`" class="btn-outline">
              Create Account
            </NuxtLink>
          </div>
        </div>

        <!-- Authenticated Normal Action -->
        <div v-else class="button-group">
          <button class="btn-primary" :disabled="accepting" @click="handleAccept">
            <span v-if="accepting" class="spinner"></span>
            <span>{{ accepting ? 'Accepting...' : 'Accept Invitation & Join' }}</span>
          </button>
        </div>
      </div>
    </main>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useOrgState } from '~/composables/useOrgState'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Join Organization — Uzu Ticket',
})

const route = useRoute()
const router = useRouter()
const { instance } = useApi()
const { isAuthenticated, user, logout, restoreSession } = useAuth()
const { acceptInvitation, setActiveOrg, loadOrganizations } = useOrgState()
const toast = useToast()

interface InviteInfo {
  id: string
  organisationId: string
  orgName: string
  orgSlug: string
  role: string
  invitedBy: string
  inviteeEmail?: string
  isAccepted: boolean
}

const loading = ref(true)
const error = ref<string | null>(null)
const inviteInfo = ref<InviteInfo | null>(null)
const accepting = ref(false)
const accepted = ref(false)

const userEmail = computed(() => user.value?.email || '')
const isEmailMismatch = computed(() => {
  if (!isAuthenticated.value || !user.value?.email || !inviteInfo.value?.inviteeEmail) return false
  return user.value.email.toLowerCase() !== inviteInfo.value.inviteeEmail.toLowerCase()
})

const orgInitials = computed(() => {
  if (!inviteInfo.value?.orgName) return 'O'
  const parts = inviteInfo.value.orgName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'O'
})

onMounted(async () => {
  await restoreSession()

  const inviteId = route.query.invite as string
  if (!inviteId) {
    error.value = 'No invitation token provided in the link.'
    loading.value = false
    return
  }

  try {
    const res = await instance.get(`/organisations/invitations/info/${inviteId}`)
    const data = res.data?.data ?? res.data
    inviteInfo.value = data
    if (data.isAccepted) {
      accepted.value = true
    }
  } catch (e: any) {
    console.error('Failed to load invitation info:', e)
    error.value = e?.response?.data?.message || 'This invitation link is invalid or has expired.'
  } finally {
    loading.value = false
  }
})

async function handleAccept() {
  if (!inviteInfo.value) return

  accepting.value = true
  try {
    await acceptInvitation(inviteInfo.value.organisationId, inviteInfo.value.id)
    await loadOrganizations(true)
    setActiveOrg({ id: inviteInfo.value.organisationId, name: inviteInfo.value.orgName })
    toast.success(`Successfully joined ${inviteInfo.value.orgName}!`)
    accepted.value = true
  } catch (e: any) {
    console.error('Error accepting invitation:', e)
    toast.error(e?.response?.data?.message || 'Failed to accept invitation.')
  } finally {
    accepting.value = false
  }
}

async function handleSwitchAccount() {
  const targetEmail = inviteInfo.value?.inviteeEmail || ''
  await logout()
  router.push(`/auth/signin?redirect=${encodeURIComponent(route.fullPath)}&email=${encodeURIComponent(targetEmail)}`)
}

function goToDashboard() {
  if (inviteInfo.value) {
    setActiveOrg({ id: inviteInfo.value.organisationId, name: inviteInfo.value.orgName })
  }
  router.push('/organizations')
}

</script>

<style scoped>
.join-page {
  min-height: 100vh;
  background-color: #f9fafb;
  color: #111827;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.join-container {
  width: 100%;
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: center;
}

.join-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 2.25rem 2rem;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-center {
  text-align: center;
}

.card-header-logo {
  margin-bottom: 1.5rem;
}

.modal-logo {
  height: 2.25rem;
  width: auto;
  object-fit: contain;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.org-header-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.85rem 1rem;
  background: #f8faf8;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  margin-bottom: 1.25rem;
}

.org-avatar {
  width: 3rem;
  height: 3rem;
  background: #0E2615;
  color: #3FD246;
  font-size: 1.15rem;
  font-weight: 800;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.org-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow: hidden;
}

.org-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.invite-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #15803D;
  background: #dcfce7;
  padding: 0.15rem 0.5rem;
  border-radius: 0.35rem;
  width: fit-content;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #4b5563;
  margin: 0 0 1.5rem;
  line-height: 1.45;
  text-align: center;
}

.mismatch-warning {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 0.85rem;
  margin-bottom: 1.25rem;
}

.warning-text {
  font-size: 0.825rem;
  color: #92400e;
  margin: 0 0 0.85rem;
  text-align: center;
  line-height: 1.4;
}

.auth-prompt {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
  text-align: center;
}

.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: #0E2615;
  background: #3FD246;
  border: none;
  border-radius: 0.65rem;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #36bd3d;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.65rem;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease;
}

.btn-outline:hover {
  background: #f9fafb;
}

.icon-circle {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.icon-error {
  background: #fef2f2;
  color: #ef4444;
}

.icon-success {
  background: #f0fdf4;
  color: #16a34a;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  font-size: 0.875rem;
  color: #6b7280;
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
</style>

<template>
  <div class="settings-tab-content">
    <div class="settings-card">
      <!-- Section 1: Two-Factor Authentication (2FA) -->
      <div class="security-section">
        <div class="two-fa-header">
          <div>
            <h3 class="section-title">Two-Factor Authentication (2FA)</h3>
            <p class="section-desc">Add an extra layer of security to your account with TOTP authenticator.</p>
          </div>
          <span
            class="status-badge"
            :class="is2FAEnabled ? 'badge--enabled' : 'badge--disabled'"
          >
            {{ is2FAEnabled ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <button
          class="btn-2fa-action"
          :class="is2FAEnabled ? 'btn-disable-2fa' : 'btn-enable-2fa'"
          :disabled="is2FALoading"
          @click="handle2FAClick"
        >
          {{ is2FALoading ? 'Please wait...' : (is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA') }}
        </button>
      </div>

      <!-- Section 2: Session Management -->
      <div class="security-section">
        <h3 class="section-title">Session Management</h3>
        <div class="row-between">
          <div class="text-group">
            <span class="row-label">Active Sessions</span>
            <span class="row-subtitle">
              {{ activeSessionsCount }} Active {{ activeSessionsCount === 1 ? 'Session' : 'Sessions' }}
              <span v-if="currentDeviceText">({{ currentDeviceText }})</span>
            </span>
          </div>
          <button class="link-green" @click="openSessionsModal">View All</button>
        </div>
      </div>

      <!-- Section 3: Password -->
      <div class="security-section">
        <h3 class="section-title">Password</h3>
        <div class="row-between">
          <span class="row-subtitle">Keep your password secure and update it regularly</span>
          <button class="btn-outline" @click="showPasswordModal = true">Change Password</button>
        </div>
      </div>

      <!-- Section 4: Login Activity -->
      <div class="security-section">
        <h3 class="section-title">Login Activity</h3>
        <div class="row-between">
          <span class="row-subtitle">
            {{ user?.lastLoginAt ? `Last active: ${new Date(user.lastLoginAt).toLocaleString()}` : 'View recent login activity and locations' }}
          </span>
          <button class="btn-outline" @click="openLoginActivityModal">View Activity</button>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="pwd-modal">
        <h3 class="modal-title">Change Password</h3>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input
              v-model="pwdForm.current"
              type="password"
              class="form-input"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input
              v-model="pwdForm.newPwd"
              type="password"
              class="form-input"
              placeholder="At least 8 characters"
              autocomplete="new-password"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input
              v-model="pwdForm.confirm"
              type="password"
              class="form-input"
              placeholder="••••••••"
              autocomplete="new-password"
            />
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" :disabled="isUpdatingPassword" @click="closePasswordModal">Cancel</button>
          <button class="btn-submit" :disabled="isUpdatingPassword" @click="updatePassword">
            {{ isUpdatingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 2FA Setup Modal -->
    <div v-if="showSetup2FAModal" class="modal-overlay" @click.self="showSetup2FAModal = false">
      <div class="pwd-modal">
        <h3 class="modal-title">Set Up Two-Factor Authentication</h3>
        <p class="modal-desc">
          Scan this QR code in Google Authenticator, Authy, or copy the secret key below.
        </p>

        <div class="secret-box">
          <span class="secret-label">Secret Key:</span>
          <code class="secret-code">{{ twoFactorSetupData?.secret }}</code>
          <button class="btn-copy" @click="copySecret">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">6-Digit Verification Code</label>
            <input
              v-model="totpCode"
              type="text"
              maxlength="6"
              class="form-input text-center font-mono tracking-widest text-lg"
              placeholder="000000"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" :disabled="isVerifying2FA" @click="showSetup2FAModal = false">Cancel</button>
          <button class="btn-submit" :disabled="isVerifying2FA || totpCode.length !== 6" @click="submitEnable2FA">
            {{ isVerifying2FA ? 'Verifying...' : 'Verify & Enable' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 2FA Disable Modal -->
    <div v-if="showDisable2FAModal" class="modal-overlay" @click.self="showDisable2FAModal = false">
      <div class="pwd-modal">
        <h3 class="modal-title">Disable Two-Factor Authentication</h3>
        <p class="modal-desc">
          Enter the 6-digit code from your authenticator app to confirm disabling 2FA.
        </p>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">6-Digit Verification Code</label>
            <input
              v-model="totpCode"
              type="text"
              maxlength="6"
              class="form-input text-center font-mono tracking-widest text-lg"
              placeholder="000000"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" :disabled="isVerifying2FA" @click="showDisable2FAModal = false">Cancel</button>
          <button class="btn-submit btn-danger" :disabled="isVerifying2FA || totpCode.length !== 6" @click="submitDisable2FA">
            {{ isVerifying2FA ? 'Disabling...' : 'Confirm Disable' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Session Management Modal -->
    <div v-if="showSessionsModal" class="modal-overlay" @click.self="showSessionsModal = false">
      <div class="wide-modal">
        <div class="modal-header-row">
          <div>
            <h3 class="modal-title">Active Sessions</h3>
            <p class="modal-desc">Manage the devices and browsers currently signed in to your account.</p>
          </div>
          <button class="btn-close-x" @click="showSessionsModal = false">✕</button>
        </div>

        <div v-if="isLoadingSessions" class="modal-state-box">
          <div class="loading-spinner"></div>
          <span class="state-text">Loading active sessions...</span>
        </div>

        <div v-else-if="sessions.length === 0" class="modal-state-box">
          <span class="empty-icon">💻</span>
          <p class="empty-desc">No active sessions found.</p>
        </div>

        <div v-else class="sessions-list">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="session-item"
            :class="{ 'session-item--current': session.isCurrent }"
          >
            <div class="session-device-icon">
              <!-- Mobile Icon -->
              <svg
                v-if="session.device === 'Mobile'"
                xmlns="http://www.w3.org/2000/svg"
                class="device-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <!-- Tablet Icon -->
              <svg
                v-else-if="session.device === 'Tablet'"
                xmlns="http://www.w3.org/2000/svg"
                class="device-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <!-- Desktop Icon -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="device-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div class="session-info">
              <div class="session-title-row">
                <span class="session-name">{{ session.browser }} on {{ session.os }}</span>
                <span v-if="session.isCurrent" class="current-badge">Current Session</span>
              </div>
              <div class="session-meta">
                <span>{{ session.location }}</span>
                <span class="meta-dot">•</span>
                <span class="mono-ip">{{ session.ipAddress }}</span>
                <span class="meta-dot">•</span>
                <span>{{ formatTimeAgo(session.lastActiveAt) }}</span>
              </div>
            </div>

            <div class="session-actions">
              <button
                v-if="!session.isCurrent"
                class="btn-revoke-item"
                :disabled="revokingSessionId === session.id"
                @click="handleRevokeSession(session.id)"
              >
                {{ revokingSessionId === session.id ? 'Revoking...' : 'Revoke' }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer-between">
          <button
            v-if="otherSessionsCount > 0"
            class="btn-revoke-all"
            :disabled="isRevokingAll"
            @click="handleRevokeAllOtherSessions"
          >
            {{ isRevokingAll ? 'Revoking...' : `Log out of other ${otherSessionsCount} sessions` }}
          </button>
          <div v-else></div>
          <button class="btn-cancel" @click="showSessionsModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Login Activity Modal -->
    <div v-if="showLoginActivityModal" class="modal-overlay" @click.self="showLoginActivityModal = false">
      <div class="wide-modal">
        <div class="modal-header-row">
          <div>
            <h3 class="modal-title">Login Activity History</h3>
            <p class="modal-desc">Recent sign-in attempts recorded on your account.</p>
          </div>
          <button class="btn-close-x" @click="showLoginActivityModal = false">✕</button>
        </div>

        <div v-if="isLoadingActivity" class="modal-state-box">
          <div class="loading-spinner"></div>
          <span class="state-text">Loading login activity...</span>
        </div>

        <div v-else-if="loginActivities.length === 0" class="modal-state-box">
          <span class="empty-icon">🛡️</span>
          <p class="empty-desc">No login activity history available.</p>
        </div>

        <div v-else class="activity-table-wrapper">
          <table class="activity-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>DEVICE & BROWSER</th>
                <th>LOCATION & IP</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="act in loginActivities" :key="act.id">
                <td>
                  <span
                    class="status-pill"
                    :class="act.status === 'success' ? 'status-pill--success' : 'status-pill--failed'"
                  >
                    {{ act.status === 'success' ? 'Successful' : 'Failed' }}
                  </span>
                </td>
                <td>
                  <div class="activity-device-cell">
                    <span class="act-device">{{ act.browser }} ({{ act.os }})</span>
                    <span class="act-type">{{ act.device }}</span>
                  </div>
                </td>
                <td>
                  <div class="activity-location-cell">
                    <span>{{ act.location }}</span>
                    <span class="mono-ip">{{ act.ipAddress }}</span>
                  </div>
                </td>
                <td class="activity-time-cell">
                  {{ formatDateTime(act.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer-end">
          <button class="btn-cancel" @click="showLoginActivityModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSettings, type UserSessionItem, type LoginActivityItem } from '~/composables/useSettings'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { user, setupTwoFactor, enableTwoFactor, disableTwoFactor } = useAuth()
const {
  changePassword,
  fetchSessions,
  revokeSession,
  revokeAllOtherSessions,
  fetchLoginActivity,
} = useSettings()

const is2FAEnabled = computed(() => !!user.value?.isTotpEnabled)
const is2FALoading = ref(false)
const showSetup2FAModal = ref(false)
const showDisable2FAModal = ref(false)
const twoFactorSetupData = ref<{ secret?: string; otpauthUrl?: string } | null>(null)
const totpCode = ref('')
const isVerifying2FA = ref(false)
const copied = ref(false)

const showPasswordModal = ref(false)
const isUpdatingPassword = ref(false)
const pwdForm = reactive({
  current: '',
  newPwd: '',
  confirm: '',
})

// Session Management State
const showSessionsModal = ref(false)
const isLoadingSessions = ref(false)
const sessions = ref<UserSessionItem[]>([])
const revokingSessionId = ref<string | null>(null)
const isRevokingAll = ref(false)

const activeSessionsCount = computed(() => sessions.value.length || 1)
const otherSessionsCount = computed(() => sessions.value.filter((s) => !s.isCurrent).length)
const currentDeviceText = computed(() => {
  const current = sessions.value.find((s) => s.isCurrent)
  if (current) return `${current.device} • Current Session`
  return 'Current Session'
})

// Login Activity State
const showLoginActivityModal = ref(false)
const isLoadingActivity = ref(false)
const loginActivities = ref<LoginActivityItem[]>([])

onMounted(() => {
  loadSessionsSilently()
})

async function loadSessionsSilently() {
  try {
    const list = await fetchSessions()
    if (Array.isArray(list)) {
      sessions.value = list
    }
  } catch {
    // Keep quiet on background preload
  }
}

async function openSessionsModal() {
  showSessionsModal.value = true
  isLoadingSessions.value = true
  try {
    const list = await fetchSessions()
    sessions.value = Array.isArray(list) ? list : []
  } catch (e: any) {
    toast.error(e.message || 'Failed to load sessions.')
  } finally {
    isLoadingSessions.value = false
  }
}

async function handleRevokeSession(sessionId: string) {
  revokingSessionId.value = sessionId
  try {
    await revokeSession(sessionId)
    sessions.value = sessions.value.filter((s) => s.id !== sessionId)
    toast.success('Session revoked successfully!')
  } catch (e: any) {
    toast.error(e.message || 'Failed to revoke session.')
  } finally {
    revokingSessionId.value = null
  }
}

async function handleRevokeAllOtherSessions() {
  isRevokingAll.value = true
  try {
    await revokeAllOtherSessions()
    sessions.value = sessions.value.filter((s) => s.isCurrent)
    toast.success('Logged out of all other sessions!')
  } catch (e: any) {
    toast.error(e.message || 'Failed to revoke other sessions.')
  } finally {
    isRevokingAll.value = false
  }
}

async function openLoginActivityModal() {
  showLoginActivityModal.value = true
  isLoadingActivity.value = true
  try {
    const list = await fetchLoginActivity()
    loginActivities.value = Array.isArray(list) ? list : []
  } catch (e: any) {
    toast.error(e.message || 'Failed to load login activity.')
  } finally {
    isLoadingActivity.value = false
  }
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return 'Active recently'
  const date = new Date(dateStr)
  const now = new Date()
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Active just now'
  if (diffSec < 3600) return `Active ${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `Active ${Math.floor(diffSec / 3600)}h ago`
  return `Last seen ${date.toLocaleDateString()}`
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function handle2FAClick() {
  totpCode.value = ''
  if (is2FAEnabled.value) {
    showDisable2FAModal.value = true
  } else {
    is2FALoading.value = true
    try {
      const data = await setupTwoFactor()
      twoFactorSetupData.value = data
      showSetup2FAModal.value = true
    } catch (e: any) {
      toast.error(e.message || 'Failed to initiate 2FA setup.')
    } finally {
      is2FALoading.value = false
    }
  }
}

async function copySecret() {
  if (twoFactorSetupData.value?.secret) {
    await navigator.clipboard.writeText(twoFactorSetupData.value.secret)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
    toast.success('Secret key copied to clipboard!')
  }
}

async function submitEnable2FA() {
  if (!twoFactorSetupData.value?.secret || totpCode.value.length !== 6) return
  isVerifying2FA.value = true
  try {
    await enableTwoFactor(twoFactorSetupData.value.secret, totpCode.value)
    toast.success('Two-factor authentication enabled successfully!')
    showSetup2FAModal.value = false
    totpCode.value = ''
  } catch (e: any) {
    toast.error(e.message || 'Invalid code. Please try again.')
  } finally {
    isVerifying2FA.value = false
  }
}

async function submitDisable2FA() {
  if (totpCode.value.length !== 6) return
  isVerifying2FA.value = true
  try {
    await disableTwoFactor(totpCode.value)
    toast.success('Two-factor authentication disabled.')
    showDisable2FAModal.value = false
    totpCode.value = ''
  } catch (e: any) {
    toast.error(e.message || 'Invalid code. Please try again.')
  } finally {
    isVerifying2FA.value = false
  }
}

function closePasswordModal() {
  showPasswordModal.value = false
  pwdForm.current = ''
  pwdForm.newPwd = ''
  pwdForm.confirm = ''
}

async function updatePassword() {
  if (!pwdForm.current || !pwdForm.newPwd) {
    toast.error('Please enter your current and new password.')
    return
  }
  if (pwdForm.newPwd.length < 8) {
    toast.error('New password must be at least 8 characters long.')
    return
  }
  if (pwdForm.newPwd !== pwdForm.confirm) {
    toast.error('New passwords do not match.')
    return
  }

  isUpdatingPassword.value = true
  try {
    await changePassword(pwdForm.current, pwdForm.newPwd)
    toast.success('Password updated successfully!')
    closePasswordModal()
  } catch (e: any) {
    toast.error(e.message || 'Failed to update password.')
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>

<style scoped>
.settings-tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  padding: 1.75rem 0;
  border-top: 1px solid #F3F4F6;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.settings-card:first-child {
  border-top: none;
}

.security-section {
  display: flex;
  flex-direction: column;
}

.two-fa-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.status-badge {
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

.badge--enabled {
  background: #DCFCE7;
  color: #166534;
}

.badge--disabled {
  background: #F3F4F6;
  color: #6B7280;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0E2615;
  margin: 0 0 0.4rem 0;
}

.section-desc {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0 0 1.25rem 0;
}

.btn-2fa-action {
  align-self: flex-start;
  padding: 0.75rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-enable-2fa {
  background: #3FD246;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}
.btn-enable-2fa:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}

.btn-disable-2fa {
  background: #FEE2E2;
  color: #DC2626;
  border: 1px solid #FECACA;
}
.btn-disable-2fa:hover:not(:disabled) {
  background: #FCA5A5;
  color: #B91C1C;
}

.btn-2fa-action:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 0.35rem;
}

.text-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.row-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0E2615;
}

.row-subtitle {
  font-size: 0.85rem;
  color: #6B7280;
}

.link-green {
  background: none;
  border: none;
  color: #3FD246;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
.link-green:hover {
  text-decoration: underline;
}

.btn-outline {
  padding: 0.65rem 1.35rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.15s ease;
}
.btn-outline:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
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

.pwd-modal {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2rem;
  max-width: 440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.wide-modal {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2rem;
  max-width: 620px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.16);
}

.modal-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.btn-close-x {
  background: #F3F4F6;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: background 0.15s;
}
.btn-close-x:hover {
  background: #E5E7EB;
  color: #111827;
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0E2615;
  margin: 0;
}

.modal-desc {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0.35rem 0 0 0;
  line-height: 1.4;
}

.secret-box {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.secret-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6B7280;
}

.secret-code {
  font-family: monospace;
  font-weight: 600;
  color: #111827;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  word-break: break-all;
}

.btn-copy {
  padding: 0.35rem 0.65rem;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
}
.btn-copy:hover {
  background: #F3F4F6;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6B7280;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  outline: none;
}
.form-input:focus {
  border-color: #3FD246;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.modal-footer-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #F3F4F6;
}

.modal-footer-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #F3F4F6;
}

.btn-cancel {
  padding: 0.65rem 1.25rem;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #F3F4F6;
}

.btn-submit {
  padding: 0.65rem 1.5rem;
  background: #3FD246;
  border: none;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-submit:hover:not(:disabled) {
  background: #36bd3d;
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #DC2626 !important;
}
.btn-danger:hover:not(:disabled) {
  background: #B91C1C !important;
}

/* Session Items */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.15rem;
  background: #FAFAFA;
  border: 1px solid #E5E7EB;
  border-radius: 0.85rem;
  transition: border-color 0.15s;
}

.session-item--current {
  background: #F0FDF4;
  border-color: #BBF7D0;
}

.session-device-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.65rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.device-svg {
  width: 1.35rem;
  height: 1.35rem;
  color: #374151;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.session-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.session-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.current-badge {
  font-size: 0.72rem;
  font-weight: 700;
  background: #DCFCE7;
  color: #166534;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.session-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: #6B7280;
}

.meta-dot {
  color: #D1D5DB;
}

.mono-ip {
  font-family: monospace;
  font-size: 0.75rem;
  color: #4B5563;
}

.btn-revoke-item {
  padding: 0.45rem 0.85rem;
  background: #ffffff;
  border: 1px solid #FCA5A5;
  color: #DC2626;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-revoke-item:hover:not(:disabled) {
  background: #FEE2E2;
}
.btn-revoke-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-revoke-all {
  padding: 0.65rem 1.15rem;
  background: #FFF1F2;
  border: 1px solid #FECDD3;
  color: #E11D48;
  border-radius: 0.65rem;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-revoke-all:hover:not(:disabled) {
  background: #FFE4E6;
}
.btn-revoke-all:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Activity Table */
.activity-table-wrapper {
  overflow-x: auto;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.825rem;
}

.activity-table th {
  padding: 0.75rem 1rem;
  background: #F9FAFB;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #4B5563;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #E5E7EB;
}

.activity-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
}

.activity-table tr:last-child td {
  border-bottom: none;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-pill--success {
  background: #DCFCE7;
  color: #166534;
}

.status-pill--failed {
  background: #FEE2E2;
  color: #DC2626;
}

.activity-device-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.act-device {
  font-weight: 600;
  color: #111827;
}

.act-type {
  font-size: 0.75rem;
  color: #6B7280;
}

.activity-location-cell {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  color: #374151;
}

.activity-time-cell {
  color: #6B7280;
  white-space: nowrap;
}

/* State Box */
.modal-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  gap: 0.75rem;
  text-align: center;
}

.loading-spinner {
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid #E5E7EB;
  border-top-color: #3FD246;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-text {
  font-size: 0.85rem;
  color: #6B7280;
}

.empty-icon {
  font-size: 2rem;
}

.empty-desc {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}
</style>

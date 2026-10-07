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
            <span class="row-subtitle">1 Desktop (Current Session)</span>
          </div>
          <button class="link-green" @click="viewSessions">View All</button>
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
            {{ user?.lastLoginAt ? `Last active: ${new Date(user.lastLoginAt).toLocaleDateString()}` : 'View recent login activity and locations' }}
          </span>
          <button class="btn-outline" @click="viewLoginActivity">View Activity</button>
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
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useSettings } from '~/composables/useSettings'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { user, setupTwoFactor, enableTwoFactor, disableTwoFactor } = useAuth()
const { changePassword } = useSettings()

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

function viewSessions() {
  toast.info('Active session: Web client (Online)')
}

function viewLoginActivity() {
  if (user.value?.lastLoginAt) {
    toast.info(`Last login recorded on ${new Date(user.value.lastLoginAt).toLocaleString()}`)
  } else {
    toast.info('Current session is active.')
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

/* Modal */
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

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0E2615;
  margin: 0;
}

.modal-desc {
  font-size: 0.85rem;
  color: #6B7280;
  margin: -0.5rem 0 0 0;
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
</style>

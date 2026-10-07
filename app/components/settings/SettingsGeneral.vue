<template>
  <div class="settings-tab-content">
    <!-- Account Information Card -->
    <div class="settings-card">
      <div class="card-header">
        <h3 class="section-title">Account Information</h3>
      </div>
      <div class="card-body">
        <div class="account-profile-box">
          <div class="avatar-and-info">
            <!-- Profile Avatar -->
            <div class="profile-avatar">
              <img
                v-if="user?.avatarUrl"
                :src="user.avatarUrl"
                alt="Profile Avatar"
                class="avatar-img"
              />
              <div v-else class="avatar-fallback">
                {{ userInitials }}
              </div>
            </div>

            <!-- Field 1: Name -->
            <div class="info-field-group">
              <span class="field-label">Name</span>
              <template v-if="isEditing">
                <input v-model="form.fullName" type="text" class="form-input" placeholder="Enter your full name" />
              </template>
              <template v-else>
                <span class="field-value">{{ form.fullName || '—' }}</span>
              </template>
            </div>
          </div>

          <!-- Edit Button -->
          <button class="btn-edit-profile" @click="toggleEdit">
            <span>{{ isEditing ? 'Done' : 'Edit' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="edit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <!-- Field 2: Organization Name -->
        <div class="info-field-group">
          <span class="field-label">Organization Name</span>
          <template v-if="isEditing">
            <input v-model="form.orgName" type="text" class="form-input" placeholder="Organization name" />
          </template>
          <template v-else>
            <span class="field-value">{{ activeOrgName || '—' }}</span>
          </template>
        </div>

        <!-- Field 3: Email Address -->
        <div class="info-field-group">
          <span class="field-label">Email Address</span>
          <template v-if="isEditing">
            <input v-model="form.email" type="email" class="form-input" disabled title="Email address cannot be changed here" />
          </template>
          <template v-else>
            <span class="field-value">{{ form.email || '—' }}</span>
          </template>
        </div>

        <!-- Field 4: Phone Number -->
        <div class="info-field-group">
          <span class="field-label">Phone Number</span>
          <template v-if="isEditing">
            <input v-model="form.phone" type="tel" class="form-input" placeholder="e.g. +234..." />
          </template>
          <template v-else>
            <span class="field-value">{{ form.phone || '—' }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Platform Settings Card -->
    <div class="settings-card mt-6">
      <div class="card-header">
        <h3 class="section-title">Platform Settings</h3>
      </div>
      <div class="card-body form-grid">
        <!-- Default Currency -->
        <div class="form-group">
          <label class="form-label">Default Currency</label>
          <AppSelect
            v-model="form.currency"
            :options="currencyOptions"
          />
        </div>

        <!-- Time Zone -->
        <div class="form-group">
          <label class="form-label">Time Zone</label>
          <AppSelect
            v-model="form.timezone"
            :options="timezoneOptions"
          />
        </div>
      </div>
    </div>

    <!-- Save Changes Button -->
    <div class="save-actions">
      <button class="btn-save-changes" :disabled="isSaving" @click="saveSettings">
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSelect from '~/components/ui/AppSelect.vue'
import type { SelectOption } from '~/components/ui/AppSelect.vue'
import { useAuth } from '~/composables/useAuth'
import { useOrgState } from '~/composables/useOrgState'
import { useSettings } from '~/composables/useSettings'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { user, userInitials } = useAuth()
const { activeOrgId, activeOrgName } = useOrgState()
const { updateProfile, updateOrg } = useSettings()

const isEditing = ref(false)
const isSaving = ref(false)

const form = reactive({
  fullName: '',
  orgName: '',
  email: '',
  phone: '',
  currency: 'NGN',
  timezone: 'GMT + WAT',
})

// Sync form fields whenever user data becomes available
watch(
  user,
  (u) => {
    if (u) {
      form.fullName = u.fullName || ''
      form.email = u.email || ''
      form.phone = u.phone || ''
      if (u.preferredCurrency) {
        form.currency = u.preferredCurrency
      }
    }
  },
  { immediate: true },
)

// Sync org name from computed ref
watch(
  activeOrgName,
  (name) => {
    if (name) form.orgName = name
  },
  { immediate: true },
)

const currencyOptions: SelectOption[] = [
  { value: 'NGN', label: 'NGN (Naira)' },
  { value: 'USD', label: 'USD (US Dollar)' },
  { value: 'GBP', label: 'GBP (British Pound)' },
  { value: 'EUR', label: 'EUR (Euro)' },
]

const timezoneOptions: SelectOption[] = [
  { value: 'GMT + WAT', label: 'GMT + WAT' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'EST', label: 'EST (Eastern Standard Time)' },
  { value: 'PST', label: 'PST (Pacific Standard Time)' },
]

async function toggleEdit() {
  if (isEditing.value) {
    await saveSettings()
  } else {
    isEditing.value = true
  }
}

async function saveSettings() {
  isSaving.value = true
  try {
    const promises: Promise<any>[] = []

    // 1. Update user profile
    promises.push(
      updateProfile({
        fullName: form.fullName.trim() || undefined,
        phone: form.phone.trim() || undefined,
        preferredCurrency: form.currency,
      }),
    )

    // 2. Update organization name if active org exists and changed
    if (activeOrgId.value && form.orgName && form.orgName.trim() !== activeOrgName.value) {
      promises.push(
        updateOrg(activeOrgId.value, {
          name: form.orgName.trim(),
        }),
      )
    }

    await Promise.all(promises)
    isEditing.value = false
    toast.success('Settings saved successfully!')
  } catch (e: any) {
    toast.error(e.message || 'Failed to save settings.')
  } finally {
    isSaving.value = false
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
}

.settings-card:first-child {
  border-top: none;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0E2615;
  margin: 0 0 1.25rem 0;
}

.account-profile-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.avatar-and-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.profile-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  background: #0E2615;
  color: #3FD246;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.35rem;
}

.info-field-group:last-child {
  margin-bottom: 0;
}

.field-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6B7280;
}

.field-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #0E2615;
}

.btn-edit-profile {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.15rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-edit-profile:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.edit-icon {
  width: 0.9rem;
  height: 0.9rem;
}

.form-input {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 0.85rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 400;
  color: #0E2615;
  outline: none;
  transition: border-color 0.15s ease;
}
.form-input:focus {
  border-color: #3FD246;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 480px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6B7280;
}

.mt-6 {
  margin-top: 1.5rem;
}

.save-actions {
  margin-top: 1.25rem;
}

.btn-save-changes {
  padding: 0.75rem 2rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}
.btn-save-changes:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-save-changes:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

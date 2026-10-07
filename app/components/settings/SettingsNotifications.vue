<template>
  <div class="settings-tab-content">
    <div class="settings-card">
      <!-- Section 1: Email Notifications -->
      <div class="section-block">
        <h3 class="section-title">Email Notifications</h3>
        <div class="toggle-row">
          <div class="toggle-text">
            <span class="toggle-label">Enable email notifications</span>
            <span class="toggle-desc">Receive updates about your events, sales, and account activity.</span>
          </div>
          <label class="switch">
            <input v-model="prefs.emailNotifications" type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="divider" />

      <!-- Section 2: Notification Preferences -->
      <div class="section-block">
        <h3 class="section-title">Notification Preferences</h3>
        
        <div class="toggle-list">
          <!-- Row 1: New order notifications -->
          <div class="toggle-row">
            <div class="toggle-text">
              <span class="toggle-label">New order notifications</span>
              <span class="toggle-desc">Get notified when a ticket is purchased</span>
            </div>
            <label class="switch">
              <input v-model="prefs.newOrders" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Row 2: Payout notifications -->
          <div class="toggle-row">
            <div class="toggle-text">
              <span class="toggle-label">Payout notifications</span>
              <span class="toggle-desc">Get notified when you receive payout</span>
            </div>
            <label class="switch">
              <input v-model="prefs.payouts" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Row 3: Event Updates -->
          <div class="toggle-row">
            <div class="toggle-text">
              <span class="toggle-label">Event Updates</span>
              <span class="toggle-desc">Get notified about event status change</span>
            </div>
            <label class="switch">
              <input v-model="prefs.eventUpdates" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Row 4: System Alerts -->
          <div class="toggle-row">
            <div class="toggle-text">
              <span class="toggle-label">System Alerts</span>
              <span class="toggle-desc">Get notified about important system updates</span>
            </div>
            <label class="switch">
              <input v-model="prefs.systemAlerts" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
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
import { useAuth } from '~/composables/useAuth'
import { useSettings } from '~/composables/useSettings'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { user } = useAuth()
const { updateProfile } = useSettings()

const isSaving = ref(false)

const prefs = reactive({
  emailNotifications: true,
  newOrders: true,
  payouts: true,
  eventUpdates: true,
  systemAlerts: true,
})

// Sync emailNotifications with user's marketingOptIn
watch(
  user,
  (u) => {
    if (u && typeof u.marketingOptIn === 'boolean') {
      prefs.emailNotifications = u.marketingOptIn
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('uzu_notification_prefs')
      if (stored) {
        const parsed = JSON.parse(stored)
        Object.assign(prefs, parsed)
      }
    } catch {
      // ignore
    }
  }
})

async function saveSettings() {
  isSaving.value = true
  try {
    // 1. Update user marketingOptIn on backend
    await updateProfile({
      marketingOptIn: prefs.emailNotifications,
    })

    // 2. Persist preferences to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('uzu_notification_prefs', JSON.stringify(prefs))
    }

    toast.success('Notification preferences saved successfully!')
  } catch (e: any) {
    toast.error(e.message || 'Failed to save notification preferences.')
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
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.settings-card:first-child {
  border-top: none;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0E2615;
  margin: 0 0 1rem 0;
}

.divider {
  height: 1px;
  background: #F3F4F6;
  margin: 0.25rem 0;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0E2615;
}

.toggle-desc {
  font-size: 0.825rem;
  color: #6B7280;
}

/* Custom Green Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 2.75rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #E5E7EB;
  transition: 0.25s;
  border-radius: 9999px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.2rem;
  width: 1.2rem;
  left: 0.15rem;
  bottom: 0.15rem;
  background-color: white;
  transition: 0.25s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

input:checked + .slider {
  background-color: #3FD246;
}

input:checked + .slider:before {
  transform: translateX(1.25rem);
}

.save-actions {
  margin-top: 0.25rem;
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

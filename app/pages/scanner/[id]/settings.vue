<template>
  <div class="scanner-settings-page">
    <!-- Main Container Card -->
    <div class="settings-container">
      <!-- Back Link -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Scanner Settings</h2>
        <p class="section-subtitle">{{ eventName }}</p>
      </div>

      <!-- 1. Scanner Preferences -->
      <div class="settings-section">
        <h3 class="section-group-title">Scanner Preferences</h3>

        <div class="setting-row">
          <span class="setting-label">Auto refresh</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.autoRefresh }"
            @click="settings.autoRefresh = !settings.autoRefresh"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">Show duplicate alerts</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.showDuplicateAlerts }"
            @click="settings.showDuplicateAlerts = !settings.showDuplicateAlerts"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">Play sounds for new alerts</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.playSounds }"
            @click="settings.playSounds = !settings.playSounds"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">Email alerts for invalid scans</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.emailAlerts }"
            @click="settings.emailAlerts = !settings.emailAlerts"
          >
            <span class="toggle-knob" />
          </button>
        </div>
      </div>

      <!-- 2. Display -->
      <div class="settings-section">
        <h3 class="section-group-title">Display</h3>

        <div class="setting-row">
          <span class="setting-label">Dark mode</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.darkMode }"
            @click="settings.darkMode = !settings.darkMode"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">Compact viewer</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.compactViewer }"
            @click="settings.compactViewer = !settings.compactViewer"
          >
            <span class="toggle-knob" />
          </button>
        </div>
      </div>

      <!-- 3. Data -->
      <div class="settings-section">
        <h3 class="section-group-title">Data</h3>

        <div class="setting-row">
          <span class="setting-label">Auto sync when online</span>
          <button
            type="button"
            class="toggle-switch"
            :class="{ 'toggle-switch--on': settings.autoSync }"
            @click="settings.autoSync = !settings.autoSync"
          >
            <span class="toggle-knob" />
          </button>
        </div>

        <div class="setting-row">
          <span class="setting-label">Retraction period</span>
          <div class="retraction-select-wrapper">
            <AppSelect
              v-model="settings.retractionPeriod"
              :options="retractionOptions"
              placeholder="Select period"
            />
          </div>
        </div>
      </div>

      <!-- Reset to Defaults Action Link -->
      <div class="reset-action-row">
        <button type="button" class="btn-reset" @click="resetToDefaults">
          Reset to defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSelect from '~/components/ui/AppSelect.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Scanner Settings — Ticket Scanner',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const eventId = computed(() => (route.params.id as string) || '1')

function goBack() {
  router.push(`/scanner/${eventId.value}`)
}

const eventName = ref('Summer Tech Growth Summit')

const settings = ref({
  autoRefresh: true,
  showDuplicateAlerts: true,
  playSounds: true,
  emailAlerts: false,
  darkMode: false,
  compactViewer: true,
  autoSync: true,
  retractionPeriod: '90-days',
})

const retractionOptions = [
  { value: '30-days', label: '30 days' },
  { value: '60-days', label: '60 days' },
  { value: '90-days', label: '90 days' },
  { value: '180-days', label: '180 days' },
]

function resetToDefaults() {
  settings.value = {
    autoRefresh: true,
    showDuplicateAlerts: true,
    playSounds: true,
    emailAlerts: false,
    darkMode: false,
    compactViewer: true,
    autoSync: true,
    retractionPeriod: '90-days',
  }
  toast.show({
    title: 'Settings Reset',
    message: 'Scanner settings have been reset to defaults',
    type: 'success',
  })
}
</script>

<style scoped>
.scanner-settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

/* Back Link */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 800;
  color: #16A34A;
  cursor: pointer;
  width: fit-content;
  transition: color 0.15s ease;
}

.back-button:hover {
  color: #15803D;
}

.back-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.section-subtitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
}

/* Settings Sections */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-group-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 48rem;
}

.setting-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* Custom Toggle Switch */
.toggle-switch {
  width: 2.75rem;
  height: 1.5rem;
  background: #E5E7EB;
  border-radius: 9999px;
  border: none;
  padding: 0.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.toggle-switch--on {
  background: #3FD246;
}

.toggle-knob {
  width: 1.2rem;
  height: 1.2rem;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  transform: translateX(0);
}

.toggle-switch--on .toggle-knob {
  transform: translateX(1.25rem);
}

/* Retraction Period Select */
.retraction-select-wrapper {
  width: 10rem;
}

/* Reset Action */
.reset-action-row {
  margin-top: 0.5rem;
}

.btn-reset {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 800;
  color: #EF4444;
  cursor: pointer;
  transition: color 0.15s ease;
}

.btn-reset:hover {
  color: #DC2626;
  text-decoration: underline;
}
</style>

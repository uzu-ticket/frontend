<template>
  <div class="connect-step-container">
    <!-- Main Full-Width White Card Container -->
    <div class="connect-card">
      <!-- Back Arrow Top Left inside Card -->
      <button class="back-btn" title="Go back to integrations" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <!-- Header Block with Logo + Name + Description -->
      <div class="header-row">
        <div class="header-logo-shell">
          <IntegrationLogo :logo-key="integration.logoKey" />
        </div>
        <div class="header-info">
          <h2 class="integration-name">{{ integration.name }}</h2>
          <p class="integration-subtitle">{{ integration.description }}</p>
        </div>
        <span v-if="integration.connected" class="connected-badge">
          <span class="badge-dot" />
          Connected
        </span>
      </div>

      <div class="divider" />

      <!-- Two-Column Layout: Form on left, Info panel on right -->
      <div class="layout-two-col">

        <!-- LEFT: API Keys Form -->
        <div class="form-section">
          <h3 class="section-title">API Credentials</h3>
          <p class="section-sub">Enter your {{ integration.name }} API keys below. Your credentials are encrypted at rest.</p>

          <form class="connect-form" @submit.prevent="handleConnect">
            <!-- Public / API Key -->
            <div class="form-group">
              <label class="form-label">{{ apiKeyLabel }} <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input
                  v-model="publicKey"
                  type="text"
                  class="form-input"
                  :placeholder="publicKeyPlaceholder"
                  required
                />
              </div>
            </div>

            <!-- Secret Key (conditionally shown) -->
            <div v-if="hasSecretKey" class="form-group">
              <label class="form-label">{{ secretKeyLabel }} <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  v-model="secretKey"
                  :type="showSecret ? 'text' : 'password'"
                  class="form-input"
                  :placeholder="secretKeyPlaceholder"
                  required
                />
                <button type="button" class="eye-toggle" @click="showSecret = !showSecret" :title="showSecret ? 'Hide key' : 'Show key'">
                  <svg v-if="!showSecret" xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="eye-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.092-4.092a3 3 0 11-4.243-4.243" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Webhook URL (optional, shown for payment providers) -->
            <div v-if="hasWebhook" class="form-group">
              <label class="form-label">Webhook URL</label>
              <div class="input-wrapper webhook-input-wrapper">
                <input
                  :value="webhookUrl"
                  type="text"
                  class="form-input form-input--readonly"
                  readonly
                />
                <button type="button" class="copy-btn" title="Copy webhook URL" @click="copyWebhook">
                  <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="copy-icon copy-icon--done" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
              <span class="helper-text">Add this URL to your {{ integration.name }} webhook settings.</span>
            </div>

            <!-- Security Notice Banner -->
            <div class="security-notice-card">
              <div class="info-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="notice-body">
                <p class="notice-text">
                  Your keys are encrypted with AES-256. Only you can see them.
                </p>
                <a :href="dashboardLink" target="_blank" rel="noopener noreferrer" class="api-keys-link">
                  <span>Get your API keys from {{ integration.name }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="link-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Bottom Action Buttons -->
            <div class="form-actions-row">
              <button type="button" class="btn-cancel" @click="$emit('back')">
                Cancel
              </button>
              <button id="btn-submit-connect" type="submit" class="btn-connect" :disabled="isSubmitting">
                <svg v-if="isSubmitting" class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ integration.connected ? 'Update Keys' : 'Connect' }}</span>
                <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <!-- RIGHT: Info & Steps Panel -->
        <div class="info-panel">
          <div class="info-panel-inner">
            <h4 class="info-panel-title">How to connect</h4>
            <ol class="steps-list">
              <li class="step-item" v-for="(step, i) in howToSteps" :key="i">
                <span class="step-num">{{ i + 1 }}</span>
                <span class="step-text">{{ step }}</span>
              </li>
            </ol>

            <div class="divider-thin" />

            <!-- Capability Tags -->
            <div class="capability-section">
              <p class="capability-title">What you can do</p>
              <div class="capability-tags">
                <span
                  v-for="cap in capabilities"
                  :key="cap"
                  class="cap-tag"
                >{{ cap }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import IntegrationLogo from './IntegrationLogo.vue'
import type { IntegrationItem } from '~/composables/useIntegrations'

const props = defineProps<{
  integration: IntegrationItem
}>()

const emit = defineEmits<{
  back: []
  connect: [keys: { publicKey: string; secretKey: string }]
}>()

const showSecret = ref(false)
const isSubmitting = ref(false)
const copied = ref(false)

const publicKey = ref('pk_test_4e8a29b01c3857d4a1b029c')
const secretKey = ref('sk_test_99e8a71b29a04f8e21a48c7')

const webhookUrl = 'https://api.uzuticket.com/webhooks/events'

// Integration-specific config
const integrationConfig: Record<string, {
  apiKeyLabel: string
  secretKeyLabel: string
  publicKeyPlaceholder: string
  secretKeyPlaceholder: string
  hasSecretKey: boolean
  hasWebhook: boolean
  dashboardLink: string
  howToSteps: string[]
  capabilities: string[]
}> = {
  paystack: {
    apiKeyLabel: 'Public Key',
    secretKeyLabel: 'Secret Key',
    publicKeyPlaceholder: 'pk_test_...',
    secretKeyPlaceholder: 'sk_test_...',
    hasSecretKey: true,
    hasWebhook: true,
    dashboardLink: 'https://dashboard.paystack.com/#/settings/developer',
    howToSteps: [
      'Log into your Paystack Dashboard.',
      'Go to Settings → API Keys & Webhooks.',
      'Copy your Public Key and Secret Key.',
      'Paste them here and click Connect.',
      'Add the webhook URL to your Paystack dashboard.',
    ],
    capabilities: ['Card Payments', 'Bank Transfer', 'Refunds', 'Webhooks'],
  },
  flutterwave: {
    apiKeyLabel: 'Public Key',
    secretKeyLabel: 'Secret Key',
    publicKeyPlaceholder: 'FLWPUBK_TEST-...',
    secretKeyPlaceholder: 'FLWSECK_TEST-...',
    hasSecretKey: true,
    hasWebhook: true,
    dashboardLink: 'https://developer.flutterwave.com/docs/api-keys',
    howToSteps: [
      'Log into your Flutterwave Dashboard.',
      'Navigate to Settings → API tab.',
      'Copy your Public Key and Secret Key.',
      'Paste them here and click Connect.',
      'Register the webhook URL in Flutterwave.',
    ],
    capabilities: ['Cards', 'Mobile Money', 'Bank Transfer', 'USSD'],
  },
  mailchimp: {
    apiKeyLabel: 'API Key',
    secretKeyLabel: 'Audience List ID',
    publicKeyPlaceholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1',
    secretKeyPlaceholder: 'abc123def4',
    hasSecretKey: true,
    hasWebhook: false,
    dashboardLink: 'https://mailchimp.com/help/about-api-keys/',
    howToSteps: [
      'Log into your Mailchimp account.',
      'Go to Profile → Extras → API Keys.',
      'Create or copy an existing API Key.',
      'Find your Audience List ID under Audience → Settings.',
      'Paste both here and click Connect.',
    ],
    capabilities: ['Email Campaigns', 'Audience Sync', 'Automation', 'Segments'],
  },
  'google-analytics': {
    apiKeyLabel: 'Measurement ID',
    secretKeyLabel: 'API Secret',
    publicKeyPlaceholder: 'G-XXXXXXXXXX',
    secretKeyPlaceholder: 'your_api_secret',
    hasSecretKey: true,
    hasWebhook: false,
    dashboardLink: 'https://analytics.google.com/',
    howToSteps: [
      'Open Google Analytics and select your property.',
      'Go to Admin → Data Streams.',
      'Select your Web stream.',
      'Copy the Measurement ID (G-XXXXXXXX).',
      'Paste it here and click Connect.',
    ],
    capabilities: ['Traffic Analytics', 'Conversions', 'Funnels', 'Events'],
  },
  'meta-pixel': {
    apiKeyLabel: 'Pixel ID',
    secretKeyLabel: 'Access Token',
    publicKeyPlaceholder: '1234567890123456',
    secretKeyPlaceholder: 'EAAGm...',
    hasSecretKey: true,
    hasWebhook: false,
    dashboardLink: 'https://www.facebook.com/events_manager2/',
    howToSteps: [
      'Open Meta Events Manager.',
      'Select your Pixel from the list.',
      'Copy the Pixel ID shown at the top.',
      'Generate a Conversions API Access Token.',
      'Paste both here and click Connect.',
    ],
    capabilities: ['Ad Tracking', 'Retargeting', 'Conversions API', 'Audiences'],
  },
  zapier: {
    apiKeyLabel: 'API Key',
    secretKeyLabel: '',
    publicKeyPlaceholder: 'your-zapier-api-key',
    secretKeyPlaceholder: '',
    hasSecretKey: false,
    hasWebhook: true,
    dashboardLink: 'https://zapier.com/app/settings/general',
    howToSteps: [
      'Log into your Zapier account.',
      'Go to Settings → Developer.',
      'Generate a new API Key.',
      'Paste it here and click Connect.',
      'Add the Uzu webhook to your Zap triggers.',
    ],
    capabilities: ['5000+ App Integrations', 'Automation', 'Triggers', 'Actions'],
  },
  paypal: {
    apiKeyLabel: 'Client ID',
    secretKeyLabel: 'Client Secret',
    publicKeyPlaceholder: 'AclientID...',
    secretKeyPlaceholder: 'Asecret...',
    hasSecretKey: true,
    hasWebhook: true,
    dashboardLink: 'https://developer.paypal.com/dashboard/',
    howToSteps: [
      'Go to the PayPal Developer Dashboard.',
      'Create or select your app under My Apps & Credentials.',
      'Copy the Client ID and Client Secret.',
      'Paste them here and click Connect.',
      'Register the webhook URL in your PayPal app settings.',
    ],
    capabilities: ['PayPal Checkout', 'International Payments', 'Refunds', 'Webhooks'],
  },
}

const config = computed(() => integrationConfig[props.integration.id] || integrationConfig.paystack)
const apiKeyLabel = computed(() => config.value.apiKeyLabel)
const secretKeyLabel = computed(() => config.value.secretKeyLabel)
const publicKeyPlaceholder = computed(() => config.value.publicKeyPlaceholder)
const secretKeyPlaceholder = computed(() => config.value.secretKeyPlaceholder)
const hasSecretKey = computed(() => config.value.hasSecretKey)
const hasWebhook = computed(() => config.value.hasWebhook)
const dashboardLink = computed(() => config.value.dashboardLink)
const howToSteps = computed(() => config.value.howToSteps)
const capabilities = computed(() => config.value.capabilities)

async function copyWebhook() {
  try {
    await navigator.clipboard.writeText(webhookUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {}
}

function handleConnect() {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    emit('connect', {
      publicKey: publicKey.value,
      secretKey: secretKey.value,
    })
  }, 900)
}
</script>

<style scoped>
.connect-step-container {
  width: 100%;
}

.connect-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2.25rem 2.5rem 3rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: #111827;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
}
.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
.back-icon {
  width: 1.35rem;
  height: 1.35rem;
}

/* Header Row */
.header-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.header-logo-shell {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 1rem;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.integration-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.2rem;
}

.integration-subtitle {
  font-size: 0.9rem;
  color: #6B7280;
  margin: 0;
}

.connected-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #DCFCE7;
  color: #15803D;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.badge-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #16A34A;
}

.divider {
  height: 1px;
  background: #F3F4F6;
  margin: 0 0 2rem;
}

/* Two Column Layout */
.layout-two-col {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 900px) {
  .layout-two-col {
    grid-template-columns: 1fr;
  }
}

/* Form Section */
.form-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.35rem;
}

.section-sub {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 1.75rem;
}

.connect-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.required {
  color: #EF4444;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #9CA3AF;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1.1rem 0.85rem 2.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  background: #ffffff;
  border: 1px solid #D1D5DB;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.form-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}
.form-input--readonly {
  background: #F9FAFB;
  color: #6B7280;
  cursor: default;
  font-size: 0.85rem;
  padding-right: 3.5rem;
}
.form-input--readonly:focus {
  border-color: #D1D5DB;
  box-shadow: none;
}

.eye-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  transition: color 0.15s;
}
.eye-toggle:hover {
  color: #374151;
}
.eye-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.webhook-input-wrapper {}

.copy-btn {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  transition: color 0.15s;
}
.copy-btn:hover {
  color: #3FD246;
}
.copy-icon {
  width: 1.1rem;
  height: 1.1rem;
}
.copy-icon--done {
  color: #16A34A;
}

.helper-text {
  font-size: 0.8rem;
  color: #6B7280;
  margin-top: 0.4rem;
}

/* Security Notice */
.security-notice-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #EAF8ED;
  padding: 1.25rem 1.5rem;
  border-radius: 0.85rem;
}

.info-icon-wrapper {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: #15803D;
}

.notice-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.notice-text {
  font-size: 0.875rem;
  color: #0E2615;
  line-height: 1.45;
  margin: 0;
}

.api-keys-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #15803D;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
}
.api-keys-link:hover {
  text-decoration: underline;
}

.link-arrow {
  width: 1rem;
  height: 1rem;
}

/* Form Actions */
.form-actions-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  background: #ffffff;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  border: 1px solid #D1D5DB;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-cancel:hover {
  background: #F9FAFB;
}

.btn-connect {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 2.25rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: background 0.15s ease, transform 0.15s ease, opacity 0.15s;
}
.btn-connect:hover:not(:disabled) {
  background: #36bd3d;
  transform: translateY(-1px);
}
.btn-connect:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-arrow {
  width: 1.1rem;
  height: 1.1rem;
}

.spinner {
  width: 1.1rem;
  height: 1.1rem;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Right Panel */
.info-panel {
  position: sticky;
  top: 2rem;
}

.info-panel-inner {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-panel-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.steps-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.step-num {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #E8F8EA;
  color: #15803D;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.45;
  padding-top: 0.15rem;
}

.divider-thin {
  height: 1px;
  background: #E5E7EB;
}

.capability-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.capability-title {
  font-size: 0.825rem;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.capability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cap-tag {
  background: #ffffff;
  border: 1px solid #D1FAE5;
  color: #065F46;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
}
</style>

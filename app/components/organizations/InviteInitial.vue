<template>
  <div class="invite-initial-container">
    <!-- Top Back Link -->
    <div class="back-row">
      <button class="btn-back-link" @click="handleBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>
    </div>

    <!-- Centered Card Content -->
    <div class="invite-content">
      <!-- 3 Overlapping Avatars Header Visual -->
      <div class="avatars-row">
        <div class="avatar-circle avatar-circle--1">
          <div class="avatar-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="avatar-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        <div class="avatar-circle avatar-circle--2">
          <div class="avatar-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="avatar-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        <div class="avatar-circle avatar-circle--3">
          <div class="avatar-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="avatar-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="visual-divider" />

      <!-- Title & Subtitle -->
      <h2 class="invite-title">Invite Team Members</h2>
      <p class="invite-subtitle">Add your team members to start collaborating</p>

      <!-- Search Input Trigger -->
      <div class="search-trigger-box" @click="$emit('start-search')">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="search-placeholder">Search by name or email</span>
      </div>

      <!-- Divider label -->
      <div class="or-divider">
        <span>Or share invite link</span>
      </div>

      <!-- Share Link Box -->
      <div class="share-link-card" @click="copyLink">
        <div class="link-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <span class="link-text">{{ copied ? 'Link Copied to Clipboard!' : 'Or share invite link' }}</span>
      </div>

      <!-- Submit Button -->
      <div class="action-footer">
        <button id="btn-send-invite" class="btn-send-invite" @click="$emit('send-invite')">
          Send Invite
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  back: []
  'start-search': []
  'send-invite': []
}>()

const router = useRouter()
const copied = ref(false)

function handleBack() {
  emit('back')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText('https://uzuticket.com/org/invite/token-12389')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}
</script>

<style scoped>
.invite-initial-container {
  width: 100%;
}

.back-row {
  margin-bottom: 1.5rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-back-link:hover { color: #0E2615; }
.back-icon { width: 1rem; height: 1rem; }

/* Centered Content */
.invite-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 540px;
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

/* 3 Overlapping Avatars */
.avatars-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.avatar-circle {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  padding: 4px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  margin-left: -1.25rem;
  transition: transform 0.2s ease;
}

.avatar-circle:first-child {
  margin-left: 0;
}

.avatar-circle--1 { background: #F3F4F6; }
.avatar-circle--2 { background: #FCE7F3; }
.avatar-circle--3 { background: #FEE2E2; }

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #9CA3AF;
}

.avatar-circle--1 .avatar-inner { background: #CBD5E1; color: #475569; }
.avatar-circle--2 .avatar-inner { background: #FBCFE8; color: #DB2777; }
.avatar-circle--3 .avatar-inner { background: #FECACA; color: #DC2626; }

.avatar-svg {
  width: 3.25rem;
  height: 3.25rem;
}

.visual-divider {
  width: 100%;
  max-width: 280px;
  height: 1px;
  background: #E5E7EB;
  margin-bottom: 1.75rem;
}

/* Title & Subtitle */
.invite-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #3FD246;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.invite-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.75rem;
}

/* Search Trigger Box */
.search-trigger-box {
  width: 100%;
  max-width: 440px;
  padding: 0.75rem 1.25rem;
  background: #EBF1F6;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 1.75rem;
}

.search-trigger-box:hover {
  background: #e2e9f0;
}

.search-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #9ca3af;
}

.search-placeholder {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Or Divider */
.or-divider {
  margin-bottom: 1.25rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #6b7280;
}

/* Share Link Card */
.share-link-card {
  width: 100%;
  max-width: 440px;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 2.25rem;
}

.share-link-card:hover {
  border-color: #3FD246;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.1);
}

.link-icon-box {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.6rem;
  background: #0E2615;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.link-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

/* Footer Action */
.action-footer {
  width: 100%;
  max-width: 440px;
}

.btn-send-invite {
  width: 100%;
  padding: 0.85rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-send-invite:hover {
  background: #34c03b;
  transform: translateY(-1px);
}
</style>

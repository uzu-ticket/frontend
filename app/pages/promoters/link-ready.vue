<template>
  <div class="link-ready-page">
    <!-- Demo Nav -->
    <div class="demo-nav-row">
      <NuxtLink to="/promoters" class="demo-nav-link">Dashboard</NuxtLink>
      <NuxtLink to="/promoters/create" class="demo-nav-link">+ Create Link</NuxtLink>
      <NuxtLink to="/promoters/link-ready" class="demo-nav-link demo-nav-link--active">Link Ready</NuxtLink>
      <NuxtLink to="/promoters/invite" class="demo-nav-link">Invite Flow</NuxtLink>
    </div>

    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Title & Subtitle -->
      <div class="card-header-section">
        <h1 class="card-title">Your Promoter Link is Ready!</h1>
        <p class="card-subtitle">Share your promoter link and start earning commission</p>
      </div>

      <!-- Your Link Section -->
      <div class="link-section">
        <label class="section-label">Your Link</label>
        <div class="copy-link-input-wrap">
          <input
            type="text"
            readonly
            :value="promoterLink"
            class="copy-link-input"
          />
          <button type="button" class="btn-copy-icon" title="Copy link" @click="copyLink">
            <svg class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 2-Column Section: Scan QR Code & Link Summary -->
      <div class="content-grid">
        <!-- Left: Scan QR Code -->
        <div class="qr-col">
          <h2 class="col-title">Scan QR Code</h2>
          <div class="qr-box">
            <div class="qr-code-wrapper">
              <svg viewBox="0 0 100 100" class="qr-svg" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="25" height="25" fill="#111827" rx="2"/>
                <rect x="14" y="14" width="17" height="17" fill="white" rx="1"/>
                <rect x="18" y="18" width="9" height="9" fill="#111827" rx="1"/>
                <rect x="65" y="10" width="25" height="25" fill="#111827" rx="2"/>
                <rect x="69" y="14" width="17" height="17" fill="white" rx="1"/>
                <rect x="73" y="18" width="9" height="9" fill="#111827" rx="1"/>
                <rect x="10" y="65" width="25" height="25" fill="#111827" rx="2"/>
                <rect x="14" y="69" width="17" height="17" fill="white" rx="1"/>
                <rect x="18" y="73" width="9" height="9" fill="#111827" rx="1"/>
                <rect x="40" y="10" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="48" y="10" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="10" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="18" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="18" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="26" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="48" y="26" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="10" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="18" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="26" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="48" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="64" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="72" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="80" y="40" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="10" y="48" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="26" y="48" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="48" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="48" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="72" y="48" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="80" y="48" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="10" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="18" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="26" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="48" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="64" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="72" y="56" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="65" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="48" y="65" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="65" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="64" y="65" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="72" y="65" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="80" y="65" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="73" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="56" y="73" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="80" y="73" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="40" y="80" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="48" y="80" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="64" y="80" width="5" height="5" fill="#111827" rx="1"/>
                <rect x="72" y="80" width="5" height="5" fill="#111827" rx="1"/>
              </svg>
            </div>
            <button type="button" class="btn-download" @click="downloadQr">
              Download
            </button>
          </div>
        </div>

        <!-- Right: Link Summary -->
        <div class="summary-col">
          <h2 class="col-title">Link Summary</h2>
          <div class="summary-list">
            <div class="summary-row">
              <span class="summary-label">Event</span>
              <span class="summary-value font-bold">Music Fest 2026</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Commission</span>
              <span class="summary-value font-bold">10%</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Created</span>
              <span class="summary-value font-bold">Sept 12, 2026 - 9:46 AM</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Expires</span>
              <span class="summary-value font-bold">Never</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Apply to</span>
              <span class="summary-value font-bold">All Ticket Types</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Alias</span>
              <span class="summary-value font-bold">music-fest-26.live</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Link Section -->
      <div class="share-section">
        <span class="section-label">Share Link</span>
        <div class="social-links">
          <button type="button" class="social-link-btn" @click="shareOn('whatsapp')">Whatsapp</button>
          <button type="button" class="social-link-btn" @click="shareOn('twitter')">Twitter</button>
          <button type="button" class="social-link-btn" @click="shareOn('facebook')">Facebook</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Promoter Link Ready — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Promoter link created successfully' },
  ],
})

const promoterLink = ref('https://uzuticet.com/p/jane_may/musicFest26')
const toast = useToast()

function copyLink() {
  navigator.clipboard.writeText(promoterLink.value)
  toast.show({
    title: 'Link Copied!',
    message: 'Promoter link copied to clipboard',
    type: 'success',
  })
}

function downloadQr() {
  toast.show({
    title: 'Downloading QR Code',
    message: 'QR Code image saved to downloads',
    type: 'info',
  })
}

function shareOn(platform: string) {
  toast.show({
    title: `Share on ${platform}`,
    message: `Opening ${platform} share window`,
    type: 'info',
  })
}
</script>

<style scoped>
.link-ready-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Demo Nav */
.demo-nav-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.demo-nav-link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.15s ease;
}

.demo-nav-link:hover {
  border-color: #3FD246;
  color: #16a34a;
}

.demo-nav-link--active {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
}

/* Main Unified Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header Section */
.card-header-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Your Link Section */
.link-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

.copy-link-input-wrap {
  position: relative;
  max-width: 520px;
  width: 100%;
}

.copy-link-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: 'Outfit', sans-serif;
  color: #3FD246;
  font-weight: 600;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;
}

.btn-copy-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.btn-copy-icon:hover {
  color: #3FD246;
}

.copy-icon {
  width: 20px;
  height: 20px;
}

/* 2-Column Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  align-items: start;
}

.col-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1rem;
}

/* QR Col */
.qr-box {
  background: #ffffff;
  border-radius: 1rem;
  border: 1.5px solid #eef2ee;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-code-wrapper {
  width: 160px;
  height: 160px;
}

.qr-svg {
  width: 100%;
  height: 100%;
}

.btn-download {
  background: transparent;
  border: none;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s ease;
}

.btn-download:hover {
  color: #3FD246;
}

/* Summary Col */
.summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  max-width: 450px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid #f9fafb;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
}

.summary-value {
  font-size: 0.875rem;
  color: #0E2615;
}

.font-bold {
  font-weight: 700;
}

/* Share Section */
.share-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.social-link-btn {
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
  cursor: pointer;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s ease;
}

.social-link-btn:hover {
  color: #3FD246;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>

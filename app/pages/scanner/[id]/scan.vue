<template>
  <div class="scan-page">
    <!-- Main Container -->
    <div class="scan-container">
      <!-- Back Link -->
      <button type="button" class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      <!-- Event Banner -->
      <div class="event-banner">
        <ScannerEventCard
          :title="event.title"
          :date-time="event.dateTime"
          :location="event.location"
          :image-url="event.imageUrl"
          :status="event.status"
          :clickable="false"
        />
      </div>

      <!-- Online/Offline Status Bar -->
      <div class="status-bar" :class="isOnline ? 'status-bar--online' : 'status-bar--offline'">
        <div class="status-row">
          <span class="status-indicator">
            <span class="status-dot" :class="isOnline ? 'status-dot--online' : 'status-dot--offline'"></span>
            {{ isOnline ? 'Online' : 'Offline Mode' }}
          </span>
          <span v-if="!isOnline" class="offline-badge">Validations use cached manifest</span>
        </div>

        <button
          v-if="!isOnline"
          type="button"
          class="btn-sync"
          @click="handleSync"
          :disabled="syncing"
        >
          <svg v-if="!syncing" xmlns="http://www.w3.org/2000/svg" class="sync-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 014.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-if="syncing">Syncing...</span>
          <span v-else>Sync Now</span>
        </button>
      </div>

      <!-- Scanner View -->
      <div class="scanner-view">
        <!-- Camera Scanner -->
        <div v-if="scannerReady" ref="scannerRef" class="camera-scanner">
          <video ref="videoEl" class="scanner-video" autoplay playsinline muted></video>
          <canvas ref="canvasEl" class="scanner-canvas"></canvas>

          <div class="viewfinder">
            <div class="viewfinder-frame">
              <div class="corner corner--tl"></div>
              <div class="corner corner--tr"></div>
              <div class="corner corner--bl"></div>
              <div class="corner corner--br"></div>
            </div>
            <p class="scan-prompt">Position QR code within frame</p>
          </div>
        </div>

        <!-- Fallback: Manual Input -->
        <div v-else class="manual-input-section">
          <div class="input-group">
            <label class="input-label">Enter QR Code String</label>
            <input
              v-model="qrInput"
              type="text"
              class="qr-input"
              placeholder="Paste or type QR code data..."
            />
          </div>

          <button
            type="button"
            class="btn-scan"
            :disabled="!qrInput.trim() || scanning"
            @click="handleManualScan"
          >
            <span v-if="scanning">Validating...</span>
            <span v-else>Validate Ticket</span>
          </button>
        </div>
      </div>

      <!-- Validation Result -->
      <div v-if="lastResult" class="validation-result">
        <div
          class="result-card"
          :class="resultCardClass"
        >
          <div class="result-icon">
            <svg v-if="lastResult.result === 'admitted'" xmlns="http://www.w3.org/2000/svg" class="result-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="lastResult.result === 'duplicate'" xmlns="http://www.w3.org/2000/svg" class="result-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="result-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <div class="result-main">
            <h3 class="result-title">
              {{ resultTitle }}
            </h3>
            <p class="result-reason">{{ lastResult.reason || defaultReason }}</p>
          </div>

          <div v-if="lastResult.isOffline" class="offline-tag">
            Offline
          </div>
        </div>
      </div>

      <!-- Scan History -->
      <div class="scan-history">
        <h3 class="history-title">Recent Scans</h3>

        <div v-if="recentScans.length === 0" class="empty-history">
          <p>No scans yet. Scan a ticket to get started.</p>
        </div>

        <LiveScanActivityItem
          v-for="item in recentScans"
          :key="item.id"
          :name="item.name"
          :email="item.email"
          :status="item.status"
          :time="item.time"
          :ticket-type="item.ticketType"
          :avatar-color="item.avatarColor"
          :clickable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScannerEventCard from '~/components/scanner/ScannerEventCard.vue'
import LiveScanActivityItem, { type ScanItem } from '~/components/scanner/LiveScanActivityItem.vue'
import { useQrValidator } from '~/composables/useQrValidator'
import { useScanner } from '~/composables/useScanner'
import { useToast } from '~/composables/useToast'
import { formatScanTime } from '~/types/scanner'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Scan Tickets — Ticket Scanner',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const scannerStore = useScanner()
const qrValidator = useQrValidator(route.params.id as string)

const eventId = computed(() => route.params.id as string)
const event = ref({
  id: '',
  title: '',
  dateTime: '',
  location: '',
  imageUrl: '',
  status: 'Live' as 'Live' | 'Upcoming',
})

const videoEl = ref<HTMLVideoElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const scannerRef = ref<HTMLDivElement | null>(null)

const scannerReady = ref(false)
const qrInput = ref('')
const scanning = ref(false)
const syncing = ref(false)
const lastResult = ref<ScanValidationResult | null>(null)

const deviceId = ref('')

onMounted(async () => {
  await loadEventData()
  await setupScanner()
})

onUnmounted(() => {
  if (videoEl.value && videoEl.value.srcObject) {
    const stream = videoEl.value.srcObject as MediaStream
    stream.getTracks().forEach((t) => t.stop())
  }
})

async function loadEventData() {
  try {
    await scannerStore.fetchDevices(true)
    deviceId.value = scannerStore.devices.value.length > 0 ? scannerStore.devices.value[0].id : ''

    const evt = await scannerStore.fetchEvent(eventId.value)
    event.value = {
      id: evt.id,
      title: evt.title,
      dateTime: evt.startsAt,
      location: evt.venueName || evt.city || '',
      imageUrl: evt.images?.[0]?.url || '',
      status: evt.status === 'live' ? 'Live' : 'Upcoming',
    }

    await qrValidator.fetchManifest(deviceId.value)
  } catch (e) {
    void e
    toast.show({
      title: 'Failed to load scanner data',
      message: 'Could not load event or manifest. Try downloading manifest while online.',
      type: 'error',
    })
  }
}

const isOnline = computed(() => qrValidator.isOnline.value)

async function setupScanner() {
  if (typeof window === 'undefined') return

  if (!('BarcodeDetector' in window)) {
    scannerReady.value = false
    return
  }

  try {
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    await nextTick()

    let stream: MediaStream | null = null
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
    }

    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
    }
    scannerReady.value = true

    startScanLoop()
  } catch {
    scannerReady.value = false
  }
}

let scanInterval: ReturnType<typeof setInterval> | null = null

function startScanLoop() {
  if (!('BarcodeDetector' in window)) return

  const detector = new (window as any).BarcodeDetector({
    formats: ['qr_code'],
  })

  scanInterval = setInterval(async () => {
    if (!videoEl.value || !canvasEl.value || videoEl.value.readyState < 2) return

    canvasEl.value.width = videoEl.value.videoWidth
    canvasEl.value.height = videoEl.value.videoHeight
    const ctx = canvasEl.value.getContext('2d')
    if (!ctx) return

    ctx.drawImage(videoEl.value, 0, 0)
    try {
      const results = await detector.detect(canvasEl.value)
      if (results.length > 0) {
        const qrCode = results[0].rawValue as string
        if (qrCode && !scanning.value) {
          scanning.value = true
          await processScan(qrCode)
          scanning.value = false
        }
      }
    } catch {
      void 0
    }
  }, 500)
}

async function handleManualScan() {
  if (!qrInput.value.trim() || scanning.value) return
  scanning.value = true
  await processScan(qrInput.value.trim())
  scanning.value = false
}

async function processScan(qrCode: string) {
  try {
    const result = await qrValidator.validateAndRecord(qrCode)
    lastResult.value = result

    toast.show({
      title: result.result === 'admitted' ? 'Valid Ticket' : 'Entry Denied',
      message: result.reason || result.result,
      type: result.result === 'admitted' ? 'success' : 'error',
    })
  } catch (e) {
    void e
    toast.show({
      title: 'Scan Error',
      message: 'Could not validate this QR code',
      type: 'error',
    })
  }
}

async function handleSync() {
  syncing.value = true
  try {
    await qrValidator.fetchManifest(deviceId.value)
    const result = await qrValidator.syncPendingScans()
    if (result.synced > 0) {
      lastResult.value = null
    }
  } finally {
    syncing.value = false
  }
}

function goBack() {
  router.push(`/scanner/${eventId.value}`)
}

const resultTitle = computed(() => {
  if (!lastResult.value) return ''
  const r = lastResult.value.result
  if (r === 'admitted') return 'Valid Ticket'
  if (r === 'duplicate') return 'Already Scanned'
  if (r === 'wrong_event') return 'Wrong Event'
  return 'Invalid Ticket'
})

const resultCardClass = computed(() => {
  if (!lastResult.value) return ''
  const r = lastResult.value.result
  if (r === 'admitted') return 'result-card--valid'
  if (r === 'duplicate') return 'result-card--duplicate'
  return 'result-card--invalid'
})

const defaultReason = computed(() => {
  if (!lastResult.value) return ''
  const r = lastResult.value.result
  if (r === 'admitted') return 'Entry allowed'
  if (r === 'duplicate') return 'Ticket already used'
  if (r === 'wrong_event') return 'Ticket belongs to another event'
  return 'Entry denied'
})

const recentScans = computed(() => {
  const scans = qrValidator.offlineScans.value
  return scans.slice(0, 10).map((s): ScanItem => ({
    id: s.id,
    name: s.ticketId ? (s.ticketId.substring(0, 8) ?? 'Unknown') : 'Unknown',
    email: '',
    status: s.result === 'admitted' ? 'Valid' : s.result === 'duplicate' ? 'Duplicate' : 'Invalid',
    time: formatScanTime(s.scannedAtWallClock),
    ticketId: s.ticketId ?? undefined,
    avatarColor: '#3FD246',
  }))
})
</script>

<style scoped>
.scan-page {
  max-width: 1200px;
  margin: 0 auto;
}

.scan-container {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Event Banner */
.event-banner {
  width: 100%;
}

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  gap: 0.75rem;
}

.status-bar--online {
  background: #DCFCE7;
  border: 1px solid #BBF7D0;
}

.status-bar--offline {
  background: #FEE2E2;
  border: 1px solid #FECACA;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-indicator {
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.status-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  display: inline-block;
}

.status-dot--online {
  background: #16A34A;
  animation: pulse 2s infinite;
}

.status-dot--offline {
  background: #EF4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.offline-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #EF4444;
  background: #FEF2F2;
  padding: 0.2rem 0.6rem;
  border-radius: 0.35rem;
}

.btn-sync {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #16A34A;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-sync:hover:not(:disabled) {
  background: #15803D;
}

.btn-sync:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sync-icon {
  width: 1rem;
  height: 1rem;
}

/* Scanner View */
.scanner-view {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000000;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-scanner {
  position: relative;
  width: 100%;
  height: 100%;
}

.scanner-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-canvas {
  display: none;
}

.viewfinder {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.viewfinder-frame {
  position: relative;
  width: 220px;
  height: 220px;
  border: 2px solid #3FD246;
  border-radius: 1rem;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #3FD246;
}

.corner--tl {
  top: -5px;
  left: -5px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 8px;
}

.corner--tr {
  top: -5px;
  right: -5px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 8px;
}

.corner--bl {
  bottom: -5px;
  left: -5px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 8px;
}

.corner--br {
  bottom: -5px;
  right: -5px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 8px;
}

.scan-prompt {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.manual-input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  max-width: 400px;
}

.input-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6B7280;
}

.qr-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-family: monospace;
  color: #111827;
  outline: none;
  transition: border-color 0.15s ease;
}

.qr-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.btn-scan {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 2rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.btn-scan:hover:not(:disabled) {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-scan:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Validation Result */
.validation-result {
  display: flex;
  justify-content: center;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid #E5E7EB;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.result-card--valid {
  background: #DCFCE7;
  border-color: #BBF7D0;
}

.result-card--invalid {
  background: #FEE2E2;
  border-color: #FECACA;
}

.result-card--duplicate {
  background: #FEF3C7;
  border-color: #FDE68A;
}

.result-icon {
  flex-shrink: 0;
}

.result-svg {
  width: 2.25rem;
  height: 2.25rem;
}

.result-main {
  flex: 1;
}

.result-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
}

.result-card--valid .result-title {
  color: #16A34A;
}

.result-card--invalid .result-title {
  color: #DC2626;
}

.result-card--duplicate .result-title {
  color: #D97706;
}

.result-reason {
  font-size: 0.85rem;
  color: #4B5563;
  margin: 0;
}

.offline-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #6B7280;
  background: #F3F4F6;
  padding: 0.15rem 0.5rem;
  border-radius: 0.3rem;
}

/* Scan History */
.scan-history {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.empty-history {
  padding: 2rem;
  text-align: center;
  color: #9CA3AF;
  font-size: 0.9rem;
}
</style>

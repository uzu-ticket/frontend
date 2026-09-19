<template>
  <div class="logo-wrapper" :class="`logo-${logoKey}`">

    <!-- Real PNG icons from /public -->
    <img
      v-if="pngSrc"
      :src="pngSrc"
      :alt="logoKey"
      class="logo-img"
    />

    <!-- Google Analytics — SVG fallback -->
    <svg v-else-if="logoKey === 'google-analytics'" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
      <rect width="40" height="40" rx="8" fill="#FFF7ED" />
      <rect x="8" y="23" width="6" height="9" rx="3" fill="#E37400" />
      <rect x="17" y="16" width="6" height="16" rx="3" fill="#F9AB00" />
      <circle cx="29" cy="12" r="4" fill="#E37400" />
      <rect x="26" y="12" width="6" height="20" rx="3" fill="#E37400" />
    </svg>

    <!-- Zapier — SVG fallback -->
    <svg v-else-if="logoKey === 'zapier'" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
      <rect width="40" height="40" rx="8" fill="#FFF5F0" />
      <g transform="translate(20, 20)">
        <line x1="0" y1="-11" x2="0" y2="11" stroke="#FF4F00" stroke-width="3.5" stroke-linecap="round" />
        <line x1="-11" y1="0" x2="11" y2="0" stroke="#FF4F00" stroke-width="3.5" stroke-linecap="round" />
        <line x1="-7.8" y1="-7.8" x2="7.8" y2="7.8" stroke="#FF4F00" stroke-width="3.2" stroke-linecap="round" />
        <line x1="-7.8" y1="7.8" x2="7.8" y2="-7.8" stroke="#FF4F00" stroke-width="3.2" stroke-linecap="round" />
      </g>
    </svg>

    <!-- Generic fallback -->
    <svg v-else viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
      <rect width="40" height="40" rx="8" fill="#F3F4F6" />
      <circle cx="20" cy="20" r="10" fill="#3FD246" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  logoKey: 'paystack' | 'mailchimp' | 'google-analytics' | 'meta-pixel' | 'zapier' | 'paypal' | 'flutterwave'
}>()

// Map logoKey → real PNG filename in /public
const pngMap: Partial<Record<typeof props.logoKey, string>> = {
  'paystack':    '/paystack-icon.png',
  'mailchimp':   '/mailchimp-icon.png',
  'flutterwave': '/flutterwave-icon.png',
  'meta-pixel':  '/meta-icon.png',
  'paypal':      '/paypal-icon.png',
}

const pngSrc = computed(() => pngMap[props.logoKey] ?? null)
</script>

<style scoped>
.logo-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  overflow: hidden;
  background: #ffffff;
}

.logo-img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.logo-svg {
  width: 100%;
  height: 100%;
}
</style>

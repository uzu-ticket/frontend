<template>
  <div
    class="live-scan-item"
    :class="{ 'live-scan-item--clickable': clickable }"
    @click="clickable && $emit('click')"
  >
    <!-- Avatar Initials Circle -->
    <div class="avatar-circle" :style="{ backgroundColor: avatarBg }">
      {{ initials }}
    </div>

    <!-- Attendee Info Stack -->
    <div class="attendee-stack">
      <span class="attendee-name">{{ name }}</span>
      <span class="attendee-email">{{ email }}</span>
    </div>

    <!-- Status Badge -->
    <div class="status-wrapper">
      <span class="badge" :class="statusBadgeClass">
        {{ status }}
      </span>
    </div>

    <!-- Timestamp -->
    <span class="scan-time">{{ time }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ScanItem {
  id: string | number
  name: string
  email: string
  status: 'Valid' | 'Invalid' | 'Duplicate' | string
  time: string
  ticketType?: string
  ticketId?: string
  orderId?: string
  gate?: string
  scanner?: string
  scannedAt?: string
  purchased?: string
  avatarColor?: string
}

interface Props {
  name: string
  email: string
  status: string
  time: string
  avatarColor?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true,
})

defineEmits<{
  click: []
}>()

const initials = computed(() => {
  if (!props.name) return '??'
  const parts = props.name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return props.name.substring(0, 2).toUpperCase()
})

const avatarBg = computed(() => {
  if (props.avatarColor) return props.avatarColor
  // Generate consistent color based on name
  const palette = ['#86EFAC', '#FDBA74', '#60A5FA', '#FDE047', '#F472B6', '#A78BFA']
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % palette.length
  return palette[index]
})

const statusBadgeClass = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'valid':
      return 'badge--valid'
    case 'invalid':
      return 'badge--invalid'
    case 'duplicate':
    case 'used':
      return 'badge--duplicate'
    default:
      return 'badge--default'
  }
})
</script>

<style scoped>
.live-scan-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 0.5rem;
  border-bottom: 1px solid #F3F4F6;
  transition: background 0.15s ease;
}

.live-scan-item:last-child {
  border-bottom: none;
}

.live-scan-item--clickable {
  cursor: pointer;
  border-radius: 0.5rem;
}

.live-scan-item--clickable:hover {
  background: #F9FAFB;
}

/* Avatar */
.avatar-circle {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  color: #1F2937;
  font-weight: 800;
  font-size: 0.825rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Info */
.attendee-stack {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.attendee-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attendee-email {
  font-size: 0.775rem;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status Badge */
.status-wrapper {
  margin-left: auto;
  margin-right: 0.75rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge--valid {
  background: #DCFCE7;
  color: #16A34A;
}

.badge--invalid {
  background: #FEE2E2;
  color: #EF4444;
}

.badge--duplicate {
  background: #FEF3C7;
  color: #D97706;
}

.badge--default {
  background: #F3F4F6;
  color: #4B5563;
}

/* Time */
.scan-time {
  font-size: 0.775rem;
  font-weight: 600;
  color: #6B7280;
  flex-shrink: 0;
}
</style>

<template>
  <div class="org-card" :class="{ 'org-card--active': isActive }">
    <!-- Top Header: Initials Badge + Name & Role -->
    <div class="org-card-header">
      <div class="org-badge" :style="{ backgroundColor: badgeBg }">
        {{ initials }}
      </div>
      <div class="org-info">
        <h3 class="org-name">{{ name }}</h3>
        <span class="org-role">{{ role }}</span>
      </div>
      <div v-if="isActive" class="active-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" class="active-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span class="active-label">Active</span>
      </div>
    </div>

    <!-- Member Avatars Stack (Only show if real memberAvatars provided) -->
    <div v-if="memberAvatars && memberAvatars.length > 0" class="org-members-stack">
      <div v-for="(avatar, index) in memberAvatars" :key="index" class="avatar-pill">
        <img :src="avatar" alt="Member Avatar" class="avatar-img" />
      </div>
      <div v-if="extraMembersCount && extraMembersCount > 0" class="extra-members-badge">
        +{{ extraMembersCount }}
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="org-metrics">
      <div class="metric-item">
        <span class="metric-value">{{ eventsCount }}</span>
        <span class="metric-label">Event{{ eventsCount === 1 ? '' : 's' }}</span>
      </div>
      <div class="metric-item">
        <span class="metric-value">{{ membersCount }}</span>
        <span class="metric-label">Member{{ membersCount === 1 ? '' : 's' }}</span>
      </div>
    </div>

    <!-- Action Button -->
    <button class="btn-open-dashboard" @click="handleOpenDashboard">
      Open Dashboard
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrgState } from '~/composables/useOrgState'

interface Props {
  id?: string | number
  name: string
  role?: string
  initials: string
  badgeBg?: string
  eventsCount: number
  membersCount: number
  memberAvatars?: string[]
  extraMembersCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  role: 'Owner',
  badgeBg: '#0E2615',
  memberAvatars: () => [],
  extraMembersCount: 0,
})

const router = useRouter()
const { setActiveOrg, activeOrgId } = useOrgState()

const isActive = computed(() => String(props.id) === activeOrgId.value)

function handleOpenDashboard() {
  if (props.id) {
    setActiveOrg({ id: String(props.id), name: props.name, initials: props.initials })
  }
  router.push('/overview')
}
</script>

<style scoped>
.org-card {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #eef2ee;
  padding: 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.org-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border-color: #e2f9e4;
  transform: translateY(-2px);
}

/* Header */
.org-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.org-badge {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.45rem;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.org-info {
  display: flex;
  flex-direction: column;
}

.org-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.15rem;
  line-height: 1.2;
}

.org-role {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Active Organization Highlight */
.org-card--active {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.25), 0 4px 20px rgba(0, 0, 0, 0.06);
}
.active-indicator {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3FD246;
  background: #ecfdf5;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
}
.active-check {
  width: 0.9rem;
  height: 0.9rem;
  color: #3FD246;
}

/* Members Stack */
.org-members-stack {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.avatar-pill {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 9999px;
  border: 2px solid #ffffff;
  overflow: hidden;
  margin-right: -0.45rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.extra-members-badge {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 9999px;
  background: #e8f9e9;
  border: 2px solid #ffffff;
  color: #3FD246;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Metrics */
.org-metrics {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.35rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Action Button */
.btn-open-dashboard {
  width: 100%;
  padding: 0.6rem;
  background: #ffffff;
  border: 1.5px solid #dcfce7;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.825rem;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-open-dashboard:hover {
  background: #f0fdf1;
  border-color: #3FD246;
}
</style>

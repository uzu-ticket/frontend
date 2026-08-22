<template>
  <header class="db-header">
    <!-- Dynamic Header Titles -->
    <div class="header-titles">
      <h1 class="header-title">{{ headerConfig.title }}</h1>
      <p class="header-subtitle">{{ headerConfig.subtitle }}</p>
    </div>

    <!-- Right Controls -->
    <div class="header-actions">
      <!-- Dynamic Action Button (Optional) -->
      <button v-if="headerConfig.buttonText" id="btn-header-action" class="btn-create" @click="headerConfig.action">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ headerConfig.buttonText }}</span>
      </button>

      <!-- Notification Bell with Popover -->
      <div class="popover-wrapper">
        <button
          id="btn-notification-bell"
          class="icon-btn notification-btn"
          aria-label="Notifications"
          @click.stop="toggleNotifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="bell-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="notification-badge" />
        </button>

        <!-- Notifications Dropdown -->
        <NotificationPopover
          v-if="isNotificationOpen"
          @close="isNotificationOpen = false"
        />
      </div>

      <!-- User Profile Container with Popover -->
      <div class="popover-wrapper">
        <div class="user-profile" @click.stop="toggleProfile">
          <div class="avatar-wrapper">
            <div class="avatar-fallback">DE</div>
          </div>
          <div class="user-info">
            <span class="user-name">Divine Emmanuel</span>
            <span class="user-email">favour009@gmail.com</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="chevron-icon" :class="{ 'chevron-icon--open': isProfileOpen }" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- User Profile Dropdown Menu -->
        <ProfilePopover
          v-if="isProfileOpen"
          @close="isProfileOpen = false"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NotificationPopover from '~/components/dashboard/NotificationPopover.vue'
import ProfilePopover from '~/components/dashboard/ProfilePopover.vue'

const emit = defineEmits<{
  'open-signout': []
}>()

const router = useRouter()
const route = useRoute()

const isNotificationOpen = ref(false)
const isProfileOpen = ref(false)

function toggleNotifications() {
  isProfileOpen.value = false
  isNotificationOpen.value = !isNotificationOpen.value
}

function toggleProfile() {
  isNotificationOpen.value = false
  isProfileOpen.value = !isProfileOpen.value
}

function closeAllPopovers() {
  isNotificationOpen.value = false
  isProfileOpen.value = false
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('click', closeAllPopovers)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', closeAllPopovers)
  }
})

const headerConfig = computed(() => {
  const path = route.path
  if (path.startsWith('/scanner')) {
    return {
      title: 'Ticket Scanner',
      subtitle: 'Monitor scanners, devices, and real-time scan activity.',
    }
  }
  if (path.startsWith('/events')) {
    return {
      title: 'Events',
      subtitle: 'Manage all your events from one place.',
    }
  }
  if (path.startsWith('/orders')) {
    return {
      title: 'Orders',
      subtitle: 'View and engage all ticket orders.',
    }
  }
  if (path.startsWith('/organizations')) {
    return {
      title: 'My Organization',
      subtitle: 'Create and manage all your organizations.',
    }
  }
  if (path.startsWith('/help')) {
    return {
      title: 'Help Center',
      subtitle: 'Find answers, guides and support for Uzuticket.',
    }
  }
  // Default Overview
  return {
    title: 'Overview',
    subtitle: 'Manage your organization\'s activity and track key metrics.',
  }
})
</script>

<style scoped>
.db-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.15rem 1.25rem;
  background: #F6FAF6;
  border-bottom: 1px solid #eef2ee;
  gap: 1.25rem;
}

/* Header Titles */
.header-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.2rem;
  line-height: 1.2;
}
.header-subtitle {
  font-size: 0.825rem;
  color: #6b7280;
  margin: 0;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.popover-wrapper {
  position: relative;
}

/* Create Event Button */
.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.55rem 1.1rem;
  border-radius: 0.55rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.2);
  transition: background 0.15s ease;
}
.btn-create:hover {
  background: #36bd3d;
}
.btn-icon {
  width: 1.05rem;
  height: 1.05rem;
}

/* Notification Bell Button */
.icon-btn {
  position: relative;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.6rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.icon-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}
.bell-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #4b5563;
}
.notification-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.45rem;
  height: 0.45rem;
  background: #ef4444;
  border-radius: 9999px;
  border: 2px solid #ffffff;
}

/* User Profile */
.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
}
.user-profile:hover {
  background: rgba(255, 255, 255, 0.6);
}

.avatar-wrapper {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-fallback {
  width: 100%;
  height: 100%;
  background: #0E2615;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 0.825rem;
  font-weight: 700;
  color: #0E2615;
  line-height: 1.2;
}
.user-email {
  font-size: 0.7rem;
  color: #9ca3af;
}

.chevron-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6b7280;
  transition: transform 0.2s ease;
}
.chevron-icon--open {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .db-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem 1rem;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  .user-info {
    display: none;
  }
}
</style>

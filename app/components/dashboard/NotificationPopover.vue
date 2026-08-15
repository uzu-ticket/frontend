<template>
  <div class="notification-popover" @click.stop>
    <!-- Header -->
    <div class="popover-header">
      <h3 class="popover-title">Notifications</h3>
      <button class="btn-mark-read" @click="markAllAsRead">
        Mark all as read
      </button>
    </div>

    <div class="header-divider" />

    <!-- Notifications List -->
    <div class="notifications-list">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="notification-item"
        :class="{ 'notification-item--read': item.read }"
        @click="item.read = true"
      >
        <!-- Icon Badge -->
        <div class="item-badge" :style="{ background: item.bgColor, color: item.iconColor }">
          <svg xmlns="http://www.w3.org/2000/svg" class="badge-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="item-content">
          <div class="title-row">
            <h4 class="item-title">{{ item.title }}</h4>
            <span class="item-time">{{ item.time }}</span>
          </div>
          <p class="item-desc">{{ item.description }}</p>
        </div>

        <!-- Unread Indicator Dot -->
        <div v-if="!item.read" class="unread-dot" />
      </div>
    </div>

    <!-- Footer -->
    <div class="popover-footer">
      <NuxtLink to="/notifications" class="view-all-link" @click="$emit('close')">
        View all notifications
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
  close: []
}>()

const notifications = ref([
  {
    id: 1,
    title: 'New Ticket Purchased',
    time: '2m ago',
    description: 'VIP Access Ticket for Summer Tech Conference 2026.',
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
    read: false,
  },
  {
    id: 2,
    title: 'Daily Sales Report',
    time: '2m ago',
    description: 'VIP Access Ticket for Summer Tech Conference 2026.',
    bgColor: '#FEF9C3',
    iconColor: '#CA8A04',
    read: false,
  },
  {
    id: 3,
    title: 'New Promoter Joined',
    time: '2m ago',
    description: 'VIP Access Ticket for Summer Tech Conference 2026.',
    bgColor: '#DCFCE7',
    iconColor: '#16A34A',
    read: false,
  },
  {
    id: 4,
    title: 'Email Campaign Sent',
    time: '2m ago',
    description: 'VIP Access Ticket for Summer Tech Conference 2026.',
    bgColor: '#FCE7F3',
    iconColor: '#DB2777',
    read: false,
  },
  {
    id: 5,
    title: 'Payout Sucessful',
    time: '2m ago',
    description: 'VIP Access Ticket for Summer Tech Conference 2026.',
    bgColor: '#DBEAFE',
    iconColor: '#2563EB',
    read: false,
  },
  {
    id: 6,
    title: 'New Ticket Purchased',
    time: '2m ago',
    description: 'VIP Access Ticket for Summer Tech Conference 2026.',
    bgColor: '#FFEDD5',
    iconColor: '#EA580C',
    read: false,
  },
])

function markAllAsRead() {
  notifications.value.forEach(n => (n.read = true))
}
</script>

<style scoped>
.notification-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  padding: 1.5rem 1.25rem 1.25rem;
  z-index: 100;
  animation: popoverFade 0.18s ease-out;
}

@keyframes popoverFade {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem 0.75rem;
}

.popover-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.btn-mark-read {
  font-size: 0.825rem;
  font-weight: 700;
  color: #3FD246;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-mark-read:hover { text-decoration: underline; }

.header-divider {
  height: 1px;
  background: #f3f4f6;
  margin-bottom: 0.75rem;
}

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 0.25rem;
  margin-bottom: 1.25rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.65rem 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item--read {
  opacity: 0.7;
}

.item-badge {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.badge-svg {
  width: 1.15rem;
  height: 1.15rem;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.15rem;
}

.item-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.item-time {
  font-size: 0.75rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.item-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3FD246;
  flex-shrink: 0;
  align-self: center;
}

/* Footer */
.popover-footer {
  text-align: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.view-all-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: #3FD246;
  text-decoration: none;
}
.view-all-link:hover { text-decoration: underline; }
</style>

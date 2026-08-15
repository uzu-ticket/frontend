<template>
  <div class="profile-popover" @click.stop>
    <!-- User Profile Header -->
    <div class="user-header">
      <div class="avatar-large">
        <div class="avatar-fallback">DE</div>
      </div>
      <div class="user-details">
        <h3 class="user-fullname">Divine Emmanuel</h3>
        <span class="user-role">Super Admin</span>
      </div>
    </div>

    <div class="header-divider" />

    <!-- Main Navigation List -->
    <div class="menu-list">
      <!-- 1. My Profile -->
      <NuxtLink to="/profile" class="menu-item" @click="$emit('close')">
        <div class="item-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="item-label">My Profile</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="chevron-right" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </NuxtLink>

      <!-- 2. Organization Setting -->
      <NuxtLink to="/organizations/settings" class="menu-item" @click="$emit('close')">
        <div class="item-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="item-label">Organization Setting</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="chevron-right" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </NuxtLink>

      <!-- 3. Billing & Plans -->
      <NuxtLink to="/billing" class="menu-item" @click="$emit('close')">
        <div class="item-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span class="item-label">Billing & Plans</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="chevron-right" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </NuxtLink>

      <!-- 4. Preferences -->
      <NuxtLink to="/preferences" class="menu-item" @click="$emit('close')">
        <div class="item-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span class="item-label">Preferences</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="chevron-right" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Bottom Help Section -->
    <div class="popover-footer">
      <NuxtLink to="/help" class="help-item" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="item-label">Help Center</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>

<style scoped>
.profile-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
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

/* User Header */
.user-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0 0.25rem 1rem;
}

.avatar-large {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  background: #0E2615;
  color: #ffffff;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-fullname {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.2rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.8rem;
  color: #6b7280;
}

.header-divider {
  height: 1px;
  background: #eef2ee;
  margin-bottom: 1.25rem;
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.5rem;
  border-radius: 0.65rem;
  text-decoration: none;
  transition: background 0.15s ease;
}

.menu-item:hover {
  background: #f9fafb;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.item-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #0E2615;
}

.item-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0E2615;
}

.chevron-right {
  width: 1.1rem;
  height: 1.1rem;
  color: #9ca3af;
}

/* Footer Help */
.popover-footer {
  padding-top: 0.5rem;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.6rem 0.5rem;
  border-radius: 0.65rem;
  text-decoration: none;
  transition: background 0.15s ease;
}

.help-item:hover {
  background: #f9fafb;
}
</style>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <NuxtLink to="/overview" class="logo-link">
        <img src="/uzu-logo.png" alt="Uzu Ticket Logo" class="logo-img" />
      </NuxtLink>
    </div>

    <!-- Navigation Stack -->
    <div class="sidebar-nav-container">
      <!-- 1. PERSONAL MODE -->
      <div v-if="!hasActiveOrg" class="nav-section">
        <span class="section-title">PERSONAL</span>
        <nav class="nav-list">
          <NuxtLink
            to="/overview"
            class="nav-item"
            :class="{ 'nav-item--active': $route.path === '/overview' || $route.path === '/' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Overview</span>
          </NuxtLink>

          <NuxtLink
            to="/organizations"
            class="nav-item"
            :class="{ 'nav-item--active': $route.path === '/organizations' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H7m4 0h2m-6 4h2m4 0h2" />
            </svg>
            <span>My Organizations</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- 2. ORGANIZATION MODE -->
      <div v-else class="nav-section">
        <span class="section-title">ORGANIZATION</span>

        <!-- Active Organization Pill Dropdown -->
        <div class="org-selector-pill" @click="isOrgDropdownOpen = !isOrgDropdownOpen">
          <div class="org-badge-dark">
            {{ activeOrgInitials }}
          </div>
          <span class="org-name-text">{{ activeOrgName }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="org-chevron" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Full Organization Navigation List -->
        <nav class="nav-list org-nav-list">
          <NuxtLink to="/overview" class="nav-item" :class="{ 'nav-item--active': $route.path === '/overview' || $route.path === '/' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Overview</span>
          </NuxtLink>

          <NuxtLink to="/events" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/events') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Events</span>
          </NuxtLink>

          <NuxtLink to="/orders" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/orders') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Orders</span>
          </NuxtLink>

          <NuxtLink to="/scanner" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/scanner') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Ticket Scanner</span>
          </NuxtLink>

          <NuxtLink to="/customers" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/customers') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Customers</span>
          </NuxtLink>

          <NuxtLink to="/promoters" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/promoters') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span>Promoters</span>
          </NuxtLink>

          <NuxtLink to="/marketing" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/marketing') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Marketing</span>
          </NuxtLink>

          <NuxtLink to="/organizations/invite" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/organizations/invite') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Team Members</span>
          </NuxtLink>

          <NuxtLink to="/reports" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/reports') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Sales & Reports</span>
          </NuxtLink>

          <NuxtLink to="/finance" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/finance') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Finance / Wallet</span>
          </NuxtLink>

          <NuxtLink to="/integrations" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/integrations') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            <span>Integrations</span>
          </NuxtLink>

          <NuxtLink to="/apikeys" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/apikeys') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>API Keys</span>
          </NuxtLink>

          <NuxtLink to="/settings" class="nav-item" :class="{ 'nav-item--active': $route.path.startsWith('/settings') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="sidebar-footer">
      <NuxtLink
        to="/help"
        class="footer-item"
        :class="{ 'footer-item--active': $route.path === '/help' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Help Center</span>
      </NuxtLink>

      <button class="footer-item logout-btn" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" class="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrgState } from '~/composables/useOrgState'

const emit = defineEmits<{
  'open-signout': []
}>()

const { hasActiveOrg, activeOrgName, activeOrgInitials } = useOrgState()
const isOrgDropdownOpen = ref(false)

function handleLogout() {
  emit('open-signout')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #eef2ee;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem 1.5rem;
  z-index: 40;
}

/* Logo */
.sidebar-logo {
  margin-bottom: 1.5rem;
  padding-left: 0.35rem;
}
.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.logo-img {
  height: 38px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
}

/* Nav */
.sidebar-nav-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-right: -0.5rem;
  padding-right: 0.5rem;
}
.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.08em;
  padding-left: 0.5rem;
}

/* Organization Selector Pill */
.org-selector-pill {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #DCFCE7;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  user-select: none;
  transition: background 0.15s ease;
}
.org-selector-pill:hover {
  background: #d1fae5;
}

.org-badge-dark {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 50%;
  background: #0E2615;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.org-name-text {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0E2615;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.org-chevron {
  width: 1rem;
  height: 1rem;
  color: #0E2615;
  flex-shrink: 0;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.65rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.15s ease;
}
.nav-item:hover {
  background: #f4fbf4;
  color: #0E2615;
}
.nav-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

/* Active State */
.nav-item--active {
  background: #e8f9e9;
  color: #3FD246;
}
.nav-item--active .nav-icon {
  color: #3FD246;
}

/* Footer Links */
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.25rem;
}
.footer-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.15s;
}
.footer-item:hover {
  background: #f9fafb;
}
.footer-item--active {
  background: #e8f9e9;
  color: #3FD246;
}
.footer-item--active .footer-icon {
  color: #3FD246;
}
.footer-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #4b5563;
}
.logout-btn {
  width: 100%;
  text-align: left;
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>

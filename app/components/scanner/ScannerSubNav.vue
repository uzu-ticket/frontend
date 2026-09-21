<template>
  <div class="scanner-sub-nav">
    <div class="nav-tabs-container">
      <NuxtLink
        :to="`/scanner/${eventId}`"
        class="nav-tab"
        :class="{ 'nav-tab--active': activeTab === 'overview' }"
      >
        <svg
          class="tab-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span>Overview</span>
      </NuxtLink>

      <NuxtLink
        :to="`/scanner/${eventId}/scan`"
        class="nav-tab nav-tab--scan"
        :class="{ 'nav-tab--active': activeTab === 'scan' }"
      >
        <svg
          class="tab-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
        <span>Scan Tickets</span>
      </NuxtLink>

      <NuxtLink
        :to="`/scanner/${eventId}/activity`"
        class="nav-tab"
        :class="{ 'nav-tab--active': activeTab === 'activity' }"
      >
        <svg
          class="tab-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Activity Log</span>
      </NuxtLink>

      <NuxtLink
        :to="`/scanner/${eventId}/sync`"
        class="nav-tab"
        :class="{ 'nav-tab--active': activeTab === 'sync' }"
      >
        <svg
          class="tab-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 014.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Offline & Sync</span>
      </NuxtLink>

      <NuxtLink
        :to="`/scanner/${eventId}/conflicts`"
        class="nav-tab"
        :class="{ 'nav-tab--active': activeTab === 'conflicts' }"
      >
        <svg
          class="tab-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Conflict Review</span>
      </NuxtLink>

      <NuxtLink
        :to="`/scanner/${eventId}/settings`"
        class="nav-tab"
        :class="{ 'nav-tab--active': activeTab === 'settings' }"
      >
        <svg
          class="tab-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>Settings</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eventId: string;
  activeTab: "overview" | "scan" | "activity" | "sync" | "conflicts" | "settings";
}>();
</script>

<style scoped>
.scanner-sub-nav {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 0.35rem;
  margin-bottom: 0.5rem;
}

.nav-tabs-container {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-tabs-container::-webkit-scrollbar {
  display: none;
}

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.95rem;
  border-radius: 0.65rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #4b5563;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.nav-tab:hover {
  background: #ffffff;
  color: #111827;
}

.nav-tab--active {
  background: #ffffff;
  color: #16a34a;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.nav-tab--scan {
  color: #16a34a;
}

.nav-tab--scan.nav-tab--active {
  background: #3fd246;
  color: #ffffff;
}

.nav-tab--scan.nav-tab--active .tab-icon {
  color: #ffffff;
}

.tab-icon {
  width: 1.05rem;
  height: 1.05rem;
  color: currentColor;
  flex-shrink: 0;
}
</style>

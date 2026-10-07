<template>
  <div class="settings-page">
    <!-- Main Container Card -->
    <div class="settings-container-card">
      <!-- Tabs Header -->
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === tab.id }"
          @click="selectTab(tab.id)"
        >
          <span>{{ tab.label }}</span>
          <div v-if="activeTab === tab.id" class="active-indicator" />
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-body">
        <KeepAlive>
          <component :is="currentTabComponent" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import SettingsGeneral from '~/components/settings/SettingsGeneral.vue'
import SettingsNotifications from '~/components/settings/SettingsNotifications.vue'
import SettingsTeams from '~/components/settings/SettingsTeams.vue'
import SettingsSecurity from '~/components/settings/SettingsSecurity.vue'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Settings — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your account, team members, notifications and security settings.' },
  ],
})

const route = useRoute()
const router = useRouter()

type TabId = 'general' | 'notifications' | 'teams' | 'security'

interface Tab {
  id: TabId
  label: string
}

const tabs: Tab[] = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'teams', label: 'Teams' },
  { id: 'security', label: 'Security' },
]

const activeTab = ref<TabId>('general')

onMounted(() => {
  const queryTab = route.query.tab as TabId
  if (queryTab && tabs.some((t) => t.id === queryTab)) {
    activeTab.value = queryTab
  }
})

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && tabs.some((t) => t.id === newTab)) {
      activeTab.value = newTab as TabId
    }
  },
)

function selectTab(id: TabId) {
  activeTab.value = id
  router.replace({ query: { ...route.query, tab: id } })
}

const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'notifications':
      return SettingsNotifications
    case 'teams':
      return SettingsTeams
    case 'security':
      return SettingsSecurity
    case 'general':
    default:
      return SettingsGeneral
  }
})
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2.5rem;
}

/* Container Card — one unified card */
.settings-container-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Tabs Header */
.tabs-header {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #E5E7EB;
}

.tab-btn {
  position: relative;
  flex: 1;
  background: none;
  border: none;
  padding: 1.25rem 1rem;
  font-size: 0.925rem;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-btn:hover {
  color: #0E2615;
}

.tab-btn--active {
  color: #3FD246;
  font-weight: 600;
}

.active-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #3FD246;
  border-radius: 3px 3px 0 0;
}

/* Tab Body */
.tab-body {
  padding: 1rem 2rem 2rem;
}
</style>

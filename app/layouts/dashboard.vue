<template>
  <div class="db-layout">
    <!-- Sidebar (hidden during Create Event steps) -->
    <AppSidebar v-if="!hideSidebar" @open-signout="showSignOutModal = true" />

    <!-- Main Container -->
    <div class="db-main" :class="{ 'db-main--full': hideSidebar }">
      <AppHeader @open-signout="showSignOutModal = true" />
      <main class="db-content">
        <slot />
      </main>
    </div>

    <!-- Sign Out Confirmation Modal -->
    <SignOutModal v-model="showSignOutModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSidebar from '~/components/dashboard/AppSidebar.vue'
import AppHeader from '~/components/dashboard/AppHeader.vue'
import SignOutModal from '~/components/dashboard/SignOutModal.vue'

const showSignOutModal = ref(false)
const hideSidebarState = useState<boolean>('hide-app-sidebar', () => false)

const hideSidebar = computed(() => hideSidebarState.value)
</script>

<style scoped>
.db-layout {
  display: flex;
  min-height: 100vh;
  background-color: #F6FAF6;
  font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
}

.db-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 240px;
  transition: margin-left 0.15s ease;
}

.db-main--full {
  margin-left: 0 !important;
}

.db-content {
  flex: 1;
  padding: 1.25rem 1.25rem 2.5rem;
}

@media (max-width: 1024px) {
  .db-main {
    margin-left: 0;
  }
  .db-content {
    padding: 1.5rem 1.25rem 2.5rem;
  }
}
</style>

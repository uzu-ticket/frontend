<template>
  <div class="integrations-page">

    <!-- Top Bar: Search + Add Integration -->
    <div class="top-bar">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="localSearch"
          type="text"
          class="search-input"
          placeholder="Search Integrations..."
        />
      </div>

      <button id="btn-add-integration" class="btn-add" @click="$emit('open-add')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-plus" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Add Integration</span>
      </button>
    </div>

    <!-- Connected Integrations -->
    <section class="section">
      <h2 class="section-title">Connected Integrations ({{ filteredConnected.length }})</h2>

      <div v-if="filteredConnected.length > 0" class="connected-grid">
        <div
          v-for="item in filteredConnected"
          :key="item.id"
          class="connected-card"
          @click="$emit('open-connect', item.id)"
        >
          <!-- Logo + Info row -->
          <div class="card-top-row">
            <div class="logo-shell">
              <IntegrationLogo :logo-key="item.logoKey" />
            </div>
            <div class="card-info">
              <span class="card-name">{{ item.name }}</span>
              <span class="card-meta">
                {{ item.category }}
                <span class="meta-dot">•</span>
                {{ item.status }}
              </span>
              <span class="active-badge">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">No connected integrations found.</div>
    </section>

    <!-- Available Integrations -->
    <section class="section">
      <h2 class="section-title">Available Integrations ({{ filteredAvailable.length }})</h2>

      <div v-if="filteredAvailable.length > 0" class="available-grid">
        <div
          v-for="item in filteredAvailable"
          :key="item.id"
          class="available-card"
        >
          <!-- Logo + Info -->
          <div class="card-top-row">
            <div class="logo-shell">
              <IntegrationLogo :logo-key="item.logoKey" />
            </div>
            <div class="card-info">
              <span class="card-name">{{ item.name }}</span>
              <span
                class="card-category"
                :class="{ 'card-category--payment': item.category === 'Payment' }"
              >{{ item.category }}</span>
            </div>
          </div>

          <!-- Connect button -->
          <button
            class="btn-connect"
            @click.stop="$emit('open-connect', item.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="plug-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Connect</span>
          </button>
        </div>
      </div>

      <div v-else class="empty-state">No available integrations found.</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import IntegrationLogo from './IntegrationLogo.vue'
import type { IntegrationItem } from '~/composables/useIntegrations'

const props = defineProps<{
  connectedList: IntegrationItem[]
  availableList: IntegrationItem[]
}>()

const emit = defineEmits<{
  'open-add': []
  'open-connect': [id: string]
  'toggle-connect': [id: string]
  'test-connect': [item: IntegrationItem]
}>()

const localSearch = ref('')

const filteredConnected = computed(() => {
  const q = localSearch.value.toLowerCase().trim()
  if (!q) return props.connectedList
  return props.connectedList.filter(
    (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
  )
})

const filteredAvailable = computed(() => {
  const q = localSearch.value.toLowerCase().trim()
  if (!q) return props.availableList
  return props.availableList.filter(
    (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
  )
})
</script>

<style scoped>
.integrations-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 480px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #9CA3AF;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.75rem;
  font-size: 0.9rem;
  color: #111827;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.search-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.1);
}
.search-input::placeholder {
  color: #9CA3AF;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.8rem 1.6rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: background 0.15s, transform 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-add:hover {
  background: #36bd3d;
  transform: translateY(-1px);
}

.btn-plus {
  width: 1.1rem;
  height: 1.1rem;
}

/* Sections */
.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

/* Connected 3-column grid */
.connected-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.connected-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.connected-card:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

/* Available 4-column grid */
.available-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.available-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.available-card:hover {
  border-color: #3FD246;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.08);
}

/* Shared card internals */
.card-top-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.logo-shell {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #F3F4F6;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

/* Connected meta: "Category • Live" */
.card-meta {
  font-size: 0.8rem;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.meta-dot {
  color: #D1D5DB;
}

/* Available category label */
.card-category {
  font-size: 0.8rem;
  color: #6B7280;
  font-weight: 500;
}
.card-category--payment {
  color: #3FD246;
  font-weight: 600;
}

/* Active badge - placed under title & description */
.active-badge {
  display: inline-flex;
  align-items: center;
  margin-top: 0.35rem;
  padding: 0.25rem 0.85rem;
  background: #DCFCE7;
  color: #15803D;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

/* Connect button */
.btn-connect {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.6rem 1rem;
  background: #ffffff;
  color: #3FD246;
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid #E5E7EB;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
}
.btn-connect:hover {
  background: #F0FDF4;
  border-color: #3FD246;
  color: #36bd3d;
  box-shadow: 0 2px 8px rgba(63, 210, 70, 0.15);
}

.plug-icon {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
  color: #3FD246;
}

/* Empty */
.empty-state {
  color: #9CA3AF;
  font-size: 0.875rem;
  padding: 1rem 0;
}

@media (max-width: 900px) {
  .connected-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .available-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .connected-grid,
  .available-grid {
    grid-template-columns: 1fr;
  }
  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-wrapper {
    max-width: 100%;
  }
}
</style>

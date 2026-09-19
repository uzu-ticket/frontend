<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-text">
          <h2 class="modal-title">Add Integrations</h2>
          <p class="modal-subtitle">Choose a service to connect to your account.</p>
        </div>
        <button class="close-btn" title="Close" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="modalSearchQuery"
          type="text"
          class="search-input"
          placeholder="Search Integrations..."
        />
      </div>

      <!-- Scrollable List of Available Integrations -->
      <div class="modal-body-list">
        <div
          v-for="item in displayedList"
          :key="item.id"
          class="modal-item-row"
        >
          <div class="item-left">
            <IntegrationLogo :logo-key="item.logoKey" />
            <div class="item-info">
              <h3 class="item-title">{{ item.name }}</h3>
              <p class="item-desc">{{ item.description }}</p>
            </div>
          </div>

          <button
            class="btn-connect-pill"
            :class="{ 'btn-connect-pill--active': item.connected }"
            @click="handleToggle(item)"
          >
            <!-- Plug / Chain Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="plug-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{{ item.connected ? 'Connected' : 'Connect' }}</span>
          </button>
        </div>

        <div v-if="displayedList.length === 0" class="empty-search">
          No integrations match "{{ modalSearchQuery }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import IntegrationLogo from './IntegrationLogo.vue'
import type { IntegrationItem } from '~/composables/useIntegrations'

const props = defineProps<{
  integrations: IntegrationItem[]
}>()

const emit = defineEmits<{
  close: []
  toggle: [id: string]
}>()

const modalSearchQuery = ref('')

const displayedList = computed(() => {
  if (!modalSearchQuery.value.trim()) return props.integrations
  const q = modalSearchQuery.value.toLowerCase()
  return props.integrations.filter(
    (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
  )
})

function handleToggle(item: IntegrationItem) {
  emit('toggle', item.id)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 2.25rem 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: color 0.15s;
}
.close-btn:hover {
  color: #111827;
}
.close-icon {
  width: 1.35rem;
  height: 1.35rem;
}

/* Search Bar */
.search-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.15rem;
  height: 1.15rem;
  color: #9CA3AF;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

/* List Body */
.modal-body-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 400px;
  padding-right: 0.25rem;
}

.modal-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #F3F4F6;
}
.modal-item-row:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0E2615;
  margin: 0 0 0.15rem;
}

.item-desc {
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0;
}

/* Connect Pill Button */
.btn-connect-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #F9FAFB;
  color: #4B5563;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-connect-pill:hover {
  background: #F3F4F6;
  border-color: #D1D5DB;
}

.btn-connect-pill--active {
  background: #E8F8EA;
  color: #15803D;
  border-color: #C8F5D2;
}

.plug-icon {
  width: 1rem;
  height: 1rem;
}

.empty-search {
  text-align: center;
  color: #6B7280;
  font-size: 0.9rem;
  padding: 2rem 0;
}
</style>

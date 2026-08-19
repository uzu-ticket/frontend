<template>
  <AppModal
    :model-value="modelValue"
    size="sm"
    title="Filter Orders"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="filter-modal-container">
      <!-- Status Filter -->
      <div class="filter-group">
        <label class="filter-label">Order Status</label>
        <div class="status-options-grid">
          <button
            v-for="st in statusOptions"
            :key="st"
            type="button"
            class="status-chip"
            :class="{ 'status-chip--active': selectedStatus === st }"
            @click="selectedStatus = st"
          >
            {{ st }}
          </button>
        </div>
      </div>

      <!-- Event Filter (Custom AppSelect) -->
      <div class="filter-group">
        <label class="filter-label">Filter by Event</label>
        <AppSelect
          v-model="selectedEvent"
          :options="eventOptions"
          placeholder="All Events"
        />
      </div>

      <!-- Ticket Tier Filter (Custom AppSelect) -->
      <div class="filter-group">
        <label class="filter-label">Ticket Tier</label>
        <AppSelect
          v-model="selectedTier"
          :options="tierOptions"
          placeholder="All Tiers"
        />
      </div>
    </div>

    <template #footer>
      <div class="filter-modal-actions">
        <button type="button" class="btn-reset" @click="resetFilters">
          Reset Filters
        </button>
        <button type="button" class="btn-apply" @click="applyFilters">
          Apply Filters
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppSelect from '~/components/ui/AppSelect.vue'

const props = defineProps<{
  modelValue: boolean
  activeStatus: string
  activeEvent: string
  activeTier: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'apply': [filters: { status: string; event: string; tier: string }]
}>()

const statusOptions = ['All', 'Published', 'Draft', 'Refunded']

const eventOptions = [
  { value: 'ALL', label: 'All Events' },
  { value: 'Table Talks', label: 'Table Talks' },
  { value: 'Startup Meets', label: 'Startup Meets' },
  { value: 'Music Fest 2026', label: 'Music Fest 2026' },
  { value: 'The Startup Growth Summit', label: 'The Startup Growth Summit' },
]

const tierOptions = [
  { value: 'ALL', label: 'All Tiers' },
  { value: 'VIP', label: 'VIP' },
  { value: 'REGULAR', label: 'REGULAR' },
  { value: 'VVIP', label: 'VVIP' },
]

const selectedStatus = ref(props.activeStatus || 'All')
const selectedEvent = ref<string | null>(props.activeEvent || 'ALL')
const selectedTier = ref<string | null>(props.activeTier || 'ALL')

watch(() => props.modelValue, (open) => {
  if (open) {
    selectedStatus.value = props.activeStatus || 'All'
    selectedEvent.value = props.activeEvent || 'ALL'
    selectedTier.value = props.activeTier || 'ALL'
  }
})

function close() {
  emit('update:modelValue', false)
}

function resetFilters() {
  selectedStatus.value = 'All'
  selectedEvent.value = 'ALL'
  selectedTier.value = 'ALL'
  applyFilters()
}

function applyFilters() {
  emit('apply', {
    status: selectedStatus.value,
    event: selectedEvent.value || 'ALL',
    tier: selectedTier.value || 'ALL',
  })
  close()
}
</script>

<style scoped>
.filter-modal-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0E2615;
}

.status-options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.status-chip {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #4b5563;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.status-chip:hover {
  background: #fafdfa;
  border-color: #3FD246;
}

.status-chip--active {
  background: #F0FDF1;
  border-color: #3FD246;
  color: #16A34A;
}

.filter-modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.btn-reset {
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #6b7280;
  font-weight: 700;
  font-size: 0.825rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-reset:hover {
  background: #f9fafb;
  color: #111827;
}

.btn-apply {
  padding: 0.6rem 1.35rem;
  border-radius: 9999px;
  border: none;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}

.btn-apply:hover {
  background: #34be3b;
}
</style>

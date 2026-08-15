<template>
  <div class="app-select-wrapper" ref="wrapperRef">
    <!-- Trigger -->
    <div
      class="select-trigger"
      :class="{
        'select-trigger--open': isOpen,
        'select-trigger--error': error,
        'select-trigger--disabled': disabled,
      }"
      @click="!disabled && (isOpen = !isOpen)"
    >
      <!-- Leading Icon (optional) -->
      <slot name="leading-icon" />

      <span class="select-value" :class="{ 'select-placeholder': !selectedOption }">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="trigger-chevron"
        :class="{ rotated: isOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Dropdown Options -->
    <Transition name="picker-drop">
      <div v-if="isOpen" class="select-dropdown">
        <!-- Search (searchable mode) -->
        <div v-if="searchable" class="search-row">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="query"
            type="text"
            class="search-input"
            placeholder="Search..."
            @click.stop
          />
        </div>

        <!-- Options List -->
        <div class="options-list">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            class="option-item"
            :class="{
              'option-item--selected': modelValue === option.value,
              'option-item--disabled': option.disabled,
            }"
            :disabled="option.disabled"
            @click="selectOption(option)"
          >
            <!-- Leading icon/avatar slot if any -->
            <span v-if="option.icon" class="option-icon">{{ option.icon }}</span>

            <div class="option-text-stack">
              <span class="option-label">{{ option.label }}</span>
              <span v-if="option.subLabel" class="option-sub-label">{{ option.subLabel }}</span>
            </div>

            <!-- Checkmark for selected -->
            <svg
              v-if="modelValue === option.value"
              xmlns="http://www.w3.org/2000/svg"
              class="check-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- No results -->
          <div v-if="filteredOptions.length === 0" class="no-results">
            No results found
          </div>
        </div>
      </div>
    </Transition>

    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  subLabel?: string
  icon?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    options: SelectOption[]
    placeholder?: string
    searchable?: boolean
    disabled?: boolean
    error?: string
  }>(),
  {
    placeholder: 'Select an option',
    searchable: false,
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [val: string | number | null]
}>()

const isOpen = ref(false)
const query = ref('')
const wrapperRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() =>
  props.options.find(o => o.value === props.modelValue) ?? null
)

const filteredOptions = computed(() => {
  if (!query.value.trim()) return props.options
  return props.options.filter(o =>
    o.label.toLowerCase().includes(query.value.toLowerCase())
  )
})

function selectOption(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  isOpen.value = false
  query.value = ''
}

function handleClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false
    query.value = ''
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.app-select-wrapper {
  position: relative;
  width: 100%;
}

.select-trigger {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  min-height: 2.75rem;
}

.select-trigger:hover:not(.select-trigger--disabled) { border-color: #d1d5db; }
.select-trigger--open { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.select-trigger--error { border-color: #ef4444; }
.select-trigger--disabled { background: #f9fafb; cursor: not-allowed; opacity: 0.7; }

.select-value {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.select-placeholder { color: #9ca3af; font-weight: 400; }

.trigger-chevron {
  width: 1.1rem; height: 1.1rem;
  color: #6b7280;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.rotated { transform: rotate(180deg); }

/* Dropdown */
.select-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 60;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Search */
.search-row {
  display: flex;
  align-items: center;
  padding: 0.65rem 0.875rem;
  border-bottom: 1px solid #f3f4f6;
  gap: 0.5rem;
}

.search-icon { width: 1rem; height: 1rem; color: #9ca3af; flex-shrink: 0; }

.search-input {
  flex: 1;
  font-size: 0.85rem;
  color: #1f2937;
  border: none;
  outline: none;
  background: transparent;
}

/* Options */
.options-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.4rem 0;
  scrollbar-width: thin;
}

.option-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.875rem;
  font-size: 0.875rem;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;
}

.option-item:hover:not(.option-item--disabled) { background: #f9fafb; }
.option-item--selected { background: #f0fdf1; color: #0E2615; }
.option-item--disabled { opacity: 0.4; cursor: not-allowed; }

.option-icon { font-size: 1.1rem; flex-shrink: 0; }

.option-text-stack {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.option-label { font-size: 0.875rem; font-weight: 600; }
.option-sub-label { font-size: 0.75rem; color: #6b7280; }

.check-icon { width: 1rem; height: 1rem; color: #3FD246; flex-shrink: 0; }

.no-results {
  padding: 1rem;
  text-align: center;
  font-size: 0.825rem;
  color: #9ca3af;
}

.error-text { font-size: 0.75rem; color: #ef4444; margin-top: 0.3rem; display: block; }

.picker-drop-enter-active, .picker-drop-leave-active { transition: all 0.15s ease; }
.picker-drop-enter-from, .picker-drop-leave-to { opacity: 0; transform: translateY(6px); }
</style>

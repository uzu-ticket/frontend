<template>
  <div class="multiselect-wrapper" ref="wrapperRef">
    <!-- Trigger -->
    <div
      class="multiselect-trigger"
      :class="{
        'multiselect-trigger--open': isOpen,
        'multiselect-trigger--error': error,
        'multiselect-trigger--disabled': disabled,
      }"
      @click="!disabled && (isOpen = !isOpen)"
    >
      <!-- Tags for selected items -->
      <div v-if="selectedOptions.length > 0" class="tags-row">
        <span
          v-for="opt in selectedOptions"
          :key="opt.value"
          class="tag"
        >
          {{ opt.label }}
          <button
            class="tag-remove"
            @click.stop="removeOption(opt.value)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="tag-x" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
      </div>

      <!-- Placeholder (when nothing selected) -->
      <span v-else class="multiselect-placeholder">{{ placeholder }}</span>

      <!-- Right side: Count badge + chevron -->
      <div class="trigger-right">
        <span v-if="selectedOptions.length > 0" class="count-badge">
          {{ selectedOptions.length }}
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
    </div>

    <!-- Dropdown -->
    <Transition name="picker-drop">
      <div v-if="isOpen" class="multiselect-dropdown">
        <!-- Search -->
        <div class="search-row">
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

        <!-- Select All / Clear All Controls -->
        <div class="bulk-controls">
          <button class="bulk-btn" @click.stop="selectAll">
            Select all
          </button>
          <span class="bulk-sep">·</span>
          <button class="bulk-btn bulk-btn--clear" @click.stop="clearAll">
            Clear all
          </button>
        </div>

        <!-- Options List -->
        <div class="options-list">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            class="option-item"
            :class="{
              'option-item--selected': isSelected(option.value),
              'option-item--disabled': option.disabled,
            }"
            :disabled="option.disabled"
            @click.stop="toggleOption(option)"
          >
            <!-- Custom Checkbox -->
            <span
              class="checkbox"
              :class="{ 'checkbox--checked': isSelected(option.value) }"
            >
              <svg
                v-if="isSelected(option.value)"
                xmlns="http://www.w3.org/2000/svg"
                class="check-svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>

            <div class="option-text-stack">
              <span class="option-label">{{ option.label }}</span>
              <span v-if="option.subLabel" class="option-sub">{{ option.subLabel }}</span>
            </div>
          </button>

          <div v-if="filteredOptions.length === 0" class="no-results">
            No results found
          </div>
        </div>

        <!-- Footer -->
        <div class="dropdown-footer">
          <span class="selected-count-text">{{ selectedOptions.length }} selected</span>
          <button class="btn-done" @click="isOpen = false">Done</button>
        </div>
      </div>
    </Transition>

    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface MultiSelectOption {
  value: string | number
  label: string
  subLabel?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: (string | number)[]
    options: MultiSelectOption[]
    placeholder?: string
    disabled?: boolean
    error?: string
    maxSelections?: number
  }>(),
  {
    placeholder: 'Select options',
    disabled: false,
    modelValue: () => [],
  }
)

const emit = defineEmits<{
  'update:modelValue': [val: (string | number)[]]
}>()

const isOpen = ref(false)
const query = ref('')
const wrapperRef = ref<HTMLElement | null>(null)

const selectedOptions = computed(() =>
  props.options.filter(o => (props.modelValue ?? []).includes(o.value))
)

const filteredOptions = computed(() => {
  if (!query.value.trim()) return props.options
  return props.options.filter(o =>
    o.label.toLowerCase().includes(query.value.toLowerCase())
  )
})

function isSelected(val: string | number) {
  return (props.modelValue ?? []).includes(val)
}

function toggleOption(option: MultiSelectOption) {
  if (option.disabled) return
  const current = [...(props.modelValue ?? [])]
  const idx = current.indexOf(option.value)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    if (props.maxSelections && current.length >= props.maxSelections) return
    current.push(option.value)
  }
  emit('update:modelValue', current)
}

function removeOption(val: string | number) {
  const current = (props.modelValue ?? []).filter(v => v !== val)
  emit('update:modelValue', current)
}

function selectAll() {
  const all = props.options
    .filter(o => !o.disabled)
    .map(o => o.value)
  emit('update:modelValue', all)
}

function clearAll() {
  emit('update:modelValue', [])
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
.multiselect-wrapper {
  position: relative;
  width: 100%;
}

/* Trigger */
.multiselect-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem 0.5rem 0.75rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 2.75rem;
  flex-wrap: nowrap;
}

.multiselect-trigger:hover:not(.multiselect-trigger--disabled) { border-color: #d1d5db; }
.multiselect-trigger--open { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.multiselect-trigger--error { border-color: #ef4444; }
.multiselect-trigger--disabled { background: #f9fafb; cursor: not-allowed; opacity: 0.7; }

/* Tags */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  flex: 1;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  background: #DCFCE7;
  color: #0E2615;
  border-radius: 9999px;
  font-size: 0.775rem;
  font-weight: 700;
}

.tag-remove {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #16a34a;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}

.tag-remove:hover { opacity: 0.7; }
.tag-x { width: 0.7rem; height: 0.7rem; }

/* Placeholder */
.multiselect-placeholder {
  flex: 1;
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Trigger Right */
.trigger-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  margin-left: auto;
  padding-left: 0.5rem;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 800;
  border-radius: 50%;
}

.trigger-chevron {
  width: 1.1rem; height: 1.1rem;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.rotated { transform: rotate(180deg); }

/* Dropdown */
.multiselect-dropdown {
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
  gap: 0.5rem;
  padding: 0.65rem 0.875rem;
  border-bottom: 1px solid #f3f4f6;
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

/* Bulk Controls */
.bulk-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  border-bottom: 1px solid #f3f4f6;
}

.bulk-btn {
  font-size: 0.775rem;
  font-weight: 700;
  color: #3FD246;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s;
}

.bulk-btn:hover { opacity: 0.7; }
.bulk-btn--clear { color: #ef4444; }
.bulk-sep { color: #d1d5db; font-size: 0.75rem; }

/* Options List */
.options-list {
  max-height: 210px;
  overflow-y: auto;
  padding: 0.4rem 0;
  scrollbar-width: thin;
}

.option-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
.option-item--selected { background: #f0fdf1; }
.option-item--disabled { opacity: 0.4; cursor: not-allowed; }

/* Custom Checkbox */
.checkbox {
  width: 1.1rem;
  height: 1.1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.3rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
}

.checkbox--checked {
  background: #3FD246;
  border-color: #3FD246;
}

.check-svg { width: 0.75rem; height: 0.75rem; color: #ffffff; }

.option-text-stack {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.option-label { font-size: 0.875rem; font-weight: 600; color: #1f2937; }
.option-sub { font-size: 0.725rem; color: #6b7280; }

.no-results {
  padding: 1rem;
  text-align: center;
  font-size: 0.825rem;
  color: #9ca3af;
}

/* Footer */
.dropdown-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.875rem;
  border-top: 1px solid #f3f4f6;
}

.selected-count-text {
  font-size: 0.775rem;
  font-weight: 600;
  color: #6b7280;
}

.btn-done {
  padding: 0.4rem 1.25rem;
  background: #3FD246;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-done:hover { background: #34c03b; }

.error-text { font-size: 0.75rem; color: #ef4444; margin-top: 0.3rem; display: block; }

/* Transition */
.picker-drop-enter-active, .picker-drop-leave-active { transition: all 0.15s ease; }
.picker-drop-enter-from, .picker-drop-leave-to { opacity: 0; transform: translateY(6px); }
</style>

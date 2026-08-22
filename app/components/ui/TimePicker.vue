<template>
  <div class="time-picker-wrapper" ref="wrapperRef">
    <!-- Trigger -->
    <div
      class="time-trigger"
      :class="{ 'time-trigger--open': isOpen, 'time-trigger--error': error }"
      @click="isOpen = !isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="trigger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="trigger-value" :class="{ 'trigger-placeholder': !displayValue }">
        {{ displayValue || placeholder }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="trigger-chevron" :class="{ rotated: isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Time Picker Dropdown -->
    <Transition name="picker-drop">
      <div v-if="isOpen" class="time-dropdown">
        <!-- Columns: Hour | Minute | AM/PM -->
        <div class="time-columns">
          <!-- Hours -->
          <div class="col-label">Hour</div>
          <div class="col-label">Min</div>
          <div class="col-label">Period</div>

          <div class="scroll-col" ref="hourRef">
            <button
              v-for="h in hours"
              :key="h"
              type="button"
              class="time-cell"
              :class="{ 'time-cell--selected': selectedHour === h }"
              @click="selectedHour = h"
            >
              {{ h }}
            </button>
          </div>

          <div class="scroll-col" ref="minRef">
            <button
              v-for="m in minutes"
              :key="m"
              type="button"
              class="time-cell"
              :class="{ 'time-cell--selected': selectedMinute === m }"
              @click="selectedMinute = m"
            >
              {{ m }}
            </button>
          </div>

          <div class="period-col">
            <button
              type="button"
              class="period-btn"
              :class="{ 'period-btn--selected': period === 'AM' }"
              @click="period = 'AM'"
            >
              AM
            </button>
            <button
              type="button"
              class="period-btn"
              :class="{ 'period-btn--selected': period === 'PM' }"
              @click="period = 'PM'"
            >
              PM
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="time-footer">
          <button type="button" class="btn-clear-time" @click="clearTime">Clear</button>
          <button type="button" class="btn-apply-time" @click="applyTime">Apply</button>
        </div>
      </div>
    </Transition>

    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    error?: string
  }>(),
  {
    placeholder: 'Select time',
    modelValue: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>()

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const parseInitial = () => {
  if (props.modelValue) {
    const match = props.modelValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (match) {
      return { h: String(parseInt(match[1])).padStart(2, '0'), m: match[2], p: match[3].toUpperCase() as 'AM' | 'PM' }
    }
  }
  return { h: '09', m: '00', p: 'AM' as 'AM' | 'PM' }
}

const initial = parseInitial()
const selectedHour = ref(initial.h)
const selectedMinute = ref(initial.m)
const period = ref<'AM' | 'PM'>(initial.p)

const displayValue = computed(() => props.modelValue || '')

function applyTime() {
  emit('update:modelValue', `${selectedHour.value}:${selectedMinute.value} ${period.value}`)
  isOpen.value = false
}

function clearTime() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.time-picker-wrapper {
  position: relative;
  width: 100%;
}

.time-trigger {
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
}

.time-trigger:hover { border-color: #d1d5db; }
.time-trigger--open { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.time-trigger--error { border-color: #ef4444; }

.trigger-icon { width: 1.1rem; height: 1.1rem; color: #6b7280; flex-shrink: 0; }

.trigger-value {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.trigger-placeholder { color: #9ca3af; font-weight: 400; }

.trigger-chevron {
  width: 1.1rem; height: 1.1rem;
  color: #6b7280;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.rotated { transform: rotate(180deg); }

/* Dropdown */
.time-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 60;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  width: 260px;
  padding: 1rem;
}

.time-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.col-label {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: #6b7280;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding-bottom: 0.35rem;
}

.scroll-col {
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-width: thin;
}

.time-cell {
  width: 100%;
  padding: 0.45rem 0;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  background: transparent;
  border: none;
  border-radius: 0.45rem;
  cursor: pointer;
  transition: all 0.12s ease;
}

.time-cell:hover { background: #f0fdf1; color: #3FD246; }
.time-cell--selected { background: #3FD246; color: #ffffff; }

/* Period Column */
.period-col {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.25rem;
}

.period-btn {
  width: 100%;
  padding: 0.55rem 0;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.12s ease;
}

.period-btn:hover { background: #e5e7eb; }
.period-btn--selected { background: #0E2615; color: #3FD246; border-color: #3FD246; }

/* Footer */
.time-footer {
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 0.75rem;
}

.btn-clear-time, .btn-apply-time {
  flex: 1;
  padding: 0.5rem 0;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.5rem;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.btn-clear-time { background: #f3f4f6; color: #6b7280; }
.btn-clear-time:hover { background: #e5e7eb; }
.btn-apply-time { background: #3FD246; color: #ffffff; }
.btn-apply-time:hover { background: #34c03b; }

.error-text { font-size: 0.75rem; color: #ef4444; margin-top: 0.3rem; display: block; }

.picker-drop-enter-active, .picker-drop-leave-active { transition: all 0.15s ease; }
.picker-drop-enter-from, .picker-drop-leave-to { opacity: 0; transform: translateY(6px); }
</style>

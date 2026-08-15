<template>
  <div class="date-picker-wrapper" ref="wrapperRef">
    <!-- Trigger Input -->
    <div
      class="date-trigger"
      :class="{ 'date-trigger--open': isOpen, 'date-trigger--error': error }"
      @click="isOpen = !isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="trigger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="trigger-value" :class="{ 'trigger-placeholder': !displayValue }">
        {{ displayValue || placeholder }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="trigger-chevron" :class="{ 'rotated': isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Dropdown Calendar -->
    <Transition name="picker-drop">
      <div v-if="isOpen" class="calendar-dropdown">
        <!-- Month/Year Navigation -->
        <div class="cal-header">
          <button class="cal-nav-btn" @click="prevMonth">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="nav-icon">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <span class="cal-month-year">{{ monthYear }}</span>

          <button class="cal-nav-btn" @click="nextMonth">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="nav-icon">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Day-of-week headers -->
        <div class="cal-weekdays">
          <span v-for="day in weekdays" :key="day" class="weekday-label">{{ day }}</span>
        </div>

        <!-- Calendar Grid -->
        <div class="cal-grid">
          <button
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            class="cal-day"
            :class="{
              'cal-day--empty': !cell.day,
              'cal-day--selected': cell.day && isSelected(cell),
              'cal-day--today': cell.day && isToday(cell),
              'cal-day--disabled': cell.disabled,
            }"
            :disabled="!cell.day || cell.disabled"
            @click="selectDay(cell)"
          >
            {{ cell.day || '' }}
          </button>
        </div>

        <!-- Footer: Today shortcut -->
        <div class="cal-footer">
          <button class="btn-today" @click="selectToday">Today</button>
          <button class="btn-clear" @click="clearDate">Clear</button>
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
    modelValue?: Date | null
    placeholder?: string
    minDate?: Date
    maxDate?: Date
    error?: string
  }>(),
  {
    placeholder: 'Select date',
    modelValue: null,
  }
)

const emit = defineEmits<{
  'update:modelValue': [date: Date | null]
}>()

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const today = new Date()
const viewYear = ref(props.modelValue ? props.modelValue.getFullYear() : today.getFullYear())
const viewMonth = ref(props.modelValue ? props.modelValue.getMonth() : today.getMonth())

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const monthYear = computed(() => `${monthNames[viewMonth.value]} ${viewYear.value}`)

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  return props.modelValue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

interface CalCell { day: number | null; year: number; month: number; disabled: boolean }

const calendarCells = computed<CalCell[]>(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const cells: CalCell[] = []

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, year: viewYear.value, month: viewMonth.value, disabled: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(viewYear.value, viewMonth.value, d)
    let disabled = false
    if (props.minDate && cellDate < props.minDate) disabled = true
    if (props.maxDate && cellDate > props.maxDate) disabled = true
    cells.push({ day: d, year: viewYear.value, month: viewMonth.value, disabled })
  }
  return cells
})

function isSelected(cell: CalCell) {
  if (!props.modelValue || !cell.day) return false
  const mv = props.modelValue
  return mv.getFullYear() === cell.year && mv.getMonth() === cell.month && mv.getDate() === cell.day
}

function isToday(cell: CalCell) {
  if (!cell.day) return false
  return today.getFullYear() === cell.year && today.getMonth() === cell.month && today.getDate() === cell.day
}

function selectDay(cell: CalCell) {
  if (!cell.day || cell.disabled) return
  emit('update:modelValue', new Date(cell.year, cell.month, cell.day))
  isOpen.value = false
}

function selectToday() {
  emit('update:modelValue', new Date(today))
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
  isOpen.value = false
}

function clearDate() {
  emit('update:modelValue', null)
  isOpen.value = false
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
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
.date-picker-wrapper {
  position: relative;
  width: 100%;
}

.date-trigger {
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

.date-trigger:hover { border-color: #d1d5db; }
.date-trigger--open { border-color: #3FD246; box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12); }
.date-trigger--error { border-color: #ef4444; }

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

/* Calendar Dropdown */
.calendar-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 60;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  width: 300px;
  padding: 1rem;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cal-nav-btn {
  width: 2rem; height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}

.cal-nav-btn:hover { background: #f3f4f6; }
.nav-icon { width: 1.1rem; height: 1.1rem; color: #374151; }

.cal-month-year {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0E2615;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.weekday-label {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #6b7280;
  padding: 0.25rem 0;
  text-transform: uppercase;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-day {
  height: 2.2rem;
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.12s ease;
}

.cal-day:hover:not(:disabled):not(.cal-day--empty) { background: #f0fdf1; color: #3FD246; }
.cal-day--selected { background: #3FD246 !important; color: #ffffff !important; }
.cal-day--today:not(.cal-day--selected) { border: 1.5px solid #3FD246; color: #3FD246; }
.cal-day--empty { pointer-events: none; }
.cal-day--disabled { color: #d1d5db; cursor: not-allowed; }

.cal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.btn-today, .btn-clear {
  padding: 0.35rem 0.8rem;
  font-size: 0.775rem;
  font-weight: 700;
  border-radius: 0.45rem;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.btn-today { background: #3FD246; color: #ffffff; }
.btn-today:hover { background: #34c03b; }
.btn-clear { background: #f3f4f6; color: #6b7280; }
.btn-clear:hover { background: #e5e7eb; color: #374151; }

.error-text {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.3rem;
  display: block;
}

/* Transition */
.picker-drop-enter-active, .picker-drop-leave-active { transition: all 0.15s ease; }
.picker-drop-enter-from, .picker-drop-leave-to { opacity: 0; transform: translateY(6px); }
</style>

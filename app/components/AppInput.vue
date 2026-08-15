<template>
  <div :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="currentType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
      <!-- Right icon area: password toggle or append slot -->
      <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <!-- Password toggle button -->
        <button
          v-if="type === 'password'"
          type="button"
          class="text-UzuTBlack hover:text-UzuTBlack/80 transition-colors focus:outline-none"
          :aria-label="currentType === 'password' ? 'Show password' : 'Hide password'"
          @click="togglePasswordVisibility"
        >
          <!-- Eye-slash (hidden) -->
          <svg v-if="currentType === 'password'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5M6.228 6.228A10.45 10.45 0 003 12c1.755 4.15 5.816 7 9.5 7a10.45 10.45 0 005.272-1.228M9.772 4.772A10.45 10.45 0 0112 4.5c3.684 0 7.745 2.85 9.5 7a10.45 10.45 0 005.272-1.228M9.772 4.772A10.45 10.45 0 0112 4.5c3.684 0 7.745 2.85 9.5 7a10.45 10.45 0 01-1.728 2.772" />
          </svg>
          <!-- Eye (visible) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <!-- Custom append slot (non-password) -->
        <slot v-else-if="$slots.append" name="append" />

        <!-- Default right icon by type -->
        <template v-else-if="!$slots.append">
          <!-- Email icon -->
          <svg v-if="type === 'email'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-UzuTBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <!-- Tel icon -->
          <svg v-else-if="type === 'tel'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-UzuTBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <!-- Text/name person icon -->
          <svg v-else-if="type === 'text'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-UzuTBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </template>
      </div>
    </div>
    <p v-if="hint" class="mt-1.5 text-sm text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" class="mt-1.5 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue'

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  modelValue?: string | number
  label?: string
  type?: InputType
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  size?: Size
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = useId()
const showPassword = ref(false)
const currentType = computed(() =>
  props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type,
)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const baseClasses = 'block w-full bg-gray-50 rounded-[14.76px] border border-gray-100 text-gray-800 placeholder-gray-400 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed'

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-4 py-3.5 text-base',
  lg: 'px-5 py-4 text-lg',
}


const inputClasses = computed(() => [
  baseClasses,
  sizeClasses[props.size],
  props.error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : '',
].filter(Boolean).join(' '))

const wrapperClasses = 'w-full'
</script>

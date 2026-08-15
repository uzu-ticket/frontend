<template>
  <div :class="alertClasses" role="alert">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg v-if="icon" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path v-if="variant === 'info'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 5a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1z" clip-rule="evenodd" />
          <path v-else-if="variant === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          <path v-else-if="variant === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          <path v-else-if="variant === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <p v-if="$slots.title" class="text-sm font-medium" :class="titleClasses">
          <slot name="title" />
        </p>
        <div :class="[$slots.title ? 'mt-1' : '', 'text-sm', bodyClasses]">
          <slot />
        </div>
      </div>
      <div v-if="$slots.actions || closable" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            v-if="closable"
            type="button"
            :class="dismissClasses"
            @click="$emit('close')"
          >
            <span class="sr-only">Dismiss</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Variant = 'info' | 'success' | 'warning' | 'error'

interface Props {
  variant?: Variant
  closable?: boolean
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  closable: false,
  icon: true,
})

defineEmits<{
  close: []
}>()

const variantClasses: Record<Variant, { bg: string; text: string; ring: string }> = {
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    ring: 'focus:ring-blue-600',
  },
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    ring: 'focus:ring-green-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    ring: 'focus:ring-yellow-600',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    ring: 'focus:ring-red-600',
  },
}

const current = variantClasses[props.variant]

const alertClasses = `rounded-lg p-4 ${current.bg} ${current.text}`
const titleClasses = current.text
const bodyClasses = current.text
const dismissClasses = `inline-flex rounded-md p-1.5 ${current.text} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 ${current.ring}`
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <slot />
  </button>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'dark' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-[16px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-md hover:shadow-lg',
  secondary: 'bg-secondary text-dark hover:bg-secondary/80 focus:ring-secondary',
  dark: 'bg-dark text-white hover:bg-dark/90 focus:ring-dark',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary border border-primary',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

const buttonClasses = [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block ? 'w-full' : '',
].filter(Boolean).join(' ')
</script>

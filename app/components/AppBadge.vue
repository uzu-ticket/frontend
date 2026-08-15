<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'dark' | 'success' | 'warning' | 'error'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  variant?: Variant
  size?: Size
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: false,
})

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/20 text-gray-700',
  dark: 'bg-dark/10 text-dark',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
}

const badgeClasses = [
  'inline-flex items-center font-medium',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.rounded ? 'rounded-full' : 'rounded-md',
].join(' ')
</script>

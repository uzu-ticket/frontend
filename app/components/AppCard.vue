<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="border-b border-gray-200 px-6 py-4">
      <slot name="header" />
    </div>
    <div class="px-6 py-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4 bg-gray-50/50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hover: false,
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const cardClasses = [
  'bg-white rounded-xl border border-gray-200 shadow-sm',
  paddingClasses[props.padding],
  props.hover ? 'transition-shadow hover:shadow-md' : '',
].filter(Boolean).join(' ')
</script>

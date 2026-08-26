<template>
  <div
    class="skeleton-loader"
    :class="[
      `skeleton--${variant}`,
      { 'skeleton--animated': animated }
    ]"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'title' | 'circle' | 'rectangle' | 'card'
  width?: string
  height?: string
  borderRadius?: string
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: undefined,
  height: undefined,
  borderRadius: undefined,
  animated: true,
})

const customStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width) styles.width = props.width
  if (props.height) styles.height = props.height
  if (props.borderRadius) styles.borderRadius = props.borderRadius
  return styles
})
</script>

<style scoped>
.skeleton-loader {
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.skeleton--animated::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.45) 20%,
    rgba(255, 255, 255, 0.7) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skeleton--text {
  height: 0.85rem;
  width: 100%;
  margin-bottom: 0.4rem;
  border-radius: 0.25rem;
}

.skeleton--title {
  height: 1.4rem;
  width: 60%;
  margin-bottom: 0.75rem;
  border-radius: 0.375rem;
}

.skeleton--circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.skeleton--rectangle {
  width: 100%;
  height: 120px;
  border-radius: 0.75rem;
}

.skeleton--card {
  width: 100%;
  height: 180px;
  border-radius: 1rem;
}
</style>

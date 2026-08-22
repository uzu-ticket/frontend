<template>
  <div class="scanner-stat-card">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">{{ formattedValue }}</span>
    <span
      v-if="change !== undefined"
      class="stat-change"
      :class="isPositive ? 'stat-change--positive' : 'stat-change--negative'"
    >
      {{ changePrefix }}{{ change }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: number | string
  change?: number
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const isPositive = computed(() => {
  if (props.change === undefined) return true
  return props.change >= 0
})

const changePrefix = computed(() => {
  if (props.change === undefined) return ''
  return props.change > 0 ? '+' : ''
})
</script>

<style scoped>
.scanner-stat-card {
  background: #F0FDF4;
  border: 1px solid #DCFCE7;
  border-radius: 0.875rem;
  padding: 1rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 130px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.scanner-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 38, 21, 0.05);
}

.stat-label {
  font-size: 0.775rem;
  font-weight: 600;
  color: #4B5563;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.2;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 700;
}

.stat-change--positive {
  color: #16A34A;
}

.stat-change--negative {
  color: #DC2626;
}
</style>

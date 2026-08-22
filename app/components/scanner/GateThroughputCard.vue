<template>
  <div class="gate-throughput-card">
    <div class="card-header">
      <h3 class="card-title">Gate ThroughPut</h3>
      <span class="period-text">This period</span>
    </div>

    <div class="throughput-list">
      <div v-for="item in items" :key="item.gate" class="throughput-item">
        <span class="gate-label">{{ item.gate }}</span>
        
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: getPercentage(item.count) + '%' }"
          />
        </div>

        <span class="count-text">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface GateThroughput {
  gate: string
  count: number
}

interface Props {
  gates?: GateThroughput[]
  maxCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  gates: () => [
    { gate: 'Gate A', count: 562 },
    { gate: 'Gate B', count: 438 },
    { gate: 'Gate C', count: 248 },
  ],
})

const items = computed(() => props.gates)

const max = computed(() => {
  if (props.maxCount) return props.maxCount
  const maxVal = Math.max(...props.gates.map(g => g.count), 1)
  return Math.ceil(maxVal * 1.1)
})

function getPercentage(count: number) {
  return Math.min(100, Math.round((count / max.value) * 100))
}
</script>

<style scoped>
.gate-throughput-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.period-text {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6B7280;
}

.throughput-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.throughput-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.gate-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  width: 4rem;
  flex-shrink: 0;
}

.progress-track {
  flex: 1;
  height: 0.5rem;
  background: #F3F4F6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3FD246;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.count-text {
  font-size: 0.875rem;
  font-weight: 800;
  color: #111827;
  width: 2.5rem;
  text-align: right;
  flex-shrink: 0;
}
</style>

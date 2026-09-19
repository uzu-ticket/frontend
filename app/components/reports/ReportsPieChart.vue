<template>
  <div class="pie-chart-card">
    <h3 class="chart-title">Total Sold by Type</h3>

    <div class="chart-content">
      <!-- SVG Donut / Pie Chart -->
      <div class="svg-container">
        <svg viewBox="0 0 160 160" class="pie-svg">
          <!-- Donut Slices (computed paths) -->
          <path
            v-for="(slice, idx) in slices"
            :key="idx"
            :d="slice.path"
            :fill="slice.color"
          />
        </svg>
      </div>

      <!-- Legend -->
      <div class="legend-list">
        <div v-for="item in legendItems" :key="item.label" class="legend-item">
          <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
          <span class="legend-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const legendItems = [
  { label: 'VIP', color: '#3FD246', value: 40.1 },
  { label: 'Regular', color: '#00D2A0', value: 35.0 },
  { label: 'Early Bird', color: '#FF3B5C', value: 18.5 },
  { label: 'Group', color: '#FFB020', value: 6.4 },
]

const slices = computed(() => {
  const total = legendItems.reduce((acc, curr) => acc + curr.value, 0)
  let cumulativeAngle = -Math.PI / 2 // Start at top (12 o'clock)
  const cx = 80
  const cy = 80
  const r = 70

  return legendItems.map((item) => {
    const angle = (item.value / total) * 2 * Math.PI
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    cumulativeAngle = endAngle

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const largeArcFlag = angle > Math.PI ? 1 : 0

    // Path for pie slice
    const path = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArcFlag},1 ${x2},${y2} Z`

    return {
      path,
      color: item.color,
    }
  })
})
</script>

<style scoped>
.pie-chart-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.chart-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.svg-container {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.pie-svg {
  width: 100%;
  height: 100%;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}
</style>

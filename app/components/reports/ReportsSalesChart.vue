<template>
  <div class="sales-chart-card">
    <div class="chart-header">
      <h3 class="chart-title">{{ title || 'Sales Over Time' }}</h3>

      <div class="select-dropdown-box">
        <span>{{ periodLabel || 'Daily' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div class="chart-wrapper">
      <svg class="chart-svg" viewBox="0 0 600 240" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGreenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3FD246" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#3FD246" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Dashed horizontal grid lines -->
        <line x1="30" y1="20" x2="570" y2="20" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="30" y1="60" x2="570" y2="60" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="30" y1="100" x2="570" y2="100" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="30" y1="140" x2="570" y2="140" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="30" y1="180" x2="570" y2="180" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="30" y1="210" x2="570" y2="210" stroke="#e5e7eb" />

        <!-- Dual Curve Areas for rich aesthetic -->
        <path :d="areaPath1" fill="url(#areaGreenGrad)" />
        <path :d="linePath1" fill="none" stroke="#3FD246" stroke-width="2" />

        <path :d="linePath2" fill="none" stroke="#3FD246" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6" />

        <!-- Nodes -->
        <circle v-for="(p, i) in points1" :key="'p1-'+i" :cx="p.x" :cy="p.y" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
      </svg>

      <!-- X Axis Labels -->
      <div class="x-axis">
        <span>Aug 5</span>
        <span>Aug 6</span>
        <span>Aug 7</span>
        <span>Aug 8</span>
        <span>Aug 9</span>
        <span>Aug 10</span>
        <span>InDesign</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  periodLabel?: string
}>()

const points1 = [
  { x: 40, y: 70 },
  { x: 120, y: 150 },
  { x: 200, y: 50 },
  { x: 280, y: 140 },
  { x: 360, y: 40 },
  { x: 440, y: 110 },
  { x: 520, y: 60 },
]

const points2 = [
  { x: 40, y: 120 },
  { x: 120, y: 75 },
  { x: 200, y: 130 },
  { x: 280, y: 80 },
  { x: 360, y: 160 },
  { x: 440, y: 95 },
  { x: 520, y: 100 },
]

function catmullRomToBezier(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return ''
  let path = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return path
}

const linePath1 = computed(() => catmullRomToBezier(points1))
const linePath2 = computed(() => catmullRomToBezier(points2))

const areaPath1 = computed(() => {
  const line = linePath1.value
  return `${line} L 520,210 L 40,210 Z`
})
</script>

<style scoped>
.sales-chart-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #E5E7EB;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.select-dropdown-box {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.arrow-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: #6B7280;
}

.chart-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-svg {
  width: 100%;
  height: 190px;
}

.x-axis {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.75rem 0;
  font-size: 0.725rem;
  color: #9CA3AF;
  font-weight: 500;
}
</style>

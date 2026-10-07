<template>
  <div class="sales-chart-card">
    <!-- Header -->
    <div class="chart-header">
      <div class="chart-title-area">
        <h3 class="chart-title">Sales Summary</h3>
        <span class="chart-period-tag">(Last {{ selectedDays === 365 ? '1 year' : selectedDays + ' days' }})</span>
      </div>

      <div class="chart-select-container">
        <AppSelect
          :model-value="selectedDays"
          :options="periodOptions"
          @update:model-value="onPeriodSelect"
        />
      </div>
    </div>

    <!-- SVG Smooth Area Curve Chart -->
    <div class="chart-wrapper">
      <svg class="chart-svg" viewBox="0 0 650 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3FD246" stop-opacity="0.45" />
            <stop offset="100%" stop-color="#3FD246" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <line x1="40" y1="30" x2="630" y2="30" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="80" x2="630" y2="80" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="130" x2="630" y2="130" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="180" x2="630" y2="180" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="230" x2="630" y2="230" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="270" x2="630" y2="270" stroke="#e5e7eb" />

        <!-- Dynamic Area Fill -->
        <path
          v-if="areaPath"
          :d="areaPath"
          fill="url(#greenGradient)"
        />

        <!-- Dynamic Main Curve Line -->
        <path
          v-if="linePath"
          :d="linePath"
          fill="none"
          stroke="#3FD246"
          stroke-width="2.5"
        />

        <!-- Data Node Circles -->
        <circle
          v-for="(pt, idx) in plotPoints"
          :key="idx"
          :cx="pt.x"
          :cy="pt.y"
          r="3.5"
          fill="#3FD246"
          stroke="#ffffff"
          stroke-width="1.5"
        />
      </svg>

      <!-- Y Axis Labels -->
      <div class="y-axis">
        <span v-for="label in yAxisLabels" :key="label">{{ label }}</span>
      </div>

      <!-- X Axis Labels -->
      <div class="x-axis">
        <span v-for="label in xAxisLabels" :key="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppSelect from '~/components/ui/AppSelect.vue'
import type { SelectOption } from '~/components/ui/AppSelect.vue'
import { useDashboard } from '~/composables/useDashboard'

const props = defineProps<{
  chartData?: { day: string; orders: number; revenue: number }[]
}>()

const { selectedDays, fetchDashboardData } = useDashboard()

const chartData = computed(() => props.chartData ?? [])

const periodOptions: SelectOption[] = [
  { value: 7, label: '7 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
  { value: 365, label: '1 Year' },
]

function onPeriodSelect(val: string | number | null) {
  if (val && typeof val === 'number') {
    fetchDashboardData(val)
  }
}

function niceMax(value: number): number {
  if (value <= 0) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const residual = value / magnitude
  let nice: number
  if (residual <= 1) nice = 1
  else if (residual <= 2) nice = 2
  else if (residual <= 5) nice = 5
  else nice = 10
  return nice * magnitude
}

const maxRevenue = computed(() => {
  if (chartData.value.length === 0) return 100
  const max = Math.max(...chartData.value.map((d) => d.revenue))
  return niceMax(max)
})

const yAxisLabels = computed(() => {
  const max = maxRevenue.value
  const step = max / 4
  return [0, step, step * 2, step * 3, max].map((v) => Math.round(v).toLocaleString())
})

const xAxisLabels = computed(() => chartData.value.map((d) => d.day))

const plotPoints = computed(() => {
  const data = chartData.value
  if (data.length === 0) return []
  const max = maxRevenue.value
  const left = 40
  const right = 630
  const top = 30
  const bottom = 230
  const width = right - left
  const height = bottom - top

  return data.map((d, i) => {
    const x = data.length === 1 ? (left + right) / 2 : left + (i / (data.length - 1)) * width
    const y = top + (1 - d.revenue / max) * height
    return { x, y }
  })
})

function catmullRomToBezier(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`

  let path = `M ${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }

  return path
}

const linePath = computed(() => catmullRomToBezier(plotPoints.value))

const areaPath = computed(() => {
  const points = plotPoints.value
  if (points.length === 0) return ''
  const left = 40
  const right = 630
  const bottom = 270
  const line = catmullRomToBezier(points)
  const firstX = points[0].x
  const lastX = points[points.length - 1].x
  return `${line} L ${lastX},${bottom} L ${firstX},${bottom} Z`
})
</script>

<style scoped>
.sales-chart-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.chart-title-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.chart-period-tag {
  font-size: 0.8rem;
  color: #9ca3af;
}

.chart-select-container {
  width: 120px;
}

:deep(.select-trigger) {
  padding: 0.35rem 0.75rem !important;
  min-height: 2.25rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.8rem !important;
}

.chart-wrapper {
  position: relative;
  flex: 1;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-svg {
  width: 100%;
  height: 220px;
}

.y-axis {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #9ca3af;
}

.x-axis {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 2.5rem;
  padding-right: 0.5rem;
  font-size: 0.725rem;
  color: #9ca3af;
}
</style>

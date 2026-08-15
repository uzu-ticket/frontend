<template>
  <div class="sales-chart-card">
    <!-- Header -->
    <div class="chart-header">
      <div class="chart-title-area">
        <h3 class="chart-title">Sales Summary</h3>
        <span class="chart-period-tag">(Last 7 days)</span>
      </div>

      <div class="select-dropdown-box">
        <span>7 Days</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
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
          <linearGradient id="greenGradientAlt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10B981" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <line x1="40" y1="30" x2="630" y2="30" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="80" x2="630" y2="80" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="130" x2="630" y2="130" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="180" x2="630" y2="180" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="230" x2="630" y2="230" stroke="#f3f4f6" stroke-dasharray="4 4" />
        <line x1="40" y1="270" x2="630" y2="270" stroke="#e5e7eb" />

        <!-- Area Fill 1 -->
        <path
          d="M 40,270 L 40,60 C 80,40 120,110 160,50 C 200,80 240,160 280,70 C 320,60 360,180 400,60 C 440,130 480,80 520,110 C 560,70 600,60 630,50 L 630,270 Z"
          fill="url(#greenGradient)"
        />

        <!-- Area Fill 2 (Secondary Wave) -->
        <path
          d="M 40,270 L 40,110 C 80,80 120,180 160,90 C 200,140 240,70 280,110 C 320,150 360,70 400,100 C 440,150 480,100 520,160 C 560,90 600,100 630,80 L 630,270 Z"
          fill="url(#greenGradientAlt)"
        />

        <!-- Main Smooth Curve Line -->
        <path
          d="M 40,60 C 80,40 120,110 160,50 C 200,80 240,160 280,70 C 320,60 360,180 400,60 C 440,130 480,80 520,110 C 560,70 600,60 630,50"
          fill="none"
          stroke="#3FD246"
          stroke-width="2.5"
        />

        <!-- Secondary Smooth Curve Line -->
        <path
          d="M 40,110 C 80,80 120,180 160,90 C 200,140 240,70 280,110 C 320,150 360,70 400,100 C 440,150 480,100 520,160 C 560,90 600,100 630,80"
          fill="none"
          stroke="#10B981"
          stroke-width="1.8"
          stroke-dasharray="3 3"
        />

        <!-- Data Node Circles -->
        <circle cx="40" cy="60" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="160" cy="50" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="280" cy="70" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="400" cy="60" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="520" cy="110" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="630" cy="50" r="3.5" fill="#3FD246" stroke="#ffffff" stroke-width="1.5" />
      </svg>

      <!-- Y Axis Labels -->
      <div class="y-axis">
        <span>800</span>
        <span>700</span>
        <span>600</span>
        <span>500</span>
        <span>400</span>
        <span>300</span>
        <span>200</span>
        <span>100</span>
        <span>0</span>
      </div>

      <!-- X Axis Labels -->
      <div class="x-axis">
        <span>Aug 5</span>
        <span>Aug 6</span>
        <span>Aug 7</span>
        <span>Aug 8</span>
        <span>Aug 9</span>
        <span>Aug 10</span>
      </div>
    </div>
  </div>
</template>

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

.select-dropdown-box {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
}

.arrow-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: #6b7280;
}

/* Chart Wrapper */
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

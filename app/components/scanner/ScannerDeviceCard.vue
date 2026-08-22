<template>
  <div class="scanner-device-card">
    <h3 class="card-title">Scanner Device</h3>

    <div class="device-stats-grid">
      <div class="stat-col">
        <span class="col-label col-label--online">Online</span>
        <span class="col-value">{{ online }}</span>
      </div>

      <div class="stat-col">
        <span class="col-label col-label--offline">
          <span class="offline-o">O</span>ffline
        </span>
        <span class="col-value">{{ offline }}</span>
      </div>

      <div class="stat-col">
        <span class="col-label col-label--total">Total</span>
        <span class="col-value">{{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  online?: number
  offline?: number
}

const props = withDefaults(defineProps<Props>(), {
  online: 3,
  offline: 1,
})

const total = computed(() => props.online + props.offline)
</script>

<style scoped>
.scanner-device-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 2rem 0;
}

.device-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: auto;
  margin-bottom: 1.5rem;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.col-label {
  font-size: 0.875rem;
  font-weight: 800;
}

.col-label--online {
  color: #16A34A;
}

.col-label--offline {
  color: #111827;
}

.offline-o {
  color: #EF4444;
}

.col-label--total {
  color: #111827;
}

.col-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
}
</style>

<template>
  <div class="scanner-stat-group">
    <ScannerStatCard
      label="Ticket Sold"
      :value="stats.ticketSold ?? 0"
      :change="stats.ticketSoldChange"
    />
    <ScannerStatCard
      label="Scanned"
      :value="stats.scanned ?? 0"
      :change="stats.scannedChange"
    />
    <ScannerStatCard
      label="Valid"
      :value="stats.valid ?? 0"
      :change="stats.validChange"
    />
    <ScannerStatCard
      label="Duplicate/Used"
      :value="stats.duplicate ?? 0"
      :change="stats.duplicateChange"
    />
    <ScannerStatCard
      label="Invalid"
      :value="stats.invalid ?? 0"
      :change="stats.invalidChange"
    />
  </div>
</template>

<script setup lang="ts">
import ScannerStatCard from './ScannerStatCard.vue'

export interface ScannerStats {
  ticketSold?: number
  ticketSoldChange?: number
  scanned?: number
  scannedChange?: number
  valid?: number
  validChange?: number
  duplicate?: number
  duplicateChange?: number
  invalid?: number
  invalidChange?: number
}

withDefaults(
  defineProps<{
    stats?: ScannerStats
  }>(),
  {
    stats: () => ({}),
  }
)
</script>

<style scoped>
.scanner-stat-group {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.875rem;
  width: 100%;
}

@media (max-width: 1024px) {
  .scanner-stat-group {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .scanner-stat-group {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>

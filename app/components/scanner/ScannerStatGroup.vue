<template>
  <div class="scanner-stat-group">
    <ScannerStatCard
      label="Ticket Sold"
      :value="stats.ticketSold ?? 1500"
      :change="stats.ticketSoldChange ?? 12.4"
    />
    <ScannerStatCard
      label="Scanned"
      :value="stats.scanned ?? 1248"
      :change="stats.scannedChange ?? 10.3"
    />
    <ScannerStatCard
      label="Valid"
      :value="stats.valid ?? 1122"
      :change="stats.validChange ?? 9.6"
    />
    <ScannerStatCard
      label="Duplicate/Used"
      :value="stats.duplicate ?? 72"
      :change="stats.duplicateChange ?? -2.2"
    />
    <ScannerStatCard
      label="Invalid"
      :value="stats.invalid ?? 54"
      :change="stats.invalidChange ?? -3.2"
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

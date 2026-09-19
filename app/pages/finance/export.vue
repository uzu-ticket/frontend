<template>
  <div class="finance-page">
    <ExportStatementStep
      @back="router.push('/finance')"
      @download="handleDownload"
    />
  </div>
</template>

<script setup lang="ts">
import ExportStatementStep from '~/components/finance/ExportStatementStep.vue'
import { useFinance } from '~/composables/useFinance'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Export Statement — Uzu Ticket',
})

const router = useRouter()
const toast = useToast()
const { exportStatement } = useFinance()

function handleDownload() {
  exportStatement()
  toast.success('Statement export downloaded successfully!')
}
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

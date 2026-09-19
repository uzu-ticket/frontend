<template>
  <div class="finance-page">
    <TransactionDetailStep
      v-if="currentTx"
      :transaction="currentTx"
      @back="router.push('/finance')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TransactionDetailStep from '~/components/finance/TransactionDetailStep.vue'
import { useFinance } from '~/composables/useFinance'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Transaction Details — Uzu Ticket',
})

const route = useRoute()
const router = useRouter()
const { transactions, selectedTransaction } = useFinance()

const currentTx = computed(() => {
  const paramId = route.params.id as string
  if (selectedTransaction.value && selectedTransaction.value.id === paramId) {
    return selectedTransaction.value
  }
  return transactions.value.find((t) => t.id === paramId) || selectedTransaction.value || transactions.value[0]
})
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

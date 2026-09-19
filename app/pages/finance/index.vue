<template>
  <div class="finance-page">
    <FinanceOverview
      :formatted-balance="formattedBalance"
      :formatted-total-earned="formattedTotalEarned"
      :formatted-pending-settlement="formattedPendingSettlement"
      :is-balance-hidden="isBalanceHidden"
      :transactions="transactions"
      @withdraw="router.push('/finance/withdraw')"
      @export="router.push('/finance/export')"
      @toggle-balance="toggleBalanceVisibility"
      @select-transaction="handleSelectTransaction"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import FinanceOverview from '~/components/finance/FinanceOverview.vue'
import { useFinance, type FinanceTransaction } from '~/composables/useFinance'
import { useOrgState } from '~/composables/useOrgState'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Finance / Wallet — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage your event revenue, wallet balance, withdrawals, and settlement activity.' },
  ],
})

const router = useRouter()
const { activeOrgId } = useOrgState()

const {
  formattedBalance,
  formattedTotalEarned,
  formattedPendingSettlement,
  isBalanceHidden,
  toggleBalanceVisibility,
  transactions,
  selectTx,
  fetchWallet,
  fetchTransactions,
} = useFinance()

function handleSelectTransaction(tx: FinanceTransaction) {
  selectTx(tx)
  router.push(`/finance/transactions/${tx.id}`)
}

onMounted(() => {
  fetchWallet()
  fetchTransactions()
})

watch(activeOrgId, () => {
  fetchWallet()
  fetchTransactions()
})
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

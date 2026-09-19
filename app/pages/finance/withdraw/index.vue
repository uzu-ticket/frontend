<template>
  <div class="finance-page">
    <WithdrawalForm
      :formatted-balance="formattedBalance"
      :raw-balance="walletBalance"
      @back="router.push('/finance')"
      @continue="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import WithdrawalForm from '~/components/finance/WithdrawalForm.vue'
import { useFinance } from '~/composables/useFinance'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Request Withdrawal — Uzu Ticket',
})

const router = useRouter()
const { walletBalance, formattedBalance } = useFinance()

function handleFormSubmit(data: any) {
  router.push('/finance/withdraw/confirm')
}
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

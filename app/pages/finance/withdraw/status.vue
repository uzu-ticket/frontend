<template>
  <div class="finance-page">
    <WithdrawalStatusStep
      :withdrawal="activeWithdrawal"
      @back="router.push('/finance')"
      @complete="router.push('/finance/withdraw/success')"
    />
  </div>
</template>

<script setup lang="ts">
import WithdrawalStatusStep from '~/components/finance/WithdrawalStatusStep.vue'
import { useFinance } from '~/composables/useFinance'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Withdrawal Status — Uzu Ticket',
})

const router = useRouter()
const { activeWithdrawal } = useFinance()
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

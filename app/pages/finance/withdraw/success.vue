<template>
  <div class="finance-page">
    <WithdrawalSuccessStep
      @back="router.push('/finance')"
      @view-details="router.push('/finance/withdraw/status')"
    />
  </div>
</template>

<script setup lang="ts">
import WithdrawalSuccessStep from '~/components/finance/WithdrawalSuccessStep.vue'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Withdrawal Successful — Uzu Ticket',
})

const router = useRouter()
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

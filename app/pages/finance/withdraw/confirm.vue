<template>
  <div class="finance-page">
    <WithdrawalOtpStep
      @back="router.push('/finance/withdraw')"
      @verify="handleOtpVerify"
    />
  </div>
</template>

<script setup lang="ts">
import WithdrawalOtpStep from '~/components/finance/WithdrawalOtpStep.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Confirm Identity — Uzu Ticket',
})

const router = useRouter()
const toast = useToast()

function handleOtpVerify(code: string) {
  toast.success('Identity verified! Withdrawal initiated successfully.')
  router.push('/finance/withdraw/status')
}
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

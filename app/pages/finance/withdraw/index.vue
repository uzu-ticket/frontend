<template>
  <div class="finance-page">
    <WithdrawalForm
      :formatted-balance="formattedBalance"
      :raw-balance="walletBalance"
      :is-submitting="isSubmitting"
      @back="router.push('/finance')"
      @continue="handleFormSubmit"
      @validation-error="showError"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import WithdrawalForm from "~/components/finance/WithdrawalForm.vue";
import { useFinance } from "~/composables/useFinance";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Request Withdrawal — Uzu Ticket",
});

const router = useRouter();
const { walletBalance, formattedBalance, requestWithdrawal, fetchWallet } =
  useFinance();
const { error: showToastError } = useToast();
const isSubmitting = ref(false);

onMounted(fetchWallet);

function showError(message: string) {
  showToastError("Withdrawal cannot continue", message);
}

async function handleFormSubmit(data: {
  amount: number;
  twoFactorCode: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}) {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const withdrawal = await requestWithdrawal(data);
    const finance = useState("finance:active-withdrawal");
    finance.value = withdrawal;
    router.push("/finance/withdraw/status");
  } catch (error) {
    showToastError(
      "Withdrawal failed",
      error instanceof Error ? error.message : "Unable to request withdrawal",
    );
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.finance-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}
</style>

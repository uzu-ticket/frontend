<template>
  <div class="create-org-page">
    <!-- Success State — no card wrapper -->
    <CreateOrgSuccess v-if="isSuccess" :org-url="orgUrl" />

    <!-- Wizard Card -->
    <div v-else class="create-org-card">
      <!-- Card Top Header -->
      <div class="card-header">
        <h2 class="card-title">Create Organization</h2>
        <span class="step-indicator">Step {{ currentStep }} of {{ totalSteps }}</span>
      </div>

      <!-- Reusable Progress Stepper -->
      <AppStepper :total-steps="totalSteps" :current-step="currentStep" />

      <!-- Step Forms -->
      <CreateOrgStep1 v-if="currentStep === 1" @next="handleStep1" />
      <CreateOrgStep2 v-else-if="currentStep === 2" @back="currentStep--" @next="handleStep2" />
      <CreateOrgStep3 v-else-if="currentStep === 3" @back="currentStep--" @skip="currentStep++" @next="handleStep3" />
      <CreateOrgStep4 v-else-if="currentStep === 4" @back="currentStep--" @submit="handleStep4" :is-submitting="isSubmitting" :submit-error="submitError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppStepper from '~/components/ui/AppStepper.vue'
import CreateOrgStep1 from '~/components/organizations/CreateOrgStep1.vue'
import CreateOrgStep2 from '~/components/organizations/CreateOrgStep2.vue'
import CreateOrgStep3 from '~/components/organizations/CreateOrgStep3.vue'
import CreateOrgStep4 from '~/components/organizations/CreateOrgStep4.vue'
import CreateOrgSuccess from '~/components/organizations/CreateOrgSuccess.vue'
import { useOrgState } from '~/composables/useOrgState'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

const currentStep = ref(1)
const totalSteps = ref(4)
const isSuccess = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')
const orgUrl = ref('')

const orgData = ref<Record<string, unknown>>({})
const { setActiveOrg } = useOrgState()
const { instance } = useApi()
const toast = useToast()

const bankCodeMap: Record<string, string> = {
  access: '044',
  gtb: '058',
  zenith: '057',
  uba: '033',
  first: '011',
  sterling: '232',
  kuda: '000001',
  opay: '000002',
}

function handleStep1(data: unknown) {
  orgData.value.step1 = data
  currentStep.value = 2
}

function handleStep2(data: unknown) {
  orgData.value.step2 = data
  currentStep.value = 3
}

function handleStep3(data: unknown) {
  orgData.value.step3 = data
  currentStep.value = 4
}

async function handleStep4(data: unknown) {
  orgData.value.step4 = data
  isSubmitting.value = true
  submitError.value = ''

  const step1 = orgData.value.step1 as
    | { name?: string; email?: string; phone?: string; description?: string; slug?: string }
    | undefined
  const step4 = data as
    | {
        bankName?: string
        accountNumber?: string
        accountName?: string
        cacNumber?: string
        registeredBusinessName?: string
      }
    | undefined

  try {
    const createRes = await instance.post('/organisations', {
      name: step1?.name,
      contactEmail: step1?.email,
      contactPhone: step1?.phone,
      description: step1?.description ? String(step1.description) : undefined,
    })

    const org = createRes.data as { id: string; slug?: string; name?: string }
    const orgId = org.id

    if (
      step4 &&
      step4.bankName &&
      step4.accountNumber &&
      step4.accountName &&
      step4.cacNumber
    ) {
      await instance.post(`/organisations/${orgId}/kyb`, {
        cacNumber: step4.cacNumber,
        settlementBankCode: bankCodeMap[step4.bankName] ?? step4.bankName,
        settlementAccountNumber: step4.accountNumber,
        settlementAccountName: step4.accountName,
      })
    }

    setActiveOrg({ id: orgId, name: step1?.name ?? '' })
    orgUrl.value = step1?.slug
      ? `https://${step1.slug}.uzuticet.com`
      : `https://${org.slug}.uzuticet.com`

    isSuccess.value = true
    toast.show({
      title: 'Organization Created',
      message: `${step1?.name ?? 'Organization'} was created successfully.`,
      type: 'success',
    })
  } catch (e: unknown) {
    const errMsg =
      (e as { response?: { data?: { message?: string | string[] } } }).response?.data?.message ??
      (e as { message?: string })?.message ??
      'Failed to create organization. Please try again.'
    submitError.value = Array.isArray(errMsg) ? errMsg.join(', ') : errMsg
    toast.show({
      title: 'Failed to Create Organization',
      message: submitError.value,
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-org-page {
  width: 100%;
}

.create-org-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
  letter-spacing: -0.01em;
}

.step-indicator {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6b7280;
}
</style>

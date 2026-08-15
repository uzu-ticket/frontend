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
      <CreateOrgStep4 v-else-if="currentStep === 4" @back="currentStep--" @submit="handleStep4" />
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

definePageMeta({
  layout: 'dashboard',
})

const currentStep = ref(1)
const totalSteps = ref(4)
const isSuccess = ref(false)
const orgUrl = ref('https://zeenom-event.uzuticet.com')

const orgData = ref<Record<string, unknown>>({})

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

function handleStep4(data: unknown) {
  orgData.value.step4 = data
  isSuccess.value = true
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

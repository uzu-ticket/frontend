<template>
  <div class="create-event-page">
    <!-- MAIN LAYOUT -->
    <div :class="{ 'create-event-layout': !isLive, 'live-layout': isLive }">
      <!-- Left Column: Vertical Stepper (contains single Back to events link & auto-save badge) -->
      <aside v-if="!isLive" class="stepper-col">
        <EventVerticalStepper :current-step="currentStep" />
      </aside>

      <!-- Right Column / Main Form Card -->
      <main class="form-card-col">
        <div class="create-event-card">
          <!-- SUCCESS STATE: YOUR EVENT IS LIVE! -->
          <EventSuccessCard v-if="isLive" />

          <!-- STEP 1: Basic Information -->
          <CreateEventStep1
            v-else-if="currentStep === 1"
            @cancel="handleCancel"
            @next="handleStep1Next"
          />

          <!-- STEP 2: Venue & Schedule -->
          <CreateEventStep2
            v-else-if="currentStep === 2"
            @back="currentStep = 1"
            @next="handleStep2Next"
          />

          <!-- STEP 3: Tickets -->
          <CreateEventStep3
            v-else-if="currentStep === 3"
            @back="currentStep = 2"
            @next="handleStep3Next"
          />

          <!-- STEP 4: Sales Settings -->
          <CreateEventStep4
            v-else-if="currentStep === 4"
            @back="currentStep = 3"
            @next="handleStep4Next"
          />

          <!-- STEP 5: Preview & Publish -->
          <CreateEventStep5
            v-else-if="currentStep === 5"
            @back="currentStep = 4"
            @save-draft="handleSaveDraft"
            @publish="handlePublish"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import EventVerticalStepper from '~/components/events/EventVerticalStepper.vue'
import CreateEventStep1 from '~/components/events/CreateEventStep1.vue'
import CreateEventStep2 from '~/components/events/CreateEventStep2.vue'
import CreateEventStep3 from '~/components/events/CreateEventStep3.vue'
import CreateEventStep4 from '~/components/events/CreateEventStep4.vue'
import CreateEventStep5 from '~/components/events/CreateEventStep5.vue'
import EventSuccessCard from '~/components/events/EventSuccessCard.vue'

definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()
const currentStep = ref(1)
const isLive = ref(false)
const eventData = ref<Record<string, unknown>>({})

const hideSidebarState = useState<boolean>('hide-app-sidebar', () => false)

// Hide AppSidebar during steps 1-5; show it when event goes live
function updateSidebarVisibility() {
  hideSidebarState.value = !isLive.value
}

onMounted(() => {
  updateSidebarVisibility()
})

watch(isLive, () => {
  updateSidebarVisibility()
})

onUnmounted(() => {
  hideSidebarState.value = false
})

function handleCancel() {
  router.push('/events')
}

function handleStep1Next(data: unknown) {
  eventData.value.step1 = data
  currentStep.value = 2
}

function handleStep2Next(data: unknown) {
  eventData.value.step2 = data
  currentStep.value = 3
}

function handleStep3Next() {
  currentStep.value = 4
}

function handleStep4Next(data: unknown) {
  eventData.value.step4 = data
  currentStep.value = 5
}

function handleSaveDraft() {
  router.push('/events')
}

function handlePublish() {
  isLive.value = true
}

useHead({
  title: 'Create Event — Uzu Ticket',
})
</script>

<style scoped>
.create-event-page {
  width: 100%;
}

.create-event-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.live-layout {
  width: 100%;
}

/* Stepper Column */
.stepper-col {
  position: sticky;
  top: 1.5rem;
}

/* Form Card Column */
.form-card-col {
  min-width: 0;
}

.create-event-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

@media (max-width: 900px) {
  .create-event-layout {
    grid-template-columns: 1fr;
  }

  .stepper-col {
    position: static;
  }
}
</style>

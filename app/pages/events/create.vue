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
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import EventVerticalStepper from '~/components/events/EventVerticalStepper.vue'
import CreateEventStep1 from '~/components/events/CreateEventStep1.vue'
import CreateEventStep2 from '~/components/events/CreateEventStep2.vue'
import CreateEventStep3 from '~/components/events/CreateEventStep3.vue'
import CreateEventStep4 from '~/components/events/CreateEventStep4.vue'
import CreateEventStep5 from '~/components/events/CreateEventStep5.vue'
import EventSuccessCard from '~/components/events/EventSuccessCard.vue'
import { useEvents } from '~/composables/useEvents'
import { useToast } from '~/composables/useToast'
import type { Event, CreateEventDto, EventCategory } from '~/types/event'

definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()
const toast = useToast()
const { fetchCategories, createEvent, publishEvent, error } = useEvents()

const currentStep = ref(1)
const isLive = ref(false)
const eventData = ref<Record<string, unknown>>({})
const createdEventId = ref<string | null>(null)
const categories = ref<EventCategory[]>([])
const isSubmitting = ref(false)

const hideSidebarState = useState<boolean>('hide-app-sidebar', () => false)

function updateSidebarVisibility() {
  hideSidebarState.value = !isLive.value
}

onMounted(async () => {
  updateSidebarVisibility()
  categories.value = await fetchCategories()
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

function resolveCategoryId(categoryName: string): string | undefined {
  return categories.value.find(c => c.name === categoryName)?.id
}

function buildCreateDto(): CreateEventDto {
  const s1 = eventData.value.step1 as Record<string, unknown>
  const s2 = eventData.value.step2 as Record<string, unknown>
  const s4 = eventData.value.step4 as Record<string, unknown>

  const startsAtDate = new Date(s2.startDate as string)
  startsAtDate.setHours(
    parseInt((s2.startTime as string).split(':')[0]) || 0,
    parseInt((s2.startTime as string).split(':')[1]) || 0,
  )

  let endsAt: string | undefined
  if (s2.endDate) {
    const endsAtDate = new Date(s2.endDate as string)
    endsAtDate.setHours(
      parseInt((s2.endTime as string).split(':')[0]) || 0,
      parseInt((s2.endTime as string).split(':')[1]) || 0,
    )
    endsAt = endsAtDate.toISOString()
  }

  return {
    title: s1.eventName as string,
    description: s1.description as string,
    categoryId: resolveCategoryId(s1.category as string),
    visibility: s1.visibility as Event['visibility'],
    venueName: s2.venueName as string,
    venueAddress: s2.address as string,
    city: s2.city as string,
    startsAt: startsAtDate.toISOString(),
    endsAt,
    salesCloseAt: computeSalesCloseAt(startsAtDate, s4),
  }
}

function computeSalesCloseAt(startsAt: Date, s4: Record<string, unknown>): string {
  const closeOption = (s4.salesClose as string) || '1h'
  let hoursBefore = 1
  if (closeOption === '3h') hoursBefore = 3
  else if (closeOption === '6h') hoursBefore = 6
  else if (closeOption === 'custom' && s4.customCloseDate && s4.customCloseTime) {
    return new Date(s4.customCloseDate as string).toISOString().split('T')[0] + 'T' + s4.customCloseTime
  }

  const salesCloseAt = new Date(startsAt.getTime() - hoursBefore * 60 * 60 * 1000)
  return salesCloseAt.toISOString()
}

async function handleSaveDraft() {
  isSubmitting.value = true
  try {
    const dto = buildCreateDto()
    await createEvent(dto)
    toast.show({
      title: 'Draft Saved',
      message: 'Your event draft has been saved successfully.',
      type: 'success',
    })
    router.push('/events')
  } catch {
    toast.show({
      title: 'Failed to Save Draft',
      message: error.value || 'Could not save the event draft. Please try again.',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

async function handlePublish() {
  isSubmitting.value = true
  try {
    const dto = buildCreateDto()
    const created = await createEvent(dto)
    createdEventId.value = created.id
    await publishEvent(created.id)
    isLive.value = true
    toast.show({
      title: 'Event Published!',
      message: `${created.title} is now live and accepting tickets.`,
      type: 'success',
    })
  } catch {
    toast.show({
      title: 'Failed to Publish',
      message: error.value || 'Could not publish the event. Please try again.',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
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

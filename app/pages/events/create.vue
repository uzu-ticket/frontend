<template>
  <div class="create-event-page">
    <!-- MAIN LAYOUT -->
    <div :class="{ 'create-event-layout': !isLive, 'live-layout': isLive }">
      <!-- Left Column: Vertical Stepper (contains single Back to events link & auto-save badge) -->
      <aside v-if="!isLive" class="stepper-col">
        <EventVerticalStepper
          :current-step="currentStep"
          @select-step="(s) => (currentStep = s)"
        />
      </aside>

      <!-- Right Column / Main Form Card -->
      <main class="form-card-col">
        <div class="create-event-card">
          <!-- SUCCESS STATE: YOUR EVENT IS LIVE! -->
          <EventSuccessCard v-if="isLive" :event-id="createdEventId" />

          <!-- STEP FLOW WITH KEEPALIVE -->
          <KeepAlive v-else>
            <component
              :is="activeStepComponent"
              :key="currentStep"
              :event-data="eventData"
              :initial-data="
                currentStep === 1
                  ? eventData.step1
                  : currentStep === 2
                    ? eventData.step2
                    : currentStep === 4
                      ? eventData.step4
                      : undefined
              "
              @cancel="handleCancel"
              @back="currentStep--"
              @next="handleStepNext"
              @save-draft="handleSaveDraft"
              @publish="handlePublish"
            />
          </KeepAlive>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import EventVerticalStepper from "~/components/events/EventVerticalStepper.vue";
import CreateEventStep1 from "~/components/events/CreateEventStep1.vue";
import CreateEventStep2 from "~/components/events/CreateEventStep2.vue";
import CreateEventStep3 from "~/components/events/CreateEventStep3.vue";
import CreateEventStep4 from "~/components/events/CreateEventStep4.vue";
import CreateEventStep5 from "~/components/events/CreateEventStep5.vue";
import EventSuccessCard from "~/components/events/EventSuccessCard.vue";
import { useEvents } from "~/composables/useEvents";
import { useToast } from "~/composables/useToast";
import type { Event, CreateEventDto, EventCategory } from "~/types/event";

definePageMeta({
  layout: "dashboard",
});

const router = useRouter();
const route = useRoute();
const toast = useToast();
const {
  fetchCategories,
  fetchEvent,
  createEvent,
  publishEvent,
  createTicketType,
  uploadEventImage,
  error,
} = useEvents();

const currentStep = ref(1);
const isLive = ref(false);
const eventData = ref<Record<string, unknown>>({});
const createdEventId = ref<string | null>(null);
const categories = ref<EventCategory[]>([]);
const isSubmitting = ref(false);
const editEventId = computed(() => {
  const value = route.query.eventId;
  return typeof value === "string" ? value : null;
});

const hideSidebarState = useState<boolean>("hide-app-sidebar", () => false);

function updateSidebarVisibility() {
  hideSidebarState.value = !isLive.value;
}

onMounted(async () => {
  updateSidebarVisibility();
  categories.value = await fetchCategories();

  if (editEventId.value) {
    try {
      const existing = await fetchEvent(editEventId.value);
      hydrateEvent(existing);
    } catch {
      toast.show({
        title: "Failed to Load Event",
        message: error.value || "Could not load the event for editing.",
        type: "error",
      });
    }
  }
});

watch(isLive, () => {
  updateSidebarVisibility();
});

onUnmounted(() => {
  hideSidebarState.value = false;
});

function handleCancel() {
  router.push("/events");
}

function formatTimeValue(value: string): string {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function hydrateEvent(existing: Event) {
  const start = new Date(existing.startsAt);
  const end = existing.endsAt ? new Date(existing.endsAt) : null;

  eventData.value = {
    step1: {
      eventName: existing.title,
      category: existing.category?.name || "",
      description: existing.description || "",
      eventSlot: existing.eventSlot || "multiple",
      visibility: existing.visibility,
      eventType: existing.isPaid ? "paid" : "free",
      coverImage: null,
      slots: Array.isArray(existing.slots) ? existing.slots : [],
    },
    step2: {
      venueName: existing.venueName || "",
      address: existing.venueAddress || "",
      city: existing.city || "",
      state: existing.state || "",
      country: existing.country || "Nigeria",
      startDate: start,
      startTime: formatTimeValue(existing.startsAt),
      endDate: end,
      endTime: end ? formatTimeValue(existing.endsAt as string) : "",
    },
    step3: existing.ticketTypes,
    step4: {
      salesClose: "1h",
      customCloseDate: null,
      customCloseTime: "",
      reminders: ["24h", "1h"],
    },
  };
}

const stepComponents = [
  CreateEventStep1,
  CreateEventStep2,
  CreateEventStep3,
  CreateEventStep4,
  CreateEventStep5,
];
const activeStepComponent = computed(
  () => stepComponents[currentStep.value - 1],
);

function handleStepNext(data: unknown) {
  if (currentStep.value === 1) handleStep1Next(data);
  else if (currentStep.value === 2) handleStep2Next(data);
  else if (currentStep.value === 3) handleStep3Next(data);
  else if (currentStep.value === 4) handleStep4Next(data);
}

function handleStep1Next(data: unknown) {
  eventData.value.step1 = data;
  currentStep.value = 2;
}

function handleStep2Next(data: unknown) {
  eventData.value.step2 = data;
  currentStep.value = 3;
}

function handleStep3Next(data?: unknown) {
  if (data) eventData.value.step3 = data;
  currentStep.value = 4;
}

function handleStep4Next(data: unknown) {
  eventData.value.step4 = data;
  currentStep.value = 5;
}

function resolveCategoryId(categoryName: string): string | undefined {
  return categories.value.find((c) => c.name === categoryName)?.id;
}

function buildCreateDto(): CreateEventDto {
  const s1 = eventData.value.step1 as Record<string, unknown>;
  const s2 = eventData.value.step2 as Record<string, unknown>;
  const s4 = eventData.value.step4 as Record<string, unknown>;

  const startsAtDate = new Date(s2.startDate as string);
  startsAtDate.setHours(
    parseInt((s2.startTime as string).split(":")[0]) || 0,
    parseInt((s2.startTime as string).split(":")[1]) || 0,
  );

  let endsAt: string | undefined;
  if (s2.endDate) {
    const endsAtDate = new Date(s2.endDate as string);
    endsAtDate.setHours(
      parseInt((s2.endTime as string).split(":")[0]) || 0,
      parseInt((s2.endTime as string).split(":")[1]) || 0,
    );
    endsAt = endsAtDate.toISOString();
  }

  return {
    title: s1.eventName as string,
    description: s1.description as string,
    categoryId: resolveCategoryId(s1.category as string),
    visibility: "public" as Event["visibility"],
    venueName: s2.venueName as string,
    venueAddress: s2.address as string,
    country: s2.country as string,
    state: s2.state as string,
    city: s2.city as string,
    eventSlot: s1.eventSlot as string,
    slots: s1.slots as unknown[],
    startsAt: startsAtDate.toISOString(),
    endsAt,
    salesCloseAt: computeSalesCloseAt(startsAtDate, s4),
  };
}

function computeSalesCloseAt(
  startsAt: Date,
  s4: Record<string, unknown>,
): string {
  const closeOption = (s4.salesClose as string) || "1h";
  let hoursBefore = 1;
  if (closeOption === "3h") hoursBefore = 3;
  else if (closeOption === "6h") hoursBefore = 6;
  else if (
    closeOption === "custom" &&
    s4.customCloseDate &&
    s4.customCloseTime
  ) {
    return (
      new Date(s4.customCloseDate as string).toISOString().split("T")[0] +
      "T" +
      s4.customCloseTime
    );
  }

  const salesCloseAt = new Date(
    startsAt.getTime() - hoursBefore * 60 * 60 * 1000,
  );
  return salesCloseAt.toISOString();
}

function buildTicketDateTime(date: unknown, time: unknown): string | undefined {
  if (!(date instanceof Date) || !date || typeof time !== "string")
    return undefined;

  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return undefined;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result.toISOString();
}

async function createTicketsForEvent(eventId: string) {
  const step3Tickets =
    (eventData.value.step3 as Array<Record<string, unknown>>) || [];
  for (const t of step3Tickets) {
    const rawPrice = String(t.price || "0").replace(/[^0-9.]/g, "");
    const priceAmount = parseFloat(rawPrice) || 0;
    const priceMinor = Math.round(priceAmount * 100);

    const dto: CreateTicketTypeDto = {
      name: (t.type as string) || "General Admission",
      priceMinor,
      quantityTotal:
        parseInt(String(t.quantity || "0").replace(/,/g, ""), 10) || 100,
      perOrderLimit:
        parseInt(String(t.maxPerOrder || "0").replace(/,/g, ""), 10) || 10,
      saleStartsAt: buildTicketDateTime(t.startDateObj, t.startTimeStr),
      saleEndsAt: buildTicketDateTime(t.endDateObj, t.endTimeStr),
    };

    try {
      await createTicketType(eventId, dto);
    } catch (e) {
      console.warn("Could not create ticket type:", e);
    }
  }
}

async function handleSaveDraft() {
  isSubmitting.value = true;
  try {
    const dto = buildCreateDto();
    const created = await createEvent(dto);
    const coverFile = (
      eventData.value.step1 as Record<string, unknown> | undefined
    )?.coverImage as File | undefined;
    if (coverFile) {
      await uploadEventImage(created.id, coverFile);
    }
    await createTicketsForEvent(created.id);
    toast.show({
      title: "Draft Saved",
      message: "Your event draft has been saved successfully.",
      type: "success",
    });
    router.push("/events");
  } catch {
    toast.show({
      title: "Failed to Save Draft",
      message:
        error.value || "Could not save the event draft. Please try again.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

async function handlePublish() {
  isSubmitting.value = true;
  try {
    const dto = buildCreateDto();
    const created = await createEvent(dto);
    createdEventId.value = created.id;
    const coverFile = (
      eventData.value.step1 as Record<string, unknown> | undefined
    )?.coverImage as File | undefined;
    if (coverFile) {
      await uploadEventImage(created.id, coverFile);
    }
    await createTicketsForEvent(created.id);
    await publishEvent(created.id);
    isLive.value = true;
    toast.show({
      title: "Event Published!",
      message: `${created.title} is now live and accepting tickets.`,
      type: "success",
    });
  } catch {
    toast.show({
      title: "Failed to Publish",
      message: error.value || "Could not publish the event. Please try again.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

useHead({
  title: "Create Event — Uzu Ticket",
});
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

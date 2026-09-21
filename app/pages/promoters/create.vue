<template>
  <div class="create-promoter-page">
    <AppPageSkeleton v-if="isLoading" layout="event" :show-header="false" />

    <!-- Main Unified Card -->
    <div v-else class="main-card">
      <h1 class="card-title">Create Promoter Link</h1>

      <form class="create-form" @submit.prevent="handleSubmit">
        <!-- Select Event -->
        <div class="form-group">
          <label class="form-label">Select Event</label>
          <AppSelect
            v-model="selectedEvent"
            :options="eventOptions"
            placeholder="Select an event"
            searchable
            :disabled="eventOptions.length === 0"
          />
          <p v-if="eventOptions.length === 0" class="field-hint">
            No events are available for this organisation.
          </p>
        </div>

        <!-- Commission Type -->
        <div class="form-group">
          <label class="form-label">Commission Type</label>
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                v-model="commissionType"
                value="percentage"
                class="radio-input"
              />
              <span
                class="custom-radio"
                :class="{
                  'custom-radio--active': commissionType === 'percentage',
                }"
              >
                <span
                  v-if="commissionType === 'percentage'"
                  class="radio-dot"
                />
              </span>
              <span class="radio-label">Percentage</span>
            </label>

            <label class="radio-item">
              <input
                type="radio"
                v-model="commissionType"
                value="fixed"
                class="radio-input"
              />
              <span
                class="custom-radio"
                :class="{ 'custom-radio--active': commissionType === 'fixed' }"
              >
                <span v-if="commissionType === 'fixed'" class="radio-dot" />
              </span>
              <span class="radio-label">Fixed Amount</span>
            </label>
          </div>
        </div>

        <!-- Rate / Value Input -->
        <div class="form-group">
          <label class="form-label">Commission Value</label>
          <div class="input-with-suffix">
            <input
              v-model="commissionValue"
              type="text"
              class="form-input"
              placeholder="10"
            />
            <span class="input-suffix">{{
              commissionType === "percentage" ? "%" : "NGN"
            }}</span>
          </div>
        </div>

        <!-- Link Expires -->
        <div class="form-group">
          <label class="form-label">Link Expires (Optional)</label>
          <AppSelect
            v-model="expiration"
            :options="expirationOptions"
            placeholder="Select expiration"
          />
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="handleCancel">
            Cancel
          </button>
          <button type="submit" class="btn-submit">+ Create Link</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppPageSkeleton from "~/components/ui/AppPageSkeleton.vue";
import AppSelect, { type SelectOption } from "~/components/ui/AppSelect.vue";
import { useEvents } from "~/composables/useEvents";
import { useOrgState } from "~/composables/useOrgState";
import { usePromoters } from "~/composables/usePromoters";
import { useToast } from "~/composables/useToast";
import type { Event } from "~/types/event";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Create Promoter Link — Uzu Ticket",
  meta: [{ name: "description", content: "Create a new promoter link" }],
});

const router = useRouter();
const toast = useToast();
const { activeOrgId } = useOrgState();
const { fetchEvents } = useEvents();
const { createPromoterLink } = usePromoters();

const isLoading = ref(true);
const isSubmitting = ref(false);
const events = ref<Event[]>([]);

const selectedEvent = ref<string | null>(null);
const commissionType = ref<"percentage" | "fixed">("percentage");
const commissionValue = ref("10");
const expiration = ref("never");

const eventOptions = computed<SelectOption[]>(() =>
  events.value.map((event) => ({
    value: event.id,
    label: event.title,
    subLabel: `${event.status.replaceAll("_", " ")} • ${new Date(event.startsAt).toLocaleDateString("en-GB")}`,
  })),
);

const expirationOptions: SelectOption[] = [
  { value: "never", label: "Never expires" },
  { value: "7days", label: "In 7 days" },
  { value: "30days", label: "In 30 days" },
  { value: "event-end", label: "When event ends" },
];

async function loadEvents() {
  if (!activeOrgId.value) {
    events.value = [];
    selectedEvent.value = null;
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const fetchedEvents = await fetchEvents(true);
    events.value = fetchedEvents.filter(
      (event) => event.status !== "cancelled",
    );
    if (!events.value.some((event) => event.id === selectedEvent.value)) {
      selectedEvent.value = events.value[0]?.id ?? null;
    }
  } catch (error) {
    console.error("Failed to load promoter events", error);
    events.value = [];
    selectedEvent.value = null;
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadEvents);
watch(activeOrgId, loadEvents);

function handleCancel() {
  router.push("/promoters");
}

async function handleSubmit() {
  if (!selectedEvent.value) {
    toast.show({
      title: "Select an Event",
      message: "Please select an event to create a promoter link",
      type: "error",
    });
    return;
  }

  const parsedVal = parseFloat(commissionValue.value);
  if (isNaN(parsedVal) || parsedVal <= 0) {
    toast.show({
      title: "Invalid Commission",
      message: "Enter a valid commission value greater than zero",
      type: "error",
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const linkData = await createPromoterLink({
      eventId: selectedEvent.value,
      commissionType: commissionType.value,
      commissionValue: parsedVal,
      expiration: expiration.value,
    });

    toast.show({
      title: "Promoter Link Created!",
      message: "Your link is ready to share.",
      type: "success",
    });

    router.push(`/promoters/link-ready?id=${linkData.id}`);
  } catch (e: any) {
    toast.show({
      title: "Failed to Create Link",
      message: e?.response?.data?.message || e.message || "An error occurred",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.create-promoter-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Demo Nav */
.demo-nav-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.demo-nav-link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.15s ease;
}

.demo-nav-link:hover {
  border-color: #3fd246;
  color: #16a34a;
}

.demo-nav-link--active {
  background: #3fd246;
  border-color: #3fd246;
  color: #ffffff;
}

/* Main Unified Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0e2615;
}

/* Select wrapper */
.select-wrapper {
  position: relative;
  width: 100%;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: "Outfit", sans-serif;
  color: #374151;
  background: #ffffff;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.form-select:focus {
  border-color: #3fd246;
}

.select-chevron {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
  pointer-events: none;
}

/* Radio Group */
.radio-group {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
}

.radio-input {
  display: none;
}

.custom-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s ease;
  background: #fff;
}

.custom-radio--active {
  border-color: #3fd246;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3fd246;
}

.radio-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

/* Input with suffix */
.input-with-suffix {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  font-size: 0.875rem;
  font-family: "Outfit", sans-serif;
  color: #374151;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3fd246;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  pointer-events: none;
}

/* Actions */
.form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.65rem;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-cancel:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.btn-submit {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.65rem;
  border: none;
  background: #3fd246;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-submit:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.25);
}
</style>

<template>
  <form class="slots-form" @submit.prevent="handleSubmit">
    <div class="slots-content">
      <div class="slots-heading-row">
        <div>
          <h3 class="slots-title">Set Your Event Schedule</h3>
          <p class="slots-subtitle">
            Add the different schedules or time slots for your event.
          </p>
        </div>
        <button
          v-if="eventSlot === 'multiple'"
          type="button"
          class="btn-add-schedule"
          @click="addSlot"
        >
          <span>Add Schedule</span>
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div v-if="eventSlot === 'multiple'" class="slots-stack">
        <div v-for="(slot, index) in slots" :key="index" class="slot-card">
          <div class="slot-card-heading">
            <input
              v-if="editingIndex === index"
              v-model="slot.name"
              class="slot-name-input"
              :aria-label="`Schedule ${index + 1} name`"
              @blur="editingIndex = null"
              @keydown.enter.prevent="editingIndex = null"
            />
            <h4 v-else class="slot-name">{{ slot.name }}</h4>
            <div class="slot-actions">
              <button
                type="button"
                class="btn-slot-action"
                :aria-label="`Edit ${slot.name}`"
                title="Edit schedule name"
                @click="editingIndex = index"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                type="button"
                class="btn-slot-action btn-slot-delete"
                :aria-label="`Delete ${slot.name}`"
                title="Delete schedule"
                @click="requestDelete(index)"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2m3 0-1 14H6L5 6" />
                  <path d="M10 11v5m4-5v5" />
                </svg>
              </button>
            </div>
          </div>

          <div class="slot-inputs-row">
            <div class="slot-field">
              <label class="slot-field-label">Date</label>
              <DatePicker v-model="slot.dateObj" placeholder="Pick date" />
            </div>
            <div class="slot-field">
              <label class="slot-field-label">Start Time</label>
              <TimePicker v-model="slot.startTime" placeholder="Start time" />
            </div>
            <div class="slot-field">
              <label class="slot-field-label">End Time</label>
              <TimePicker v-model="slot.endTime" placeholder="End time" />
            </div>
          </div>
        </div>
      </div>
      <p v-else class="single-slot-note">
        This event has one ticket slot. You can continue to add the event venue
        and dates.
      </p>
    </div>

    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        Cancel
      </button>
      <button type="submit" class="btn-continue">
        <span>Save &amp; Continue</span>
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <AppModal
      v-model="deleteConfirmationOpen"
      title="Delete schedule?"
      size="sm"
      :close-on-backdrop="false"
      @close="dismissDelete"
    >
      <p class="delete-confirmation-copy">
        This will remove {{ pendingDeleteName }} and its scheduled time.
      </p>
      <template #footer>
        <div class="delete-confirmation-actions">
          <button
            type="button"
            class="btn-keep-schedule"
            @click="dismissDelete"
          >
            Keep Schedule
          </button>
          <button
            type="button"
            class="btn-confirm-delete"
            @click="confirmDelete"
          >
            Delete Schedule
          </button>
        </div>
      </template>
    </AppModal>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import AppModal from "~/components/AppModal.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import TimePicker from "~/components/ui/TimePicker.vue";

type EventSlot = {
  id?: string;
  name: string;
  dateObj: Date | null;
  startTime: string;
  endTime: string;
};

const props = withDefaults(
  defineProps<{
    initialData?: EventSlot[];
    eventSlot?: string;
  }>(),
  { eventSlot: "multiple" },
);

const emit = defineEmits<{
  back: [];
  next: [slots: EventSlot[]];
}>();

const slots = reactive<EventSlot[]>([]);
const editingIndex = ref<number | null>(null);
const deleteConfirmationOpen = ref(false);
const pendingDeleteIndex = ref<number | null>(null);
const pendingDeleteName = ref("");

function defaultSlots(): EventSlot[] {
  return [
    {
      name: "Schedule 1",
      dateObj: null,
      startTime: "09:00 AM",
      endTime: "11:00 AM",
    },
    {
      name: "Schedule 2",
      dateObj: null,
      startTime: "09:00 AM",
      endTime: "11:00 AM",
    },
  ];
}

function setSlots(value?: EventSlot[]) {
  const nextSlots = value?.length ? value : defaultSlots();
  slots.splice(
    0,
    slots.length,
    ...nextSlots.map((slot) => ({
      ...(slot.id ? { id: slot.id } : {}),
      name: slot.name,
      dateObj: slot.dateObj ? new Date(slot.dateObj) : null,
      startTime: slot.startTime || "09:00 AM",
      endTime: slot.endTime || "11:00 AM",
    })),
  );
}

watch(() => props.initialData, setSlots, { immediate: true, deep: true });

function requestDelete(index: number) {
  pendingDeleteIndex.value = index;
  pendingDeleteName.value = slots[index]?.name || "this schedule";
  deleteConfirmationOpen.value = true;
}

function dismissDelete() {
  deleteConfirmationOpen.value = false;
  pendingDeleteIndex.value = null;
}

function confirmDelete() {
  if (pendingDeleteIndex.value !== null) {
    slots.splice(pendingDeleteIndex.value, 1);
  }
  dismissDelete();
}

function addSlot() {
  slots.push({
    name: `Schedule ${slots.length + 1}`,
    dateObj: null,
    startTime: "09:00 AM",
    endTime: "11:00 AM",
  });
}

function handleSubmit() {
  emit(
    "next",
    props.eventSlot === "multiple" ? slots.map((slot) => ({ ...slot })) : [],
  );
}
</script>

<style scoped>
.slots-form {
  display: flex;
  min-height: max(38rem, calc(100vh - 13rem));
  flex-direction: column;
}

.slots-content {
  flex: 1;
}

.slots-heading-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.slots-title {
  margin: 0 0 0.25rem;
  color: #0e2615;
  font-size: 1rem;
  font-weight: 800;
}

.slots-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.825rem;
}

.btn-add-schedule,
.btn-continue {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: 0;
  border-radius: 0.6rem;
  background: #3fd246;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-add-schedule {
  padding: 0 0.9rem;
}

.slots-stack {
  display: flex;
  max-width: 42rem;
  flex-direction: column;
  gap: 0.5rem;
}

.slot-card {
  padding: 0.5rem 0.85rem 0.65rem;
  border: 1px solid #d5deeb;
  border-radius: 0.65rem;
  background: #fff;
}

.slot-card-heading {
  display: flex;
  min-height: 2rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
}

.slot-name {
  margin: 0;
  color: #0e2615;
  font-size: 0.875rem;
  font-weight: 700;
}

.slot-name-input {
  width: min(18rem, 70%);
  padding: 0.3rem 0.45rem;
  border: 1px solid #d5deeb;
  border-radius: 0.35rem;
  color: #0e2615;
  font: inherit;
}

.slot-name-input:focus {
  border-color: #3fd246;
  outline: 0;
  box-shadow: 0 0 0 1px #3fd246;
}

.slot-field :deep(.date-trigger--open),
.slot-field :deep(.time-trigger--open) {
  border-color: #3fd246;
  box-shadow: 0 0 0 1px #3fd246;
}

.slot-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-slot-action {
  display: grid;
  width: 1.85rem;
  height: 1.85rem;
  place-items: center;
  border: 1px solid #d5deeb;
  border-radius: 0.4rem;
  background: #fff;
  color: #0e2615;
  cursor: pointer;
}

.btn-slot-action svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.btn-slot-delete {
  color: #ef4444;
}

.slot-inputs-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.slot-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.35rem;
}

.slot-field-label {
  color: #596b60;
  font-size: 0.72rem;
}

.single-slot-note {
  max-width: 42rem;
  padding: 1rem;
  border: 1px solid #d5deeb;
  border-radius: 0.65rem;
  color: #596b60;
  font-size: 0.85rem;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn-back {
  min-width: 5rem;
  min-height: 2.5rem;
  padding: 0 1rem;
  border: 1px solid #d5deeb;
  border-radius: 0.6rem;
  background: #fff;
  color: #0e2615;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-continue {
  padding: 0 0.9rem;
}

.btn-continue svg {
  width: 1rem;
  height: 1rem;
}

.delete-confirmation-copy {
  margin: 0;
  color: #596b60;
  font-size: 0.9rem;
  line-height: 1.5;
}

.delete-confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
}

.btn-keep-schedule,
.btn-confirm-delete {
  min-height: 2.4rem;
  padding: 0 0.85rem;
  border: 1px solid #d5deeb;
  border-radius: 0.45rem;
  background: #fff;
  color: #0e2615;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-confirm-delete {
  border-color: #dc2626;
  background: #dc2626;
  color: #fff;
}

@media (max-width: 640px) {
  .slots-heading-row {
    align-items: stretch;
    flex-direction: column;
  }

  .btn-add-schedule {
    align-self: flex-start;
  }

  .slot-inputs-row {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }
}
</style>

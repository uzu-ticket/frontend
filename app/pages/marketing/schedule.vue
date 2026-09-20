<template>
  <div class="schedule-page">
    <div class="main-card">
      <!-- Step Header -->
      <div class="step-header">
        <h1 class="card-title">Choose When to Send</h1>
        <p class="card-subtitle">Send now or schedule for later.</p>
      </div>

      <!-- Send Options -->
      <div class="send-options">
        <div
          class="option-card"
          :class="{ 'option-card--active': sendOption === 'now' }"
          @click="sendOption = 'now'"
        >
          <div
            class="option-radio"
            :class="{ 'option-radio--active': sendOption === 'now' }"
          >
            <div v-if="sendOption === 'now'" class="radio-dot" />
          </div>
          <div class="option-text">
            <span class="option-title">Send Now</span>
            <span class="option-desc"
              >One ticket gives access to the event.</span
            >
          </div>
        </div>

        <div
          class="option-card"
          :class="{ 'option-card--active': sendOption === 'later' }"
          @click="sendOption = 'later'"
        >
          <div
            class="option-radio"
            :class="{ 'option-radio--active': sendOption === 'later' }"
          >
            <div v-if="sendOption === 'later'" class="radio-dot" />
          </div>
          <div class="option-text">
            <span class="option-title">Schedule For Later</span>
            <span class="option-desc"
              >Divide your event into multiple sessions or time slots.</span
            >
          </div>
        </div>
      </div>

      <!-- Schedule Date & Time (shown when Schedule For Later is selected) -->
      <Transition name="expand">
        <div v-if="sendOption === 'later'" class="schedule-section">
          <div
            class="schedule-section-header"
            @click="scheduleOpen = !scheduleOpen"
          >
            <span class="schedule-section-title">Schedule Date & Time</span>
            <svg
              class="chevron-icon"
              :class="{ 'chevron-icon--open': scheduleOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>

          <Transition name="expand">
            <div v-if="scheduleOpen" class="schedule-fields">
              <div class="date-time-row">
                <div class="date-input-wrapper">
                  <input
                    v-model="scheduleDate"
                    type="date"
                    class="date-input"
                  />
                  <svg
                    class="date-cal-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div class="select-wrapper">
                  <select v-model="scheduleTime" class="time-select">
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                  <svg
                    class="select-chevron"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <p class="timezone-label">(GMT +1) West Africa Time</p>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Footer -->
      <div class="card-footer card-footer--split">
        <button class="btn-back" @click="$router.back()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="back-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <button
          class="btn-continue"
          :disabled="isSubmitting"
          @click="handleSend"
        >
          {{
            isSubmitting
              ? "Saving..."
              : sendOption === "now"
                ? "Send Campaign"
                : "Schedule Campaign"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMarketing } from "~/composables/useMarketing";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Schedule Campaign — Uzu Ticket",
  meta: [
    {
      name: "description",
      content: "Choose when to send your email marketing campaign.",
    },
  ],
});

const sendOption = ref<"now" | "later">("now");
const scheduleOpen = ref(true);
const scheduleDate = ref("2026-09-27");
const scheduleTime = ref("10:00 AM");
const isSubmitting = ref(false);
const campaignDraft = useState<{ subject: string; bodyHtml: string } | null>(
  "marketing:draft",
  () => null,
);
const { createCampaign, sendCampaign } = useMarketing();
const { error: showError } = useToast();

async function handleSend() {
  if (!campaignDraft.value) {
    showError(
      "Campaign draft missing",
      "Return to the create screen and complete the campaign first.",
    );
    return;
  }
  if (sendOption.value === "later" && !scheduleDate.value) {
    showError(
      "Choose a schedule date",
      "Select when this campaign should be sent.",
    );
    return;
  }
  isSubmitting.value = true;
  try {
    const scheduledAt =
      sendOption.value === "later"
        ? new Date(`${scheduleDate.value} ${scheduleTime.value}`).toISOString()
        : undefined;
    const campaign = await createCampaign({
      ...campaignDraft.value,
      scheduledAt,
    });
    if (sendOption.value === "now") await sendCampaign(campaign.id);
    campaignDraft.value = null;
    await navigateTo("/marketing/campaign-sent");
  } catch (error) {
    showError(
      "Campaign failed",
      error instanceof Error ? error.message : "Unable to create campaign",
    );
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.schedule-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 720px;
}

.step-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Send Options */
.send-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.85rem;
  cursor: pointer;
  background: #fff;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.option-card:hover {
  border-color: #3fd246;
}

.option-card--active {
  border-color: #3fd246;
  background: #f0fdf4;
}

.option-radio {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.option-radio--active {
  border-color: #3fd246;
}

.radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #3fd246;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.option-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0e2615;
}

.option-desc {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Schedule Section */
.schedule-section {
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  overflow: hidden;
}

.schedule-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  background: #fff;
}

.schedule-section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0e2615;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.chevron-icon--open {
  transform: rotate(180deg);
}

.schedule-fields {
  padding: 1.25rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-time-row {
  display: flex;
  gap: 0.75rem;
}

.date-input-wrapper {
  position: relative;
  flex: 1;
}

.date-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.7rem 2.5rem 0.7rem 1rem;
  font-size: 0.9rem;
  color: #0e2615;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.date-input:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.date-cal-icon {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  pointer-events: none;
}

.select-wrapper {
  position: relative;
  flex: 1;
}

.time-select {
  width: 100%;
  appearance: none;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.7rem 2.5rem 0.7rem 1rem;
  font-size: 0.9rem;
  color: #0e2615;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s;
}

.time-select:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.select-chevron {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  pointer-events: none;
}

.timezone-label {
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
}

.card-footer--split {
  justify-content: space-between;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.6rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.btn-back:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #3fd246;
  border: none;
  border-radius: 0.65rem;
  padding: 0.6rem 1.4rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    transform 0.15s;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.btn-continue:hover {
  background: #32c23e;
  transform: translateY(-1px);
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>

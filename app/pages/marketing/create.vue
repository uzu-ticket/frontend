<template>
  <div class="create-campaign-page">
    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Step 1: Campaign Basics -->
      <template v-if="currentStep === 1">
        <div class="step-back">
          <NuxtLink to="/marketing" class="back-link">
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
          </NuxtLink>
        </div>

        <div class="step-header">
          <h1 class="card-title">Create Campaign</h1>
          <p class="card-subtitle">Let's start with the basics.</p>
        </div>

        <div class="form-body">
          <div class="form-group">
            <label class="form-label"
              >Campaign Name <span class="required">*</span></label
            >
            <input
              v-model="form.name"
              class="form-input"
              type="text"
              placeholder="Summer Fest Reminder"
            />
          </div>

          <div class="form-group">
            <label class="form-label"
              >Campaign Type <span class="required">*</span></label
            >
            <div class="type-cards">
              <div
                v-for="ct in campaignTypes"
                :key="ct.value"
                class="type-card"
                :class="{ 'type-card--active': form.type === ct.value }"
                @click="form.type = ct.value"
              >
                <span class="type-card-title">{{ ct.label }}</span>
                <span class="type-card-desc">{{ ct.desc }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"
              >Campaign Goal <span class="required">*</span></label
            >
            <AppSelect
              v-model="form.goal"
              :options="campaignGoalOptions"
              placeholder="Select goal"
            />
          </div>

          <div class="form-group">
            <label class="form-label"
              >Event Description <span class="optional">(Optional)</span></label
            >
            <div class="textarea-wrapper">
              <textarea
                v-model="form.description"
                class="form-textarea"
                placeholder="Tell us about this campaign"
                maxlength="200"
                rows="4"
              />
              <span class="char-count">{{ form.description.length }}/200</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Step 2: Select Audience -->
      <template v-if="currentStep === 2">
        <div class="step-header">
          <h1 class="card-title">Select Your Audience</h1>
          <p class="card-subtitle">Choose who should receive this campaign.</p>
        </div>

        <div class="form-body">
          <div class="form-group">
            <label class="form-label"
              >Audience Source <span class="required">*</span></label
            >
            <div class="tab-group">
              <button
                v-for="src in audienceSources"
                :key="src.value"
                class="tab-btn"
                :class="{
                  'tab-btn--active': form.audienceSource === src.value,
                }"
                @click="form.audienceSource = src.value"
              >
                {{ src.label }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"
              >Select Audience <span class="required">*</span></label
            >
            <AppSelect
              v-model="form.audience"
              :options="audienceOptions"
              placeholder="Choose an audience segment"
            />
            <p class="form-hint">
              {{ audienceOptions.find(o => o.value === form.audience)?.subLabel ?? 'Select who will receive this campaign.' }}
            </p>
          </div>

          <div class="summary-card">
            <h4 class="summary-title">Audience Summary</h4>
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="summary-stat-label">Total Recipients</span>
                <span class="summary-stat-value">5,245</span>
              </div>
              <div class="summary-stat">
                <span class="summary-stat-label">Estimated Reach</span>
                <span class="summary-stat-value"
                  ><strong>98%</strong> of your customers</span
                >
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Step 3: Compose Email -->
      <template v-if="currentStep === 3">
        <div class="step-header">
          <h1 class="card-title">Compose Email</h1>
          <p class="card-subtitle">Design your email content.</p>
        </div>

        <div class="compose-layout">
          <div class="compose-left">
            <div class="form-group">
              <label class="form-label"
                >Email Subject <span class="required">*</span></label
              >
              <input
                v-model="form.subject"
                class="form-input"
                type="text"
                placeholder="Don't miss out! Summer Festival is almost here!"
              />
            </div>

            <div class="form-group">
              <label class="form-label"
                >Preheader Text <span class="required">*</span></label
              >
              <input
                v-model="form.preheader"
                class="form-input"
                type="text"
                placeholder="Get ready for an unforgettable experience."
              />
            </div>

            <div class="form-group">
              <label class="form-label">Add Content</label>
              <div class="block-list">
                <button
                  v-for="block in contentBlocks"
                  :key="block.value"
                  class="block-btn"
                  :class="{
                    'block-btn--active': selectedBlock === block.value,
                  }"
                  @click="selectedBlock = block.value"
                >
                  <span class="block-icon" v-html="block.icon" />
                  {{ block.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="compose-right">
            <div class="email-preview">
              <div class="preview-header">
                <span class="preview-logo">UZU<br />ticket.</span>
                <div class="preview-nav">
                  <span>Events</span>
                  <span>Tickets</span>
                  <span>My account</span>
                </div>
              </div>
              <div class="preview-hero-img" />
              <div class="preview-body">
                <h3 class="preview-body-title">
                  The Summer Festival is almost here!
                </h3>
                <p class="preview-body-text">
                  We can't wait to see you! Grab your tickets now and get ready
                  for an unforgettable experience.
                </p>
                <button class="preview-cta">Grab My Tickets</button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Step 4: Review Campaign -->
      <template v-if="currentStep === 4">
        <div class="step-header">
          <h1 class="card-title">Review Your Campaign</h1>
          <p class="card-subtitle">Please review all details before sending.</p>
        </div>

        <div class="review-layout">
          <div class="review-left">
            <div class="review-details-card">
              <div
                v-for="detail in reviewDetails"
                :key="detail.key"
                class="review-row"
              >
                <span class="review-key">{{ detail.key }}</span>
                <span class="review-val">{{ detail.value }}</span>
              </div>
            </div>

            <div class="email-preview email-preview--sm">
              <div class="preview-header">
                <span class="preview-logo">UZU<br />ticket.</span>
                <div class="preview-nav">
                  <span>Events</span>
                  <span>Tickets</span>
                  <span>My account</span>
                </div>
              </div>
              <div class="preview-hero-img" />
              <div class="preview-body">
                <h3 class="preview-body-title">
                  The Summer Festival is almost here!
                </h3>
                <p class="preview-body-text">
                  We can't wait to see you! Grab your tickets now and get ready
                  for an unforgettable experience.
                </p>
                <button class="preview-cta">Grab My Tickets</button>
              </div>
            </div>
          </div>

          <div class="review-right">
            <div class="perf-card">
              <h4 class="perf-title">Estimated Performance</h4>
              <div class="perf-stat">
                <span class="perf-label">Total Recipients</span>
                <span class="perf-value">5,245</span>
              </div>
              <div class="perf-stat">
                <span class="perf-label">Est. Open Rate</span>
                <span class="perf-value">1,700</span>
              </div>
              <div class="perf-stat">
                <span class="perf-label">Est. Clicks</span>
                <span class="perf-value">530</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Footer Actions -->
      <div
        class="card-footer"
        :class="{ 'card-footer--split': currentStep > 1 }"
      >
        <button v-if="currentStep > 1" class="btn-back" @click="prevStep">
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

        <button class="btn-continue" @click="nextStep">
          {{ currentStep === 4 ? "Send Campaign" : "Continue" }}
          <svg
            v-if="currentStep < 4"
            xmlns="http://www.w3.org/2000/svg"
            class="btn-arrow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppSelect from "~/components/ui/AppSelect.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Create Campaign — Uzu Ticket",
  meta: [
    {
      name: "description",
      content: "Create and send a new targeted email marketing campaign.",
    },
  ],
});

const currentStep = ref(1);
const selectedBlock = ref("");

const form = ref({
  name: "",
  type: "regular",
  goal: "",
  description: "",
  audienceSource: "saved",
  audience: "all",
  subject: "",
  preheader: "",
});

const campaignTypes = [
  { value: "regular", label: "Regular", desc: "Send one-on-one email" },
  { value: "automated", label: "Automated", desc: "Triggered by actions" },
  {
    value: "event-based",
    label: "Event Based",
    desc: "Send for a specific event",
  },
];

const campaignGoalOptions = [
  { value: "boost-sales", label: "Boost ticket sales" },
  { value: "event-reminder", label: "Event reminder" },
  { value: "re-engage", label: "Re-engage past customers" },
  { value: "announce", label: "Announce new event" },
];

const audienceSources = [
  { value: "saved", label: "Saved Audiences" },
  { value: "attendees", label: "Event Attendees" },
  { value: "segments", label: "Segments" },
];

const audienceOptions = [
  {
    value: "all",
    label: "All Customers",
    subLabel: "5,245 recipients — every registered customer",
    icon: "👥",
  },
  {
    value: "vip",
    label: "VIP Customers",
    subLabel: "1,120 recipients — top-tier buyers",
    icon: "⭐",
  },
  {
    value: "regular",
    label: "Regular Customers",
    subLabel: "4,125 recipients — non-VIP audience",
    icon: "🎟️",
  },
];

const contentBlocks = [
  {
    value: "text",
    label: "Text",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>',
  },
  {
    value: "image",
    label: "Image",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 15l-5-5L5 21"/></svg>',
  },
  {
    value: "button",
    label: "Button",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="3"/></svg>',
  },
  {
    value: "divider",
    label: "Divider",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></svg>',
  },
  {
    value: "template",
    label: "Template",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  },
];

const reviewDetails = computed(() => [
  { key: "Summer Festival", value: form.value.name || "Summer Fest Reminder" },
  {
    key: "Campaign Type",
    value:
      campaignTypes.find((t) => t.value === form.value.type)?.label ??
      "Regular",
  },
  { key: "Audience", value: "All Customers (5,245 recipients)" },
  {
    key: "Subject",
    value:
      form.value.subject || "Don't miss out! Summer Festival is almost here!",
  },
  {
    key: "Preheader",
    value: form.value.preheader || "Get ready for an unforgettable experience.",
  },
]);

function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++;
  } else {
    const campaignDraft = useState("marketing:draft", () => ({
      subject: "",
      bodyHtml: "",
    }));
    campaignDraft.value = {
      subject: form.value.subject || form.value.name || "UzuTicket campaign",
      bodyHtml: `<h1>${form.value.subject || form.value.name}</h1><p>${form.value.description || form.value.preheader}</p>`,
    };
    navigateTo("/marketing/schedule");
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}
</script>

<style scoped>
.create-campaign-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Main Unified Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Back Link */
.step-back {
  margin-bottom: -0.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3fd246;
  text-decoration: none;
  transition: opacity 0.15s;
}

.back-link:hover {
  opacity: 0.75;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* Step Header */
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

/* Form */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
}

.required {
  color: #dc2626;
}

.optional {
  font-weight: 400;
  color: #9ca3af;
}

.form-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  color: #0e2615;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
  background: #fff;
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Campaign Type Cards */
.type-cards {
  display: flex;
  gap: 0.75rem;
}

.type-card {
  flex: 1;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.type-card:hover {
  border-color: #3fd246;
}

.type-card--active {
  border-color: #3fd246;
  background: #f0fdf4;
}

.type-card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0e2615;
}

.type-card-desc {
  font-size: 0.775rem;
  color: #6b7280;
}

/* Select */
.select-wrapper {
  position: relative;
}

.form-select {
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

.form-select:focus {
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

/* Textarea */
.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  color: #0e2615;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-textarea:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
  background: #fff;
}

.char-count {
  position: absolute;
  bottom: 0.6rem;
  right: 0.75rem;
  font-size: 0.72rem;
  color: #9ca3af;
}

.form-hint {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
}

/* Audience Tab Group */
.tab-group {
  display: flex;
  background: #f3f4f6;
  border-radius: 0.6rem;
  padding: 0.2rem;
  gap: 0.1rem;
}

.tab-btn {
  flex: 1;
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  font-family: inherit;
}

.tab-btn--active {
  background: #fff;
  color: #3fd246;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* Audience Summary Card */
.summary-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 1.25rem;
}

.summary-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 1rem;
}

.summary-stats {
  display: flex;
  gap: 3rem;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.summary-stat-label {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 600;
}

.summary-stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0e2615;
  letter-spacing: -0.02em;
}

/* Compose Layout */
.compose-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.compose-left {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Content Block List */
.block-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.block-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.block-btn:hover {
  border-color: #3fd246;
  background: #f0fdf4;
}

.block-btn--active {
  border-color: #3fd246;
  background: #f0fdf4;
  color: #0e2615;
}

.block-icon {
  width: 1.1rem;
  height: 1.1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* Email Preview */
.email-preview {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.85rem;
  overflow: hidden;
  background: #fff;
}

.email-preview--sm .preview-body {
  padding: 1rem;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.preview-logo {
  font-size: 0.6rem;
  font-weight: 900;
  color: #0e2615;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.preview-nav {
  display: flex;
  gap: 0.65rem;
  font-size: 0.68rem;
  color: #374151;
  font-weight: 500;
}

.preview-hero-img {
  width: 100%;
  height: 110px;
  background: linear-gradient(135deg, #1a1a2e 0%, #4a0e8f 50%, #e91e8c 100%);
}

.preview-body {
  padding: 1.25rem;
  text-align: center;
}

.preview-body-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.4rem;
}

.preview-body-text {
  font-size: 0.72rem;
  color: #6b7280;
  margin: 0 0 0.85rem;
  line-height: 1.5;
}

.preview-cta {
  background: #3fd246;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.45rem 1.1rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

/* Review Layout */
.review-layout {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.review-left {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-details-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  overflow: hidden;
}

.review-row {
  display: flex;
  gap: 1rem;
  padding: 0.8rem 1.1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.85rem;
}

.review-row:last-child {
  border-bottom: none;
}

.review-key {
  font-weight: 700;
  color: #374151;
  min-width: 120px;
  flex-shrink: 0;
}

.review-val {
  color: #6b7280;
}

/* Performance Card */
.perf-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 1.25rem;
}

.perf-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 1.1rem;
}

.perf-stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1.1rem;
}

.perf-stat:last-child {
  margin-bottom: 0;
}

.perf-label {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 600;
}

.perf-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0e2615;
  letter-spacing: -0.02em;
}

/* Card Footer */
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

.btn-arrow {
  width: 0.85rem;
  height: 0.85rem;
}

@media (max-width: 768px) {
  .compose-layout,
  .review-layout {
    grid-template-columns: 1fr;
  }

  .type-cards {
    flex-direction: column;
  }
}
</style>

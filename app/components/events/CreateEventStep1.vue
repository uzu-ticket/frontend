<template>
  <form class="step1-form" novalidate @submit.prevent="handleSubmit">
    <!-- Form Header -->
    <div class="form-header">
      <h3 class="form-title">Basic Information</h3>
      <p class="form-subtitle">Tell attendees what your event is about.</p>
    </div>

    <!-- 2-Column Content Layout -->
    <div class="form-body-grid">
      <!-- Left Column: Form Fields -->
      <div class="form-left-col">
        <!-- Event Name -->
        <div class="field-group">
          <label for="input-event-name" class="field-label">
            Event Name <span class="required-star">*</span>
          </label>
          <input
            id="input-event-name"
            v-model="formData.eventName"
            type="text"
            placeholder="Enter organization name"
            class="form-input"
            :class="{ 'form-input--error': errors.eventName }"
          />
          <span v-if="errors.eventName" class="field-error">{{
            errors.eventName
          }}</span>
        </div>

        <!-- Category -->
        <div class="field-group">
          <label class="field-label">
            Category <span class="required-star">*</span>
          </label>
          <AppSelect
            v-model="formData.category"
            :options="categoryOptions"
            placeholder="Select category"
            searchable
            :error="errors.category"
          />
        </div>

        <!-- Event Description -->
        <div class="field-group">
          <label for="input-description" class="field-label">
            Event Description <span class="required-star">*</span>
          </label>
          <div class="textarea-wrapper">
            <textarea
              id="input-description"
              v-model="formData.description"
              maxlength="200"
              rows="4"
              placeholder="Give attendees a brief overview of your event, speakers, activities, and what they can expect."
              class="form-textarea"
              :class="{ 'form-textarea--error': errors.description }"
            />
            <span class="char-counter"
              >{{ formData.description.length }}/200</span
            >
          </div>
          <span v-if="errors.description" class="field-error">{{
            errors.description
          }}</span>
        </div>

        <!-- Event Slot -->
        <div class="field-group">
          <label class="field-label">
            Event Slot <span class="required-star">*</span>
          </label>
          <div class="radio-cards-grid">
            <div
              class="radio-card"
              :class="{
                'radio-card--selected': formData.eventSlot === 'single',
              }"
              @click="formData.eventSlot = 'single'"
            >
              <div class="radio-indicator">
                <div v-if="formData.eventSlot === 'single'" class="radio-dot" />
              </div>
              <div class="radio-card-content">
                <h4 class="card-option-title">Single Slot</h4>
                <p class="card-option-desc">
                  One ticket gives access to the event.
                </p>
              </div>
            </div>

            <div
              class="radio-card"
              :class="{
                'radio-card--selected': formData.eventSlot === 'multiple',
              }"
              @click="formData.eventSlot = 'multiple'"
            >
              <div class="radio-indicator">
                <div
                  v-if="formData.eventSlot === 'multiple'"
                  class="radio-dot"
                />
              </div>
              <div class="radio-card-content">
                <h4 class="card-option-title">Multiple Slot</h4>
                <p class="card-option-desc">
                  Create separate schedules for different dates or times.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Type -->
        <div class="field-group">
          <label class="field-label">
            Event Type <span class="required-star">*</span>
          </label>
          <div class="radio-cards-grid">
            <div
              class="radio-card"
              :class="{ 'radio-card--selected': formData.eventType === 'paid' }"
              @click="formData.eventType = 'paid'"
            >
              <div class="radio-indicator">
                <div v-if="formData.eventType === 'paid'" class="radio-dot" />
              </div>
              <div class="radio-card-content">
                <h4 class="card-option-title">Paid</h4>
                <p class="card-option-desc">
                  Attendees purchase tickets to attend.
                </p>
              </div>
            </div>

            <div
              class="radio-card"
              :class="{ 'radio-card--selected': formData.eventType === 'free' }"
              @click="formData.eventType = 'free'"
            >
              <div class="radio-indicator">
                <div v-if="formData.eventType === 'free'" class="radio-dot" />
              </div>
              <div class="radio-card-content">
                <h4 class="card-option-title">Free</h4>
                <p class="card-option-desc">
                  Everyone can attend without paying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Add Cover Image (Optional) -->
      <div class="form-right-col">
        <label class="field-label">Add cover Image (Optional)</label>
        <div class="dropzone-box" @click="triggerFileInput">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="file-input-hidden"
            @change="handleFileSelect"
          />

          <div class="dropzone-content">
            <div class="upload-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="cloud-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p class="upload-prompt">
              Drag and drop an image here or
              <span class="browse-highlight">browse files</span>
            </p>
          </div>
        </div>

        <div class="upload-hints">
          <span class="hint-text">Recommended size 1300x 800px</span>
          <span class="hint-text">PNG, JPG, OR SVG MAX 2MB</span>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">
        Cancel
      </button>

      <button type="submit" class="btn-save-continue">
        <span>Save & Continue</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="btn-arrow"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import AppSelect from "~/components/ui/AppSelect.vue";

const emit = defineEmits<{
  cancel: [];
  next: [data: typeof formData];
}>();

const props = defineProps<{
  initialData?: Partial<typeof formData>;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const categoryOptions = [
  { value: "Technology", label: "Technology", subLabel: "Tech & Innovation" },
  { value: "Music", label: "Music & Concerts", subLabel: "Live performances" },
  {
    value: "Business",
    label: "Business & Corporate",
    subLabel: "Professional events",
  },
  { value: "Arts", label: "Arts & Culture", subLabel: "Creative events" },
  { value: "Sports", label: "Sports & Fitness", subLabel: "Active events" },
  { value: "Food", label: "Food & Drinks", subLabel: "Culinary experiences" },
  { value: "Comedy", label: "Comedy & Entertainment", subLabel: "Fun events" },
];

const formData = reactive({
  eventName: "",
  category: "",
  description: "",
  eventSlot: "multiple",
  visibility: "public",
  eventType: "paid",
  coverImage: null as File | null,
});

const errors = reactive({
  eventName: "",
  category: "",
  description: "",
});

watch(
  () => props.initialData,
  (data) => {
    if (!data) return;
    Object.assign(formData, data);
  },
  { immediate: true, deep: true },
);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.coverImage = target.files[0];
  }
}

function validate() {
  let valid = true;
  errors.eventName = "";
  errors.category = "";
  errors.description = "";

  if (!formData.eventName.trim()) {
    errors.eventName = "Event name is required.";
    valid = false;
  }
  if (!formData.category) {
    errors.category = "Category is required.";
    valid = false;
  }
  if (!formData.description.trim()) {
    errors.description = "Description is required.";
    valid = false;
  }

  return valid;
}

function handleSubmit() {
  if (!validate()) return;
  emit("next", { ...formData });
}
</script>

<style scoped>
.step1-form {
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 1.75rem;
}

.form-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.25rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

/* 2-Column Grid */
.form-body-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.25rem;
  margin-bottom: 2.25rem;
}

.form-left-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-right-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Field Group */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #0e2615;
}

.required-star {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  transition: all 0.15s ease;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.form-input--error {
  border-color: #ef4444 !important;
}

/* Select */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.form-select:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #6b7280;
  pointer-events: none;
}

/* Textarea */
.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: all 0.15s ease;
}

.form-textarea:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.char-counter {
  position: absolute;
  right: 0.85rem;
  bottom: 0.65rem;
  font-size: 0.75rem;
  color: #9ca3af;
  pointer-events: none;
}

/* Radio Cards Grid */
.radio-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.radio-card {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.875rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.radio-card:hover {
  border-color: #d1d5db;
}

.radio-card--selected {
  background: #f0fdf1;
  border-color: #3fd246;
}

.radio-indicator {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  border: 1.5px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.radio-card--selected .radio-indicator {
  border-color: #3fd246;
}

.radio-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #3fd246;
}

.card-option-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0e2615;
  margin: 0 0 0.15rem;
}

.card-option-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

/* Dropzone Upload Box */
.dropzone-box {
  background: #f3f4f6;
  border: 1.5px dashed #d1d5db;
  border-radius: 0.875rem;
  padding: 2.25rem 1.25rem;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 0.75rem;
}

.dropzone-box:hover {
  border-color: #3fd246;
  background: #f0fdf1;
}

.file-input-hidden {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.upload-icon-circle {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: #ffffff;
  color: #3fd246;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.cloud-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.upload-prompt {
  font-size: 0.8rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.4;
}

.browse-highlight {
  color: #3fd246;
  font-weight: 700;
  text-decoration: underline;
}

.upload-hints {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.2rem;
}

.hint-text {
  font-size: 0.725rem;
  color: #9ca3af;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}

/* Form Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
}

.btn-cancel {
  padding: 0.65rem 1.75rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0e2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-save-continue {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.75rem;
  background: #3fd246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-save-continue:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-arrow {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 900px) {
  .form-body-grid {
    grid-template-columns: 1fr;
  }
  .slot-inputs-row {
    grid-template-columns: 1fr;
  }
}
</style>

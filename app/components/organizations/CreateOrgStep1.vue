<template>
  <form class="step1-form" novalidate @submit.prevent="handleSubmit">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Basic Information</h3>
      <p class="form-subtitle">
        Please provide the basic information about your organization.
      </p>
    </div>

    <div class="fields-stack">
      <!-- 1. Organization Name -->
      <div class="field-group">
        <label for="input-org-name" class="field-label">
          Organization Name <span class="required-star">*</span>
        </label>
        <input
          id="input-org-name"
          v-model="formData.name"
          type="text"
          placeholder="Enter organization name"
          class="form-input"
          :class="{ 'form-input--error': errors.name }"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <!-- 2. Organization URL (Slug) -->
      <div class="field-group">
        <label for="input-org-slug" class="field-label">
          Organization URL (Slug) <span class="required-star">*</span>
        </label>
        <AppInput
          id="input-org-slug"
          v-model="formData.slug"
          type="text"
          prefix="https://uzutickets.com/"
          placeholder="your-organization"
          :error="errors.slug"
        />
      </div>

      <!-- 3 & 4. 2-Column Row: Business Email & Phone Number -->
      <div class="two-col-row">
        <!-- Business Email -->
        <div class="field-group">
          <label for="input-org-email" class="field-label">
            Business Email <span class="required-star">*</span>
          </label>
          <input
            id="input-org-email"
            v-model="formData.email"
            type="email"
            placeholder="yourorganization@gmail.com"
            class="form-input"
            :class="{ 'form-input--error': errors.email }"
          />
          <span v-if="errors.email" class="field-error">{{
            errors.email
          }}</span>
        </div>

        <!-- Phone Number with Flag prefix -->
        <div class="field-group">
          <label for="input-org-phone" class="field-label">
            Phone Number <span class="required-star">*</span>
          </label>
          <AppPhoneInput
            id="input-org-phone"
            v-model="formData.phone"
            placeholder="802 333 4566"
            :error="errors.phone"
            default-country="NG"
          />
        </div>
      </div>

      <!-- 5. Industry -->
      <div class="field-group">
        <label for="select-org-industry" class="field-label">
          Industry <span class="required-star">*</span>
        </label>
        <AppSelect
          v-model="formData.industry"
          :options="industryOptions"
          placeholder="Please select industry"
          :error="errors.industry"
        />
      </div>

      <!-- 6. Organization Description -->
      <div class="field-group">
        <label for="textarea-org-desc" class="field-label">
          Organization Description <span class="required-star">*</span>
        </label>
        <div
          class="textarea-container"
          :class="{ 'textarea-container--error': errors.description }"
        >
          <textarea
            id="textarea-org-desc"
            v-model="formData.description"
            rows="4"
            maxlength="200"
            placeholder="Briefly describe your organization and what you do"
            class="form-textarea"
          />
          <div class="char-counter">{{ formData.description.length }}/200</div>
        </div>
        <span v-if="errors.description" class="field-error">{{
          errors.description
        }}</span>
      </div>
    </div>

    <!-- Form Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-cancel" @click="handleCancel">
        Cancel
      </button>

      <AppButton type="submit" :loading="props.isSubmitting">
        <span>Next</span>
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
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import AppButton from "~/components/AppButton.vue";
import AppInput from "~/components/AppInput.vue";
import AppPhoneInput from "~/components/AppPhoneInput.vue";
import AppSelect from "~/components/ui/AppSelect.vue";

const props = defineProps<{
  initialData?: Partial<{
    name: string;
    slug: string;
    email: string;
    phone: string;
    industry: string;
    description: string;
  }>;
  isSubmitting?: boolean;
}>();

const router = useRouter();

const emit = defineEmits<{
  next: [data: typeof formData];
}>();

const formData = reactive({
  name: "",
  slug: "",
  email: "",
  phone: "",
  industry: "",
  description: "",
});

function hydrateForm(data?: Partial<typeof formData>) {
  Object.assign(formData, {
    name: "",
    slug: "",
    email: "",
    phone: "",
    industry: "",
    description: "",
    ...data,
  });
}

watch(
  () => props.initialData,
  (data) => {
    hydrateForm(data as Partial<typeof formData> | undefined);
  },
  { immediate: true, deep: true },
);

const industryOptions = [
  { value: "entertainment", label: "Entertainment & Events" },
  { value: "tech", label: "Technology & Software" },
  { value: "education", label: "Education & Workshops" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "corporate", label: "Corporate & Business" },
];

const errors = reactive({
  name: "",
  slug: "",
  email: "",
  phone: "",
  industry: "",
  description: "",
});

watch(
  () => formData.name,
  (value) => {
    if (value.trim()) errors.name = "";
  },
);

watch(
  () => formData.slug,
  (value) => {
    if (value.trim()) errors.slug = "";
  },
);

watch(
  () => formData.email,
  (value) => {
    if (value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.email = "";
    }
  },
);

watch(
  () => formData.phone,
  (value) => {
    if (value.trim()) errors.phone = "";
  },
);

watch(
  () => formData.industry,
  (value) => {
    if (value) errors.industry = "";
  },
);

watch(
  () => formData.description,
  (value) => {
    if (value.trim()) errors.description = "";
  },
);

function validate() {
  let valid = true;
  errors.name = "";
  errors.slug = "";
  errors.email = "";
  errors.phone = "";
  errors.industry = "";
  errors.description = "";

  if (!formData.name.trim()) {
    errors.name = "Organization name is required.";
    valid = false;
  }
  if (!formData.slug.trim()) {
    errors.slug = "Organization URL is required.";
    valid = false;
  }
  if (
    !formData.email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = "Valid business email is required.";
    valid = false;
  }
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required.";
    valid = false;
  }
  if (!formData.industry) {
    errors.industry = "Please select an industry.";
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

function handleCancel() {
  router.push("/organizations");
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

.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  margin-bottom: 2.25rem;
}

.two-col-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

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

/* Phone Input */
.phone-input-wrapper {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  overflow: hidden;
  transition: all 0.15s ease;
}

.phone-input-wrapper:focus-within {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.country-prefix {
  padding: 0.75rem 0.75rem 0.75rem 1rem;
  display: flex;
  align-items: center;
}

.flag-icon {
  font-size: 1.1rem;
}

.phone-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 1rem 0.75rem 0.25rem;
  font-size: 0.875rem;
  color: #1f2937;
  background: transparent;
}

/* Textarea */
.textarea-container {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.15s ease;
}

.textarea-container:focus-within {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem 2rem;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 0.875rem;
  color: #1f2937;
  resize: vertical;
  background: transparent;
}

.char-counter {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}

/* Form Footer Actions */
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
  border-color: #d1d5db;
}

.btn-next {
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

.btn-next:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-arrow {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 640px) {
  .two-col-row {
    grid-template-columns: 1fr;
  }
}
</style>

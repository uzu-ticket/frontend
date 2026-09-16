<template>
  <form class="step2-form" novalidate @submit.prevent="handleSubmit">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Branding</h3>
      <p class="form-subtitle">
        Add your organization's branding and social presence.
      </p>
    </div>

    <div class="fields-stack">
      <!-- Top Row: Logo & Cover Image -->
      <div class="two-col-row branding-row">
        <!-- Left: Organization Logo -->
        <div class="field-group">
          <label class="field-label">
            Organization Logo <span class="required-star">*</span>
          </label>

          <div class="logo-upload-box" @click="triggerLogoInput">
            <input
              ref="logoInputRef"
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              class="hidden-file-input"
              @change="handleLogoChange"
            />

            <template v-if="logoPreview">
              <img
                :src="logoPreview"
                alt="Organization Logo"
                class="preview-logo-img"
              />
            </template>
            <template v-else>
              <div class="logo-icon-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="photo-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </template>
          </div>
          <span class="upload-hint-text">PNG, JPG, OR SVG MAX 2MB</span>
        </div>

        <!-- Right: Cover Image (Optional) -->
        <div class="field-group">
          <label class="field-label"> Cover Image (Optional) </label>

          <div class="cover-upload-box" @click="triggerCoverInput">
            <input
              ref="coverInputRef"
              type="file"
              accept="image/*"
              class="hidden-file-input"
              @change="handleCoverChange"
            />

            <template v-if="coverPreview">
              <img
                :src="coverPreview"
                alt="Cover Image"
                class="preview-cover-img"
              />
            </template>
            <template v-else>
              <div class="cover-upload-content">
                <div class="cloud-icon-wrapper">
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
                <p class="drop-text">
                  Drag and drop an image here or
                  <span class="browse-link">browse files</span>
                </p>
              </div>
            </template>
          </div>
          <span class="upload-hint-text">Recommended size 1300x 800px</span>
        </div>
      </div>

      <!-- Social Links Section -->
      <div class="social-section">
        <h4 class="social-title">Social Links (optional)</h4>

        <!-- Row 1: Facebook & Twitter (X) -->
        <div class="two-col-row">
          <div class="field-group">
            <label for="input-facebook" class="field-label">Facebook</label>
            <input
              id="input-facebook"
              v-model="formData.facebook"
              type="url"
              placeholder="your facebook url"
              class="form-input"
            />
          </div>

          <div class="field-group">
            <label for="input-twitter" class="field-label">Twitter (X)</label>
            <input
              id="input-twitter"
              v-model="formData.twitter"
              type="url"
              placeholder="your twitter url"
              class="form-input"
            />
          </div>
        </div>

        <!-- Row 2: Instagram & LinkedIn -->
        <div class="two-col-row mt-3">
          <div class="field-group">
            <label for="input-instagram" class="field-label">Instagram</label>
            <input
              id="input-instagram"
              v-model="formData.instagram"
              type="url"
              placeholder="your instagram url"
              class="form-input"
            />
          </div>

          <div class="field-group">
            <label for="input-linkedin" class="field-label">LinkedIn</label>
            <input
              id="input-linkedin"
              v-model="formData.linkedin"
              type="url"
              placeholder="your linkedin url"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Form Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="btn-arrow-left"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Back</span>
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
import { ref, reactive, watch } from "vue";
import AppButton from "~/components/AppButton.vue";

const props = defineProps<{
  initialData?: Partial<{
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  }>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  back: [];
  next: [data: typeof formData];
}>();

const logoInputRef = ref<HTMLInputElement | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);

const logoPreview = ref<string | null>(null);
const coverPreview = ref<string | null>(null);

const formData = reactive({
  logoFile: null as File | null,
  coverFile: null as File | null,
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
});

function hydrateForm(data?: Partial<typeof formData>) {
  Object.assign(formData, {
    logoFile: null,
    coverFile: null,
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
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

function triggerLogoInput() {
  logoInputRef.value?.click();
}

function triggerCoverInput() {
  coverInputRef.value?.click();
}

function handleLogoChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    formData.logoFile = file;
    logoPreview.value = URL.createObjectURL(file);
  }
}

function handleCoverChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    formData.coverFile = file;
    coverPreview.value = URL.createObjectURL(file);
  }
}

function handleSubmit() {
  emit("next", { ...formData });
}
</script>

<style scoped>
.step2-form {
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
  gap: 1.5rem;
  margin-bottom: 2.25rem;
}

.two-col-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.branding-row {
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 4.75rem;
  align-items: start;
}

.mt-3 {
  margin-top: 0.75rem;
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

.hidden-file-input {
  display: none;
}

/* Upload Boxes */
.logo-upload-box {
  height: 198px;
  background: #ffffff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  overflow: hidden;
}

.logo-upload-box:hover {
  background: #fbfffb;
  border-color: #3fd246;
}

.logo-icon-circle {
  width: 5.4rem;
  height: 5.4rem;
  border-radius: 50%;
  background: #dce7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.photo-icon {
  width: 2.15rem;
  height: 2.15rem;
}

.preview-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.cover-upload-box {
  height: 198px;
  background: #ffffff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 0.75rem;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
  overflow: hidden;
}

.cover-upload-box:hover {
  background: #fbfffb;
  border-color: #3fd246;
}

.cover-upload-content {
  width: 100%;
  height: 126px;
  background: #eef1f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.65rem 0.65rem 0 0;
}

.cloud-icon-wrapper {
  margin-bottom: 0.4rem;
}

.cloud-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3fd246;
}

.drop-text {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0;
}

.browse-link {
  color: #3fd246;
  font-weight: 700;
}

.preview-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-hint-text {
  font-size: 0.725rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.02em;
  margin-top: 0.25rem;
}

/* Social Section */
.social-section {
  margin-top: 0.5rem;
}

.social-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0e2615;
  margin: 0 0 1rem;
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

/* Form Footer Actions */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

.btn-back:hover {
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

.btn-arrow,
.btn-arrow-left {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 640px) {
  .two-col-row {
    grid-template-columns: 1fr;
  }
}
</style>

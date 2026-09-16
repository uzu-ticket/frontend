<template>
  <form class="step4-form" novalidate @submit.prevent="handleSubmit">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Settlement Details</h3>
      <p class="form-subtitle">
        Add your bank details to receive payouts. You can do this later
      </p>
    </div>

    <div class="fields-stack">
      <!-- Bank Name -->
      <div class="field-group">
        <label for="select-bank" class="field-label">
          Bank Name <span class="required-star">*</span>
        </label>
        <AppSelect
          v-model="formData.bankName"
          :options="bankOptions"
          placeholder="Select bank name"
          :error="errors.bankName"
        />
      </div>

      <!-- Account Number -->
      <div class="field-group">
        <label for="input-account-number" class="field-label">
          Account Number <span class="required-star">*</span>
        </label>
        <input
          id="input-account-number"
          v-model="formData.accountNumber"
          type="text"
          inputmode="numeric"
          maxlength="10"
          placeholder="0123456789"
          class="form-input"
          :class="{ 'form-input--error': errors.accountNumber }"
        />
        <span v-if="errors.accountNumber" class="field-error">{{
          errors.accountNumber
        }}</span>
      </div>

      <!-- Account Name -->
      <div class="field-group">
        <label for="input-account-name" class="field-label">
          Account Name <span class="required-star">*</span>
        </label>
        <input
          id="input-account-name"
          v-model="formData.accountName"
          type="text"
          placeholder="Zeenom Events Limited"
          class="form-input"
          :class="{ 'form-input--error': errors.accountName }"
        />
        <span v-if="errors.accountName" class="field-error">{{
          errors.accountName
        }}</span>

        <!-- Match Banner -->
        <div
          v-if="
            formData.accountName &&
            formData.registeredBusinessName &&
            formData.accountName.toLowerCase() ===
              formData.registeredBusinessName.toLowerCase()
          "
          class="match-banner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="match-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Account Name matches Registered Business Name</span>
        </div>
      </div>

      <!-- Business Registration Number (CAC) -->
      <div class="field-group">
        <label for="input-cac" class="field-label">
          Business Registration Number (CAC)
          <span class="required-star">*</span>
        </label>
        <input
          id="input-cac"
          v-model="formData.cacNumber"
          type="text"
          placeholder="RC1234567"
          class="form-input"
          :class="{ 'form-input--error': errors.cacNumber }"
        />
        <span
          v-if="formData.cacNumber && !isValidCacNumber(formData.cacNumber)"
          class="field-hint"
        >
          Use a valid CAC number such as RC1234567.
        </span>
        <span v-if="errors.cacNumber" class="field-error">{{
          errors.cacNumber
        }}</span>
      </div>

      <!-- Registered Business Name -->
      <div class="field-group">
        <label for="input-registered-name" class="field-label">
          Registered Business Name <span class="required-star">*</span>
        </label>
        <input
          id="input-registered-name"
          v-model="formData.registeredBusinessName"
          type="text"
          placeholder="Zeenom Events Limited"
          class="form-input"
          :class="{ 'form-input--error': errors.registeredBusinessName }"
        />
        <span v-if="errors.registeredBusinessName" class="field-error">{{
          errors.registeredBusinessName
        }}</span>
      </div>

      <!-- Checkbox Confirmation -->
      <label class="checkbox-label">
        <input
          id="checkbox-confirm"
          v-model="formData.confirmed"
          type="checkbox"
          class="checkbox-input"
        />
        <span class="checkbox-text"
          >I confirm that the bank account belongs to this registered
          business.</span
        >
      </label>
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
        <span>{{
          props.isSubmitting ? "Creating..." : "Create Organization"
        }}</span>
      </AppButton>
    </div>

    <span v-if="props.submitError" class="field-error submit-error">{{
      props.submitError
    }}</span>
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import AppSelect from "~/components/ui/AppSelect.vue";
import AppButton from "~/components/AppButton.vue";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

const props = defineProps<{
  initialData?: Partial<{
    bankName: string;
    accountNumber: string;
    accountName: string;
    cacNumber: string;
    registeredBusinessName: string;
    confirmed: boolean;
  }>;
  isSubmitting?: boolean;
  submitError?: string;
}>();

const emit = defineEmits<{
  back: [];
  submit: [data: typeof formData];
}>();

const formData = reactive({
  bankName: "",
  accountNumber: "",
  accountName: "",
  cacNumber: "",
  registeredBusinessName: "",
  confirmed: false,
});

const bankOptions = ref<{ value: string; label: string }[]>([]);
const isResolvingAccount = ref(false);
const isSearchingCac = ref(false);
const lastSearchedCac = ref("");
const { instance } = useApi();
const toast = useToast();

function hydrateForm(data?: Partial<typeof formData>) {
  Object.assign(formData, {
    bankName: "",
    accountNumber: "",
    accountName: "",
    cacNumber: "",
    registeredBusinessName: "",
    confirmed: false,
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

const errors = reactive({
  bankName: "",
  accountNumber: "",
  accountName: "",
  cacNumber: "",
  registeredBusinessName: "",
});

async function loadBanks() {
  try {
    const response = await instance.get<
      | { name: string; code: string }[]
      | { data: { name: string; code: string }[] }
    >("/payments/paystack/banks");
    const banks = Array.isArray(response.data)
      ? response.data
      : response.data.data;
    bankOptions.value = banks.map((bank) => ({
      value: bank.code,
      label: bank.name,
    }));
  } catch (error) {
    toast.show({
      title: "Unable to load banks",
      message: getApiErrorMessage(error, "Please try again shortly."),
      type: "error",
    });
  }
}

async function resolveAccountName() {
  if (formData.accountNumber.length !== 10 || !formData.bankName) return;

  isResolvingAccount.value = true;
  errors.accountName = "";
  try {
    const response = await instance.get<
      { accountName: string } | { data: { accountName: string } }
    >("/payments/paystack/resolve-account", {
      params: {
        accountNumber: formData.accountNumber,
        bankCode: formData.bankName,
      },
    });
    const result = Array.isArray(response.data)
      ? undefined
      : "accountName" in response.data
        ? response.data
        : response.data.data;
    formData.accountName = result?.accountName ?? "";
  } catch (error) {
    formData.accountName = "";
    errors.accountName = getApiErrorMessage(
      error,
      "We could not verify this bank account.",
    );
  } finally {
    isResolvingAccount.value = false;
  }
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const message = (
    error as { response?: { data?: { message?: string | string[] } } }
  ).response?.data?.message;
  return Array.isArray(message) ? message.join(", ") : message || fallback;
}

function normalizeCacNumber(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

function isValidCacNumber(value: string) {
  return /^(RC|BN|IT)\d{4,8}$/.test(normalizeCacNumber(value));
}

async function searchCacRegistration(value: string) {
  const normalized = normalizeCacNumber(value);
  if (!isValidCacNumber(normalized) || lastSearchedCac.value === normalized)
    return;

  lastSearchedCac.value = normalized;
  isSearchingCac.value = true;
  try {
    const response = await instance.post<{
      found: boolean;
      businessName?: string;
      message?: string;
    }>("/organisations/cac/search", { searchTerm: normalized });

    if (response.data.found && response.data.businessName) {
      formData.registeredBusinessName = response.data.businessName;
      errors.registeredBusinessName = "";
      return;
    }

    errors.cacNumber =
      response.data.message || "No CAC registration was found for this number.";
  } catch (error) {
    errors.cacNumber = getApiErrorMessage(
      error,
      "CAC search is temporarily unavailable. Please try again.",
    );
  } finally {
    isSearchingCac.value = false;
  }
}

watch(
  () => [formData.accountNumber, formData.bankName],
  () => {
    void resolveAccountName();
  },
);

onMounted(() => {
  void loadBanks();
});

watch(
  () => formData.bankName,
  (value) => {
    if (value) errors.bankName = "";
  },
);

watch(
  () => formData.accountNumber,
  (value) => {
    if (value.trim() && value.length >= 10) errors.accountNumber = "";
  },
);

watch(
  () => formData.accountName,
  (value) => {
    if (value.trim()) errors.accountName = "";
  },
);

watch(
  () => formData.cacNumber,
  (value) => {
    formData.cacNumber = normalizeCacNumber(value);
    if (isValidCacNumber(value)) errors.cacNumber = "";
    void searchCacRegistration(value);
  },
);

watch(
  () => formData.registeredBusinessName,
  (value) => {
    if (value.trim()) errors.registeredBusinessName = "";
  },
);

function validate() {
  let valid = true;
  Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ""));

  if (!formData.bankName) {
    errors.bankName = "Please select a bank.";
    valid = false;
  }
  if (!formData.accountNumber.trim() || formData.accountNumber.length < 10) {
    errors.accountNumber = "Enter a valid 10-digit account number.";
    valid = false;
  }
  if (!formData.accountName.trim()) {
    errors.accountName = "Account name is required.";
    valid = false;
  }
  if (!isValidCacNumber(formData.cacNumber)) {
    errors.cacNumber = "Enter a valid CAC number, for example RC1234567.";
    valid = false;
  }
  if (!formData.registeredBusinessName.trim()) {
    errors.registeredBusinessName = "Registered business name is required.";
    valid = false;
  }

  return valid;
}

function handleSubmit() {
  if (!validate()) return;
  emit("submit", { ...formData });
}
</script>

<style scoped>
.step4-form {
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
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.15rem;
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

/* Match Banner */
.match-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
}
.match-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
}
.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #3fd246;
  margin-top: 0.125rem;
  flex-shrink: 0;
  cursor: pointer;
}
.checkbox-text {
  font-size: 0.825rem;
  color: #4b5563;
  line-height: 1.4;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}

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

.btn-create {
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
.btn-create:hover:not(:disabled) {
  background: #34c03b;
  transform: translateY(-1px);
}
.btn-create:disabled {
  opacity: 0.65;
  cursor: wait;
}
.spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 0.8s linear infinite;
}
.submit-error {
  margin-top: 0.5rem;
  display: block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.btn-arrow-left {
  width: 1rem;
  height: 1rem;
}
</style>

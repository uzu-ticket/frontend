<template>
  <div :class="wrapperClasses">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {{ label }}
    </label>

    <div
      class="phone-input-wrapper"
      :class="[
        error ? 'phone-input-wrapper--error' : '',
        disabled ? 'phone-input-wrapper--disabled' : '',
      ]"
    >
      <!-- Country Selector -->
      <div
        ref="triggerRef"
        class="country-selector"
        :class="{ 'country-selector--disabled': disabled }"
        role="button"
        :aria-label="`Select country, currently ${selectedCountry.name}`"
        :aria-haspopup="true"
        :aria-expanded="isPickerOpen"
        tabindex="0"
        @mousedown.prevent
        @click="togglePicker()"
        @keydown.space.prevent="togglePicker()"
        @keydown.enter.prevent="togglePicker()"
      >
        <span class="flag" aria-hidden="true">{{ selectedCountry.flag }}</span>
        <span class="dial-code">{{ selectedCountry.dialCode }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="chevron"
          :class="{ 'chevron--open': isPickerOpen }"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 8l6 6 6-6"
          />
        </svg>
      </div>

      <!-- Phone Number Input -->
      <input
        :id="inputId"
        ref="inputRef"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        :value="phoneRaw"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="handleInput"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />

      <div
        v-if="isPickerOpen"
        class="country-picker"
        :class="`country-picker--${pickerPlacement}`"
        role="dialog"
        aria-modal="true"
        aria-label="Select a country"
        @click.stop
        @keydown.escape.window="closePicker"
      >
        <div class="picker-search-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="picker-search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref="searchRef"
            v-model="searchQuery"
            type="text"
            class="picker-search-input"
            placeholder="Search country"
            autocomplete="off"
          />
        </div>

        <div class="picker-list">
          <button
            v-for="country in filteredCountries"
            :key="country.code"
            type="button"
            class="picker-item"
            :class="{
              'picker-item--selected': country.code === selectedCountry.code,
            }"
            @click="selectCountry(country)"
          >
            <span class="picker-flag">{{ country.flag }}</span>
            <span class="picker-name">{{ country.name }}</span>
            <span class="picker-dial">{{ country.dialCode }}</span>
          </button>

          <div v-if="filteredCountries.length === 0" class="picker-no-results">
            No results found
          </div>
        </div>
      </div>
    </div>

    <p v-if="hint" class="mt-1.5 text-sm text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" class="mt-1.5 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  useId,
} from "vue";

export interface PhoneCountry {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  defaultCountry?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "802 333 4566",
  size: "md",
  defaultCountry: "NG",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:countryCode": [value: string];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  "update:country": [country: PhoneCountry];
}>();

const countries: PhoneCountry[] = [
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
];

const inputId = useId();
const inputRef = ref<HTMLInputElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);

const phoneRaw = ref("");
const searchQuery = ref("");
const isPickerOpen = ref(false);
const pickerPlacement = ref<"top" | "bottom">("bottom");

const selectedCountry = ref<PhoneCountry>(
  countries.find((c) => c.code === props.defaultCountry) ?? countries[0]!,
);

function parseModelValue(val: string | undefined) {
  const digits = (val ?? "").replace(/\D/g, "");
  if (!digits) {
    phoneRaw.value = "";
    return;
  }
  let matched = false;
  const sorted = countries
    .slice()
    .sort((a, b) => b.dialCode.length - a.dialCode.length);
  for (const c of sorted) {
    const dcDigits = c.dialCode.slice(1);
    if (dcDigits && digits.startsWith(dcDigits)) {
      selectedCountry.value = c;
      phoneRaw.value = digits.slice(dcDigits.length);
      matched = true;
      break;
    }
  }
  if (!matched) {
    phoneRaw.value = digits;
  }
}

watch(() => props.modelValue, parseModelValue, { immediate: true });

const filteredCountries = computed(() => {
  if (!searchQuery.value.trim()) return countries;
  const q = searchQuery.value.toLowerCase().trim();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.includes(q.replace("+", "")),
  );
});

const baseClasses =
  "block w-full bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200 disabled:cursor-not-allowed";

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "text-sm py-2.5",
  md: "text-base py-3.5",
  lg: "text-lg py-4",
};

const inputClasses = computed(() =>
  [
    baseClasses,
    sizeClasses[props.size],
    "flex-1 bg-transparent border-0 outline-none pl-3 pr-4",
  ]
    .filter(Boolean)
    .join(" "),
);

const wrapperClasses = "w-full";

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const digits = target.value.replace(/\D/g, "");
  if (target.value !== digits) {
    target.value = digits;
  }
  phoneRaw.value = digits;
  const full = digits ? `${selectedCountry.value.dialCode}${digits}` : "";
  emit("update:modelValue", full);
  emit("update:countryCode", selectedCountry.value.code);
}

function onInputFocus(event: FocusEvent) {
  isPickerOpen.value = false;
  emit("focus", event);
}

function onInputBlur(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null;
  const isInsidePicker =
    nextTarget &&
    (nextTarget === triggerRef.value ||
      (nextTarget instanceof HTMLElement &&
        nextTarget.closest(".country-picker")));

  setTimeout(() => {
    if (isPickerOpen.value && isInsidePicker) return;
    if (isPickerOpen.value) return;
    emit("blur", event);
  }, 150);
}

function updatePickerPlacement() {
  if (!triggerRef.value || !isPickerOpen.value) return;

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const gap = 8;
  const pickerHeight = 240;
  const spaceAbove = triggerRect.top - gap;
  const spaceBelow = window.innerHeight - triggerRect.bottom - gap;

  pickerPlacement.value =
    spaceBelow >= pickerHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
}

function handleViewportChange() {
  updatePickerPlacement();
}

function togglePicker() {
  if (props.disabled || props.readonly) return;

  isPickerOpen.value = !isPickerOpen.value;
  if (isPickerOpen.value) {
    searchQuery.value = "";
    nextTick(() => {
      updatePickerPlacement();
      searchRef.value?.focus();
    });
  }
}

function openPicker() {
  if (props.disabled || props.readonly) return;
  isPickerOpen.value = true;
  searchQuery.value = "";
  nextTick(() => {
    updatePickerPlacement();
    searchRef.value?.focus();
  });
}

function closePicker() {
  isPickerOpen.value = false;
  searchQuery.value = "";
}

function selectCountry(country: PhoneCountry) {
  selectedCountry.value = country;
  searchQuery.value = "";
  closePicker();
  const full = phoneRaw.value ? `${country.dialCode}${phoneRaw.value}` : "";
  emit("update:modelValue", full);
  emit("update:countryCode", country.code);
  emit("update:country", country);
  nextTick(() => inputRef.value?.focus());
}

function onDocKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isPickerOpen.value) {
    closePicker();
    inputRef.value?.focus();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onDocKeydown);
  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("scroll", handleViewportChange, true);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onDocKeydown);
  window.removeEventListener("resize", handleViewportChange);
  window.removeEventListener("scroll", handleViewportChange, true);
});
</script>

<style scoped>
.phone-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  overflow: visible;
  transition: all 0.15s ease;
}

.phone-input-wrapper:focus-within {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.phone-input-wrapper--error {
  border-color: #ef4444 !important;
}

.phone-input-wrapper--error:focus-within {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}

.phone-input-wrapper--disabled {
  background: #f9fafb;
  opacity: 0.7;
}

/* Country Selector */
.country-selector {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0 0.75rem;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
  min-width: 90px;
  flex-shrink: 0;
  justify-content: center;
}

.country-selector:hover {
  background: #ffffff;
}

.country-selector--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.flag {
  font-size: 1.1rem;
}

.dial-code {
  font-size: 0.825rem;
  font-weight: 700;
  color: #1f2937;
}

.chevron {
  width: 0.8rem;
  height: 0.8rem;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.chevron--open {
  transform: rotate(180deg);
}

/* Phone Input Field */
.phone-input-wrapper input {
  flex: 1 1 auto;
  width: 100%;
  background: transparent;
}

.phone-input-wrapper input::placeholder {
  color: #9ca3af;
}

.phone-input-wrapper input:focus {
  outline: none;
}

/* Country Picker Overlay */
.country-picker {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  max-height: 240px;
  background: #ffffff;
  border-radius: 0.875rem;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 30;
}

.country-picker--bottom {
  top: calc(100% + 8px);
}

.country-picker--top {
  bottom: calc(100% + 8px);
}

.picker-search-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.875rem;
  border-bottom: 1px solid #f3f4f6;
}

.picker-search-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.picker-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #1f2937;
}

.picker-list {
  overflow-y: auto;
  padding: 0.4rem 0;
  scrollbar-width: thin;
}

.picker-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.875rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background 0.12s ease;
}

.picker-item:hover {
  background: #f9fafb;
}

.picker-item--selected {
  background: #ecfdf5;
  color: #0e2615;
  font-weight: 700;
}

.picker-flag {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.picker-name {
  flex: 1;
}

.picker-dial {
  font-weight: 700;
  color: #6b7280;
}

.picker-no-results {
  padding: 1rem;
  text-align: center;
  font-size: 0.825rem;
  color: #9ca3af;
}

/* Transitions */
.picker-fade-enter-active,
.picker-fade-leave-active {
  transition: opacity 0.15s ease;
}

.picker-fade-enter-from,
.picker-fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { isAxiosError } from "axios";
import { useApi } from "~/composables/useApi";
import AppSelect from "~/components/ui/AppSelect.vue";
import DatePicker from "~/components/ui/DatePicker.vue";

useHead({
  title: "Join the waitlist — Uzu Ticket",
  meta: [
    {
      name: "description",
      content:
        "Be first to experience a better way to discover and run events with Uzu Ticket.",
    },
  ],
});

type Audience = "organiser" | "promoter" | "ticket-buyer";

const audienceOptions: {
  value: Audience;
  title: string;
  description: string;
}[] = [
  {
    value: "organiser",
    title: "Event organiser",
    description: "I create and run events",
  },
  {
    value: "promoter",
    title: "Promoter",
    description: "I help events find their crowd",
  },
  {
    value: "ticket-buyer",
    title: "Ticket buyer",
    description: "I love going out",
  },
];

const form = reactive({
  fullName: "",
  email: "",
  whatsapp: "",
  audience: "" as Audience | "",
  city: "",
  eventType: "",
  nextEventDate: "",
  eventLink: "",
});

const errors = reactive<Record<string, string>>({});
const submitted = ref(false);
const submitting = ref(false);
const submissionError = ref("");
const isOrganiser = computed(() => form.audience === "organiser");
const { instance } = useApi();

const eventTypes = [
  "Concerts & live music",
  "Festivals",
  "Nightlife & parties",
  "Arts & culture",
  "Food & drink",
  "Sports",
  "Conferences & business",
  "Other",
];
const eventTypeOptions = eventTypes.map((eventType) => ({
  value: eventType,
  label: eventType,
}));

const nextEventDatePicker = computed<Date | null>({
  get() {
    if (!form.nextEventDate) return null;
    const [year, month, day] = form.nextEventDate.split("-").map(Number);
    if (year === undefined || month === undefined || day === undefined) {
      return null;
    }
    return new Date(year, month - 1, day);
  },
  set(date) {
    form.nextEventDate = date
      ? [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-")
      : "";
  },
});

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!form.email.trim() && !form.whatsapp.trim()) {
    errors.contact =
      "Add an email address or WhatsApp number so we can reach you.";
  } else if (
    form.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.audience)
    errors.audience = "Choose the option that best describes you.";
  if (!form.city.trim()) errors.city = "Please enter your city.";
  if (isOrganiser.value && !form.eventType)
    errors.eventType = "Choose an event type.";
  if (isOrganiser.value && !form.nextEventDate)
    errors.nextEventDate = "Add your next event date.";

  return Object.keys(errors).length === 0;
}

async function handleSubmit() {
  if (!validate()) {
    submitted.value = false;
    return;
  }

  submitting.value = true;
  submissionError.value = "";

  try {
    await instance.post("/waitlist", {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      audience: form.audience,
      city: form.city.trim(),
      eventType: form.eventType || undefined,
      nextEventDate: form.nextEventDate || undefined,
      eventLink: form.eventLink.trim() || undefined,
    });
    submitted.value = true;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data?.message
      : undefined;
    submissionError.value = Array.isArray(message)
      ? message.join(" ")
      : typeof message === "string"
        ? message
        : "We couldn’t add you to the waitlist. Please try again.";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="waitlist-page">
    <section class="story-panel" aria-labelledby="story-title">
      <div class="story-inner">
        <NuxtLink to="/" class="brand" aria-label="Uzu Ticket home">
          <img src="/uzu-logo.png" alt="Uzu Ticket" class="brand-logo" />
        </NuxtLink>

        <div class="story-copy">
          <span class="eyebrow"
            ><span class="eyebrow-dot" /> A better kind of event starts
            here</span
          >
          <h1 id="story-title">
            Make room<br />
            for <span>what’s next.</span>
          </h1>
          <p class="story-description">
            The people, places and plans that make a city come alive. Get in
            early with Uzu.
          </p>

          <div class="story-note">
            <div class="note-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v1a2.5 2.5 0 0 0 0 5v1a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 14.5v-1a2.5 2.5 0 0 0 0-5v-1Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.5 8.5v1m0 2v1m0 2v1"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div>
              <p class="note-title">Your city. Your kind of fun.</p>
              <p class="note-copy">
                One home for the events you love and the people behind them.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="orbit orbit-one" aria-hidden="true" />
      <div class="orbit orbit-two" aria-hidden="true" />
      <div class="spark spark-one" aria-hidden="true">✳</div>
      <div class="spark spark-two" aria-hidden="true">✳</div>
    </section>

    <section class="form-panel" aria-labelledby="form-title">
      <div class="form-shell">
        <header v-if="!submitted" class="form-header">
          <div class="mobile-brand">
            <img src="/uzu-logo.png" alt="" class="brand-logo" />
          </div>
          <div class="form-heading">
            <span class="form-kicker">A little ahead of the crowd</span>
            <h2 id="form-title">
              Get on the list<span class="heading-period">.</span>
            </h2>
            <p>
              Tell us a little about yourself. We’ll let you know when Uzu is
              ready for your city.
            </p>
          </div>
        </header>

        <form
          v-if="!submitted"
          class="waitlist-form"
          novalidate
          @submit.prevent="handleSubmit"
        >
          <div class="field">
            <label for="full-name"
              >Full name <span class="required">*</span></label
            >
            <input
              id="full-name"
              v-model="form.fullName"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="e.g. Alex Johnson"
              :aria-invalid="!!errors.fullName"
              :aria-describedby="
                errors.fullName ? 'full-name-error' : undefined
              "
            />
            <span
              v-if="errors.fullName"
              id="full-name-error"
              class="field-error"
              >{{ errors.fullName }}</span
            >
          </div>

          <div class="contact-fields">
            <div class="field">
              <label for="email"
                >Email address
                <span v-if="!form.whatsapp" class="required">*</span></label
              >
              <div class="input-with-icon">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="m3 5.75 6.12 4.38a1.5 1.5 0 0 0 1.76 0L17 5.75M4.5 4.5h11A1.5 1.5 0 0 1 17 6v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14V6a1.5 1.5 0 0 1 1.5-1.5Z"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="
                    errors.email ? 'email-error' : 'contact-hint'
                  "
                />
              </div>
              <span v-if="errors.email" id="email-error" class="field-error">{{
                errors.email
              }}</span>
            </div>
            <div class="field">
              <label for="whatsapp"
                >WhatsApp number
                <span v-if="!form.email" class="required">*</span></label
              >
              <div class="input-with-icon">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M16.5 9.67a6.5 6.5 0 0 1-9.62 5.7L3 16.5l1.14-3.45a6.5 6.5 0 1 1 12.36-3.38Z"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.1 7.1c.15-.34.3-.35.5-.36h.42c.13 0 .3.05.38.27l.53 1.27c.07.17.06.3-.04.43l-.4.48c-.1.11-.2.23-.08.44.12.22.53.87 1.13 1.4.77.68 1.42.9 1.65 1.01.22.11.36.1.49-.05l.61-.71c.15-.17.3-.2.5-.12l1.2.57c.2.1.34.15.39.24.05.1.05.54-.13 1.05-.18.5-1.02.98-1.42 1.02-.36.03-.82.05-1.32-.11-.3-.1-.7-.23-1.2-.45-2.1-.91-3.48-3.1-3.59-3.25-.1-.15-.85-1.12-.85-2.13 0-1.01.52-1.5.7-1.7Z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  id="whatsapp"
                  v-model="form.whatsapp"
                  type="tel"
                  name="whatsapp"
                  autocomplete="tel"
                  placeholder="+234 800 000 0000"
                  :aria-invalid="!!errors.contact"
                  aria-describedby="contact-hint"
                />
              </div>
            </div>
          </div>
          <p
            id="contact-hint"
            class="field-hint"
            :class="{ 'field-error': errors.contact }"
          >
            {{ errors.contact || "Add at least one way for us to reach you." }}
          </p>

          <fieldset class="field audience-field">
            <legend>
              Which best describes you? <span class="required">*</span>
            </legend>
            <div class="audience-options">
              <label
                v-for="option in audienceOptions"
                :key="option.value"
                class="audience-option"
                :class="{
                  'audience-option--selected': form.audience === option.value,
                }"
              >
                <input
                  v-model="form.audience"
                  type="radio"
                  name="audience"
                  :value="option.value"
                />
                <span class="radio-mark" aria-hidden="true" />
                <span class="audience-copy">
                  <span class="audience-title">{{ option.title }}</span>
                  <span class="audience-description">{{
                    option.description
                  }}</span>
                </span>
              </label>
            </div>
            <span v-if="errors.audience" class="field-error">{{
              errors.audience
            }}</span>
          </fieldset>

          <div class="field">
            <label for="city">Your city <span class="required">*</span></label>
            <div class="input-with-icon">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M16.5 8.33c0 4.17-6.5 9.17-6.5 9.17s-6.5-5-6.5-9.17a6.5 6.5 0 1 1 13 0Z"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linejoin="round"
                />
                <circle
                  cx="10"
                  cy="8.33"
                  r="2.17"
                  stroke="currentColor"
                  stroke-width="1.4"
                />
              </svg>
              <input
                id="city"
                v-model="form.city"
                type="text"
                name="city"
                autocomplete="address-level2"
                placeholder="e.g. Lagos"
                :aria-invalid="!!errors.city"
              />
            </div>
            <span v-if="errors.city" class="field-error">{{
              errors.city
            }}</span>
          </div>

          <div v-if="isOrganiser" class="organiser-fields">
            <div class="section-divider">
              <span>For event organisers</span>
              <i />
            </div>
            <div class="event-fields">
              <div class="field">
                <label for="event-type"
                  >What kind of events? <span class="required">*</span></label
                >
                <AppSelect
                  v-model="form.eventType"
                  :options="eventTypeOptions"
                  placeholder="Select event type"
                  :error="errors.eventType"
                />
              </div>
              <div class="field">
                <label>
                  When’s your next event?
                  <span class="required">*</span>
                </label>
                <DatePicker
                  v-model="nextEventDatePicker"
                  placeholder="Select event date"
                  :error="errors.nextEventDate"
                />
              </div>
            </div>
          </div>

          <div class="field">
            <label for="event-link"
              >Event name or social page
              <span class="optional">Optional</span></label
            >
            <div class="input-with-icon">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M8.33 11.67a3.33 3.33 0 0 0 5 .36l2-2a3.33 3.33 0 0 0-4.71-4.71l-1.15 1.15M11.67 8.33a3.33 3.33 0 0 0-5-.36l-2 2a3.33 3.33 0 0 0 4.71 4.71l1.15-1.15"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                id="event-link"
                v-model="form.eventLink"
                type="text"
                name="event-link"
                placeholder="Name, Instagram handle or link"
              />
            </div>
          </div>

          <p v-if="submissionError" class="submission-error" role="alert">
            {{ submissionError }}
          </p>
          <button type="submit" class="submit-button" :disabled="submitting">
            <span>{{ submitting ? "Joining…" : "Join the waitlist" }}</span>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.17 10h11.66m-5-5 5 5-5 5"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </form>

        <div v-else class="success-state" role="status" aria-live="polite">
          <div class="mobile-brand success-brand" aria-label="Uzu Ticket">
            <img src="/uzu-logo.png" alt="Uzu Ticket" class="brand-logo" />
          </div>
          <div class="success-content">
            <div class="success-mark" aria-hidden="true">
              <span class="success-mark-halo"></span>
              <span class="success-mark-circle">
                <svg viewBox="0 0 32 32" fill="none">
                  <path
                    d="m8 16.5 5.2 5.2L24.5 10"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
            <span class="success-label">
              <span class="success-label-dot"></span>
              You’re on the list
            </span>
            <h3>
              This is the start<br />
              of something <span>good.</span>
            </h3>
            <p class="success-message">
              Thanks for joining us, {{ form.fullName.split(" ")[0] }}. We’ll
              reach out when Uzu is ready to bring your city together.
            </p>
            <div class="success-city">
              <span class="success-city-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M16.5 8.33c0 4.17-6.5 9.17-6.5 9.17s-6.5-5-6.5-9.17a6.5 6.5 0 1 1 13 0Z"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linejoin="round"
                  />
                  <circle cx="10" cy="8.33" r="2.17" stroke="currentColor" stroke-width="1.4" />
                </svg>
              </span>
              <span class="success-city-copy">
                <span class="success-city-label">Coming to</span>
                <strong>{{ form.city }}</strong>
              </span>
              <span class="success-city-spark" aria-hidden="true">✳</span>
            </div>
            <p class="success-footnote">
              Keep an eye on your inbox. Good things are on the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.waitlist-page {
  --ink: #14251b;
  --muted: #788179;
  --green: #44d34c;
  --green-dark: #239c3b;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  color: var(--ink);
  background: #fbfcf9;
}

.story-panel {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
  background: #102719;
  color: #fff;
}

.story-panel::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 95% 15%,
      rgba(63, 210, 70, 0.19),
      transparent 33%
    ),
    radial-gradient(
      ellipse at 8% 85%,
      rgba(65, 145, 76, 0.15),
      transparent 38%
    ),
    linear-gradient(150deg, #102719 4%, #132d1e 58%, #0b1e13 100%);
  content: "";
}

.story-inner {
  z-index: 1;
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: clamp(1.25rem, 3.2vw, 3rem) clamp(1.5rem, 4.2vw, 4.5rem);
}

.brand,
.mobile-brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  color: white;
  text-decoration: none;
}

.brand-logo {
  width: 2.7rem;
  height: 2.2rem;
  object-fit: contain;
}

.story-copy {
  max-width: 440px;
  margin: auto 0;
  padding: 1.5rem 0 2rem;
}

.eyebrow,
.form-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #81d986;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 4px rgba(68, 211, 76, 0.14);
}

.story-copy h1 {
  margin: 1.5rem 0 1.1rem;
  font-size: clamp(3rem, 4.6vw, 4.8rem);
  font-weight: 600;
  letter-spacing: -0.075em;
  line-height: 0.98;
}

.story-copy h1 span {
  color: var(--green);
}

.story-description {
  max-width: 340px;
  margin: 0;
  color: #bbc8bd;
  font-size: 1rem;
  line-height: 1.8;
}

.story-note {
  display: flex;
  max-width: 385px;
  align-items: flex-start;
  gap: 0.95rem;
  margin-top: 2rem;
  padding: 1.05rem 1.15rem;
  border: 1px solid rgba(206, 236, 207, 0.12);
  border-radius: 1rem;
  background: rgba(236, 255, 236, 0.045);
  backdrop-filter: blur(10px);
}

.note-icon {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.8rem;
  background: rgba(68, 211, 76, 0.14);
  color: var(--green);
}

.note-icon svg {
  width: 1.3rem;
  height: 1.3rem;
}

.note-title,
.note-copy {
  margin: 0;
}

.note-title {
  padding-top: 0.08rem;
  font-size: 0.87rem;
  font-weight: 600;
}

.note-copy {
  margin-top: 0.25rem;
  color: #aab8ad;
  font-size: 0.74rem;
  line-height: 1.55;
}

.orbit {
  position: absolute;
  z-index: -1;
  right: -10rem;
  bottom: 10%;
  width: 28rem;
  height: 28rem;
  border: 1px solid rgba(183, 233, 184, 0.09);
  border-radius: 50%;
  pointer-events: none;
}

.orbit-two {
  right: -6rem;
  bottom: 4%;
  width: 20rem;
  height: 20rem;
  border-color: rgba(183, 233, 184, 0.08);
}

.spark {
  position: absolute;
  color: rgba(102, 217, 108, 0.5);
  font-size: 1.5rem;
}

.spark-one {
  top: 23%;
  right: 15%;
}
.spark-two {
  right: 10%;
  bottom: 22%;
  font-size: 0.9rem;
}

.form-panel {
  display: flex;
  min-width: 0;
  height: 100%;
  min-height: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(1rem, 2.6vw, 2.5rem) clamp(1.5rem, 4vw, 4rem);
}

.form-shell {
  width: 100%;
  max-width: 590px;
}

.mobile-brand {
  display: none;
  color: var(--ink);
}

.mobile-brand .brand-logo {
  width: 2.7rem;
  height: 2.2rem;
}

.form-heading {
  margin-bottom: 1.15rem;
}

.form-heading .form-kicker,
.success-state .form-kicker {
  color: #379847;
}

.form-heading h2 {
  margin: 0.48rem 0 0.55rem;
  color: #14251b;
  font-size: clamp(2rem, 3vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.065em;
  line-height: 1.1;
}

.heading-period {
  color: #41c94c;
}

.form-heading > p {
  max-width: 445px;
  margin: 0;
  color: #7d877f;
  font-size: 0.86rem;
  line-height: 1.65;
}

.waitlist-form {
  display: flex;
  flex-direction: column;
  gap: 0.72rem;
}

.field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.42rem;
}

.field label,
.audience-field legend {
  color: #354239;
  font-size: 0.75rem;
  font-weight: 600;
}

.required {
  color: #34b946;
}

.optional {
  margin-left: 0.3rem;
  color: #9aa29b;
  font-size: 0.67rem;
  font-weight: 400;
}

.field input,
.field select {
  width: 100%;
  height: 2.55rem;
  border: 1px solid #e3e8e1;
  border-radius: 0.68rem;
  outline: none;
  background: #fff;
  color: #25352a;
  font: inherit;
  font-size: 0.8rem;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;
}

.field input {
  padding: 0 0.9rem;
}

.field select {
  padding: 0 2rem 0 0.8rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%237d877f' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
}

.field input::placeholder {
  color: #b0b7b1;
}

.field input:focus,
.field select:focus {
  border-color: #49cb54;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(68, 211, 76, 0.12);
}

.field input[aria-invalid="true"],
.field select[aria-invalid="true"] {
  border-color: #d96a5f;
}

.input-with-icon {
  position: relative;
}

.input-with-icon > svg {
  position: absolute;
  top: 50%;
  left: 0.82rem;
  width: 1rem;
  height: 1rem;
  transform: translateY(-50%);
  color: #9ba69d;
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 2.45rem;
}

.contact-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.field-hint {
  margin: -0.72rem 0 0;
  color: #939c95;
  font-size: 0.65rem;
}

.field-error {
  display: block;
  color: #b54840 !important;
  font-size: 0.66rem !important;
  font-weight: 500;
}

.audience-field {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.audience-field legend {
  margin-bottom: 0.5rem;
  padding: 0;
}

.audience-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
}

.audience-option {
  display: flex;
  min-height: 3.55rem;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.67rem 0.58rem;
  border: 1px solid #e5e9e3;
  border-radius: 0.7rem;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
}

.audience-option:hover {
  border-color: #a9dbad;
}

.audience-option--selected {
  border-color: #4acb55;
  background: #f3fbf2;
  box-shadow: 0 0 0 2px rgba(68, 211, 76, 0.08);
}

.audience-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.audience-option:focus-within {
  outline: 2px solid rgba(68, 211, 76, 0.55);
  outline-offset: 2px;
}

.radio-mark {
  display: grid;
  width: 0.88rem;
  height: 0.88rem;
  flex: 0 0 auto;
  margin-top: 0.08rem;
  place-items: center;
  border: 1.3px solid #c9d1c9;
  border-radius: 50%;
}

.audience-option--selected .radio-mark {
  border-color: #35b746;
}

.audience-option--selected .radio-mark::after {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: #35b746;
  content: "";
}

.audience-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.15rem;
}

.audience-title {
  color: #27372c;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.3;
}

.audience-description {
  color: #929b93;
  font-size: 0.56rem;
  line-height: 1.35;
}

.organiser-fields {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.section-divider {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #379847;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.section-divider i {
  height: 1px;
  flex: 1;
  background: #e5ece3;
}

.event-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.event-fields .field label {
  min-height: 1.05rem;
}

.event-fields :deep(.select-trigger),
.event-fields :deep(.date-trigger) {
  min-height: 2.3rem;
  padding: 0.45rem 0.8rem;
  border-color: #e3e8e1;
  border-radius: 0.68rem;
}

.event-fields :deep(.select-value),
.event-fields :deep(.trigger-value) {
  color: #25352a;
  font-size: 0.8rem;
  font-weight: 400;
}

.event-fields :deep(.select-placeholder),
.event-fields :deep(.trigger-placeholder) {
  color: #b0b7b1;
}

.event-fields :deep(.select-trigger--open),
.event-fields :deep(.date-trigger--open) {
  border-color: #49cb54;
  box-shadow: 0 0 0 3px rgba(68, 211, 76, 0.12);
}

.event-fields :deep(.select-trigger--error),
.event-fields :deep(.date-trigger--error) {
  border-color: #d96a5f;
}

.event-fields :deep(.error-text) {
  font-size: 0.66rem;
}

.submit-button {
  display: flex;
  width: 100%;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 0.25rem;
  border: 0;
  border-radius: 0.72rem;
  background: #42c94d;
  box-shadow: 0 6px 15px rgba(46, 178, 58, 0.17);
  color: #102519;
  cursor: pointer;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  transition:
    transform 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
}

.submit-button svg {
  width: 1.08rem;
  height: 1.08rem;
  transition: transform 150ms ease;
}

.submit-button:hover {
  transform: translateY(-1px);
  background: #52da5d;
  box-shadow: 0 9px 20px rgba(46, 178, 58, 0.23);
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.submission-error {
  margin: 0;
  color: #b54840;
  font-size: 0.72rem;
}

.submit-button:hover svg {
  transform: translateX(3px);
}

.submit-button:focus-visible {
  outline: 3px solid rgba(39, 153, 52, 0.4);
  outline-offset: 3px;
}

.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.42rem;
  margin: -0.28rem 0 0;
  color: #919a92;
  font-size: 0.63rem;
}

.privacy-note svg {
  width: 0.83rem;
  height: 0.83rem;
  color: #55ae5d;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.48rem;
  margin-top: 1.15rem;
  color: #a2aaa3;
  font-size: 0.62rem;
}

.footer-separator {
  color: #c1c8c1;
}

.success-state {
  position: relative;
  display: flex;
  min-height: min(42rem, 100%);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.success-state::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(34rem, 115%);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(68, 211, 76, 0.09), rgba(68, 211, 76, 0) 68%);
  content: "";
  pointer-events: none;
}

.success-brand {
  display: none;
  align-self: flex-start;
}

.success-content {
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 27rem;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.success-mark {
  position: relative;
  display: grid;
  width: 6.3rem;
  height: 6.3rem;
  margin-bottom: 2rem;
  place-items: center;
}

.success-mark-halo,
.success-mark-circle {
  position: absolute;
  border-radius: 50%;
}

.success-mark-halo {
  inset: 0;
  border: 1px solid rgba(62, 190, 74, 0.2);
  background: rgba(73, 203, 84, 0.06);
  box-shadow: 0 0 0 0.65rem rgba(73, 203, 84, 0.035);
}

.success-mark-circle {
  display: grid;
  width: 4.1rem;
  height: 4.1rem;
  place-items: center;
  background: linear-gradient(145deg, #52d65c, #35b847);
  box-shadow: 0 9px 22px rgba(46, 178, 58, 0.23), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  color: #fff;
}

.success-mark-circle svg {
  width: 2rem;
  height: 2rem;
}

.success-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem 0.75rem;
  border: 1px solid #d8f0d8;
  border-radius: 99px;
  background: #f0faf0;
  color: #278c3a;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.success-label-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: #3bc54b;
  box-shadow: 0 0 0 3px rgba(59, 197, 75, 0.13);
}

.success-state h3 {
  margin: 1.15rem 0 0.75rem;
  color: #14251b;
  font-size: clamp(2.4rem, 4vw, 3.35rem);
  font-weight: 600;
  letter-spacing: -0.075em;
  line-height: 1.04;
}

.success-state h3 span {
  color: #39bb48;
}

.success-message {
  max-width: 24rem;
  margin: 0;
  color: #7d877f;
  font-size: 0.88rem;
  line-height: 1.75;
}

.success-city {
  display: flex;
  width: min(100%, 22rem);
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.8rem;
  padding: 0.85rem 1rem;
  border: 1px solid #e4ece3;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 8px 24px rgba(27, 55, 33, 0.045);
  text-align: left;
}

.success-city-icon {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.75rem;
  background: #eef9ed;
  color: #36a747;
}

.success-city-icon svg {
  width: 1.2rem;
  height: 1.2rem;
}

.success-city-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.12rem;
}

.success-city-label {
  color: #89938b;
  font-size: 0.64rem;
}

.success-city-copy strong {
  color: #213329;
  font-size: 0.88rem;
  font-weight: 600;
}

.success-city-spark {
  color: #46c653;
  font-size: 1rem;
}

.success-footnote {
  margin: 1.05rem 0 0;
  color: #a0a9a1;
  font-size: 0.67rem;
}

@media (max-width: 1050px) {
  .story-inner {
    padding-right: 1.8rem;
    padding-left: 1.8rem;
  }

  .form-panel {
    padding-right: 1.8rem;
    padding-left: 1.8rem;
  }
}

@media (max-width: 820px) {
  .waitlist-page {
    display: block;
    height: auto;
    min-height: 100vh;
    min-height: 100svh;
    overflow: visible;
  }

  .story-panel {
    display: none;
  }

  .form-panel {
    height: auto;
    min-height: 100vh;
    min-height: 100svh;
    overflow: visible;
    padding: 2.3rem 1.5rem;
  }

  .form-shell {
    max-width: 570px;
  }

  .mobile-brand {
    display: inline-flex;
    margin-bottom: 2.2rem;
  }

  .success-state {
    min-height: calc(100svh - 4.6rem);
  }

  .success-brand {
    display: inline-flex;
    margin: 0;
  }

  .success-content {
    flex: 1;
    justify-content: center;
    padding: 1.5rem 0;
  }
}

@media (max-width: 520px) {
  .form-panel {
    align-items: flex-start;
    padding: 1.5rem 1.15rem 2rem;
  }

  .mobile-brand {
    margin-bottom: 1.7rem;
  }

  .success-state {
    min-height: calc(100svh - 3.5rem);
  }

  .success-mark {
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom: 1.6rem;
  }

  .success-mark-circle {
    width: 3.65rem;
    height: 3.65rem;
  }

  .success-city {
    margin-top: 1.4rem;
  }

  .form-heading {
    margin-bottom: 1.35rem;
  }

  .form-heading h2 {
    font-size: 2.08rem;
  }

  .waitlist-form {
    gap: 0.9rem;
  }

  .contact-fields,
  .event-fields {
    grid-template-columns: 1fr;
    gap: 0.78rem;
  }

  .audience-options {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }

  .audience-option {
    min-height: 3.25rem;
    align-items: center;
    padding: 0.55rem 0.65rem;
  }

  .audience-description {
    font-size: 0.62rem;
  }

  .audience-title {
    font-size: 0.72rem;
  }

  .form-footer {
    flex-wrap: wrap;
    margin-top: 1.65rem;
  }
}

@media (max-height: 800px) and (min-width: 821px) {
  .form-panel {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
  }

  .form-heading {
    margin-bottom: 0.8rem;
  }

  .form-heading h2 {
    margin-top: 0.3rem;
    margin-bottom: 0.35rem;
    font-size: 2rem;
  }

  .form-heading > p {
    font-size: 0.78rem;
  }

  .waitlist-form {
    gap: 0.52rem;
  }

  .field {
    gap: 0.3rem;
  }

  .field input,
  .field select {
    height: 2.3rem;
  }

  .audience-option {
    min-height: 3.1rem;
    padding-top: 0.48rem;
    padding-bottom: 0.48rem;
  }

  .submit-button {
    height: 2.5rem;
  }

  .form-footer {
    margin-top: 0.7rem;
  }
}

@media (max-height: 680px) and (min-width: 821px) {
  .form-footer {
    display: none;
  }

  .form-heading > p {
    display: none;
  }

  .audience-option {
    min-height: 2.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

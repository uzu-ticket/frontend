<template>
  <div class="step5-form">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Preview &amp; Publish</h3>
      <p class="form-subtitle">Review your event before making it live.</p>
    </div>

    <div class="preview-content">
      <div class="preview-gallery">
        <SecureImage
          :src="mainImage"
          :alt="previewTitle"
          wrapper-class="preview-gallery-img-wrapper"
          img-class="preview-gallery-main"
        />
        <SecureImage
          :src="mainImage"
          :alt="previewTitle"
          wrapper-class="preview-gallery-img-wrapper"
          img-class="preview-gallery-side"
        />
      </div>

      <section class="event-details-section">
        <h1 class="event-preview-title">{{ previewTitle }}</h1>
        <p class="event-preview-desc">
          {{ eventDescription || "No description provided." }}
        </p>

        <div v-if="eventTags.length" class="event-tags">
          <span v-for="tag in eventTags" :key="tag" class="event-tag">{{
            tag
          }}</span>
        </div>

        <div class="event-info-row">
          <div class="event-info-item">
            <span class="event-info-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M8 3v4m8-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z"
                />
              </svg>
            </span>
            <span>{{ formattedDate || "Date TBD" }}</span>
          </div>
          <div class="event-info-item">
            <span class="event-info-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
            <span
              >{{ formattedStartTime || "Time TBD"
              }}<template v-if="formattedEndTime">
                – {{ formattedEndTime }}</template
              ></span
            >
          </div>
          <div class="event-info-item">
            <span class="event-info-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.2" />
              </svg>
            </span>
            <span
              >{{ visibilityLabel
              }}<span v-if="visibilityDesc" class="visibility-separator">·</span
              >{{ visibilityDesc }}</span
            >
          </div>
        </div>
      </section>

      <section class="preview-ticket-section">
        <h2 class="preview-section-title">Tickets</h2>
        <div class="preview-schedule-list">
          <article
            v-for="group in ticketGroups"
            :key="group.slotIndex"
            class="preview-schedule"
          >
            <div class="preview-schedule-heading">
              <div class="preview-schedule-title-group">
                <h3>
                  {{ group.name }}
                  <span class="schedule-batch-label"
                    >/ Batch {{ group.batch }}</span
                  >
                </h3>
                <span class="preview-ticket-count"
                  >{{ group.tickets.length }} ticket types</span
                >
                <p>These ticket types are available for this time slot.</p>
              </div>
              <div class="preview-schedule-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M8 3v4m8-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                  {{ group.date || "Date TBD" }}
                </span>
                <span v-if="group.time">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  {{ group.time }}
                </span>
              </div>
            </div>

            <div v-if="group.tickets.length" class="preview-ticket-grid">
              <article
                v-for="(ticket, index) in group.tickets"
                :key="`${group.slotIndex}-${index}`"
                class="preview-ticket-row"
              >
                <svg
                  class="preview-ticket-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
                  />
                  <path d="M13 5v2m0 2v2m0 2v2m0 2v2" />
                </svg>
                <div class="preview-ticket-identity">
                  <div class="preview-ticket-name-row">
                    <span class="preview-ticket-name">{{ ticket.type }}</span>
                    <span
                      class="preview-ticket-tag"
                      :class="ticketTagClass(ticket)"
                      >{{ ticketTag(ticket) }}</span
                    >
                  </div>
                  <span class="preview-ticket-price">{{
                    ticket.price || "Free"
                  }}</span>
                </div>
                <div class="preview-ticket-stat">
                  <span>Quantity</span>
                  <strong>{{ ticket.quantity || "0" }}</strong>
                </div>
                <div class="preview-ticket-stat">
                  <span>Sold</span>
                  <strong>{{ ticket.quantitySold || "0" }}</strong>
                </div>
              </article>
            </div>
            <div v-else class="preview-no-tickets">
              No tickets added for this schedule.
            </div>
          </article>
        </div>
      </section>

      <section class="preview-venue-section">
        <div class="preview-venue-heading">
          <h2 class="preview-section-title">Venue</h2>
          <div class="preview-venue-address">
            <span class="event-info-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.2" />
              </svg>
            </span>
            <strong>{{ locationName || "Venue TBD" }}</strong>
            <span>{{ locationCity }}</span>
          </div>
        </div>
        <iframe
          class="preview-venue-map"
          title="Map showing the event venue"
          src="https://www.openstreetmap.org/export/embed.html?bbox=3.382%2C6.423%2C3.458%2C6.485&layer=mapnik&marker=6.4541%2C3.4316"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        />
      </section>
    </div>

    <!-- Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="btn-arrow"
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

      <div class="footer-right-group">
        <button type="button" class="btn-draft" @click="$emit('save-draft')">
          Save as Draft
        </button>

        <button type="button" class="btn-publish" @click="$emit('publish')">
          <span>Publish Event</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import SecureImage from "~/components/ui/SecureImage.vue";

const props = defineProps<{
  eventData: Record<string, unknown>;
}>();

const emit = defineEmits<{
  back: [];
  "save-draft": [];
  publish: [];
}>();

const s1 = computed(
  () => props.eventData.step1 as Record<string, unknown> | undefined,
);
const s2 = computed(
  () => props.eventData.step2 as Record<string, unknown> | undefined,
);
const s3 = computed(
  () => props.eventData.step3 as Array<Record<string, unknown>> | undefined,
);
const previewTitle = computed(() =>
  String(s1.value?.eventName || "Untitled Event"),
);
const eventDescription = computed(() => String(s1.value?.description || ""));
const locationName = computed(() => String(s2.value?.venueName || ""));
const locationCity = computed(() => {
  const parts = [s2.value?.city, s2.value?.state, s2.value?.country]
    .map((part) => String(part || "").trim())
    .filter(Boolean);
  return [...new Set(parts)].join(", ");
});

const eventTags = computed(() => {
  const parts = [
    s1.value?.category,
    s2.value?.city,
    s2.value?.state,
    s2.value?.country,
  ]
    .map((part) => String(part || "").trim())
    .filter(Boolean);
  return [...new Set(parts)];
});

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: unknown, withWeekday = false): string {
  const date = parseDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    ...(withWeekday ? { weekday: "long" as const } : {}),
    month: "long",
    day: "numeric",
    ...(withWeekday ? {} : { year: "numeric" as const }),
  });
}

const formattedDate = computed(() => formatDate(s2.value?.startDate, true));
const formattedStartTime = computed(() => String(s2.value?.startTime || ""));
const formattedEndTime = computed(() => String(s2.value?.endTime || ""));

const visibilityLabel = computed(() => {
  const value = String(s1.value?.visibility || "");
  if (value === "public") return "Public Event";
  if (value === "unlisted") return "Unlisted Event";
  if (value === "rsvp") return "RSVP Event";
  return value || "Visibility not set";
});

const visibilityDesc = computed(() => {
  const value = String(s1.value?.visibility || "");
  if (value === "public") return "Anyone can attend";
  if (value === "unlisted") return "Anyone with the link can attend";
  if (value === "rsvp") return "Attendees must RSVP";
  return "";
});

const ticketGroups = computed(() => {
  const savedSlots = props.eventData.eventSlots;
  const schedules =
    Array.isArray(savedSlots) && savedSlots.length
      ? savedSlots
      : [
          {
            name: "Event Schedule",
            dateObj: s2.value?.startDate,
            startTime: s2.value?.startTime,
            endTime: s2.value?.endTime,
          },
        ];

  return schedules.map((value, slotIndex) => {
    const schedule = value as Record<string, unknown>;
    const tickets = (s3.value || []).filter(
      (ticket) =>
        (typeof ticket.slotIndex === "number" ? ticket.slotIndex : 0) ===
        slotIndex,
    );
    const startTime = String(schedule.startTime || s2.value?.startTime || "");
    const endTime = String(schedule.endTime || s2.value?.endTime || "");

    return {
      slotIndex,
      name: String(schedule.name || `Schedule ${slotIndex + 1}`),
      batch: String.fromCharCode(65 + slotIndex),
      tickets,
      date: formatDate(schedule.dateObj || s2.value?.startDate),
      time:
        startTime && endTime
          ? `${startTime} – ${endTime}`
          : startTime || endTime,
    };
  });
});

function ticketTag(ticket: Record<string, unknown>): string {
  const type = String(ticket.type || "").toLowerCase();
  if (type.includes("vip") || type.includes("premium")) return "Premium Access";
  if (type.includes("diamond") || type.includes("exclusive"))
    return "Exclusive Access";
  return "General Admission";
}

function ticketTagClass(ticket: Record<string, unknown>): string {
  const type = String(ticket.type || "").toLowerCase();
  if (type.includes("vip") || type.includes("premium"))
    return "preview-ticket-tag--premium";
  if (type.includes("diamond") || type.includes("exclusive"))
    return "preview-ticket-tag--exclusive";
  return "preview-ticket-tag--general";
}

const coverImageUrl = ref("");
let coverImageObjectUrl: string | null = null;

watch(
  () => s1.value?.coverImage,
  (image) => {
    if (coverImageObjectUrl && import.meta.client) {
      URL.revokeObjectURL(coverImageObjectUrl);
      coverImageObjectUrl = null;
    }

    if (typeof image === "string") {
      coverImageUrl.value = image;
    } else if (
      import.meta.client &&
      typeof File !== "undefined" &&
      image instanceof File
    ) {
      coverImageObjectUrl = URL.createObjectURL(image);
      coverImageUrl.value = coverImageObjectUrl;
    } else {
      coverImageUrl.value = "";
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (coverImageObjectUrl && import.meta.client) {
    URL.revokeObjectURL(coverImageObjectUrl);
  }
});

const mainImage = computed(
  () =>
    coverImageUrl.value ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1500&auto=format&fit=crop",
);
</script>

<style scoped>
.step5-form {
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 1.5rem;
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

/* ======================== */
/* 2-Column Grid */
/* ======================== */
.preview-body-grid {
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  gap: 1.75rem;
  margin-bottom: 2rem;
  align-items: start;
}

/* ======================== */
/* LEFT COLUMN */
/* ======================== */
.preview-left-col {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.cover-banner-wrapper {
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: 0.875rem;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.cover-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-details-section {
  display: flex;
  flex-direction: column;
}

.event-preview-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.45rem;
}

.event-preview-desc {
  font-size: 0.855rem;
  color: #6b7280;
  margin: 0 0 1.35rem;
  line-height: 1.55;
}

/* Info Cards */
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.85rem 0.75rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.card-icon-col {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.45rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.info-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: #6b7280;
}

.inline-clock {
  width: 0.7rem;
  height: 0.7rem;
  vertical-align: middle;
  margin-right: 2px;
  color: #9ca3af;
  display: inline;
}

.card-text-col {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.info-primary {
  font-size: 0.775rem;
  font-weight: 700;
  color: #0e2615;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-secondary {
  font-size: 0.725rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Ticket Section */
.ticket-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ticket-section-label {
  font-size: 0.925rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.tickets-preview-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.ticket-preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0.75rem;
  border-radius: 0.75rem;
  gap: 0.3rem;
}

.ticket--purple {
  background: #f3e8ff;
}
.ticket--purple .ticket-tag {
  color: #7e22ce;
}
.ticket--purple .ticket-price {
  color: #6b21a8;
}

.ticket--green {
  background: #dcfce7;
}
.ticket--green .ticket-tag {
  color: #15803d;
}
.ticket--green .ticket-price {
  color: #166534;
}

.ticket--yellow {
  background: #fef3c7;
}
.ticket--yellow .ticket-tag {
  color: #b45309;
}
.ticket--yellow .ticket-price {
  color: #92400e;
}

.ticket-tag {
  font-size: 0.8rem;
  font-weight: 800;
}

.ticket-price {
  font-size: 1.05rem;
  font-weight: 800;
}

/* ======================== */
/* RIGHT COLUMN */
/* ======================== */
.preview-right-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Media Card */
.media-box-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1.35rem 1.25rem;
  background: #ffffff;
}

.media-title {
  font-size: 0.925rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.2rem;
}

.media-sub {
  font-size: 0.775rem;
  color: #6b7280;
  margin: 0 0 1.15rem;
}

.media-field {
  display: flex;
  flex-direction: column;
}

.media-field--mt {
  margin-top: 1.15rem;
}

.media-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0e2615;
  margin-bottom: 0.6rem;
  display: block;
}

.required-star {
  color: #ef4444;
}

.media-thumbnails-row {
  display: flex;
  gap: 0.65rem;
  align-items: stretch;
}

.thumb-preview {
  border-radius: 0.6rem;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.thumb-preview--169 {
  width: 105px;
  height: 68px;
}

.thumb-preview--45 {
  width: 82px;
  height: 88px;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-image-btn {
  flex: 1;
  border: 1.5px dashed #d1d5db;
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  gap: 0.2rem;
}

.change-image-btn:hover {
  border-color: #3fd246;
  background: #f0fdf1;
}

.plus-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #9ca3af;
}

.change-label {
  font-size: 0.725rem;
  font-weight: 700;
  color: #0e2615;
}

.change-sub {
  font-size: 0.625rem;
  color: #9ca3af;
  line-height: 1.3;
}

/* Review Checklist */
.checklist-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1.25rem;
  background: #ffffff;
}

.checklist-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 1rem;
}

.checklist-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.checklist-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3fd246;
  flex-shrink: 0;
}

.checklist-text {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.checklist-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #0e2615;
}

.checklist-status {
  font-size: 0.725rem;
  color: #6b7280;
}

.edit-link {
  font-size: 0.775rem;
  font-weight: 700;
  color: #3fd246;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.edit-link:hover {
  opacity: 0.75;
}

/* Ready to Publish Banner */
.ready-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.15rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.875rem;
}

.ready-check-icon {
  width: 1.35rem;
  height: 1.35rem;
  color: #3fd246;
  flex-shrink: 0;
  margin-top: 1px;
}

.ready-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ready-heading {
  font-size: 0.85rem;
  font-weight: 800;
  color: #14532d;
}

.ready-sub {
  font-size: 0.775rem;
  color: #166534;
  line-height: 1.4;
}

/* ======================== */
/* FOOTER */
/* ======================== */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
  margin-top: auto;
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
}

.footer-right-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-draft {
  padding: 0.65rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-draft:hover {
  background: #f9fafb;
}

.btn-publish {
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
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
  transition: all 0.15s ease;
}

.btn-publish:hover {
  background: #34c03b;
  transform: translateY(-1px);
}
.btn-arrow {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 900px) {
  .preview-body-grid {
    grid-template-columns: 1fr;
  }

  .info-cards-grid {
    grid-template-columns: 1fr;
  }
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  margin-bottom: 2rem;
}

.preview-gallery {
  display: grid;
  height: 17.5rem;
  min-height: 0;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 0.9fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 0.75rem;
  overflow: hidden;
}

.preview-gallery-main,
.preview-gallery-side {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  border-radius: 0.6rem;
  object-fit: cover;
}

.preview-gallery-main {
  object-position: center 55%;
}

.preview-gallery-side {
  object-position: center;
}

:deep(.preview-gallery-img-wrapper) {
  width: 100%;
  height: 100%;
  border-radius: 0.6rem;
  overflow: hidden;
}

.event-details-section {
  display: flex;
  flex-direction: column;
}

.event-preview-title {
  margin: 0 0 0.45rem;
  color: #0e2615;
  font-size: 1.5rem;
  font-weight: 800;
}

.event-preview-desc {
  max-width: 58rem;
  margin: 0 0 1rem;
  color: #627067;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre-line;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.event-tag {
  padding: 0.35rem 0.65rem;
  border-radius: 99px;
  background: #eef4fd;
  color: #53677f;
  font-size: 0.68rem;
  font-weight: 600;
}

.event-info-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 2rem;
  color: #53665a;
  font-size: 0.72rem;
}

.event-info-item {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.45rem;
}

.event-info-icon {
  display: grid;
  width: 1.65rem;
  height: 1.65rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.35rem;
  background: #f0f5f1;
  color: #36c946;
}

.event-info-icon svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.visibility-separator {
  margin-inline: 0.4rem;
}

.preview-ticket-section,
.preview-venue-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-section-title {
  margin: 0;
  color: #0e2615;
  font-size: 1.2rem;
  font-weight: 800;
}

.preview-schedule-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.preview-schedule {
  padding-bottom: 0.15rem;
}

.preview-schedule-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.preview-schedule-title-group {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.65rem;
}

.preview-schedule-title-group h3 {
  margin: 0;
  color: #17231a;
  font-size: 0.85rem;
  font-weight: 750;
}

.schedule-batch-label {
  font-weight: 650;
}

.preview-schedule-title-group p {
  flex-basis: 100%;
  margin: -0.1rem 0 0;
  color: #65756b;
  font-size: 0.68rem;
}

.preview-ticket-count {
  padding: 0.28rem 0.55rem;
  border-radius: 99px;
  background: #dcfce3;
  color: #1b8730;
  font-size: 0.65rem;
  font-weight: 700;
  white-space: nowrap;
}

.preview-schedule-meta {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem 1.2rem;
  color: #53665a;
  font-size: 0.68rem;
}

.preview-schedule-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.preview-schedule-meta svg {
  width: 0.95rem;
  height: 0.95rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.preview-ticket-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(4.4rem, auto);
  gap: 0.65rem;
}

.preview-ticket-row {
  display: grid;
  min-width: 0;
  min-height: 4.4rem;
  grid-template-columns: 1.25rem minmax(0, 1fr) 3.7rem 2.8rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid #d5deeb;
  border-radius: 0.6rem;
  background: #fff;
}

.preview-ticket-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
  color: #90a0b8;
  stroke: currentColor;
  stroke-width: 1.6;
}

.preview-ticket-identity {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-ticket-name-row {
  display: flex;
  min-width: 0;
  overflow: hidden;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.preview-ticket-name {
  min-width: 0;
  overflow: hidden;
  color: #1a231d;
  font-size: 0.68rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-ticket-tag {
  padding: 0.2rem 0.45rem;
  border-radius: 99px;
  font-size: 0.6rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-ticket-tag--general {
  background: #edf5ff;
  color: #1680e5;
}

.preview-ticket-tag--premium {
  background: #ffeaf4;
  color: #d93e91;
}

.preview-ticket-tag--exclusive {
  background: #fff3e3;
  color: #c87517;
}

.preview-ticket-price {
  color: #8b99b0;
  font-size: 0.95rem;
  font-weight: 750;
}

.preview-ticket-stat {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.preview-ticket-stat span {
  color: #53665a;
  font-size: 0.62rem;
}

.preview-ticket-stat strong {
  color: #111a14;
  font-size: 0.9rem;
  font-weight: 750;
}

.preview-no-tickets {
  padding: 1rem;
  border: 1px solid #d5deeb;
  border-radius: 0.6rem;
  color: #65756b;
  font-size: 0.72rem;
}

.preview-venue-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.preview-venue-address {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.6rem;
  color: #53665a;
  font-size: 0.7rem;
}

.preview-venue-address strong {
  color: #26372b;
  font-weight: 700;
}

.preview-venue-map {
  display: block;
  width: 100%;
  height: 14rem;
  border: 0;
  border-radius: 0.6rem;
}

@media (max-width: 760px) {
  .preview-gallery {
    height: 14rem;
    grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  }

  .preview-schedule-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .preview-schedule-meta {
    justify-content: flex-start;
  }

  .preview-ticket-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .preview-gallery {
    height: 12rem;
    grid-template-columns: 1fr;
  }

  .preview-gallery-side {
    display: none;
  }

  .preview-ticket-row {
    grid-template-columns: 1.1rem minmax(0, 1fr) 3.4rem 2.6rem;
    gap: 0.5rem;
    padding-inline: 0.55rem;
  }

  .preview-ticket-stat {
    min-width: 0;
  }

  .preview-venue-heading,
  .preview-venue-address {
    align-items: flex-start;
  }

  .preview-venue-heading {
    flex-direction: column;
  }
}
</style>

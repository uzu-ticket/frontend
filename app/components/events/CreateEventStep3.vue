<template>
  <div class="step3-container">
    <!-- ADD / EDIT TICKET FORM VIEW -->
    <AppModal
      v-model="isTicketModalOpen"
      :title="editingIndex !== null ? 'Edit Ticket' : 'Add Ticket'"
      size="sm"
      :panel-class="editingIndex !== null ? 'ticket-edit-modal' : undefined"
      :close-on-backdrop="false"
      @close="handleCancelAdd"
    >
      <div class="step-view view-add">
        <form
          class="add-ticket-form-body"
          novalidate
          @submit.prevent="handleSaveTicket"
        >
          <button
            v-if="editingIndex !== null"
            type="button"
            class="btn-edit-ticket-delete"
            aria-label="Delete ticket"
            title="Delete ticket"
            @click="requestDeleteTicket(editingIndex)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2m3 0-1 14H6L5 6" />
              <path d="M10 11v5m4-5v5" />
            </svg>
          </button>
          <p class="add-ticket-modal-subtitle">
            {{
              editingIndex !== null
                ? "Update the details for this ticket."
                : "Create a ticket type for your event"
            }}
          </p>

          <!-- Ticket Name -->
          <div class="field-group">
            <label class="field-label"
              >Ticket Name <span class="required-star">*</span></label
            >
            <input
              v-model="ticketForm.name"
              type="text"
              maxlength="60"
              placeholder="e.g Early bird"
              class="form-input"
              :class="{ 'form-input--error': errors.name }"
            />
            <span v-if="errors.name" class="field-error">{{
              errors.name
            }}</span>
          </div>

          <!-- Price -->
          <div class="field-group">
            <label class="field-label"
              >Price <span class="required-star">*</span></label
            >
            <input
              v-model="ticketForm.price"
              type="text"
              inputmode="decimal"
              placeholder="₦ 0.00"
              class="form-input"
              :class="{ 'form-input--error': errors.price }"
              @input="formatPriceInput"
            />
            <span v-if="errors.price" class="field-error">{{
              errors.price
            }}</span>
          </div>

          <!-- Available Quantity & Max per Order -->
          <div class="two-col-grid">
            <div class="field-group">
              <label class="field-label"
                >Available Quantity <span class="required-star">*</span></label
              >
              <input
                v-model="ticketForm.quantity"
                type="text"
                inputmode="numeric"
                placeholder="0"
                class="form-input"
                :class="{ 'form-input--error': errors.quantity }"
                @input="(event) => formatIntegerInput('quantity', event)"
              />
              <span v-if="errors.quantity" class="field-error">{{
                errors.quantity
              }}</span>
            </div>

            <div class="field-group">
              <label class="field-label"
                >Max per Order <span class="required-star">*</span></label
              >
              <input
                v-model="ticketForm.maxPerOrder"
                type="text"
                inputmode="numeric"
                placeholder="1"
                class="form-input"
                :class="{ 'form-input--error': errors.maxPerOrder }"
                @input="(event) => formatIntegerInput('maxPerOrder', event)"
              />
              <span v-if="errors.maxPerOrder" class="field-error">{{
                errors.maxPerOrder
              }}</span>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="add-ticket-actions">
            <button type="submit" class="btn-create-ticket">
              {{ editingIndex !== null ? "Save Changes" : "Add ticket" }}
            </button>
            <button
              type="button"
              class="btn-cancel-form"
              @click="handleCancelAdd"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppModal>

    <AppModal
      v-model="isDeleteTicketModalOpen"
      title="Delete ticket?"
      size="sm"
      :close-on-backdrop="false"
      @close="cancelDeleteTicket"
    >
      <p class="delete-ticket-copy">
        Are you sure you want to delete {{ pendingDeleteTicketName }}? This
        action cannot be undone.
      </p>
      <template #footer>
        <div class="delete-ticket-actions">
          <button
            type="button"
            class="btn-cancel-ticket-delete"
            @click="cancelDeleteTicket"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-confirm-ticket-delete"
            @click="confirmDeleteTicket"
          >
            Delete Ticket
          </button>
        </div>
      </template>
    </AppModal>

    <!-- TICKETS LIST VIEW -->
    <div class="step-view view-list">
      <div class="list-header-row">
        <div>
          <h3 class="form-title">Tickets</h3>
          <p class="form-subtitle">
            Create one or more ticket options for attendees.
          </p>
        </div>
      </div>

      <!-- Schedule batches and their ticket types -->
      <div class="tickets-list">
        <section
          v-for="group in scheduleGroups"
          :key="group.slotIndex"
          class="schedule-batch"
        >
          <div
            class="schedule-batch-header"
            :class="{
              'schedule-batch-header--collapsed': !expandedSlots.includes(
                group.slotIndex,
              ),
            }"
          >
            <button
              type="button"
              class="schedule-toggle"
              :aria-expanded="expandedSlots.includes(group.slotIndex)"
              @click="toggleSchedule(group.slotIndex)"
            >
              <svg
                class="schedule-chevron"
                :class="{
                  'schedule-chevron--open': expandedSlots.includes(
                    group.slotIndex,
                  ),
                }"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                class="schedule-ticket-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
                />
                <path d="M13 5v2m0 2v2m0 2v2m0 2v2" />
              </svg>
              <span class="schedule-name">{{ group.name }}</span>
              <span class="schedule-ticket-count"
                >{{ group.ticketCount }} ticket types</span
              >
            </button>

            <div class="schedule-summary">
              <span class="schedule-summary-item">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M8 3v4m8-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                {{ group.date }}
              </span>
              <span v-if="group.time" class="schedule-summary-item">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {{ group.time }}
              </span>
            </div>

            <button
              v-if="
                group.ticketCount > 0 ||
                !expandedSlots.includes(group.slotIndex)
              "
              type="button"
              class="btn-add-ticket-top"
              @click="handleOpenSelectView(group.slotIndex)"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Add Ticket</span>
            </button>
          </div>

          <div
            class="schedule-disclosure"
            :class="{
              'schedule-disclosure--open': expandedSlots.includes(
                group.slotIndex,
              ),
            }"
            :aria-hidden="!expandedSlots.includes(group.slotIndex)"
            :inert="!expandedSlots.includes(group.slotIndex)"
          >
            <div v-if="group.ticketCount === 0" class="schedule-empty-state">
              <div class="empty-ticket-art">
                <svg
                  class="empty-ticket-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
                  />
                  <path d="M13 5v2m0 2v2m0 2v2m0 2v2" />
                </svg>
                <span class="empty-ticket-plus" aria-hidden="true">+</span>
              </div>
              <h4 class="empty-state-title">
                No ticket available for this batch
              </h4>
              <p class="empty-state-copy">
                You haven't created any ticket types yet. Add your first ticket
                to set up pricing, quantity, and other details.
              </p>
              <button
                type="button"
                class="empty-add-ticket"
                @click="handleOpenSelectView(group.slotIndex)"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Add Ticket</span>
              </button>
            </div>
            <div v-else class="schedule-ticket-list">
              <template v-for="(ticket, index) in tickets" :key="index">
                <div
                  v-if="ticket.slotIndex === group.slotIndex"
                  class="ticket-card"
                  :class="{ 'ticket-deactivated': ticket.deactivated }"
                >
                  <div class="ticket-icon-box" :style="{ color: ticket.color }">
                    <svg
                      class="ticket-vertical-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
                      />
                      <path d="M13 5v2m0 2v2m0 2v2m0 2v2" />
                    </svg>
                  </div>

                  <!-- Ticket Content -->
                  <div class="ticket-content">
                    <div class="ticket-top-row">
                      <!-- Type & Price -->
                      <div class="ticket-meta">
                        <span class="ticket-type">{{ ticket.type }}</span>
                        <span
                          class="ticket-tag"
                          :class="ticketTagClass(ticket)"
                          >{{ ticketTag(ticket) }}</span
                        >
                        <span
                          class="ticket-price"
                          :style="{ color: ticket.color }"
                          >{{ ticket.price }}</span
                        >
                      </div>

                      <!-- Quantity -->
                      <div class="ticket-avail">
                        <span class="ticket-avail-label">Quantity</span>
                        <span
                          class="ticket-avail-count"
                          :class="{ 'avail-green': ticket.color === '#3FD246' }"
                          >{{ ticket.quantity }}</span
                        >
                      </div>

                      <div class="ticket-avail">
                        <span class="ticket-avail-label">Sold</span>
                        <span class="ticket-avail-count">{{
                          ticket.quantitySold
                        }}</span>
                      </div>

                      <!-- Ticket actions -->
                      <div class="ticket-action-wrapper" @click.stop>
                        <button
                          type="button"
                          class="ticket-edit-btn"
                          :aria-label="`Edit ${ticket.type}`"
                          title="Edit ticket"
                          @click="editTicket(index)"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M12 20h9" />
                            <path
                              d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="ticket-delete-btn"
                          :aria-label="`Delete ${ticket.type}`"
                          title="Delete ticket"
                          @click="requestDeleteTicket(index)"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2m3 0-1 14H6L5 6" />
                            <path d="M10 11v5m4-5v5" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- Sales Period -->
                    <div class="ticket-sales-row">
                      <div class="sales-col">
                        <span class="sales-label">Sales Start</span>
                        <div class="sales-date-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="date-icon"
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
                          <span>{{ ticket.salesStart }}</span>
                        </div>
                      </div>

                      <div class="sales-col">
                        <span class="sales-label">Sales End</span>
                        <div class="sales-date-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="date-icon"
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
                          <span>{{ ticket.salesEnd }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>

      <!-- Navigation Footer -->
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

        <button type="button" class="btn-next" @click="handleNextStep">
          <span>Save &amp; Continue</span>
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
import { ref, reactive, watch, computed } from "vue";
import AppModal from "~/components/AppModal.vue";
import { getEventTicketColor } from "~/utils/eventTicketColors";

const emit = defineEmits<{
  back: [];
  cancel: [];
  next: [data?: any];
}>();

const props = defineProps<{
  eventData?: Record<string, unknown>;
  initialData?: unknown;
}>();

interface TicketItem {
  id?: string;
  type: string;
  price: string;
  quantity: string;
  maxPerOrder?: string;
  color: string;
  salesStart: string;
  salesEnd: string;
  description?: string;
  deactivated?: boolean;
  startDateObj?: Date | null;
  startTimeStr?: string;
  endDateObj?: Date | null;
  endTimeStr?: string;
  slotIndex: number;
  quantitySold: number;
}

// Initial tickets list starts empty so the user can add a ticket from the list view.
const tickets = ref<TicketItem[]>([]);
const expandedSlots = ref([0]);
const selectedSlotIndex = ref(0);

const scheduleGroups = computed(() => {
  const eventSlots = props.eventData?.eventSlots;
  const schedules = Array.isArray(eventSlots) ? eventSlots : [];
  const availableSchedules = schedules.length
    ? schedules
    : [
        {
          name: "Event Schedule",
          dateObj: null,
          startTime: "",
          endTime: "",
        },
      ];

  return availableSchedules.map((schedule, slotIndex) => {
    const slot = schedule as Record<string, unknown>;
    const slotTickets = tickets.value.filter(
      (ticket) => ticket.slotIndex === slotIndex,
    );
    return {
      slotIndex,
      name: String(slot.name || `Batch ${String.fromCharCode(65 + slotIndex)}`),
      date: formatScheduleDate(slot.dateObj),
      time: `${String(slot.startTime || "").trim()}${slot.endTime ? ` - ${String(slot.endTime).trim()}` : ""}`,
      ticketCount: slotTickets.length,
    };
  });
});

function formatScheduleDate(value: unknown): string {
  if (!value) return "Date not set";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ticketTag(ticket: TicketItem): string {
  const type = ticket.type.toLowerCase();
  if (type.includes("vip") || type.includes("premium")) return "Premium Access";
  if (type.includes("diamond") || type.includes("exclusive"))
    return "Exclusive Access";
  return "General Admission";
}

function ticketTagClass(ticket: TicketItem): string {
  const type = ticket.type.toLowerCase();
  if (type.includes("vip") || type.includes("premium"))
    return "ticket-tag--premium";
  if (type.includes("diamond") || type.includes("exclusive"))
    return "ticket-tag--exclusive";
  return "ticket-tag--general";
}

function toggleSchedule(slotIndex: number) {
  expandedSlots.value = expandedSlots.value.includes(slotIndex)
    ? expandedSlots.value.filter((index) => index !== slotIndex)
    : [...expandedSlots.value, slotIndex];
}

// View state: 'add' | 'list'
const viewMode = ref<"add" | "list">("list");
const isTicketModalOpen = ref(false);
const isDeleteTicketModalOpen = ref(false);
const editingIndex = ref<number | null>(null);
const pendingDeleteTicketIndex = ref<number | null>(null);
const pendingDeleteTicketName = ref("");

// Add / Edit Ticket Form Data
const ticketForm = reactive({
  name: "",
  price: "₦ 0",
  quantity: "0",
  maxPerOrder: "1",
  startDate: new Date(2026, 7, 24) as Date | null,
  startTime: "10:00 AM",
  endDate: new Date(2026, 8, 24) as Date | null,
  endTime: "10:00 AM",
  description: "",
});

// Reactive error states matching Step 1 & Step 2 pattern
const errors = reactive({
  selection: "",
  name: "",
  price: "",
  quantity: "",
  maxPerOrder: "",
  salesStart: "",
  salesEnd: "",
  description: "",
});

function formatTicketPrice(priceMinor: string | number): string {
  const amount = Number(priceMinor) / 100;
  return `₦ ${amount.toLocaleString("en-NG", {
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function parseTicketDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const parsed = new Date(String(value));
  return isNaN(parsed.getTime()) ? null : parsed;
}

function hydrateTickets(value: unknown) {
  if (!Array.isArray(value)) return;

  tickets.value = value.map((ticket, index) => {
    const item = ticket as Record<string, unknown>;
    const hasComponentProps =
      item.type !== undefined ||
      item.price !== undefined ||
      item.quantity !== undefined;

    const startDate = parseTicketDate(item.startDateObj ?? item.saleStartsAt);
    const endDate = parseTicketDate(item.endDateObj ?? item.saleEndsAt);

    const type = String(item.type || item.name || "GENERAL").toUpperCase();

    const price =
      hasComponentProps && typeof item.price === "string" && item.price.trim()
        ? item.price
        : formatTicketPrice(String(item.priceMinor || "0"));

    const quantity =
      hasComponentProps &&
      typeof item.quantity === "string" &&
      item.quantity.trim()
        ? item.quantity
        : Number(item.quantityTotal || 0).toLocaleString("en-US");

    const maxPerOrder =
      hasComponentProps &&
      typeof item.maxPerOrder === "string" &&
      item.maxPerOrder.trim()
        ? item.maxPerOrder
        : item.perOrderLimit == null
          ? "1"
          : Number(item.perOrderLimit).toLocaleString("en-US");

    const salesStart =
      (item.salesStart as string) ||
      (startDate
        ? `${formatDateStr(startDate)} • ${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
        : "");

    const salesEnd =
      (item.salesEnd as string) ||
      (endDate
        ? `${formatDateStr(endDate)} • ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
        : "");

    const startTimeStr =
      (item.startTimeStr as string) ||
      (startDate?.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) ||
        "");

    const endTimeStr =
      (item.endTimeStr as string) ||
      (endDate?.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) ||
        "");

    return {
      id: item.id ? String(item.id) : undefined,
      type,
      price,
      quantity,
      maxPerOrder,
      color: (item.color as string) || getEventTicketColor(index),
      salesStart,
      salesEnd,
      startDateObj: startDate,
      startTimeStr,
      endDateObj: endDate,
      endTimeStr,
      description: String(item.description || ""),
      slotIndex: typeof item.slotIndex === "number" ? item.slotIndex : 0,
      quantitySold: Number(item.quantitySold || 0),
    };
  });
}

watch(
  () => props.initialData ?? props.eventData?.step3,
  (value) => hydrateTickets(value),
  { immediate: true, deep: true },
);

watch(
  ticketForm,
  (form) => {
    if (form.name.trim()) errors.name = "";
    const price = parsePriceAmount(form.price);
    const quantity = parseWholeNumber(form.quantity);
    const maxPerOrder = parseWholeNumber(form.maxPerOrder);
    if (price !== null && price >= 0) errors.price = "";
    if (quantity !== null && quantity > 0) errors.quantity = "";
    if (
      maxPerOrder !== null &&
      maxPerOrder > 0 &&
      (quantity === null || maxPerOrder <= quantity)
    ) {
      errors.maxPerOrder = "";
    }
    if (form.startDate && form.startTime) errors.salesStart = "";
    if (form.endDate && form.endTime) errors.salesEnd = "";
    if (form.description.trim()) errors.description = "";
  },
  { deep: true },
);

function resetErrors() {
  errors.selection = "";
  errors.name = "";
  errors.price = "";
  errors.quantity = "";
  errors.maxPerOrder = "";
  errors.salesStart = "";
  errors.salesEnd = "";
  errors.description = "";
}

function handleOpenSelectView(slotIndex: number) {
  const step1 = props.eventData?.step1;
  const eventType =
    step1 && typeof step1 === "object"
      ? (step1 as Record<string, unknown>).eventType
      : undefined;
  selectedSlotIndex.value = slotIndex;
  handleOpenAddForm(eventType === "free" ? "free" : "paid");
}

function handleOpenAddForm(type: "paid" | "free") {
  editingIndex.value = null;
  resetErrors();
  ticketForm.name = "";
  ticketForm.price = "₦ 0";
  ticketForm.quantity = "0";
  ticketForm.maxPerOrder = "1";
  ticketForm.startDate = new Date(2026, 7, 24);
  ticketForm.startTime = "10:00 AM";
  ticketForm.endDate = new Date(2026, 8, 24);
  ticketForm.endTime = "10:00 AM";
  ticketForm.description = "";
  viewMode.value = "add";
  isTicketModalOpen.value = true;
}

function handleCancelAdd() {
  resetErrors();
  viewMode.value = "list";
  isTicketModalOpen.value = false;
}

function formatDateStr(date: Date | null): string {
  if (!date) return "Aug 24, 2026";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPriceInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const rawValue = input.value.replace(/[^\d.]/g, "");
  const [rawWhole = "", ...decimalParts] = rawValue.split(".");
  const whole = rawWhole.replace(/^0+(?=\d)/, "");
  const formattedWhole = whole ? Number(whole).toLocaleString("en-US") : "";
  const decimal = decimalParts.join("").replace(/\D/g, "").slice(0, 2);

  ticketForm.price = formattedWhole
    ? `₦ ${formattedWhole}${rawValue.includes(".") ? `.${decimal}` : ""}`
    : "";
}

function formatIntegerInput(field: "quantity" | "maxPerOrder", event: Event) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  ticketForm[field] = digits ? Number(digits).toLocaleString("en-US") : "";
}

function parsePriceAmount(value: string): number | null {
  const normalized = value.replace(/[^\d.]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function parseWholeNumber(value: string): number | null {
  const normalized = value.replace(/\D/g, "");
  if (!normalized) return null;
  const amount = Number(normalized);
  return Number.isSafeInteger(amount) ? amount : null;
}

function validateForm() {
  resetErrors();
  let valid = true;
  const price = parsePriceAmount(ticketForm.price);
  const quantity = parseWholeNumber(ticketForm.quantity);
  const maxPerOrder = parseWholeNumber(ticketForm.maxPerOrder);

  if (!ticketForm.name.trim()) {
    errors.name = "Ticket name is required.";
    valid = false;
  } else if (ticketForm.name.trim().length > 60) {
    errors.name = "Ticket name must be 60 characters or fewer.";
    valid = false;
  }

  if (price === null || price < 0) {
    errors.price = "Enter a valid price with up to 2 decimal places.";
    valid = false;
  }

  if (quantity === null || quantity < 1) {
    errors.quantity = "Available quantity must be at least 1.";
    valid = false;
  }

  if (maxPerOrder === null || maxPerOrder < 1) {
    errors.maxPerOrder = "Max per order must be at least 1.";
    valid = false;
  } else if (quantity !== null && maxPerOrder > quantity) {
    errors.maxPerOrder = "Max per order cannot exceed available quantity.";
    valid = false;
  }

  return valid;
}

function handleSaveTicket() {
  if (!validateForm()) return;

  const typeFormatted = ticketForm.name.trim().toUpperCase() || "GENERAL";
  const existingTicket =
    editingIndex.value !== null ? tickets.value[editingIndex.value] : undefined;
  const color =
    existingTicket?.color ?? getEventTicketColor(tickets.value.length);
  const targetSlotIndex = existingTicket?.slotIndex ?? selectedSlotIndex.value;
  const startStr = `${formatDateStr(ticketForm.startDate)} • ${ticketForm.startTime || "10:00 AM"}`;
  const endStr = `${formatDateStr(ticketForm.endDate)} • ${ticketForm.endTime || "10:00 AM"}`;

  const newTicket: TicketItem = {
    id: existingTicket?.id,
    type: typeFormatted,
    price: ticketForm.price || "₦ 0",
    quantity: ticketForm.quantity || "0",
    maxPerOrder: ticketForm.maxPerOrder || "1",
    color,
    salesStart: startStr,
    salesEnd: endStr,
    startDateObj: ticketForm.startDate,
    startTimeStr: ticketForm.startTime,
    endDateObj: ticketForm.endDate,
    endTimeStr: ticketForm.endTime,
    description: ticketForm.description,
    slotIndex: targetSlotIndex,
    quantitySold: existingTicket?.quantitySold ?? 0,
  };

  if (editingIndex.value !== null) {
    tickets.value[editingIndex.value] = newTicket;
    editingIndex.value = null;
  } else {
    tickets.value.push(newTicket);
  }

  if (!expandedSlots.value.includes(targetSlotIndex)) {
    expandedSlots.value = [...expandedSlots.value, targetSlotIndex];
  }

  viewMode.value = "list";
  isTicketModalOpen.value = false;
}

function editTicket(index: number) {
  resetErrors();
  const t = tickets.value[index];
  if (!t) return;

  editingIndex.value = index;
  ticketForm.name = t.type;
  ticketForm.price = t.price;
  ticketForm.quantity = t.quantity;
  ticketForm.maxPerOrder = t.maxPerOrder || "1";
  ticketForm.startDate = t.startDateObj || new Date(2026, 7, 24);
  ticketForm.startTime = t.startTimeStr || "9:00 AM";
  ticketForm.endDate = t.endDateObj || new Date(2026, 7, 24);
  ticketForm.endTime = t.endTimeStr || "9:00 AM";
  ticketForm.description = t.description || "";
  viewMode.value = "add";
  isTicketModalOpen.value = true;
}

function requestDeleteTicket(index: number) {
  const ticket = tickets.value[index];
  if (!ticket) return;
  pendingDeleteTicketIndex.value = index;
  pendingDeleteTicketName.value = ticket.type;
  isDeleteTicketModalOpen.value = true;
}

function cancelDeleteTicket() {
  isDeleteTicketModalOpen.value = false;
  pendingDeleteTicketIndex.value = null;
  pendingDeleteTicketName.value = "";
}

function confirmDeleteTicket() {
  if (pendingDeleteTicketIndex.value !== null) {
    const deletingIndex = pendingDeleteTicketIndex.value;
    deleteTicket(deletingIndex);
    if (editingIndex.value === deletingIndex) {
      isTicketModalOpen.value = false;
      editingIndex.value = null;
      viewMode.value = "list";
    }
  }
  cancelDeleteTicket();
}

function deleteTicket(index: number) {
  tickets.value.splice(index, 1);
  if (tickets.value.length === 0) {
    viewMode.value = "list";
  }
}

function handleNextStep() {
  if (tickets.value.length === 0) {
    errors.selection = "Please add at least one ticket.";
    return;
  }
  emit("next", tickets.value);
}
</script>

<style scoped>
.step3-container {
  display: flex;
  flex-direction: column;
}

.step-view {
  display: flex;
  flex-direction: column;
}

/* Form Headers */
.form-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.35rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

/* ========================================== */
/* SCREEN 1: SELECTION VIEW STYLES */
/* ========================================== */
.selection-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2.25rem 0 3rem;
}

.ticket-type-option-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.75rem 2.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-type-option-card:hover {
  border-color: #3fd246;
  box-shadow: 0 8px 24px rgba(63, 210, 70, 0.08);
  transform: translateY(-2px);
}

.ticket-type-option-card--selected {
  border-color: #3fd246 !important;
  background: #f0fdf1 !important;
  box-shadow: 0 4px 16px rgba(63, 210, 70, 0.12) !important;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.option-icon-box {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-paid {
  background: #eaf8eb;
  color: #3fd246;
  font-size: 1.85rem;
  font-weight: 700;
}

.icon-free {
  background: #fdf0f0;
  color: #ef4444;
}

.heart-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #ef4444;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.option-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.option-title-paid {
  color: #0e2615;
}

.option-title-free {
  color: #ef4444;
}

.option-desc {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  max-width: 500px;
  line-height: 1.45;
}

.option-right-select {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.radio-indicator {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 1.5px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.radio-indicator--selected {
  border-color: #3fd246;
  background: #ffffff;
}

.radio-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: #3fd246;
}

.chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #374151;
  flex-shrink: 0;
}

.selection-error {
  font-size: 0.8rem;
  font-weight: 600;
}

/* ========================================== */
/* SCREEN 2: ADD TICKET FORM STYLES */
/* ========================================== */
.back-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #3fd246;
  font-weight: 700;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.75rem;
  transition: opacity 0.15s;
  width: fit-content;
}

.back-link-btn:hover {
  opacity: 0.85;
}

.back-link-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.add-ticket-header {
  margin-bottom: 1.5rem;
}

.add-ticket-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.25rem;
}

.add-ticket-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.add-ticket-form-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-ticket-modal-subtitle {
  margin: -0.85rem 0 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
}

:deep(.ticket-edit-modal .app-modal-close) {
  display: none;
}

.btn-edit-ticket-delete {
  position: absolute;
  top: 0.85rem;
  right: 1rem;
  display: grid;
  width: 3.5rem;
  height: 3.5rem;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #fee2e2;
  color: #ef4444;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.btn-edit-ticket-delete svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.btn-edit-ticket-delete:hover {
  transform: scale(1.06);
  background: #fecaca;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.2);
}

.btn-edit-ticket-delete:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 3px;
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

.form-input,
.form-textarea {
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

.form-input:focus,
.form-textarea:focus {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.form-input--error,
.form-textarea--error {
  border-color: #ef4444 !important;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.2rem;
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

/* Combined Date & Time Box */
.combined-datetime-input {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  background: #ffffff;
  transition: all 0.15s ease;
}

.combined-datetime-input:focus-within {
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.combined-datetime-input--error {
  border-color: #ef4444 !important;
}

.datetime-part {
  flex: 1;
}

.datetime-part :deep(.date-trigger),
.datetime-part :deep(.time-trigger) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border-radius: 0 !important;
  padding: 0.65rem 0.85rem !important;
}

:deep(.app-modal-title) {
  font-size: 1.15rem;
}

.datetime-divider {
  width: 1px;
  height: 1.75rem;
  background: #e5e7eb;
  flex-shrink: 0;
}

.add-ticket-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.delete-ticket-copy {
  margin: 0;
  color: #53665a;
  font-size: 0.85rem;
  line-height: 1.5;
}

.delete-ticket-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
}

.btn-cancel-ticket-delete,
.btn-confirm-ticket-delete {
  min-height: 2.4rem;
  padding: 0 0.9rem;
  border: 1px solid #d5deeb;
  border-radius: 0.45rem;
  background: #fff;
  color: #0e2615;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-confirm-ticket-delete {
  border-color: #dc2626;
  background: #dc2626;
  color: #fff;
}

.btn-cancel-form {
  flex: 1;
  min-height: 2.5rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0e2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel-form:hover {
  background: #f9fafb;
}

.btn-create-ticket {
  flex: 1;
  min-height: 2.5rem;
  padding: 0.5rem 1rem;
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

.btn-create-ticket:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

/* ========================================== */
/* SCREEN 3: TICKETS LIST VIEW STYLES */
/* ========================================== */
.list-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.btn-add-ticket-top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  background: #ffffff;
  border: 1px dashed #3fd246;
  color: #3fd246;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-add-ticket-top:hover {
  background: #f0fdf1;
}

.btn-icon {
  width: 1.05rem;
  height: 1.05rem;
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.ticket-card {
  display: flex;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: visible;
  transition: all 0.15s ease;
}

.ticket-deactivated {
  opacity: 0.6;
}

.ticket-accent-strip {
  width: 5px;
  border-radius: 0.875rem 0 0 0.875rem;
  flex-shrink: 0;
}

.ticket-content {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ticket-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.ticket-type {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ticket-price {
  font-size: 1.3rem;
  font-weight: 800;
}

.ticket-avail {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.ticket-avail-label {
  font-size: 0.825rem;
  color: #6b7280;
  font-weight: 600;
}

.ticket-avail-count {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0e2615;
}

.avail-green {
  color: #3fd246;
}

/* 3-Dots Menu */
.ticket-action-wrapper {
  position: relative;
}

.dots-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.15s;
}

.dots-btn:hover {
  background: #f3f4f6;
}

.dots-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.context-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 155px;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  padding: 0.4rem 0;
  z-index: 50;
  animation: popoverFade 0.15s ease-out;
}

@keyframes popoverFade {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.55rem 0.85rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f9fafb;
  color: #0e2615;
}
.menu-item--delete {
  color: #ef4444;
}
.menu-item--delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.item-icon {
  width: 1rem;
  height: 1rem;
}

/* Sales Row */
.ticket-sales-row {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.sales-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sales-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
}

.sales-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: #374151;
}

.date-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: #6b7280;
}

/* Navigation Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
  margin-top: 1rem;
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

.btn-next {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 2rem;
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

.list-header-row {
  margin-bottom: 1rem;
}

.tickets-list {
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.schedule-batch {
  overflow: hidden;
  border: 1px solid #cfd9e8;
  border-radius: 0.65rem;
  background: #fff;
}

.schedule-batch-header {
  display: flex;
  min-height: 4rem;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 0.9rem;
  transition: min-height 240ms ease;
}

.schedule-batch-header--collapsed {
  min-height: 5rem;
}

.schedule-toggle {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 0.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: #102317;
  text-align: left;
  cursor: pointer;
}

.schedule-chevron {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  transform: rotate(-90deg);
  transition: transform 0.15s ease;
}

.schedule-chevron--open {
  transform: rotate(0);
}

.schedule-ticket-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
  color: #90a0b8;
  stroke: currentColor;
  stroke-width: 1.6;
}

.schedule-name {
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.schedule-ticket-count {
  flex: 0 0 auto;
  padding: 0.3rem 0.55rem;
  border-radius: 99px;
  background: #eef4fd;
  color: #53677f;
  font-size: 0.68rem;
  white-space: nowrap;
}

.schedule-summary {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  color: #53665a;
  font-size: 0.72rem;
  white-space: nowrap;
}

.schedule-summary-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.schedule-summary-item svg {
  width: 0.95rem;
  height: 0.95rem;
  stroke: currentColor;
  stroke-width: 1.6;
}

.schedule-ticket-list {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  padding: 0 0.65rem 0.65rem;
}

.schedule-disclosure {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 240ms ease,
    opacity 180ms ease;
}

.schedule-disclosure--open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.schedule-empty-state {
  display: flex;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  overflow: hidden;
  margin: 0 0.65rem 0.65rem;
  padding: 1.25rem;
  border: 1px solid #d5deeb;
  border-radius: 0.65rem;
  background: #fff;
  text-align: center;
}

.empty-ticket-art {
  position: relative;
  display: grid;
  width: 5rem;
  height: 5rem;
  flex: 0 0 auto;
  place-items: center;
  margin-bottom: 0.25rem;
  border-radius: 50%;
  background: #effaf0;
}

.empty-ticket-icon {
  width: 2.8rem;
  height: 2.8rem;
  color: #92a08f;
  stroke: currentColor;
  stroke-width: 1.5;
}

.empty-ticket-plus {
  position: absolute;
  right: 0.75rem;
  bottom: 0.65rem;
  display: grid;
  width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  border-radius: 50%;
  background: #3fd246;
  color: #fff;
  font-size: 1rem;
  line-height: 1;
}

.empty-state-title {
  margin: 0;
  color: #17231a;
  font-size: 0.85rem;
  font-weight: 750;
}

.empty-state-copy {
  max-width: 20rem;
  margin: 0;
  color: #65756b;
  font-size: 0.7rem;
  line-height: 1.45;
}

.empty-add-ticket {
  display: inline-flex;
  min-width: 7.5rem;
  min-height: 2.3rem;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 0.1rem;
  padding: 0 0.8rem;
  border: 1px solid #b7e5be;
  border-radius: 0.5rem;
  background: #f2fbf3;
  color: #176a2a;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;
}

.empty-add-ticket:hover {
  border-color: #3fd246;
  background: #e7f8e9;
}

.empty-add-ticket svg {
  width: 0.9rem;
  height: 0.9rem;
}

.ticket-card {
  min-height: 4rem;
  align-items: center;
  gap: 0.75rem;
  border-color: #d5deeb;
  border-radius: 0.6rem;
}

.ticket-icon-box {
  display: grid;
  width: 1.5rem;
  height: 2rem;
  flex: 0 0 auto;
  place-items: center;
  margin-left: 0.7rem;
}

.ticket-icon-box svg {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
  stroke-width: 1.7;
}

.ticket-vertical-icon {
  transform: rotate(90deg);
}

.ticket-content {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 0.8rem 0.55rem 0;
}

.ticket-top-row {
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 1rem;
}

.ticket-meta {
  min-width: 0;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem 0.6rem;
}

.ticket-type {
  color: #18221c;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: capitalize;
}

.ticket-tag {
  padding: 0.18rem 0.5rem;
  border-radius: 99px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
}

.ticket-tag--general {
  background: #edf5ff;
  color: #1680e5;
}

.ticket-tag--premium {
  background: #ffeaf4;
  color: #d93e91;
}

.ticket-tag--exclusive {
  background: #fff3e3;
  color: #c87517;
}

.ticket-price {
  flex-basis: 100%;
  color: #8b99b0 !important;
  font-size: 1rem;
  font-weight: 750;
}

.ticket-avail {
  min-width: 5rem;
  flex: 0 0 auto;
  gap: 0.25rem;
}

.ticket-avail-label {
  color: #53665a;
  font-size: 0.68rem;
}

.ticket-avail-count {
  color: #101a13;
  font-size: 1rem;
  font-weight: 750;
}

.ticket-action-wrapper {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding-left: 0.5rem;
  border-left: 1px solid #e6eaf0;
}

.ticket-edit-btn,
.ticket-delete-btn {
  display: grid;
  width: 1.8rem;
  height: 1.8rem;
  flex: 0 0 auto;
  place-items: center;
  border: 0;
  border-radius: 0.35rem;
  background: transparent;
  color: #24382b;
  cursor: pointer;
}

.ticket-edit-btn svg,
.ticket-delete-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.ticket-delete-btn {
  color: #dc2626;
}

.ticket-delete-btn:hover {
  background: #fef2f2;
}

.ticket-sales-row {
  display: none;
}

@media (max-width: 800px) {
  .schedule-batch-header {
    flex-wrap: wrap;
  }

  .schedule-toggle {
    flex-basis: calc(100% - 8rem);
  }

  .schedule-summary {
    order: 3;
    flex: 1 1 100%;
    padding-left: 2rem;
  }

  .schedule-ticket-list .ticket-top-row {
    flex-wrap: wrap;
  }
}

@media (max-width: 560px) {
  .schedule-ticket-count {
    display: none;
  }

  .ticket-card {
    align-items: flex-start;
  }

  .ticket-content {
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .ticket-top-row {
    flex-wrap: wrap;
  }

  .ticket-meta {
    flex-basis: 100%;
  }

  .ticket-avail {
    min-width: 3.8rem;
  }

  .ticket-action-wrapper {
    margin-left: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .schedule-batch-header,
  .schedule-disclosure {
    transition: none;
  }
}

@media (max-width: 768px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }

  .ticket-sales-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>

<template>
  <div class="events-page">
    <!-- Empty State -->
    <EventEmptyState
      v-if="!loading && apiEvents.length === 0"
      @create="router.push('/events/create')"
    />

    <!-- Loading State -->
    <div v-else-if="loading" class="events-loading">
      <div class="spinner" />
      <p class="loading-text">Loading events...</p>
    </div>

    <!-- Table / Grid -->
    <div v-else class="events-main-card">
      <!-- Tabs Filter Bar -->
      <div class="tabs-header">
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          All Events ({{ tableEvents.length }})
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'published' }"
          @click="activeTab = 'published'"
        >
          Published
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'draft' }"
          @click="activeTab = 'draft'"
        >
          Draft
        </button>
      </div>

      <!-- Search & Controls Bar -->
      <div class="controls-bar">
        <!-- Search Input -->
        <div class="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="search-icon"
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
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            class="search-input"
          />
        </div>

        <!-- Right Action Controls -->
        <div class="right-controls">
          <div class="control-popover-wrap">
            <button
              type="button"
              class="btn-control"
              :class="{ 'btn-control--active': isFilterOpen }"
              @click.stop="toggleFilter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="control-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filter</span>
            </button>
            <div v-if="isFilterOpen" class="filter-popover" @click.stop>
              <div class="popover-heading">
                <h3>Filter Events</h3>
                <button
                  type="button"
                  class="popover-reset"
                  @click="resetFilters"
                >
                  Reset
                </button>
              </div>
              <div class="popover-field">
                <label>Status</label>
                <AppSelect
                  v-model="draftStatusFilter"
                  :options="statusFilterOptions"
                />
              </div>
              <div class="popover-field">
                <label>Event Type</label>
                <AppSelect
                  v-model="draftTypeFilter"
                  :options="typeFilterOptions"
                />
              </div>
              <div class="popover-field">
                <label>Date Range</label>
                <div class="date-range-fields">
                  <DatePicker
                    v-model="draftStartDate"
                    placeholder="Start Date"
                  />
                  <DatePicker v-model="draftEndDate" placeholder="End Date" />
                </div>
              </div>
              <div class="popover-actions">
                <button
                  type="button"
                  class="popover-cancel"
                  @click="isFilterOpen = false"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="popover-apply"
                  @click="applyFilters"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div class="control-popover-wrap">
            <button
              type="button"
              class="btn-control"
              :class="{ 'btn-control--active': isSortOpen }"
              @click.stop="toggleSort"
            >
              <span>Sort</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="control-arrow"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div v-if="isSortOpen" class="sort-popover" @click.stop>
              <h3>Sort Events</h3>
              <button
                v-for="option in sortOptions"
                :key="option.value"
                type="button"
                class="sort-option"
                @click="selectSort(option.value)"
              >
                <span>{{ option.label }}</span>
                <svg
                  v-if="sortOption === option.value"
                  xmlns="http://www.w3.org/2000/svg"
                  class="sort-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 12l4 4L19 6"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="view-switcher" aria-label="Event view">
            <button
              type="button"
              class="view-switch-btn"
              :class="{ 'view-switch-btn--active': viewMode === 'cards' }"
              aria-label="Card view"
              title="Card view"
              @click="viewMode = 'cards'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="view-switch-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              class="view-switch-btn"
              :class="{ 'view-switch-btn--active': viewMode === 'list' }"
              aria-label="List view"
              title="List view"
              @click="viewMode = 'list'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="view-switch-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" d="M8 6h13M8 12h13M8 18h13" />
                <path stroke-linecap="round" d="M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>
          </div>

          <!-- Create Event Primary Button -->
          <button
            id="btn-create-event-table"
            class="btn-create-event"
            @click="router.push('/events/create')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="btn-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Create event</span>
          </button>
        </div>
      </div>

      <!-- Card View -->
      <div v-if="viewMode === 'cards'" class="events-grid">
        <EventCard
          v-for="event in filteredTableEvents"
          :key="event.id"
          :event="event"
          @action="handleAction"
          @open="router.push(`/events/${$event}`)"
        />
      </div>

      <!-- List View -->
      <AppDataTable
        v-else
        :columns="tableColumns"
        :items="filteredTableEvents"
        :page-size="5"
      >
        <!-- Custom Cell: EVENT -->
        <template #cell-event="{ item }">
          <div class="event-cell" @click="router.push(`/events/${item.id}`)">
            <div
              class="event-thumb-box"
              :style="{ background: item.bgGradient }"
            >
              <img
                v-if="item.coverImage"
                :src="item.coverImage"
                :alt="item.title"
                class="table-cover-img"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="thumb-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <div class="event-title-stack">
              <h4 class="table-event-name">{{ item.title }}</h4>
              <span class="table-event-category">{{ item.category }}</span>
            </div>
          </div>
        </template>

        <!-- Custom Cell: DATE & TIME -->
        <template #cell-dateTime="{ item }">
          <div class="date-cell">
            <span class="date-val">{{ item.date }}</span>
            <span class="time-val">{{ item.time }}</span>
          </div>
        </template>

        <!-- Custom Cell: VENUE -->
        <template #cell-venue="{ item }">
          <div class="venue-cell">
            <span class="venue-name">{{ item.venue }}</span>
            <span class="venue-location">{{ item.location }}</span>
          </div>
        </template>

        <!-- Custom Cell: TICKETS SOLD -->
        <template #cell-ticketsSold="{ item }">
          <span class="tickets-val">{{ item.ticketsSold }}</span>
        </template>

        <!-- Custom Cell: REVENUE -->
        <template #cell-revenue="{ item }">
          <span class="revenue-val">{{ item.revenue }}</span>
        </template>

        <!-- Custom Cell: STATUS -->
        <template #cell-status="{ item }">
          <span
            class="status-pill"
            :class="
              item.status === 'Published'
                ? 'status-pill--published'
                : 'status-pill--draft'
            "
          >
            {{ item.status }}
          </span>
        </template>

        <!-- Custom Cell: ACTION (3-Dots Menu) -->
        <template #cell-action="{ item }">
          <div class="table-action-wrapper" @click.stop>
            <button
              class="table-dots-btn"
              @click="openMenuId = openMenuId === item.id ? null : item.id"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="dots-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
            </button>

            <!-- Context Actions Dropdown -->
            <div v-if="openMenuId === item.id" class="table-context-menu">
              <button class="menu-item" @click="handleAction('edit', item.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="item-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Edit</span>
              </button>

              <button
                class="menu-item"
                @click="handleAction('duplicate', item.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="item-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Duplicate</span>
              </button>

              <button
                class="menu-item"
                @click="handleAction('analytics', item.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="item-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>View analytics</span>
              </button>

              <button
                class="menu-item"
                @click="handleAction('close-sales', item.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="item-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Close sales</span>
              </button>

              <button
                class="menu-item menu-item--delete"
                @click="handleAction('delete', item.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="item-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </template>
      </AppDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import EventEmptyState from "~/components/events/EventEmptyState.vue";
import EventCard, { type EventItem } from "~/components/events/EventCard.vue";
import AppDataTable, {
  type TableColumn,
} from "~/components/ui/AppDataTable.vue";
import AppSelect from "~/components/ui/AppSelect.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import { useEvents } from "~/composables/useEvents";
import { useToast } from "~/composables/useToast";
import type { Event } from "~/types/event";

definePageMeta({
  layout: "dashboard",
});

const router = useRouter();
const toast = useToast();
const { fetchEvents, loading, error } = useEvents();

const apiEvents = ref<Event[]>([]);
const activeTab = ref<"all" | "published" | "draft">("all");
const searchQuery = ref("");
const openMenuId = ref<string | null>(null);
const viewMode = ref<"cards" | "list">("cards");
const isFilterOpen = ref(false);
const isSortOpen = ref(false);
const statusFilter = ref<"all" | "published" | "draft">("all");
const typeFilter = ref<"all" | "paid" | "free">("all");
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const draftStatusFilter = ref(statusFilter.value);
const draftTypeFilter = ref(typeFilter.value);
const draftStartDate = ref<Date | null>(null);
const draftEndDate = ref<Date | null>(null);
const sortOption = ref("recommended");

const statusFilterOptions = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const typeFilterOptions = [
  { value: "all", label: "All Type" },
  { value: "paid", label: "Paid" },
  { value: "free", label: "Free" },
];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "nameAsc", label: "A-Z (Name)" },
  { value: "nameDesc", label: "Z-A (Name)" },
];

onMounted(async () => {
  try {
    apiEvents.value = await fetchEvents();
  } catch {
    toast.show({
      title: "Failed to Load Events",
      message: error.value || "Could not load your events. Please try again.",
      type: "error",
    });
  }
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatPrice(minor: string, currency = "NGN"): string {
  const major = Number(minor) / 100;
  if (major === 0) return "Free";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(major);
}

function formatEventStatus(status: Event["status"]): string {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getGradient(category?: string): string {
  const gradients: Record<string, string> = {
    Technology: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    Business: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    Music: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
    Education: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    Finance: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    Design: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
  };
  return (
    gradients[category || ""] ||
    "linear-gradient(135deg, #3FD246 0%, #22c55e 100%)"
  );
}

const tableEvents = computed(() => {
  return apiEvents.value.map(
    (e): EventItem => ({
      id: e.id,
      title: e.title,
      category: e.category?.name || "—",
      eventType: e.ticketTypes.some((tt) => Number(tt.priceMinor) > 0)
        ? "paid"
        : "free",
      startsAt: e.startsAt,
      venue: e.venueName || "—",
      location: [e.city, e.state, e.country].filter(Boolean).join(", ") || "—",
      date: formatDate(e.startsAt),
      status: formatEventStatus(e.status),
      ticketsSold: e.ticketTypes.reduce((sum, tt) => sum + tt.quantitySold, 0),
      revenue: formatPrice(
        e.ticketTypes
          .reduce((sum, tt) => sum + Number(tt.priceMinor) * tt.quantitySold, 0)
          .toString(),
        e.ticketTypes[0]?.currency || "NGN",
      ),
      coverImage: e.images.find((img) => img.isCover)?.url || e.images[0]?.url,
      bgGradient: getGradient(e.category?.name),
      time: formatTime(e.startsAt),
    }),
  );
});

const publishedCount = computed(
  () => tableEvents.value.filter((e) => e.status === "Published").length,
);
const draftCount = computed(
  () => tableEvents.value.filter((e) => e.status === "Draft").length,
);

function closeAllMenus() {
  openMenuId.value = null;
  isFilterOpen.value = false;
  isSortOpen.value = false;
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("click", closeAllMenus);
  }
});

/* Custom Table Columns */
const tableColumns: TableColumn[] = [
  { key: "event", label: "EVENT", width: "30%" },
  { key: "dateTime", label: "DATE & TIME", width: "18%" },
  { key: "venue", label: "VENUE", width: "22%" },
  { key: "ticketsSold", label: "TICKETS SOLD", width: "12%" },
  { key: "revenue", label: "REVENUE", width: "12%" },
  { key: "status", label: "STATUS", width: "10%" },
  { key: "action", label: "ACTION", width: "6%", align: "center" },
];

const filteredTableEvents = computed(() => {
  let list = tableEvents.value;
  if (activeTab.value === "published") {
    list = list.filter((e) => e.status === "Published");
  } else if (activeTab.value === "draft") {
    list = list.filter((e) => e.status === "Draft");
  }

  if (statusFilter.value === "published") {
    list = list.filter((e) => e.status === "Published");
  } else if (statusFilter.value === "draft") {
    list = list.filter((e) => e.status === "Draft");
  }

  if (typeFilter.value !== "all") {
    list = list.filter((e) => e.eventType === typeFilter.value);
  }

  if (startDate.value) {
    const from = new Date(startDate.value);
    from.setHours(0, 0, 0, 0);
    list = list.filter((e) => new Date(e.startsAt || "") >= from);
  }

  if (endDate.value) {
    const to = new Date(endDate.value);
    to.setHours(23, 59, 59, 999);
    list = list.filter((e) => new Date(e.startsAt || "") <= to);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q),
    );
  }
  return [...list].sort((a, b) => {
    if (sortOption.value === "newest") {
      return (
        new Date(b.startsAt || "").getTime() -
        new Date(a.startsAt || "").getTime()
      );
    }
    if (sortOption.value === "oldest") {
      return (
        new Date(a.startsAt || "").getTime() -
        new Date(b.startsAt || "").getTime()
      );
    }
    if (sortOption.value === "nameAsc") return a.title.localeCompare(b.title);
    if (sortOption.value === "nameDesc") return b.title.localeCompare(a.title);
    return 0;
  });
});

function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value;
  isSortOpen.value = false;
  if (isFilterOpen.value) {
    draftStatusFilter.value = statusFilter.value;
    draftTypeFilter.value = typeFilter.value;
    draftStartDate.value = startDate.value;
    draftEndDate.value = endDate.value;
  }
}

function toggleSort() {
  isSortOpen.value = !isSortOpen.value;
  isFilterOpen.value = false;
}

function applyFilters() {
  statusFilter.value = draftStatusFilter.value as "all" | "published" | "draft";
  typeFilter.value = draftTypeFilter.value as "all" | "paid" | "free";
  startDate.value = draftStartDate.value;
  endDate.value = draftEndDate.value;
  isFilterOpen.value = false;
}

function resetFilters() {
  statusFilter.value = "all";
  typeFilter.value = "all";
  startDate.value = null;
  endDate.value = null;
  draftStatusFilter.value = "all";
  draftTypeFilter.value = "all";
  draftStartDate.value = null;
  draftEndDate.value = null;
}

function selectSort(value: string) {
  sortOption.value = value;
  isSortOpen.value = false;
}

function handleAction(actionType: string, eventId: string) {
  openMenuId.value = null;
  if (actionType === "edit") {
    router.push(`/events/${eventId}`);
  } else if (actionType === "delete") {
    // TODO: call delete API
    toast.show({
      title: "Delete Event",
      message: "Delete is not yet implemented.",
      type: "info",
    });
  }
}

useHead({
  title: "Events — Uzu Ticket",
  meta: [
    { name: "description", content: "Manage all your events from one place." },
  ],
});
</script>

<style scoped>
.events-page {
  width: 100%;
}

/* Loading State */
.events-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3fd246;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-left: 1rem;
  font-size: 0.95rem;
  color: #6b7280;
}

/* Main Events Card */
.events-main-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

/* Tabs Header */
.tabs-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 1.75rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  position: relative;
  transition: color 0.15s ease;
}

.tab-btn:hover {
  color: #0e2615;
}

.tab-btn--active {
  color: #3fd246;
  font-weight: 700;
}

.tab-btn--active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #3fd246;
  border-radius: 2px;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 520px;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.15rem;
  height: 1.15rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1.25rem 0.75rem 3rem;
  background: #ebf1f6;
  border: 1px solid transparent;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  background: #ffffff;
  border-color: #3fd246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-control {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-control:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-control--active {
  border-color: #3fd246;
  color: #0e2615;
}

.control-popover-wrap {
  position: relative;
}

.filter-popover,
.sort-popover {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 100;
  background: #ffffff;
  border: 1px solid #eef2ee;
  border-radius: 1.1rem;
  box-shadow: 0 20px 50px rgba(14, 38, 21, 0.14);
}

.filter-popover {
  width: min(24rem, calc(100vw - 2rem));
  padding: 1rem;
}

.sort-popover {
  width: 14rem;
  padding: 1rem 1rem;
}

.popover-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.popover-heading h3,
.sort-popover h3 {
  margin: 0;
  color: #0e2615;
  font-size: 1rem;
  font-weight: 800;
}

.sort-popover h3 {
  margin-bottom: 0.65rem;
}

.popover-reset {
  padding: 0;
  border: none;
  background: transparent;
  color: #3fd246;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.popover-field {
  margin-bottom: 0.75rem;
}

.popover-field > label {
  display: block;
  margin-bottom: 0.35rem;
  color: #6b7c70;
  font-size: 0.8rem;
  font-weight: 700;
}

.date-range-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.popover-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.65rem;
  margin-top: 1rem;
}

.popover-cancel,
.popover-apply {
  min-width: 7rem;
  padding: 0.6rem 1rem;
  border-radius: 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.popover-cancel {
  border: 1px solid #c7d2e1;
  background: #ffffff;
  color: #0e2615;
}

.popover-apply {
  border: 1px solid #3fd246;
  background: #3fd246;
  color: #ffffff;
}

.sort-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.25rem;
  border: none;
  background: transparent;
  color: #0e2615;
  font-size: 0.82rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.sort-option:hover {
  color: #3fd246;
}

.sort-check {
  width: 1.2rem;
  height: 1.2rem;
  color: #3fd246;
}

.view-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem;
  background: #f3f4f6;
  border-radius: 0.65rem;
}

.view-switch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.45rem;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-switch-btn:hover {
  color: #374151;
}

.view-switch-btn--active {
  background: #ffffff;
  color: #0e2615;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.view-switch-icon {
  width: 1.05rem;
  height: 1.05rem;
}

.control-icon,
.control-arrow {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}

.btn-create-event {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.35rem;
  background: #3fd246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.2);
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-create-event:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-icon {
  width: 1.05rem;
  height: 1.05rem;
}

/* Custom Table Cell Styling */
.event-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.event-thumb-box {
  width: 4.5rem;
  height: 3.5rem;
  border-radius: 0.65rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.table-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-svg {
  width: 1.6rem;
  height: 1.6rem;
  opacity: 0.85;
}

.event-title-stack {
  display: flex;
  flex-direction: column;
}

.table-event-name {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.15rem;
}

.table-event-category {
  font-size: 0.775rem;
  color: #6b7280;
}

/* Date & Venue Cells */
.date-cell,
.venue-cell {
  display: flex;
  flex-direction: column;
}

.date-val,
.venue-name {
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
}

.time-val,
.venue-location {
  font-size: 0.775rem;
  color: #6b7280;
}

.revenue-val {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0e2615;
}

/* Status Pills */
.status-pill {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-pill--published {
  background: #dcfce7;
  color: #16a34a;
}

.status-pill--draft {
  background: #fef3c7;
  color: #d97706;
}

/* Table 3-Dots Action */
.table-action-wrapper {
  position: relative;
  z-index: 10;
}

.table-dots-btn {
  width: 1.85rem;
  height: 1.85rem;
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

.table-dots-btn:hover {
  background: #f3f4f6;
  color: #0e2615;
}

.dots-icon {
  width: 1.15rem;
  height: 1.15rem;
}

/* Context Menu */
.table-context-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 160px;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  padding: 0.4rem 0;
  z-index: 100;
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
  text-align: left;
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

/* 2-Row Horizontal Scroll Grid View */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (max-width: 700px) {
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    max-width: 100%;
  }
  .right-controls {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 701px) and (max-width: 1100px) {
  .events-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

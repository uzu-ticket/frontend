<template>
  <div class="payout-history-page">
    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Back Button & Header -->
      <div class="card-header">
        <div class="back-row">
          <button
            type="button"
            class="back-link"
            @click="$router.push('/promoters')"
          >
            <svg
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
        </div>

        <h1 class="card-title">Payout History</h1>
        <p class="card-subtitle">You can now request withdrawal</p>
      </div>

      <!-- Tab Pill Row -->
      <div class="tabs-row">
        <button type="button" class="tab-pill tab-pill--active">
          All Payout History
        </button>
      </div>

      <!-- Table Section -->
      <div class="table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>REFERENCE</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedPayouts"
              :key="item.id"
              class="table-row"
            >
              <td>{{ item.date }}</td>
              <td class="amount-cell">N{{ item.amount.toLocaleString() }}</td>
              <td>
                <span
                  class="status-pill"
                  :class="`status--${item.status.toLowerCase()}`"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="reference-cell">{{ item.reference }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination
        v-model="currentPage"
        :total-pages="totalPages"
        :total-items="payouts.length"
        :page-size="pageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppPagination from "~/components/ui/AppPagination.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Payout History — Promoters — Uzu Ticket",
  meta: [
    {
      name: "description",
      content: "Promoter payout history and transaction logs",
    },
  ],
});

const currentPage = ref(1);
const pageSize = 5;

const payouts = ref([
  {
    id: "1",
    date: "Sept 12, 2026",
    amount: 29000,
    status: "Completed",
    reference: "UTX-9231",
  },
  {
    id: "2",
    date: "Sept 12, 2026",
    amount: 50000,
    status: "Failed",
    reference: "UTX-9231",
  },
  {
    id: "3",
    date: "Sept 12, 2026",
    amount: 50000,
    status: "Completed",
    reference: "UTX-9231",
  },
  {
    id: "4",
    date: "Sept 12, 2026",
    amount: 30000,
    status: "Completed",
    reference: "FTG-9231",
  },
  {
    id: "5",
    date: "Sept 12, 2026",
    amount: 50000,
    status: "Failed",
    reference: "UBX-9231",
  },
  {
    id: "6",
    date: "Sept 12, 2026",
    amount: 10000,
    status: "Completed",
    reference: "UTX-9231",
  },
  {
    id: "7",
    date: "Sept 12, 2026",
    amount: 15000,
    status: "Completed",
    reference: "UTX-9231",
  },
]);

const totalPages = computed(
  () => Math.ceil(payouts.value.length / pageSize) || 1,
);

const paginatedPayouts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return payouts.value.slice(start, start + pageSize);
});
</script>

<style scoped>
.payout-history-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Demo Nav */
.demo-nav-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.demo-nav-link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.15s ease;
}

.demo-nav-link:hover {
  border-color: #3fd246;
  color: #16a34a;
}

.demo-nav-link--active {
  background: #3fd246;
  border-color: #3fd246;
  color: #ffffff;
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

/* Header */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.back-row {
  margin-bottom: 0.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #3fd246;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  gap: 0.35rem;
  transition: color 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.back-link:hover {
  color: #2bb832;
}

.back-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Tabs */
.tabs-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.25rem;
}

.tab-pill {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 700;
  color: #3fd246;
  border-bottom: 2.5px solid #3fd246;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: #f0fdf4;
  cursor: pointer;
  font-family: "Outfit", sans-serif;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table thead tr th {
  padding: 0.85rem 0.75rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3fd246;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
  background: #fafdfa;
}

.table-row {
  transition: background 0.1s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.history-table tbody tr td {
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.amount-cell {
  font-weight: 700;
  color: #0e2615;
}

.reference-cell {
  font-weight: 600;
  color: #374151;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--completed {
  background: #f0fdf4;
  color: #16a34a;
}

.status--failed {
  background: #fef2f2;
  color: #dc2626;
}
</style>

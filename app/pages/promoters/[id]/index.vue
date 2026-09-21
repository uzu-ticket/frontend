<template>
  <div class="promoter-detail-page">
    <AppPageSkeleton
      v-if="isLoading"
      layout="stats"
      :stat-cards="4"
      :show-header="true"
    />

    <template v-else>
      <div class="main-card">
        <!-- Back Navigation -->
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
            Back to Promoters
          </button>
        </div>

        <!-- Promoter Profile Header -->
        <div class="profile-header">
          <div
            class="profile-avatar"
            :style="{ background: promoter.avatarBg }"
          >
            {{ promoter.initials }}
          </div>

          <div class="profile-info">
            <div class="profile-name-row">
              <h1 class="profile-name">{{ promoter.name }}</h1>
              <span
                class="status-pill"
                :class="`status--${promoter.status.toLowerCase()}`"
              >
                {{ promoter.status }}
              </span>
            </div>
            <div class="profile-contacts">
              <span class="contact-item">
                <svg
                  class="contact-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ promoter.email }}
              </span>
              <span v-if="promoter.phone" class="contact-item">
                <svg
                  class="contact-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {{ promoter.phone }}
              </span>
            </div>
            <div class="profile-meta">
              Promoter Event: <strong>{{ promoter.event }}</strong>
              <span class="meta-dot">•</span>
              Joined {{ formatDate(promoter.joinedAt) }}
            </div>
          </div>

          <div class="action-buttons">
            <button type="button" class="btn-secondary" @click="copyPromoterLink">
              Copy Link
            </button>
            <button
              type="button"
              class="btn-status"
              :class="promoter.status === 'Active' ? 'btn-status--deactivate' : 'btn-status--activate'"
              @click="toggleStatus"
            >
              {{ promoter.status === 'Active' ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Tickets Sold</span>
            <div class="stat-value">{{ promoter.ticketsSold }}</div>
            <div class="stat-trend">+12.4% vs last period</div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Revenue Generated</span>
            <div class="stat-value">
              ₦{{ formatCurrency(promoter.revenue) }}
            </div>
            <div class="stat-trend">+8.6% volume</div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Commission Earned</span>
            <div class="stat-value">
              ₦{{ formatCurrency(promoter.commissionEarned) }}
            </div>
            <div class="stat-trend">Rate: {{ promoter.commissionRate }}</div>
          </div>

          <div class="stat-card">
            <span class="stat-label">Link Clicks & Conversion</span>
            <div class="stat-value">{{ promoter.clicks }} clicks</div>
            <div class="stat-trend">{{ promoter.conversionRate }} conversion</div>
          </div>
        </div>

        <!-- Section Tabs / Tables -->
        <div class="tabs-row">
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'sales' }"
            @click="activeTab = 'sales'"
          >
            Sales & Commission Log
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'links' }"
            @click="activeTab = 'links'"
          >
            Promoter Links
          </button>
        </div>

        <!-- Tab 1: Sales Log -->
        <div v-if="activeTab === 'sales'" class="table-wrapper">
          <table class="detail-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>TICKET REVENUE</th>
                <th>COMMISSION</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in promoter.commissions"
                :key="item.id"
                class="table-row"
              >
                <td class="order-id">{{ item.orderId }}</td>
                <td>{{ item.customerName }}</td>
                <td>₦{{ formatCurrency(item.revenue) }}</td>
                <td class="earned-cell">₦{{ formatCurrency(item.amount) }}</td>
                <td>{{ formatDate(item.createdAt) }}</td>
                <td>
                  <span
                    class="status-pill"
                    :class="`status--${item.status.toLowerCase()}`"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="!promoter.commissions || promoter.commissions.length === 0">
                <td colspan="6" class="empty-cell">
                  No commission transactions recorded yet for this promoter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 2: Promoter Links -->
        <div v-if="activeTab === 'links'" class="table-wrapper">
          <table class="detail-table">
            <thead>
              <tr>
                <th>LINK CODE</th>
                <th>PROMOTER URL</th>
                <th>CLICKS</th>
                <th>EXPIRATION</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="link in promoter.links"
                :key="link.id"
                class="table-row"
              >
                <td class="order-id">{{ link.code }}</td>
                <td class="url-cell">{{ link.url }}</td>
                <td>{{ link.clicks }}</td>
                <td>{{ link.expiresAt ? formatDate(link.expiresAt) : 'Never' }}</td>
                <td>
                  <button
                    type="button"
                    class="btn-copy-sm"
                    @click="copyText(link.url)"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Toast Notification -->
    <Transition name="fade">
      <div v-if="toastMessage" class="toast-notification">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";
import { useOrgState } from "~/composables/useOrgState";
import AppPageSkeleton from "~/components/ui/AppPageSkeleton.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const promoterId = computed(() => route.params.id as string);

const { instance } = useApi();
const { activeOrgId } = useOrgState();

const isLoading = ref(true);
const activeTab = ref<"sales" | "links">("sales");
const toastMessage = ref("");

// Default/mock fallback data matching system promoters
const defaultPromoters: Record<string, any> = {
  "promoter-1": {
    id: "promoter-1",
    name: "Divine Emmanuel",
    initials: "DE",
    avatarBg: "#14b8a6",
    email: "divine.emmanuel@example.com",
    phone: "08035534516",
    status: "Active",
    event: "Summer Music Fest",
    ticketsSold: 156,
    commissionRate: "10%",
    commissionEarned: 180000,
    revenue: 1800000,
    clicks: 420,
    conversionRate: "37.1%",
    joinedAt: "2026-08-10T10:00:00Z",
    links: [
      {
        id: "l-1",
        code: "p-divine-summer",
        url: "https://uzutickets.com/p/p-divine-summer",
        clicks: 420,
        expiresAt: null,
      },
    ],
    commissions: [
      {
        id: "c-101",
        orderId: "ORD-9821",
        customerName: "Alex Morgan",
        revenue: 25000,
        amount: 2500,
        createdAt: "2026-09-18T14:20:00Z",
        status: "Completed",
      },
      {
        id: "c-102",
        orderId: "ORD-9818",
        customerName: "Sarah Jenkins",
        revenue: 50000,
        amount: 5000,
        createdAt: "2026-09-17T11:45:00Z",
        status: "Completed",
      },
      {
        id: "c-103",
        orderId: "ORD-9805",
        customerName: "David Okyere",
        revenue: 15000,
        amount: 1500,
        createdAt: "2026-09-15T16:10:00Z",
        status: "Pending",
      },
    ],
  },
  "promoter-2": {
    id: "promoter-2",
    name: "Mike Mills",
    initials: "MM",
    avatarBg: "#065f46",
    email: "mike.mills@example.com",
    phone: "08021123344",
    status: "Inactive",
    event: "Arts Emergence",
    ticketsSold: 98,
    commissionRate: "15%",
    commissionEarned: 250000,
    revenue: 1666600,
    clicks: 280,
    conversionRate: "35.0%",
    joinedAt: "2026-07-22T09:30:00Z",
    links: [
      {
        id: "l-2",
        code: "p-mike-arts",
        url: "https://uzutickets.com/p/p-mike-arts",
        clicks: 280,
        expiresAt: null,
      },
    ],
    commissions: [
      {
        id: "c-201",
        orderId: "ORD-9750",
        customerName: "Grace Hopper",
        revenue: 40000,
        amount: 6000,
        createdAt: "2026-09-12T09:15:00Z",
        status: "Completed",
      },
    ],
  },
  "promoter-3": {
    id: "promoter-3",
    name: "Jane Cooper",
    initials: "JC",
    avatarBg: "#2563eb",
    email: "jane.cooper@example.com",
    phone: "08098877665",
    status: "Active",
    event: "Chess Africa",
    ticketsSold: 76,
    commissionRate: "10%",
    commissionEarned: 150000,
    revenue: 1500000,
    clicks: 210,
    conversionRate: "36.1%",
    joinedAt: "2026-08-01T12:00:00Z",
    links: [
      {
        id: "l-3",
        code: "p-jane-chess",
        url: "https://uzutickets.com/p/p-jane-chess",
        clicks: 210,
        expiresAt: null,
      },
    ],
    commissions: [
      {
        id: "c-301",
        orderId: "ORD-9600",
        customerName: "Tunde Bakare",
        revenue: 30000,
        amount: 3000,
        createdAt: "2026-09-10T15:00:00Z",
        status: "Completed",
      },
    ],
  },
  "promoter-4": {
    id: "promoter-4",
    name: "Ben Francis",
    initials: "BF",
    avatarBg: "#ef4444",
    email: "ben.francis@example.com",
    phone: "08077654321",
    status: "Active",
    event: "New Year Groove",
    ticketsSold: 60,
    commissionRate: "12%",
    commissionEarned: 300000,
    revenue: 2500000,
    clicks: 190,
    conversionRate: "31.5%",
    joinedAt: "2026-08-15T14:20:00Z",
    links: [
      {
        id: "l-4",
        code: "p-ben-groove",
        url: "https://uzutickets.com/p/p-ben-groove",
        clicks: 190,
        expiresAt: null,
      },
    ],
    commissions: [
      {
        id: "c-401",
        orderId: "ORD-9510",
        customerName: "Emeka Okafor",
        revenue: 50000,
        amount: 6000,
        createdAt: "2026-09-05T18:30:00Z",
        status: "Completed",
      },
    ],
  },
  "promoter-5": {
    id: "promoter-5",
    name: "Lizzy Poole",
    initials: "LP",
    avatarBg: "#6b21a8",
    email: "lizzy.poole@example.com",
    phone: "08035534516",
    status: "Inactive",
    event: "Pool Party Event",
    ticketsSold: 44,
    commissionRate: "10%",
    commissionEarned: 120000,
    revenue: 1200000,
    clicks: 130,
    conversionRate: "33.8%",
    joinedAt: "2026-09-01T08:00:00Z",
    links: [
      {
        id: "l-5",
        code: "p-lizzy-pool",
        url: "https://uzutickets.com/p/p-lizzy-pool",
        clicks: 130,
        expiresAt: null,
      },
    ],
    commissions: [
      {
        id: "c-501",
        orderId: "ORD-9400",
        customerName: "Funke Akindele",
        revenue: 20000,
        amount: 2000,
        createdAt: "2026-09-02T10:10:00Z",
        status: "Completed",
      },
    ],
  },
};

const promoter = ref<any>({
  id: promoterId.value,
  name: "Promoter",
  initials: "PR",
  avatarBg: "#3fd246",
  email: "",
  phone: "",
  status: "Active",
  event: "Event",
  ticketsSold: 0,
  commissionRate: "0%",
  commissionEarned: 0,
  revenue: 0,
  clicks: 0,
  conversionRate: "0%",
  joinedAt: new Date().toISOString(),
  links: [],
  commissions: [],
});

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val || 0);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function copyText(text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  showToast("Link copied to clipboard!");
}

function copyPromoterLink() {
  const link = promoter.value.links?.[0]?.url || `https://uzutickets.com/p/${promoter.value.id}`;
  copyText(link);
}

function toggleStatus() {
  promoter.value.status = promoter.value.status === "Active" ? "Inactive" : "Active";
  showToast(`Promoter status updated to ${promoter.value.status}`);
}

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = "";
  }, 3000);
}

async function loadPromoterDetail() {
  isLoading.value = true;
  try {
    if (activeOrgId.value) {
      const res = await instance.get(
        `/organisations/${activeOrgId.value}/promoters/${promoterId.value}`
      );
      if (res.data) {
        promoter.value = res.data.data ?? res.data;
      }
    }
  } catch (err) {
    console.warn("Using fallback promoter detail", err);
    const fallback = defaultPromoters[promoterId.value] || defaultPromoters["promoter-1"];
    promoter.value = { ...fallback };
  } finally {
    // If name wasn't set by backend, load fallback
    if (!promoter.value.name || promoter.value.name === "Promoter") {
      const fallback = defaultPromoters[promoterId.value] || defaultPromoters["promoter-1"];
      promoter.value = { ...fallback };
    }
    useHead({
      title: `${promoter.value.name} — Promoter Detail`,
    });
    isLoading.value = false;
  }
}

onMounted(() => {
  loadPromoterDetail();
});
</script>

<style scoped>
.promoter-detail-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
}

.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Back Link */
.back-row {
  display: flex;
  align-items: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.back-link:hover {
  color: #16a34a;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.profile-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.profile-contacts {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.profile-meta {
  font-size: 0.82rem;
  color: #9ca3af;
}

.meta-dot {
  margin: 0 0.4rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.55rem 1.1rem;
  border-radius: 0.65rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-secondary:hover {
  border-color: #3fd246;
  color: #16a34a;
}

.btn-status {
  padding: 0.55rem 1.1rem;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-status--deactivate {
  background: #fef2f2;
  color: #dc2626;
}

.btn-status--deactivate:hover {
  background: #fee2e2;
}

.btn-status--activate {
  background: #f0fdf4;
  color: #16a34a;
}

.btn-status--activate:hover {
  background: #dcfce7;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #fafdfa;
  border: 1px solid rgba(63, 210, 70, 0.45);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #4b5563;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0e2615;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3fd246;
}

/* Tabs */
.tabs-row {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #eef2ee;
  padding-bottom: 0.5rem;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  padding: 0.5rem 0.25rem;
  cursor: pointer;
  position: relative;
  transition: color 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.tab-btn--active {
  color: #16a34a;
  font-weight: 700;
}

.tab-btn--active::after {
  content: "";
  position: absolute;
  bottom: -0.55rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #3fd246;
  border-radius: 2px;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table thead tr th {
  padding: 0.85rem 0.75rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3fd246;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.detail-table tbody tr td {
  padding: 0.95rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.order-id {
  font-weight: 700;
  color: #111827;
}

.earned-cell {
  font-weight: 700;
  color: #0e2615;
}

.url-cell {
  font-family: monospace;
  font-size: 0.82rem;
  color: #2563eb;
}

.btn-copy-sm {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-copy-sm:hover {
  border-color: #3fd246;
  color: #16a34a;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--active,
.status--completed {
  background: #f0fdf4;
  color: #16a34a;
}

.status--inactive,
.status--cancelled {
  background: #f3f4f6;
  color: #6b7280;
}

.status--pending {
  background: #fff7ed;
  color: #ea580c;
}

.empty-cell {
  text-align: center;
  padding: 2.5rem 1rem !important;
  color: #9ca3af;
}

.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0e2615;
  color: #ffffff;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .action-buttons {
    width: 100%;
  }
}
</style>

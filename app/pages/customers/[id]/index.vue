<template>
  <div class="customer-detail-page">
    <!-- Single unified card -->
    <div class="main-card">
      <!-- Back row inside card -->
      <div class="back-row">
        <button type="button" class="back-link" @click="$router.push('/customers')">
          <svg class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar" :style="{ background: customer.avatarColor }">
          {{ customer.initials }}
        </div>
        <div class="profile-info">
          <div class="profile-name-row">
            <h1 class="profile-name">{{ customer.name }}</h1>
            <span class="status-pill" :class="`status--${customer.status.toLowerCase()}`">
              {{ customer.status }}
            </span>
          </div>
          <div class="profile-contacts">
            <span class="contact-item">
              <svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ customer.email }}
            </span>
            <span class="contact-item">
              <svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ customer.phone }}
            </span>
          </div>
          <div class="profile-meta">
            Customer since {{ customer.customerSince }}
            <span class="meta-dot">•</span>
            Customer ID - {{ customer.customerId }}
          </div>
        </div>
      </div>

      <!-- Tabs row — border-separated from header -->
      <div class="tabs-row">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab content — same card, no extra border -->
      <div class="tab-content">

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="overview-section">
          <div class="overview-header">
            <div />
            <button type="button" class="btn-edit" @click="isEditing = !isEditing">
              <span>Edit</span>
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          <div class="overview-fields">
            <div class="field-row">
              <span class="field-label">Full Name</span>
              <span class="field-value">{{ customer.name }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Email</span>
              <span class="field-value">{{ customer.email }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Phone</span>
              <span class="field-value">{{ customer.phone }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Location</span>
              <span class="field-value">{{ customer.location }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Date of Birth</span>
              <span class="field-value">{{ customer.dateOfBirth }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Preferred Currency</span>
              <span class="field-value">{{ customer.preferredCurrency }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Marketing Content</span>
              <span class="field-value">{{ customer.marketingContent }}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Last Active</span>
              <span class="field-value">{{ customer.lastActive }}</span>
            </div>
          </div>
        </div>

        <!-- Purchase History Tab -->
        <div v-if="activeTab === 'purchases'">
          <div class="table-wrapper">
            <table class="purchases-table">
              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>ORDER ID</th>
                  <th>DATE</th>
                  <th>TICKETS</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="purchase in paginatedPurchases"
                  :key="purchase.id"
                  class="table-row"
                  @click="goToTicket(purchase)"
                >
                  <td class="event-name">{{ purchase.event }}</td>
                  <td class="order-id-cell">{{ purchase.orderId }}</td>
                  <td>{{ purchase.date }}</td>
                  <td>{{ purchase.tickets }}</td>
                  <td class="amount-cell">₦{{ purchase.amount.toLocaleString() }}</td>
                  <td>
                    <span class="purchase-status" :class="`pstatus--${purchase.status.toLowerCase()}`">
                      {{ purchase.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <AppPagination
            v-model="currentPage"
            :total-pages="totalPages"
            :total-items="purchases.length"
            :page-size="pageSize"
          />
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'">
          <h2 class="activity-title">Recent Activity</h2>
          <div class="activity-list">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="activity-row"
            >
              <div class="activity-icon-wrap">
                <svg class="activity-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12C20 10.343 21.343 9 23 9V7C23 5.895 22.105 5 21 5H3C1.895 5 1 5.895 1 7V9C2.657 9 4 10.343 4 12C4 13.657 2.657 15 1 15V17C1 18.105 1.895 19 3 19H21C22.105 19 23 18.105 23 17V15C21.343 15 20 13.657 20 12Z" stroke="#3FD246" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-text">
                <span class="activity-desc">{{ activity.description }}</span>
                <span class="activity-date">{{ activity.date }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPagination from '~/components/ui/AppPagination.vue'
import type { Customer, CustomerPurchase, CustomerActivity } from '~/types/customers'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'purchases', label: 'Purchase History' },
  { key: 'activity', label: 'Activity' },
]

const activeTab = ref('overview')
const isEditing = ref(false)
const currentPage = ref(1)
const pageSize = 5

const customer = ref<Customer>({
  id: 'cust-1',
  customerId: 'CUST 0032026',
  initials: 'DE',
  avatarColor: '#3FD246',
  name: 'Divine Emmanuel',
  email: 'divineemma@gmail.com',
  phone: '+2348023334566',
  orders: 8,
  status: 'Active',
  location: 'Lagos, Nigeria',
  dateOfBirth: 'Feb 14, 1999',
  preferredCurrency: 'NGN',
  marketingContent: 'Subscribed',
  lastActive: '2 minutes ago',
  customerSince: 'Aug 20, 2026',
})

useHead({
  title: computed(() => `${customer.value.name} — Customers — Uzu Ticket`),
  meta: [
    { name: 'description', content: 'View customer profile and ticket purchase history.' },
  ],
})

const purchases = ref<CustomerPurchase[]>([
  { id: 'p1', event: 'Summer Tech Camp', orderId: '#ORD-1264', date: 'Aug 10, 2026', tickets: 8, amount: 10000, status: 'Completed' },
  { id: 'p2', event: 'Music Fest 2026', orderId: '#ORD-1264', date: 'Sept 12, 2026', tickets: 10, amount: 14000, status: 'Completed' },
  { id: 'p3', event: 'Business Catchup', orderId: '#ORD-1264', date: 'Aug 10, 2026', tickets: 5, amount: 20000, status: 'Cancelled' },
  { id: 'p4', event: 'Tech Connect Lagos', orderId: '#ORD-1264', date: 'Oct 10, 2026', tickets: 8, amount: 10000, status: 'Completed' },
  { id: 'p5', event: 'Food & Night Expo', orderId: '#ORD-1264', date: 'Sept 12, 2026', tickets: 6, amount: 20000, status: 'Refunded' },
])

const activities = ref<CustomerActivity[]>([
  { id: 'a1', date: 'Sept 23, 2026', description: 'Purchased 2 tickets for Summer Tech Event' },
  { id: 'a2', date: 'Sept 23, 2026', description: 'Purchased 2 tickets for Summer Tech Event' },
  { id: 'a3', date: 'Sept 23, 2026', description: 'Purchased 2 tickets for Summer Tech Event' },
  { id: 'a4', date: 'Sept 23, 2026', description: 'Purchased 2 tickets for Summer Tech Event' },
  { id: 'a5', date: 'Sept 23, 2026', description: 'Purchased 2 tickets for Summer Tech Event' },
])

const totalPages = computed(() => Math.ceil(purchases.value.length / pageSize) || 1)

const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return purchases.value.slice(start, start + pageSize)
})

function goToTicket(purchase: CustomerPurchase) {
  router.push(`/customers/${route.params.id}/ticket/tkt-1`)
}
</script>

<style scoped>
.customer-detail-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Back */
.back-row {
  padding: 1.5rem 1.5rem 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  gap: 0.35rem;
  transition: color 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.back-link:hover {
  color: #2bb832;
}

.back-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

/* ── Single unified card ── */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

/* Profile header — inside card, padded */
.profile-header {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  border-bottom: 1px solid #eef2ee;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--active   { background: #f0fdf4; color: #16a34a; }
.status--inactive { background: #f9fafb; color: #6b7280; }
.status--invalid  { background: #fef2f2; color: #dc2626; }

.profile-contacts {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.contact-icon {
  width: 15px;
  height: 15px;
  color: #9ca3af;
}

.profile-meta {
  font-size: 0.8rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-dot {
  color: #d1d5db;
}

/* Tabs row — inside card, border-separated */
.tabs-row {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid #eef2ee;
}

.tab-btn {
  padding: 0.85rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.tab-btn:hover {
  color: #0E2615;
}

.tab-btn--active {
  color: #3FD246;
  border-bottom-color: #3FD246;
  font-weight: 700;
}

/* Tab content area — inside card, padded */
.tab-content {
  padding: 1.5rem;
}

/* Overview */
.overview-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-radius: 0.65rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  gap: 0.35rem;
  font-family: 'Outfit', sans-serif;
}

.btn-edit:hover {
  border-color: #3FD246;
  color: #16a34a;
}

.overview-fields {
  display: flex;
  flex-direction: column;
}

.field-row {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.field-row:last-child {
  border-bottom: none;
}

.field-label {
  width: 220px;
  flex-shrink: 0;
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
}

.field-value {
  font-size: 0.9rem;
  color: #0E2615;
  font-weight: 600;
}

/* Purchase History */
.table-wrapper {
  overflow-x: auto;
}

.purchases-table {
  width: 100%;
  border-collapse: collapse;
}

.purchases-table thead tr th {
  padding: 0.65rem 0.75rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3FD246;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.table-row {
  cursor: pointer;
  transition: background 0.1s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.purchases-table tbody tr td {
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.event-name    { font-weight: 600; color: #111827; }
.order-id-cell { font-weight: 700; color: #0E2615; }
.amount-cell   { font-weight: 700; color: #0E2615; }

.purchase-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.pstatus--completed { background: #f0fdf4; color: #16a34a; }
.pstatus--cancelled { background: #fef2f2; color: #dc2626; }
.pstatus--refunded  { background: #fff7ed; color: #ea580c; }
.pstatus--pending   { background: #fefce8; color: #ca8a04; }

/* Activity */
.activity-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-row:last-child {
  border-bottom: none;
}

.activity-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon {
  width: 20px;
  height: 20px;
}

.activity-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.activity-desc {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0E2615;
  line-height: 1.4;
}

.activity-date {
  font-size: 0.8rem;
  color: #9ca3af;
  font-weight: 400;
}
</style>

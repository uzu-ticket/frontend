<template>
  <div class="customers-page" @click="handleGlobalClick">
    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Stat Cards (4 Cards Grid) -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Total Customers</span>
          <div class="metric-value">12,842</div>
          <div class="metric-trend">+12.4% from last 30 days</div>
        </div>
        <div class="metric-card">
          <span class="metric-label">Active (Last 30 days)</span>
          <div class="metric-value">2,1358</div>
          <div class="metric-trend">+8.6% from last 30 days</div>
        </div>
        <div class="metric-card">
          <span class="metric-label">New</span>
          <div class="metric-value">342</div>
          <div class="metric-trend">+5.2% from last 30 days</div>
        </div>
        <div class="metric-card">
          <span class="metric-label">Duplicate/Used</span>
          <div class="metric-value">214</div>
          <div class="metric-trend">+3.1% from last 30 days</div>
        </div>
      </div>

      <!-- Table Controls -->
      <div class="controls-top-row">
        <!-- Search -->
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email or phone..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">
            &times;
          </button>
        </div>

        <!-- Filter -->
        <button
          type="button"
          class="btn-control btn-filter"
          :class="{ 'btn-control--active': filterStatus !== 'All' }"
          @click.stop="showFilterDropdown = !showFilterDropdown"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
          <span v-if="filterStatus !== 'All'" class="filter-active-dot" />
        </button>

        <!-- Filter Dropdown -->
        <Transition name="fade-drop">
          <div v-if="showFilterDropdown" class="filter-dropdown" @click.stop>
            <div class="filter-dropdown-title">Filter by Status</div>
            <button
              v-for="opt in statusOptions"
              :key="opt"
              class="filter-option"
              :class="{ 'filter-option--active': filterStatus === opt }"
              @click="filterStatus = opt; showFilterDropdown = false"
            >
              {{ opt }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="customers-table">
          <thead>
            <tr>
              <th class="col-customer">CUSTOMER</th>
              <th class="col-email">EMAIL</th>
              <th class="col-phone">PHONE</th>
              <th class="col-orders">ORDERS</th>
              <th class="col-status">STATUS</th>
              <th class="col-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton Rows -->
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="i" class="table-row">
                <td class="col-customer">
                  <div class="customer-cell">
                    <AppSkeleton variant="circle" width="36px" height="36px" />
                    <AppSkeleton variant="text" width="110px" />
                  </div>
                </td>
                <td class="col-email"><AppSkeleton variant="text" width="140px" /></td>
                <td class="col-phone"><AppSkeleton variant="text" width="100px" /></td>
                <td class="col-orders"><AppSkeleton variant="text" width="30px" /></td>
                <td class="col-status"><AppSkeleton variant="text" width="60px" border-radius="999px" /></td>
                <td class="col-actions"><AppSkeleton variant="circle" width="24px" height="24px" /></td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="customer in paginatedCustomers"
                :key="customer.id"
                class="table-row"
              >
              <!-- Customer -->
              <td class="col-customer">
                <div class="customer-cell">
                  <div class="avatar" :style="{ background: customer.avatarColor }">
                    {{ customer.initials }}
                  </div>
                  <span class="customer-name">{{ customer.name }}</span>
                </div>
              </td>

              <!-- Email -->
              <td class="col-email">{{ customer.email }}</td>

              <!-- Phone -->
              <td class="col-phone">{{ customer.phone }}</td>

              <!-- Orders -->
              <td class="col-orders">{{ customer.orders }}</td>

              <!-- Status -->
              <td class="col-status">
                <span class="status-pill" :class="`status--${customer.status.toLowerCase()}`">
                  {{ customer.status }}
                </span>
              </td>

              <!-- Actions -->
              <td class="col-actions">
                <div class="kebab-menu-container" @click.stop>
                  <button
                    type="button"
                    class="kebab-trigger-btn"
                    @click="toggleKebab(customer.id)"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  <Transition name="fade-drop">
                    <div v-if="activeKebabId === customer.id" class="kebab-dropdown-menu">
                      <button type="button" class="menu-item" @click="viewCustomer(customer)">
                        <svg class="w-4 h-4 menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Customer</span>
                      </button>
                      <button type="button" class="menu-item menu-item--danger" @click="activeKebabId = null">
                        <svg class="w-4 h-4 menu-icon text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <span>Block Customer</span>
                      </button>
                    </div>
                  </Transition>
                </div>
              </td>
            </tr>
            </template>

            <!-- Empty state -->
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="6" class="empty-table-cell">
                <div class="empty-state-box">
                  <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p class="empty-text">No customers found matching your criteria.</p>
                  <button class="reset-empty-btn" @click="resetFilters">Reset Search &amp; Filters</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="table-pagination-footer">
        <div class="pagination-info">
          Showing 1 of {{ totalCustomersCount }} orders
        </div>
        <div class="pagination-controls">
          <button
            v-for="page in paginationPages"
            :key="page"
            type="button"
            class="page-btn"
            :class="{ 'page-btn--active': currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="page-btn page-next-btn"
            :disabled="currentPage >= totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import type { Customer } from '~/types/customers'

const isLoading = ref(false)

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Customers — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Manage buyers and their ticket activity across your events.' },
  ],
})

const router = useRouter()

// Mock data
const customersList = ref<Customer[]>([
  {
    id: 'cust-1',
    customerId: 'CUST 0032026',
    initials: 'DE',
    avatarColor: '#3FD246',
    name: 'Divine Emmanuel',
    email: 'divine@gmail.com',
    phone: '08022334566',
    orders: 8,
    status: 'Active',
    location: 'Lagos, Nigeria',
    dateOfBirth: 'Feb 14, 1999',
    preferredCurrency: 'NGN',
    marketingContent: 'Subscribed',
    lastActive: '2 minutes ago',
    customerSince: 'Aug 20, 2026',
  },
  {
    id: 'cust-2',
    customerId: 'CUST 0032027',
    initials: 'MM',
    avatarColor: '#374151',
    name: 'Mike Mills',
    email: 'mikemills@gmail.com',
    phone: '08025334566',
    orders: 10,
    status: 'Inactive',
    location: 'Abuja, Nigeria',
    dateOfBirth: 'Mar 5, 1990',
    preferredCurrency: 'NGN',
    marketingContent: 'Unsubscribed',
    lastActive: '5 days ago',
    customerSince: 'Jun 10, 2026',
  },
  {
    id: 'cust-3',
    customerId: 'CUST 0032028',
    initials: 'JC',
    avatarColor: '#3B82F6',
    name: 'Jane Cooper',
    email: 'janecooper@gmail.com',
    phone: '08032334566',
    orders: 5,
    status: 'Active',
    location: 'Port Harcourt, Nigeria',
    dateOfBirth: 'Jul 22, 1995',
    preferredCurrency: 'NGN',
    marketingContent: 'Subscribed',
    lastActive: '1 hour ago',
    customerSince: 'Jul 1, 2026',
  },
  {
    id: 'cust-4',
    customerId: 'CUST 0032029',
    initials: 'BF',
    avatarColor: '#EF4444',
    name: 'Ben Francis',
    email: 'benfrancis@gmail.com',
    phone: '08032534766',
    orders: 8,
    status: 'Active',
    location: 'Lagos, Nigeria',
    dateOfBirth: 'Dec 10, 1992',
    preferredCurrency: 'NGN',
    marketingContent: 'Subscribed',
    lastActive: '30 minutes ago',
    customerSince: 'May 15, 2026',
  },
  {
    id: 'cust-5',
    customerId: 'CUST 0032030',
    initials: 'LP',
    avatarColor: '#7C3AED',
    name: 'Lizzy Poole',
    email: 'lizzypoole@gmail.com',
    phone: '08035534516',
    orders: 6,
    status: 'Invalid',
    location: 'Ibadan, Nigeria',
    dateOfBirth: 'Sep 3, 1988',
    preferredCurrency: 'NGN',
    marketingContent: 'Unsubscribed',
    lastActive: '2 weeks ago',
    customerSince: 'Apr 20, 2026',
  },
  {
    id: 'cust-6',
    customerId: 'CUST 0032031',
    initials: 'JH',
    avatarColor: '#84CC16',
    name: 'James Hal',
    email: 'jameshal@gmail.com',
    phone: '08030034516',
    orders: 3,
    status: 'Active',
    location: 'Enugu, Nigeria',
    dateOfBirth: 'Jan 18, 1997',
    preferredCurrency: 'NGN',
    marketingContent: 'Subscribed',
    lastActive: '3 hours ago',
    customerSince: 'Aug 1, 2026',
  },
  {
    id: 'cust-7',
    customerId: 'CUST 0032032',
    initials: 'JD',
    avatarColor: '#0E2615',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: '08085534514',
    orders: 7,
    status: 'Active',
    location: 'Lagos, Nigeria',
    dateOfBirth: 'Nov 25, 1993',
    preferredCurrency: 'NGN',
    marketingContent: 'Subscribed',
    lastActive: '15 minutes ago',
    customerSince: 'Mar 5, 2026',
  },
])

// State
const searchQuery = ref('')
const filterStatus = ref('All')
const showFilterDropdown = ref(false)
const activeKebabId = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 10

const statusOptions = ['All', 'Active', 'Inactive', 'Invalid']
const totalCustomersCount = 24
const paginationPages = [1, 2, 3, 4, 5, 7]

// Computed
const filteredCustomers = computed(() => {
  return customersList.value.filter((c) => {
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query)
    )
    const matchesStatus = filterStatus.value === 'All' || c.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / pageSize) || 1)

const paginatedCustomers = computed(() => filteredCustomers.value)

// Methods
function handleGlobalClick() {
  activeKebabId.value = null
  showFilterDropdown.value = false
}

function toggleKebab(id: string) {
  activeKebabId.value = activeKebabId.value === id ? null : id
}

function viewCustomer(customer: Customer) {
  activeKebabId.value = null
  router.push(`/customers/${customer.id}`)
}

function resetFilters() {
  searchQuery.value = ''
  filterStatus.value = 'All'
}
</script>

<style scoped>
.customers-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
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

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metric-card {
  background: #FAFDFA;
  border: 1px solid rgba(63, 210, 70, 0.45);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 210, 70, 0.08);
}

.metric-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
}

.metric-value {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3FD246;
}

.controls-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 520px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.5rem 0.65rem 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.85rem;
  color: #111827;
  outline: none;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.search-input:focus {
  border-color: #3FD246;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.clear-search-btn {
  position: absolute;
  right: 0.85rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-control {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
  position: relative;
}

.btn-control:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.btn-control--active {
  border-color: #3FD246;
  color: #16a34a;
}

.filter-active-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3FD246;
  margin-left: 0.5rem;
}

/* Filter Dropdown */
.filter-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 160px;
}

.filter-dropdown-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 0.5rem 0.5rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 0.5rem;
}

.filter-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s ease;
  font-family: 'Outfit', sans-serif;
}

.filter-option:hover {
  background: #f3f4f6;
}

.filter-option--active {
  background: #f0fdf4;
  color: #16a34a;
  font-weight: 700;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.customers-table {
  width: 100%;
  border-collapse: collapse;
}

.customers-table thead tr th {
  padding: 0.65rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: #3FD246;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.table-row {
  transition: background 0.1s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.customers-table tbody tr td {
  padding: 0.9rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

/* Customer cell */
.customer-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #ffffff;
  flex-shrink: 0;
}

.customer-name {
  font-weight: 600;
  color: #111827;
}

/* Status Pills */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.status--active {
  background: #f0fdf4;
  color: #16a34a;
}

.status--inactive {
  background: #f9fafb;
  color: #6b7280;
}

.status--invalid {
  background: #fef2f2;
  color: #dc2626;
}

/* Kebab */
.kebab-menu-container {
  position: relative;
  display: inline-block;
}

.kebab-trigger-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.35rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
}

.kebab-trigger-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.kebab-dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.4rem);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 175px;
  z-index: 50;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s ease;
  font-family: 'Outfit', sans-serif;
  text-align: left;
}

.menu-item:hover {
  background: #f3f4f6;
}

.menu-item--danger {
  color: #dc2626;
}

.menu-item--danger:hover {
  background: #fef2f2;
}

.menu-icon {
  color: #6b7280;
  flex-shrink: 0;
}

/* Empty state */
.empty-table-cell {
  padding: 3rem 1rem !important;
}

.empty-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.reset-empty-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.65rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  transition: all 0.15s ease;
}

.reset-empty-btn:hover {
  border-color: #3FD246;
  color: #16a34a;
}

/* Pagination */
.table-pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-info {
  font-size: 0.82rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.page-btn:hover {
  border-color: #3FD246;
  color: #16a34a;
}

.page-btn--active {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
}

.page-next-btn {
  font-size: 0.9rem;
}

/* Transitions */
.fade-drop-enter-active,
.fade-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-drop-enter-from,
.fade-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Col widths */
.col-customer { min-width: 180px; }
.col-email { min-width: 180px; }
.col-phone { min-width: 130px; }
.col-orders { min-width: 80px; text-align: center; }
.col-status { min-width: 100px; }
.col-actions { min-width: 80px; text-align: right; }
</style>

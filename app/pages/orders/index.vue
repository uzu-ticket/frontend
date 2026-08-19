<template>
  <div class="orders-page" @click="handleGlobalClick">
    <!-- Stat Cards (4 Cards Grid) -->
    <div class="metrics-grid">
      <!-- Card 1: Total Orders -->
      <div class="metric-card">
        <div class="metric-icon-badge metric-icon--green">
          <svg class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span class="metric-label">Total Orders</span>
        <div class="metric-value">24</div>
        <div class="metric-trend">
          <span class="trend-arrow">↑</span>
          <span class="trend-percent">15%</span>
          <span class="trend-period">from last 30 days</span>
        </div>
      </div>

      <!-- Card 2: Tickets Sold -->
      <div class="metric-card">
        <div class="metric-icon-badge metric-icon--yellow">
          <svg class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <span class="metric-label">Tickets Sold</span>
        <div class="metric-value">3,672</div>
        <div class="metric-trend">
          <span class="trend-arrow">↑</span>
          <span class="trend-percent">18%</span>
          <span class="trend-period">from last 30 days</span>
        </div>
      </div>

      <!-- Card 3: Total Revenue -->
      <div class="metric-card">
        <div class="metric-icon-badge metric-icon--green">
          <svg class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span class="metric-label">Total Revenue</span>
        <div class="metric-value">5,742,200</div>
        <div class="metric-trend">
          <span class="trend-arrow">↑</span>
          <span class="trend-percent">30%</span>
          <span class="trend-period">from last 30 days</span>
        </div>
      </div>

      <!-- Card 4: Refunds -->
      <div class="metric-card">
        <div class="metric-icon-badge metric-icon--red">
          <svg class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <span class="metric-label">Refunds</span>
        <div class="metric-value">1,245,600</div>
        <div class="metric-trend">
          <span class="trend-arrow">↑</span>
          <span class="trend-percent">15%</span>
          <span class="trend-period">from last 30 days</span>
        </div>
      </div>
    </div>

    <!-- Search & Control Bar -->
    <div class="table-controls-card">
      <div class="controls-top-row">
        <!-- Search Input -->
        <div class="search-input-wrapper">
          <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by order number, email or name"
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">
            &times;
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="actions-right">
          <button
            type="button"
            class="btn-control btn-filter"
            :class="{ 'btn-control--active': hasActiveFilters }"
            @click.stop="showFilterModal = true"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
            <span v-if="hasActiveFilters" class="filter-active-dot" />
          </button>

          <button
            type="button"
            class="btn-control btn-export"
            @click.stop="showExportModal = true"
          >
            Export
            <svg class="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Active Filters Tag Bar -->
      <div v-if="hasActiveFilters" class="active-filters-bar">
        <span class="active-filters-title">Active Filters:</span>
        <span v-if="filterStatus !== 'All'" class="filter-pill">
          Status: {{ filterStatus }}
          <button @click="filterStatus = 'All'">&times;</button>
        </span>
        <span v-if="filterEvent !== 'ALL'" class="filter-pill">
          Event: {{ filterEvent }}
          <button @click="filterEvent = 'ALL'">&times;</button>
        </span>
        <span v-if="filterTier !== 'ALL'" class="filter-pill">
          Tier: {{ filterTier }}
          <button @click="filterTier = 'ALL'">&times;</button>
        </span>
        <button class="clear-all-filters-link" @click="resetAllFilters">Clear all</button>
      </div>

      <!-- Table Section -->
      <div class="table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th class="col-checkbox">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="col-order">ORDER</th>
              <th class="col-buyer">BUYER</th>
              <th class="col-event">EVENT</th>
              <th class="col-tickets">TICKETS</th>
              <th class="col-total">TOTAL</th>
              <th class="col-status">STATUS</th>
              <th class="col-date">DATE</th>
              <th class="col-action text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="table-row"
              :class="{ 'row-selected': selectedOrderIds.includes(order.id) }"
            >
              <!-- Checkbox -->
              <td class="col-checkbox">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :checked="selectedOrderIds.includes(order.id)"
                  @change="toggleSelectOrder(order.id)"
                />
              </td>

              <!-- Order ID -->
              <td class="col-order">
                <div class="order-id-wrapper">
                  <span class="order-number">{{ order.orderNumber }}</span>
                  <button
                    type="button"
                    class="copy-btn"
                    title="Copy Order ID"
                    @click.stop="copyText(order.orderNumber, 'Order Number')"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div class="order-ref">Ref: {{ order.reference }}</div>
              </td>

              <!-- Buyer -->
              <td class="col-buyer">
                <div class="buyer-name">{{ order.buyer.name }}</div>
                <div class="buyer-email">{{ order.buyer.email }}</div>
              </td>

              <!-- Event -->
              <td class="col-event">
                <div class="event-title">{{ order.event.title }}</div>
                <div class="event-date">{{ order.event.date }}</div>
              </td>

              <!-- Tickets -->
              <td class="col-tickets">
                <div class="ticket-count">{{ order.tickets.count }} Tickets</div>
                <div class="ticket-tier">{{ order.tickets.tier }}</div>
              </td>

              <!-- Total -->
              <td class="col-total">
                <div class="total-amount">N{{ order.totalAmount.toLocaleString() }}</div>
              </td>

              <!-- Status -->
              <td class="col-status">
                <span class="status-pill" :class="`status--${order.status.toLowerCase()}`">
                  {{ order.status }}
                </span>
              </td>

              <!-- Date -->
              <td class="col-date">
                <div class="created-date">{{ order.createdDate }}</div>
              </td>

              <!-- Action (Kebab Dropdown) -->
              <td class="col-action text-right">
                <div class="kebab-menu-container" @click.stop>
                  <button
                    type="button"
                    class="kebab-trigger-btn"
                    @click="toggleKebab(order.id)"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  <!-- Kebab Dropdown Menu -->
                  <Transition name="fade-drop">
                    <div v-if="activeKebabId === order.id" class="kebab-dropdown-menu">
                      <button type="button" class="menu-item" @click="handleAction('view-order', order)">
                        <svg class="w-4 h-4 menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Order</span>
                      </button>

                      <button type="button" class="menu-item" @click="handleAction('view-tickets', order)">
                        <svg class="w-4 h-4 menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>View Tickets</span>
                      </button>

                      <button type="button" class="menu-item" @click="handleAction('download-invoice', order)">
                        <svg class="w-4 h-4 menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Invoice</span>
                      </button>

                      <button type="button" class="menu-item" @click="handleAction('refund', order)">
                        <svg class="w-4 h-4 menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Issue Refund</span>
                      </button>

                      <button type="button" class="menu-item menu-item--danger" @click="handleAction('cancel', order)">
                        <svg class="w-4 h-4 menu-icon text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Cancel Order</span>
                      </button>
                    </div>
                  </Transition>
                </div>
              </td>
            </tr>

            <!-- Empty Table State -->
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="empty-table-cell">
                <div class="empty-state-box">
                  <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="empty-text">No orders found matching your criteria.</p>
                  <button class="reset-empty-btn" @click="resetAllFilters">Reset Search & Filters</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="table-pagination-footer">
        <div class="pagination-info">
          Showing 1 of {{ totalOrdersCount }} orders
        </div>

        <div class="pagination-controls">
          <button
            v-for="page in paginationPages"
            :key="page"
            type="button"
            class="page-btn"
            :class="{ 'page-btn--active': currentPage === page }"
            @click="currentPage = typeof page === 'number' ? page : currentPage"
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

    <!-- Modals -->
    <ExportOrdersModal
      v-model="showExportModal"
      @export="onExportFormatSelected"
    />

    <ViewOrderModal
      v-model="showViewOrderModal"
      :order="activeOrder"
    />

    <ViewTicketsModal
      v-model="showViewTicketsModal"
      :order="activeOrder"
    />

    <DownloadInvoiceModal
      v-model="showDownloadInvoiceModal"
      :order="activeOrder"
    />

    <IssueRefundModal
      v-model="showIssueRefundModal"
      :order="activeOrder"
      @refund-issued="onRefundIssued"
    />

    <CancelOrderModal
      v-model="showCancelOrderModal"
      :order="activeOrder"
      @order-cancelled="onOrderCancelled"
    />

    <OrderFilterModal
      v-model="showFilterModal"
      :active-status="filterStatus"
      :active-event="filterEvent"
      :active-tier="filterTier"
      @apply="onFiltersApplied"
    />

    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Order } from '~/types/orders'

import ExportOrdersModal from '~/components/orders/ExportOrdersModal.vue'
import ViewOrderModal from '~/components/orders/ViewOrderModal.vue'
import ViewTicketsModal from '~/components/orders/ViewTicketsModal.vue'
import DownloadInvoiceModal from '~/components/orders/DownloadInvoiceModal.vue'
import IssueRefundModal from '~/components/orders/IssueRefundModal.vue'
import CancelOrderModal from '~/components/orders/CancelOrderModal.vue'
import OrderFilterModal from '~/components/orders/OrderFilterModal.vue'
import AppToastContainer from '~/components/ui/AppToastContainer.vue'

import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Orders — Uzu Ticket',
  meta: [
    { name: 'description', content: 'View and engage all ticket orders.' },
  ],
})

const toast = useToast()

// Initial Mock Orders Dataset matching screenshots exactly
const ordersList = ref<Order[]>([
  {
    id: 'ord-1',
    orderNumber: '#ORD-1264',
    reference: 'UZ12481248',
    buyer: {
      name: 'Jane Cooper',
      email: 'Jane@gmail.com',
      phone: '08166523458',
    },
    event: {
      title: 'Table Talks',
      date: 'Aug, 30 . 10:00 AM',
    },
    tickets: {
      count: 2,
      tier: 'VIP',
    },
    totalAmount: 500000,
    status: 'Published',
    createdDate: 'Aug 4, 2026 10:00 AM',
    payment: {
      method: 'Card',
      details: 'Card ending in 4342',
    },
    ticketItems: [
      {
        id: 'tkt-101',
        type: 'REGULAR',
        price: 10000,
        available: 500,
        totalQuantity: 1,
        salesStart: 'Aug 24, 2026 • 9:00 AM',
        salesEnd: 'Aug 24, 2026 • 9:00 AM',
      },
      {
        id: 'tkt-102',
        type: 'VIP',
        price: 20000,
        available: 200,
        totalQuantity: 1,
        salesStart: 'Aug 24, 2026 • 9:00 AM',
        salesEnd: 'Aug 24, 2026 • 9:00 AM',
      },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-1264',
    reference: 'UZ12481248',
    buyer: {
      name: 'Jane Cooper',
      email: 'Jane@gmail.com',
      phone: '08166523458',
    },
    event: {
      title: 'Startup Meets',
      date: 'Aug, 30 . 10:00 AM',
    },
    tickets: {
      count: 2,
      tier: 'VIP',
    },
    totalAmount: 100000,
    status: 'Published',
    createdDate: 'Aug 4, 2026 10:00 AM',
    payment: {
      method: 'Card',
      details: 'Card ending in 4342',
    },
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-1264',
    reference: 'UZ12481248',
    buyer: {
      name: 'Jane Cooper',
      email: 'Jane@gmail.com',
      phone: '08166523458',
    },
    event: {
      title: 'Music Fest 2026',
      date: 'Aug, 30 . 10:00 AM',
    },
    tickets: {
      count: 2,
      tier: 'VIP',
    },
    totalAmount: 100000,
    status: 'Draft',
    createdDate: 'Aug 4, 2026 10:00 AM',
    payment: {
      method: 'Card',
      details: 'Card ending in 4342',
    },
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-1264',
    reference: 'UZ12481248',
    buyer: {
      name: 'Jane Cooper',
      email: 'Jane@gmail.com',
      phone: '08166523458',
    },
    event: {
      title: 'Music Fest 2026',
      date: 'Aug, 30 . 10:00 AM',
    },
    tickets: {
      count: 2,
      tier: 'VIP',
    },
    totalAmount: 100000,
    status: 'Published',
    createdDate: 'Aug 4, 2026 10:00 AM',
    payment: {
      method: 'Card',
      details: 'Card ending in 4342',
    },
  },
  {
    id: 'ord-5',
    orderNumber: '#ORD-1264',
    reference: 'UZ12481248',
    buyer: {
      name: 'Jane Cooper',
      email: 'Jane@gmail.com',
      phone: '08166523458',
    },
    event: {
      title: 'Music Fest 2026',
      date: 'Aug, 30 . 10:00 AM',
    },
    tickets: {
      count: 2,
      tier: 'VIP',
    },
    totalAmount: 100000,
    status: 'Refunded',
    createdDate: 'Aug 4, 2026 10:00 AM',
    payment: {
      method: 'Card',
      details: 'Card ending in 4342',
    },
  },
  {
    id: 'ord-6',
    orderNumber: '#ORD-1264',
    reference: 'UZ12481248',
    buyer: {
      name: 'Jane Cooper',
      email: 'Jane@gmail.com',
      phone: '08166523458',
    },
    event: {
      title: 'Music Fest 2026',
      date: 'Aug, 30 . 10:00 AM',
    },
    tickets: {
      count: 2,
      tier: 'VIP',
    },
    totalAmount: 100000,
    status: 'Published',
    createdDate: 'Aug 4, 2026 10:00 AM',
    payment: {
      method: 'Card',
      details: 'Card ending in 4342',
    },
  },
])

// State
const searchQuery = ref('')
const filterStatus = ref('All')
const filterEvent = ref('ALL')
const filterTier = ref('ALL')

const selectedOrderIds = ref<string[]>([])
const activeKebabId = ref<string | null>(null)
const activeOrder = ref<Order | null>(null)

// Modal Open States
const showExportModal = ref(false)
const showViewOrderModal = ref(false)
const showViewTicketsModal = ref(false)
const showDownloadInvoiceModal = ref(false)
const showIssueRefundModal = ref(false)
const showCancelOrderModal = ref(false)
const showFilterModal = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = 10

// Active Filters check
const hasActiveFilters = computed(() => {
  return filterStatus.value !== 'All' || filterEvent.value !== 'ALL' || filterTier.value !== 'ALL'
})

// Filtered list
const filteredOrders = computed(() => {
  return ordersList.value.filter((order) => {
    // Search match
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || (
      order.orderNumber.toLowerCase().includes(query) ||
      order.reference.toLowerCase().includes(query) ||
      order.buyer.name.toLowerCase().includes(query) ||
      order.buyer.email.toLowerCase().includes(query) ||
      order.event.title.toLowerCase().includes(query)
    )

    // Status filter
    const matchesStatus = filterStatus.value === 'All' || order.status === filterStatus.value

    // Event filter
    const matchesEvent = filterEvent.value === 'ALL' || order.event.title === filterEvent.value

    // Tier filter
    const matchesTier = filterTier.value === 'ALL' || order.tickets.tier === filterTier.value

    return matchesSearch && matchesStatus && matchesEvent && matchesTier
  })
})

const totalOrdersCount = computed(() => 24)

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize) || 1)

const paginatedOrders = computed(() => {
  return filteredOrders.value
})

const isAllSelected = computed(() => {
  return paginatedOrders.value.length > 0 && paginatedOrders.value.every((o) => selectedOrderIds.value.includes(o.id))
})

const paginationPages = [1, 2, 3, 4, 5, 7]

// Methods
function handleGlobalClick() {
  activeKebabId.value = null
}

function toggleKebab(orderId: string) {
  if (activeKebabId.value === orderId) {
    activeKebabId.value = null
  } else {
    activeKebabId.value = orderId
  }
}

function toggleSelectAll(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    selectedOrderIds.value = paginatedOrders.value.map((o) => o.id)
  } else {
    selectedOrderIds.value = []
  }
}

function toggleSelectOrder(id: string) {
  if (selectedOrderIds.value.includes(id)) {
    selectedOrderIds.value = selectedOrderIds.value.filter((item) => item !== id)
  } else {
    selectedOrderIds.value.push(id)
  }
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text)
  toast.show({
    title: 'Copied to Clipboard',
    message: `Copied ${label} ${text}`,
    type: 'success',
  })
}

function resetAllFilters() {
  searchQuery.value = ''
  filterStatus.value = 'All'
  filterEvent.value = 'ALL'
  filterTier.value = 'ALL'
}

function onFiltersApplied(filters: { status: string; event: string; tier: string }) {
  filterStatus.value = filters.status
  filterEvent.value = filters.event
  filterTier.value = filters.tier
  toast.show({
    title: 'Filters Applied',
    message: `Showing orders matching your filter criteria`,
    type: 'info',
  })
}

function handleAction(type: 'view-order' | 'view-tickets' | 'download-invoice' | 'refund' | 'cancel', order: Order) {
  activeKebabId.value = null
  activeOrder.value = order

  if (type === 'view-order') {
    showViewOrderModal.value = true
  } else if (type === 'view-tickets') {
    showViewTicketsModal.value = true
  } else if (type === 'download-invoice') {
    showDownloadInvoiceModal.value = true
  } else if (type === 'refund') {
    showIssueRefundModal.value = true
  } else if (type === 'cancel') {
    showCancelOrderModal.value = true
  }
}

function onExportFormatSelected(format: string) {
  // Handled in modal
}

function onRefundIssued(order: Order, amount: number, reason: string) {
  const target = ordersList.value.find((o) => o.id === order.id)
  if (target) {
    target.status = 'Refunded'
  }
}

function onOrderCancelled(order: Order, reason: string) {
  const target = ordersList.value.find((o) => o.id === order.id)
  if (target) {
    target.status = 'Cancelled'
  }
}
</script>

<style scoped>
.orders-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.metric-icon-badge {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
}

.metric-icon--green {
  background: #F0FDF1;
  color: #3FD246;
}

.metric-icon--yellow {
  background: #FEF9C3;
  color: #CA8A04;
}

.metric-icon--red {
  background: #FEE2E2;
  color: #DC2626;
}

.badge-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.metric-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 0.35rem;
}

.metric-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin-bottom: 0.5rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.725rem;
  color: #9ca3af;
}

.trend-arrow, .trend-percent {
  color: #16a34a;
  font-weight: 700;
}

/* Table Controls Container */
.table-controls-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.controls-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

/* Search input */
.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 480px;
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
  background: #ffffff;
  font-size: 0.85rem;
  color: #111827;
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
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

/* Action Controls Right */
.actions-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-control {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

.btn-control:hover {
  background: #f9fafb;
  border-color: #3FD246;
  color: #0E2615;
}

.btn-control--active {
  border-color: #3FD246;
  background: #F0FDF1;
  color: #16A34A;
}

.filter-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3FD246;
  position: absolute;
  top: 6px;
  right: 6px;
}

/* Active filters tags */
.active-filters-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.active-filters-title {
  font-size: 0.775rem;
  font-weight: 700;
  color: #6b7280;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: #F0FDF1;
  color: #16A34A;
  font-size: 0.75rem;
  font-weight: 700;
}

.filter-pill button {
  background: transparent;
  border: none;
  color: #16A34A;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
}

.clear-all-filters-link {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}

/* Table Wrapper */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 0.5rem;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.825rem;
}

.orders-table th {
  padding: 0.85rem 0.75rem;
  font-weight: 700;
  color: #16A34A;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
  letter-spacing: 0.04em;
}

.orders-table td {
  padding: 1rem 0.75rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.table-row {
  transition: background 0.15s ease;
}

.table-row:hover {
  background: #fafdfa;
}

.row-selected {
  background: #f0fdf1 !important;
}

/* Columns styling */
.col-checkbox {
  width: 40px;
}

.custom-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #3FD246;
  border-radius: 0.25rem;
  cursor: pointer;
}

.order-id-wrapper {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.order-number {
  font-weight: 800;
  color: #0E2615;
}

.copy-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.1rem;
  display: inline-flex;
  align-items: center;
  border-radius: 0.2rem;
  transition: color 0.15s ease;
}

.copy-btn:hover {
  color: #3FD246;
}

.order-ref {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.1rem;
}

.buyer-name {
  font-weight: 700;
  color: #111827;
}

.buyer-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.event-title {
  font-weight: 800;
  color: #0E2615;
}

.event-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.ticket-count {
  font-weight: 800;
  color: #0E2615;
}

.ticket-tier {
  font-size: 0.75rem;
  color: #6b7280;
}

.total-amount {
  font-weight: 800;
  color: #0E2615;
}

/* Status Badges */
.status-pill {
  display: inline-block;
  padding: 0.25rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.725rem;
  font-weight: 700;
  text-align: center;
}

.status--published,
.status--completed {
  background: #F0FDF1;
  color: #16A34A;
}

.status--draft {
  background: #FEF9C3;
  color: #D97706;
}

.status--refunded,
.status--cancelled {
  background: #FEE2E2;
  color: #DC2626;
}

.created-date {
  font-size: 0.775rem;
  color: #6b7280;
}

/* Kebab Menu Dropdown */
.kebab-menu-container {
  position: relative;
  display: inline-block;
}

.kebab-trigger-btn {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.kebab-trigger-btn:hover {
  background: #f3f4f6;
  color: #0E2615;
}

.kebab-dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.35rem;
  width: 180px;
  background: #ffffff;
  border-radius: 0.85rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  z-index: 50;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: #f4fbf4;
  color: #0E2615;
}

.menu-item--danger {
  color: #dc2626;
}

.menu-item--danger:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.menu-icon {
  flex-shrink: 0;
}

/* Empty State Table */
.empty-table-cell {
  padding: 3rem 1rem !important;
  text-align: center;
}

.empty-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.reset-empty-btn {
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
}

/* Pagination Footer */
.table-pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-info {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0E2615;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-btn {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.4rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #3FD246;
  color: #3FD246;
}

.page-btn--active {
  border-color: #3FD246;
  background: #F0FDF1;
  color: #16A34A;
  box-shadow: 0 0 0 1px #3FD246;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Transitions */
.fade-drop-enter-active,
.fade-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-drop-enter-from,
.fade-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .controls-top-row {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-wrapper {
    max-width: 100%;
  }
  .actions-right {
    justify-content: flex-end;
  }
}
</style>

<template>
  <div class="recent-orders-card">
    <!-- Header -->
    <div class="card-header">
      <h3 class="card-title">Recent Orders</h3>
      <NuxtLink v-if="orders.length > 0" to="/orders" class="view-all-link">View All</NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div v-for="i in 3" :key="i" class="skeleton-row">
        <AppSkeleton variant="text" width="100%" height="0.8rem" class="mb-1" />
        <AppSkeleton variant="text" width="80%" height="0.8rem" class="mb-2" />
        <AppSkeleton variant="text" width="60%" height="0.8rem" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p class="error-text">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="empty-state">
      <p class="empty-text">No orders yet for this organization.</p>
    </div>

    <!-- Data Table -->
    <div v-else class="table-responsive">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Events</th>
            <th>Tickets</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="order-id">{{ order.orderNumber }}</td>
            <td class="customer-name">{{ order.buyer.name }}</td>
            <td class="event-title">{{ order.event.title }}</td>
            <td class="ticket-count">{{ order.tickets.count }}</td>
            <td class="amount-val">₦{{ order.totalAmount.toLocaleString() }}</td>
            <td>
              <span class="status-pill" :class="statusBadgeClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td class="order-date">{{ order.createdDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AppSkeleton from '~/components/ui/AppSkeleton.vue'
import { useOrders } from '~/composables/useOrders'
import { useOrgState } from '~/composables/useOrgState'
import { orderStatusCssClass } from '~/types/orders'
import type { OrderStatus } from '~/types/orders'

const { activeOrgId } = useOrgState()
const { fetchOrders, orders: allOrders, loading, error } = useOrders()

const orders = computed(() => allOrders.value.slice(0, 5))

onMounted(() => {
  if (activeOrgId.value) {
    fetchOrders(activeOrgId.value, true)
  }
})

watch(activeOrgId, (newId) => {
  if (newId) {
    fetchOrders(newId, true)
  }
})

function statusBadgeClass(status: string): string {
  return orderStatusCssClass(status as OrderStatus)
}
</script>

<style scoped>
.recent-orders-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.view-all-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3FD246;
  text-decoration: none;
}
.view-all-link:hover { text-decoration: underline; }

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8rem;
}

.orders-table th {
  padding: 0.6rem 0.5rem;
  font-weight: 700;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.orders-table td {
  padding: 0.75rem 0.5rem;
  color: #374151;
  border-bottom: 1px solid #f9fafb;
  white-space: nowrap;
}

.order-id {
  color: #9ca3af;
  font-weight: 600;
}

.customer-name {
  font-weight: 600;
  color: #4b5563;
}

.event-title {
  font-weight: 600;
  color: #0E2615;
}

.amount-val {
  font-weight: 700;
  color: #0E2615;
}

.order-date {
  color: #6b7280;
}

/* Loading & empty states */
.loading-state {
  padding: 1rem 0;
}

.skeleton-row {
  margin-bottom: 1rem;
}
.skeleton-row:last-child {
  margin-bottom: 0;
}

.error-state {
  padding: 2rem 0;
  text-align: center;
}
.error-text {
  font-size: 0.85rem;
  color: #ef4444;
}

.empty-state {
  padding: 2rem 0;
  text-align: center;
}
.empty-text {
  font-size: 0.85rem;
  color: #6b7280;
}

/* Status Pills */
.status-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.725rem;
  font-weight: 700;
  text-align: center;
}

.status--pending,
.status--partially-refunded {
  background: #FEF9C3;
  color: #CA8A04;
}

.status--completed {
  background: #DCFCE7;
  color: #16A34A;
}

.status--refunded,
.status--cancelled,
.status--failed {
  background: #FEE2E2;
  color: #DC2626;
}
</style>

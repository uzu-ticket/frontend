<template>
  <div class="recent-orders-card">
    <!-- Header -->
    <div class="card-header">
      <h3 class="card-title">Recent Orders</h3>
      <NuxtLink to="/orders" class="view-all-link">View All</NuxtLink>
    </div>

    <!-- Data Table -->
    <div class="table-responsive">
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
            <td class="order-id">{{ order.orderId }}</td>
            <td class="customer-name">{{ order.customer }}</td>
            <td class="event-title">{{ order.event }}</td>
            <td class="ticket-count">{{ order.tickets }}</td>
            <td class="amount-val">₦{{ order.amount }}</td>
            <td>
              <span class="status-pill" :class="`status--${order.status.toLowerCase()}`">
                {{ order.status }}
              </span>
            </td>
            <td class="order-date">{{ order.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const orders = [
  {
    id: 1,
    orderId: '#ORD-455',
    customer: 'Tolu Adebayo',
    event: 'Summer Tech..',
    tickets: 1,
    amount: '10,000',
    status: 'Paid',
    date: 'Aug 4, 2026',
  },
  {
    id: 2,
    orderId: '#ORD-455',
    customer: 'Tolu Adebayo',
    event: 'Lagos Event',
    tickets: 6,
    amount: '20,000',
    status: 'Pending',
    date: 'Aug 10, 2026',
  },
  {
    id: 3,
    orderId: '#ORD-455',
    customer: 'Tolu Adebayo',
    event: 'Startup Growth',
    tickets: 4,
    amount: '30,000',
    status: 'Paid',
    date: 'Aug 8, 2026',
  },
  {
    id: 4,
    orderId: '#ORD-455',
    customer: 'Tolu Adebayo',
    event: 'Runners Jump',
    tickets: 5,
    amount: '15,000',
    status: 'Failed',
    date: 'Aug 2, 2026',
  },
]
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

/* Status Pills */
.status-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.725rem;
  font-weight: 700;
  text-align: center;
}

.status--paid {
  background: #DCFCE7;
  color: #16A34A;
}

.status--pending {
  background: #FEF9C3;
  color: #CA8A04;
}

.status--failed {
  background: #FEE2E2;
  color: #DC2626;
}
</style>

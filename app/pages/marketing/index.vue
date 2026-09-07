<template>
  <div class="marketing-page">
    <!-- Main Unified Card -->
    <div class="main-card">
      <!-- Card Header -->
      <div class="card-header">
        <div class="header-text">
          <h1 class="card-title">Marketing Overview</h1>
          <p class="card-subtitle">Manage your email campaigns and track performance.</p>
        </div>
        <NuxtLink to="/marketing/create" class="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Campaign
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Campaigns</span>
          <div class="stat-value">24</div>
          <div class="stat-trend">+12.4% from last 30 days</div>
        </div>
        <div class="stat-card">
          <span class="stat-label">Emails Sent</span>
          <div class="stat-value">12,543</div>
          <div class="stat-trend">+16% from last 30 days</div>
        </div>
        <div class="stat-card">
          <span class="stat-label">Open Rate</span>
          <div class="stat-value">34.6%</div>
          <div class="stat-trend">+5.2% from last 30 days</div>
        </div>
        <div class="stat-card">
          <span class="stat-label">Click Rate</span>
          <div class="stat-value">7.2%</div>
          <div class="stat-trend">+2% from last 30 days</div>
        </div>
      </div>

      <!-- Campaigns Table -->
      <div class="table-section">
        <div class="table-responsive">
          <table class="campaign-table">
            <thead>
              <tr>
                <th>CAMPAIGN</th>
                <th>AUDIENCE</th>
                <th>SENT</th>
                <th>OPEN RATE</th>
                <th>CLICK RATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="campaign in campaigns" :key="campaign.id" class="table-row">
                <td class="campaign-name">{{ campaign.name }}</td>
                <td class="audience-col">{{ campaign.audience }}</td>
                <td class="sent-col">{{ campaign.sent.toLocaleString() }}</td>
                <td class="rate-col">{{ campaign.openRate }}</td>
                <td class="rate-col">{{ campaign.clickRate }}</td>
                <td>
                  <span class="status-badge" :class="statusClass(campaign.status)">
                    {{ campaign.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <NuxtLink to="/marketing/campaigns" class="view-all-link">View all events</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Marketing — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Create and send targeted email campaigns, promote your events, and drive more ticket sales.' },
  ],
})

interface Campaign {
  id: number
  name: string
  audience: string
  sent: number
  openRate: string
  clickRate: string
  status: 'Sent' | 'Cancelled' | 'Scheduled'
}

const campaigns: Campaign[] = [
  { id: 1, name: 'Summer Music Camp', audience: 'VIP Customers', sent: 2450, openRate: '30%', clickRate: '20%', status: 'Sent' },
  { id: 2, name: 'Music Fest 2026', audience: 'All Customers', sent: 1300, openRate: '10%', clickRate: '5%', status: 'Sent' },
  { id: 3, name: 'Business Catchup', audience: 'Regular', sent: 3210, openRate: '35%', clickRate: '40%', status: 'Cancelled' },
  { id: 4, name: 'Tech Connect Lagos', audience: 'VIP Customers', sent: 2400, openRate: '24%', clickRate: '32%', status: 'Sent' },
  { id: 5, name: 'Food & Night Expo', audience: 'Regular', sent: 1000, openRate: '10%', clickRate: '43%', status: 'Scheduled' },
]

function statusClass(status: string) {
  const map: Record<string, string> = {
    Sent: 'status--sent',
    Cancelled: 'status--cancelled',
    Scheduled: 'status--scheduled',
  }
  return map[status] ?? ''
}
</script>

<style scoped>
.marketing-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  font-size: 1.125rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #3FD246;
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 0.65rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.25);
}

.btn-create:hover {
  background: #32c23e;
  transform: translateY(-1px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #FAFDFA;
  border: 1px solid rgba(63, 210, 70, 0.45);
  border-radius: 0.9rem;
  padding: 1.25rem 1.35rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 210, 70, 0.08);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0E2615;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3FD246;
}

/* Table Section */
.table-section {
  border: 1px solid #eef2ee;
  border-radius: 0.85rem;
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.campaign-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.campaign-table thead tr {
  border-bottom: 1px solid #f3f4f6;
}

.campaign-table th {
  padding: 0.85rem 1.25rem;
  font-size: 0.72rem;
  font-weight: 800;
  color: #6b7280;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.campaign-table td {
  padding: 0.9rem 1.25rem;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
}

.table-row {
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;
}

.table-row:hover {
  background: #f9fef9;
}

.table-row:last-child {
  border-bottom: none;
}

.campaign-name {
  font-weight: 600;
  color: #0E2615;
}

.audience-col {
  color: #6b7280;
}

.sent-col {
  font-weight: 600;
  color: #374151;
}

.rate-col {
  font-weight: 600;
  color: #374151;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status--sent {
  background: #dcfce7;
  color: #16a34a;
}

.status--cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.status--scheduled {
  background: #fff7ed;
  color: #ea580c;
}

/* Table Footer */
.table-footer {
  padding: 0.9rem 1.25rem;
  border-top: 1px solid #f3f4f6;
}

.view-all-link {
  font-size: 0.82rem;
  font-weight: 700;
  color: #3FD246;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

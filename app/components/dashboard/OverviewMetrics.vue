<template>
  <div class="metrics-grid">
    <!-- Card 1: Total Events -->
    <div class="metric-card">
      <div class="metric-icon-badge metric-icon--green">
        <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <span class="metric-label">Total Events</span>
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
        <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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
      <div class="metric-icon-badge metric-icon--red">
        <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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

    <!-- Card 4: Wallet Balance -->
    <div class="metric-card">
      <div class="metric-icon-badge metric-icon--green">
        <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <span class="metric-label">Wallet Balance</span>
      <div class="metric-value">1,245,600</div>
      <div class="metric-trend">
        <span class="trend-arrow">↑</span>
        <span class="trend-percent">15%</span>
        <span class="trend-period">from last 30 days</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  transition: transform 0.2s ease;
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

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>

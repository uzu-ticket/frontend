<template>
  <div class="capabilities-card">
    <h3 class="card-title">What you can do with Uzuticket</h3>

    <ul class="capabilities-list">
      <!-- Item 1: Create unlimited events -->
      <li class="capability-item">
        <div class="capability-badge">
          <svg xmlns="http://www.w3.org/2000/svg" class="capability-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span class="capability-text">Create unlimited events</span>
      </li>

      <!-- Item 2: Sell tickets online -->
      <li class="capability-item">
        <div class="capability-badge">
          <svg xmlns="http://www.w3.org/2000/svg" class="capability-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <span class="capability-text">Sell tickets online</span>
      </li>

      <!-- Item 3: Invite team members -->
      <li class="capability-item">
        <div class="capability-badge">
          <svg xmlns="http://www.w3.org/2000/svg" class="capability-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <span class="capability-text">Invite team members</span>
      </li>

      <!-- Item 4: Scan Tickets offline -->
      <li class="capability-item">
        <div class="capability-badge">
          <svg xmlns="http://www.w3.org/2000/svg" class="capability-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <span class="capability-text">Scan Tickets offline</span>
      </li>

      <!-- Item 5: Track sales and payout -->
      <li class="capability-item">
        <div class="capability-badge">
          <svg xmlns="http://www.w3.org/2000/svg" class="capability-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span class="capability-text">Track sales and payout</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.capabilities-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  height: 100%;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
  letter-spacing: -0.01em;
}

.capabilities-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.capability-badge {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  background: #f0fdf1;
  border: 1px solid #e2f9e4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.capability-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #3FD246;
}

.capability-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}
</style>

<template>
  <div class="sent-page">
    <div class="main-card">
      <div class="success-content">
        <!-- Illustration placeholder — drop your image at /public/campaign-celebrate.png -->
        <img
          src="/check-email.jpg"
          alt="Campaign scheduled celebration"
          class="celebrate-img"
        />

        <h1 class="success-title">Your campaign has been scheduled!</h1>
        <p class="success-desc">
          "Summer Festival Reminder" will be sent on<br />
          27 Sept, 2026 at 10:00 AM (WAT) to 5,245 recipients.
        </p>

        <div class="action-row">
          <NuxtLink to="/marketing/campaigns/1" class="btn-primary">
            View Campaign
          </NuxtLink>
          <NuxtLink to="/marketing" class="btn-secondary">
            Go to Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Campaign Scheduled — Uzu Ticket",
  meta: [
    {
      name: "description",
      content: "Your email campaign has been successfully scheduled.",
    },
  ],
});
</script>

<style scoped>
.sent-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 4rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 520px;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 520px;
  text-align: center;
}

.celebrate-img {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
  letter-spacing: -0.02em;
}

.success-desc {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.65;
  margin: 0;
}

.action-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  width: 100%;
  justify-content: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #3fd246;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 2rem;
  border-radius: 0.65rem;
  text-decoration: none;
  flex: 1;
  max-width: 200px;
  transition:
    background 0.2s,
    transform 0.15s;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.btn-primary:hover {
  background: #32c23e;
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #374151;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 2rem;
  border-radius: 0.65rem;
  text-decoration: none;
  flex: 1;
  max-width: 200px;
  border: 1.5px solid #e5e7eb;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.btn-secondary:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}
</style>

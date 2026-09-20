<template>
  <div class="invite-page">
    <!-- Main Card -->
    <div class="main-card">
      <!-- ── 1. INVITATION STATE (Image 1) ── -->
      <template v-if="state === 'invite'">
        <div class="invite-content">
          <!-- Envelope Illustration -->
          <div class="envelope-graphic">
            <svg
              viewBox="0 0 160 120"
              class="envelope-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Back flap -->
              <path d="M20 30L80 70L140 30V100H20V30Z" fill="#2bb832" />
              <!-- Letter inside -->
              <rect
                x="35"
                y="15"
                width="90"
                height="65"
                rx="4"
                fill="#ffffff"
                stroke="#e5e7eb"
                stroke-width="1.5"
              />
              <rect x="45" y="25" width="50" height="4" rx="2" fill="#d1d5db" />
              <rect
                x="45"
                y="34"
                width="70"
                height="3"
                rx="1.5"
                fill="#e5e7eb"
              />
              <rect
                x="45"
                y="41"
                width="60"
                height="3"
                rx="1.5"
                fill="#e5e7eb"
              />
              <rect
                x="45"
                y="48"
                width="65"
                height="3"
                rx="1.5"
                fill="#e5e7eb"
              />
              <rect
                x="45"
                y="55"
                width="40"
                height="3"
                rx="1.5"
                fill="#e5e7eb"
              />
              <!-- Envelope Front Pocket -->
              <path
                d="M20 40L80 75L140 40V105C140 107.761 137.761 110 135 110H25C22.2386 110 20 107.761 20 105V40Z"
                fill="#3FD246"
              />
              <path
                d="M20 40L75 75C78.0933 76.856 81.9067 76.856 85 75L140 40"
                stroke="#25a02b"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- Headline & Subtitle -->
          <h1 class="invite-title">You’re invited to promote an event!</h1>
          <p class="invite-subtitle">
            <strong>Jane May</strong> has invited you to promote their event
          </p>

          <!-- Event Card Box -->
          <div class="event-card-box">
            <div class="event-thumbnail">
              <svg viewBox="0 0 100 100" class="thumb-svg">
                <rect width="100" height="100" fill="#1e1b4b" rx="8" />
                <circle
                  cx="50"
                  cy="40"
                  r="25"
                  fill="#ec4899"
                  fill-opacity="0.6"
                />
                <circle
                  cx="30"
                  cy="60"
                  r="20"
                  fill="#8b5cf6"
                  fill-opacity="0.5"
                />
                <circle
                  cx="70"
                  cy="55"
                  r="22"
                  fill="#3b82f6"
                  fill-opacity="0.5"
                />
                <!-- Silhouette audience -->
                <path
                  d="M10 90 Q 25 70, 40 90 T 70 90 T 100 90 V 100 H 10 Z"
                  fill="#09090b"
                />
                <circle cx="30" cy="72" r="6" fill="#09090b" />
                <circle cx="55" cy="68" r="7" fill="#09090b" />
                <circle cx="80" cy="74" r="6" fill="#09090b" />
              </svg>
            </div>
            <div class="event-details">
              <span class="event-label">Event</span>
              <h2 class="event-name">Music Festival 2026</h2>
              <div class="event-meta">Aug, 30 • 10:00AM</div>
              <div class="event-location">Maryland Yaba, Lagos, Nigeria.</div>
            </div>
          </div>

          <!-- Commission text -->
          <p class="commission-text">
            You will earn commission for every ticket sold through your link
          </p>

          <!-- Buttons -->
          <div class="action-buttons">
            <button type="button" class="btn-accept" @click="acceptInvite">
              Accept Invitation
            </button>
            <button type="button" class="btn-decline" @click="declineInvite">
              Decline Invitation
            </button>
          </div>

          <!-- Expire Note -->
          <span class="expire-note">This invitation will expire in 7 days</span>
        </div>
      </template>

      <!-- ── 2. WELCOME ONBOARD STATE (Image 2) ── -->
      <template v-else-if="state === 'welcome'">
        <div class="welcome-content">
          <!-- Happy Jumping People Illustration -->
          <div class="people-graphic">
            <svg
              viewBox="0 0 240 180"
              class="people-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Shadow ovals -->
              <ellipse cx="65" cy="160" rx="20" ry="4" fill="#e5e7eb" />
              <ellipse cx="120" cy="160" rx="18" ry="4" fill="#e5e7eb" />
              <ellipse cx="170" cy="160" rx="20" ry="4" fill="#e5e7eb" />

              <!-- Person 1 (Man Jumping) -->
              <path
                d="M60 25 C60 15, 72 15, 72 25 C72 35, 60 35, 60 25 Z"
                fill="#7c2d12"
              />
              <path
                d="M55 40 L40 15 M77 40 L90 18"
                stroke="#3FD246"
                stroke-width="6"
                stroke-linecap="round"
              />
              <rect
                x="56"
                y="36"
                width="20"
                height="45"
                rx="8"
                fill="#3FD246"
              />
              <path
                d="M60 80 L55 130 L45 155 M72 80 L80 120 L95 145"
                stroke="#166534"
                stroke-width="7"
                stroke-linecap="round"
              />

              <!-- Person 2 (Woman Jumping) -->
              <path
                d="M165 30 C165 20, 177 20, 177 30 C177 40, 165 40, 165 30 Z"
                fill="#7c2d12"
              />
              <path
                d="M152 48 L135 25 M180 48 L195 30"
                stroke="#3FD246"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M155 45 C155 45, 175 45, 175 65 C175 75, 150 90, 150 90 Z"
                fill="#3FD246"
              />
              <path
                d="M160 85 L145 125 L130 148 M172 85 L185 120 L200 142"
                stroke="#166534"
                stroke-width="6"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <!-- Headline & Subtitle -->
          <h1 class="welcome-title">Welcome on board</h1>
          <p class="welcome-subtitle">You are now a promoter for</p>
          <div class="welcome-event-name">Music Fest 2026</div>

          <p class="welcome-instruction">
            Start sharing you link and earn commissions.
          </p>

          <!-- Action -->
          <button type="button" class="btn-dashboard" @click="goToDashboard">
            Go to dashboard
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Promoter Invitation — Uzu Ticket",
  meta: [{ name: "description", content: "Event promotion invitation" }],
});

const router = useRouter();
const state = ref<"invite" | "welcome">("invite");

function acceptInvite() {
  state.value = "welcome";
}

function declineInvite() {
  router.push("/promoters");
}

function goToDashboard() {
  router.push("/promoters");
}
</script>

<style scoped>
.invite-page {
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Demo Nav */
.demo-nav-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.demo-nav-link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: all 0.15s ease;
}

.demo-nav-link:hover {
  border-color: #3fd246;
  color: #16a34a;
}

.demo-nav-link--active {
  background: #3fd246;
  border-color: #3fd246;
  color: #ffffff;
}

/* Main Unified Card */
.main-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 600px;
}

/* ── Invite Content (Image 1) ── */
.invite-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 520px;
  width: 100%;
}

.envelope-graphic {
  width: 140px;
  height: 110px;
  margin-bottom: 1.25rem;
}

.envelope-svg {
  width: 100%;
  height: 100%;
}

.invite-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.5rem;
}

.invite-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1.75rem;
}

.invite-subtitle strong {
  color: #0e2615;
}

/* Event Card Box */
.event-card-box {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem;
  border-radius: 0.85rem;
  border: 1.5px solid #eef2ee;
  background: #ffffff;
  text-align: left;
  margin-bottom: 1.5rem;
}

.event-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 0.65rem;
  overflow: hidden;
  flex-shrink: 0;
}

.thumb-svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.event-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.event-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
}

.event-meta {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 600;
}

.event-location {
  font-size: 0.78rem;
  color: #9ca3af;
}

.commission-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1.75rem;
}

.btn-accept {
  width: 100%;
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  background: #3fd246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-accept:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.3);
}

.btn-decline {
  width: 100%;
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #3fd246;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-decline:hover {
  border-color: #3fd246;
  background: #f0fdf4;
}

.expire-note {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0e2615;
}

/* ── Welcome Content (Image 2) ── */
.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.people-graphic {
  width: 200px;
  height: 150px;
  margin-bottom: 1.5rem;
}

.people-svg {
  width: 100%;
  height: 100%;
}

.welcome-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0 0 0.5rem;
}

.welcome-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem;
}

.welcome-event-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0e2615;
  margin-bottom: 1.5rem;
}

.welcome-instruction {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 2rem;
}

.btn-dashboard {
  width: 100%;
  padding: 0.85rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  background: #3fd246;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: "Outfit", sans-serif;
}

.btn-dashboard:hover {
  background: #2bb832;
  box-shadow: 0 4px 15px rgba(63, 210, 70, 0.3);
}
</style>

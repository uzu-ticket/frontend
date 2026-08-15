<template>
  <div class="org-empty-card">
    <div class="empty-content">
      <!-- Image Illustration -->
      <div class="illustration-wrapper">
        <img src="/organization-empty-image.png" alt="No Organization Yet" class="empty-img" />
      </div>

      <!-- Text -->
      <h2 class="empty-title">No Organization Yet</h2>
      <p class="empty-description">
        You need an organization to start creating events and selling tickets
      </p>

      <!-- Action Buttons -->
      <div class="empty-actions">
        <button id="btn-create-org-empty" class="btn-primary-org" @click="$emit('create')">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Create Organization</span>
        </button>

        <button id="btn-accept-invitation" class="btn-secondary-org" @click="$emit('accept-invitation')">
          Accept Invitation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  create: []
  'accept-invitation': []
}>()
</script>

<style scoped>
.org-empty-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 2.5rem 1.75rem;
  min-height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 440px;
}

.illustration-wrapper {
  width: 220px;
  height: auto;
  margin-bottom: 1.5rem;
}

.empty-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.empty-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.empty-description {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0 0 1.5rem;
  line-height: 1.55;
  max-width: 380px;
}

.empty-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 300px;
}

.btn-primary-org {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
  width: 100%;
}

.btn-primary-org:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-secondary-org {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
}

.btn-secondary-org:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-icon {
  width: 1.15rem;
  height: 1.15rem;
}
</style>

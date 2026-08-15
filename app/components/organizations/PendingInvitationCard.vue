<template>
  <div class="invitation-card">
    <!-- Top Row: Badge, Org Name, Invited By, and Role Badge -->
    <div class="invitation-top-row">
      <div class="invitation-info">
        <div class="org-badge" :style="{ backgroundColor: badgeBg, color: badgeColor }">
          {{ initials }}
        </div>
        <div class="invitation-details">
          <h4 class="org-name">{{ orgName }}</h4>
          <span class="invited-by">Invited by {{ invitedBy }}</span>
        </div>
      </div>

      <!-- Role Badge -->
      <div class="role-badge">
        {{ role }}
      </div>
    </div>

    <!-- Bottom Row: Action Buttons (Accept, Decline) -->
    <div class="invitation-actions">
      <button class="btn-accept" @click="$emit('accept')">
        Accept
      </button>
      <button class="btn-decline" @click="$emit('decline')">
        Decline
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string | number
  orgName: string
  invitedBy: string
  role?: string
  initials: string
  badgeBg?: string
  badgeColor?: string
}

withDefaults(defineProps<Props>(), {
  role: 'Admin',
  badgeBg: '#fce7f3',
  badgeColor: '#db2777',
})

defineEmits<{
  accept: []
  decline: []
}>()
</script>

<style scoped>
.invitation-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem 0 0.5rem;
}

.invitation-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.invitation-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.org-badge {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.45rem;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.invitation-details {
  display: flex;
  flex-direction: column;
}

.org-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.15rem;
  line-height: 1.2;
}

.invited-by {
  font-size: 0.8rem;
  color: #6b7280;
}

.role-badge {
  background: #e8f9e9;
  color: #3FD246;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.9rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
}

.invitation-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-accept {
  padding: 0.6rem 2rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}
.btn-accept:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-decline {
  padding: 0.6rem 2rem;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-decline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

@media (max-width: 640px) {
  .invitation-top-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .invitation-actions {
    width: 100%;
  }
  .btn-accept, .btn-decline {
    flex: 1;
    text-align: center;
    padding: 0.75rem 1rem;
  }
}
</style>

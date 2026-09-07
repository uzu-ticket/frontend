<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="modelValue" class="drawer-backdrop" @click.self="close">
        <div class="drawer-container">
          <!-- Drawer Header -->
          <div class="drawer-header">
            <button type="button" class="btn-drawer-back" @click="close">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Member Details</span>
            </button>
            <button type="button" class="btn-drawer-close" @click="close">
              &times;
            </button>
          </div>

          <!-- Drawer Content -->
          <div v-if="member" class="drawer-body">
            <!-- Member Header Card -->
            <div class="member-profile-header">
              <div
                class="member-avatar-lg"
                :style="{ background: member.avatarBg || '#FF4D6D' }"
              >
                {{ member.initials }}
              </div>
              <div class="profile-details">
                <div class="name-status-row">
                  <h3 class="profile-name">{{ member.name }}</h3>
                  <span
                    class="status-badge"
                    :class="member.status === 'Active' ? 'status--active' : 'status--pending'"
                  >
                    {{ member.status }}
                  </span>
                </div>
                <p class="profile-meta">
                  <svg class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ member.email }}</span>
                </p>
                <p class="profile-meta">
                  <svg class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{{ member.phone || '+234802334566' }}</span>
                </p>
              </div>
            </div>

            <hr class="divider" />

            <!-- Roles Section -->
            <div class="detail-section">
              <h4 class="section-heading">Roles</h4>
              <div class="roles-pills-row">
                <span
                  v-for="role in memberRoles"
                  :key="role.key"
                  class="role-pill"
                  :class="`role-pill--${role.key}`"
                >
                  {{ role.name }}
                </span>
                <span class="assigned-date">Assigned on {{ member.assignedDate || 'Sept 12, 2026' }}</span>
              </div>
            </div>

            <hr class="divider" />

            <!-- Event Access Section -->
            <div class="detail-section">
              <h4 class="section-heading">Event Access</h4>
              <div class="event-access-box">
                {{ member.eventAccess || 'All Events (Recommended)' }}
              </div>
            </div>

            <hr class="divider" />

            <!-- Activity (Audit Trail) Section -->
            <div class="detail-section">
              <h4 class="section-heading">Activity (Audit trail)</h4>
              <div class="audit-trail-list">
                <div class="audit-row">
                  <span class="audit-label">Invitation sent</span>
                  <span class="audit-value">{{ member.inviteSentAt || 'Sept 12, 2026 at 11:35 AM' }}</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Invitation accepted</span>
                  <span class="audit-value">{{ member.inviteAcceptedAt || '---' }}</span>
                </div>
                <div class="audit-row">
                  <span class="audit-label">Last active</span>
                  <span class="audit-value">{{ member.lastActiveAt || '10:00 AM' }}</span>
                </div>
              </div>
            </div>

            <!-- Drawer Bottom Actions -->
            <div class="drawer-actions-footer">
              <button type="button" class="btn-drawer-action" @click="$emit('change-role', member)">
                Change role
              </button>
              <button type="button" class="btn-drawer-action" @click="$emit('manage-access', member)">
                Manage event access
              </button>
              <button type="button" class="btn-drawer-action btn-drawer-action--danger" @click="$emit('remove-member', member)">
                Remove access
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MemberDetail {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  roleKey: string
  status: 'Active' | 'Pending'
  initials: string
  avatarBg?: string
  assignedDate?: string
  eventAccess?: string
  inviteSentAt?: string
  inviteAcceptedAt?: string
  lastActiveAt?: string
}

const props = defineProps<{
  modelValue: boolean
  member: MemberDetail | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change-role': [member: MemberDetail]
  'manage-access': [member: MemberDetail]
  'remove-member': [member: MemberDetail]
}>()

const memberRoles = computed(() => {
  if (!props.member) return []
  if (props.member.roleKey === 'owner') return [{ key: 'super_admin', name: 'Super Admin' }]
  if (props.member.roleKey === 'admin') return [{ key: 'admin', name: 'Admin' }]
  if (props.member.roleKey === 'manager') return [{ key: 'sales', name: 'Sales' }]
  if (props.member.roleKey === 'sales') return [{ key: 'sales', name: 'Sales' }, { key: 'promoter', name: 'Promoter' }]
  return [{ key: props.member.roleKey, name: props.member.role }]
})

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 38, 21, 0.45);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}

.drawer-container {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  height: 100%;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Outfit', sans-serif;
  overflow-y: auto;
}

@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.btn-drawer-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  cursor: pointer;
}
.btn-drawer-back:hover {
  color: #3FD246;
}

.btn-drawer-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
}

.drawer-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.member-profile-header {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.member-avatar-lg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.name-status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.status-badge {
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}
.status--active { background: #f0fdf4; color: #16a34a; }
.status--pending { background: #fff7ed; color: #ea580c; }

.profile-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.divider {
  border: none;
  border-top: 1px solid #f3f4f6;
  margin: 0;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-heading {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.roles-pills-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.role-pill {
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}
.role-pill--super_admin { background: #f3e8ff; color: #9333ea; border: 1px solid #e9d5ff; }
.role-pill--admin { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }
.role-pill--sales { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
.role-pill--promoter { background: #fce7f3; color: #db2777; border: 1px solid #fbcfe8; }
.role-pill--ticket_scanner { background: #ccfbf1; color: #0d9488; border: 1px solid #99f6e4; }
.role-pill--customer_support { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }

.assigned-date {
  font-size: 0.82rem;
  color: #6b7280;
}

.event-access-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.85rem 1.1rem;
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

.audit-trail-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.audit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
}

.audit-label {
  color: #6b7280;
}

.audit-value {
  color: #111827;
  font-weight: 600;
}

.drawer-actions-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
}

.btn-drawer-action {
  width: 100%;
  padding: 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Outfit', sans-serif;
}

.btn-drawer-action:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-drawer-action--danger {
  color: #dc2626;
  border-color: #fca5a5;
}

.btn-drawer-action--danger:hover {
  background: #fef2f2;
  border-color: #f87171;
}
</style>

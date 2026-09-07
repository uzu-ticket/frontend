<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="close">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Change role / manage access</h3>
              <p class="modal-subtitle">Update the member's role(s) and event access. Changes take effect immediately.</p>
            </div>
            <button type="button" class="btn-close" @click="close">&times;</button>
          </div>

          <!-- Body -->
          <form class="modal-body" @submit.prevent="handleSubmit">
            <!-- Assign Roles -->
            <div class="form-group">
              <label class="form-label">
                Assign roles <span class="required-star">*</span>
              </label>
              <div class="roles-chips-container" @click="showRoleDropdown = !showRoleDropdown">
                <div class="chips-wrapper">
                  <span
                    v-for="roleKey in selectedRoles"
                    :key="roleKey"
                    class="role-chip"
                  >
                    {{ getRoleLabel(roleKey) }}
                    <button type="button" class="chip-remove-btn" @click.stop="removeRole(roleKey)">&times;</button>
                  </span>
                </div>
              </div>
              <p class="field-hint">You can select one or more roles. Each role grants specific permission.</p>

              <!-- Role Selector Dropdown -->
              <div v-if="showRoleDropdown" class="role-dropdown-menu">
                <button
                  v-for="opt in availableRoles"
                  :key="opt.key"
                  type="button"
                  class="role-dropdown-item"
                  :class="{ 'role-dropdown-item--selected': selectedRoles.includes(opt.key) }"
                  @click.stop="toggleRole(opt.key)"
                >
                  <span class="role-dot" :style="{ background: opt.color }"></span>
                  <span>{{ opt.label }}</span>
                  <span v-if="selectedRoles.includes(opt.key)" class="check-mark">✓</span>
                </button>
              </div>
            </div>

            <!-- Event Access -->
            <div class="form-group">
              <label class="form-label">
                Event Access <span class="required-star">*</span>
              </label>
              <div class="select-wrapper">
                <select v-model="eventAccess" class="form-select">
                  <option value="all">All events (Recommended)</option>
                  <option value="specific">Specific events only</option>
                </select>
                <svg class="select-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p class="field-hint">Limit this member to specific events. Leave empty for full access.</p>
            </div>

            <!-- Green Info Alert -->
            <div class="info-alert-box info-alert--green">
              <div class="info-icon">ⓘ</div>
              <p class="info-text">All events (recommended)</p>
            </div>

            <!-- Role Permission Summary Section -->
            <div class="summary-section">
              <h4 class="summary-title">Role permission summary</h4>
              <div class="summary-cards">
                <div v-if="selectedRoles.includes('promoter')" class="summary-card">
                  <span class="summary-dot dot--pink"></span>
                  <span class="summary-role-name">Promoter</span>
                  <span class="summary-desc">Create/Manage promo links, track commissions.</span>
                </div>
                <div v-if="selectedRoles.includes('sales') || selectedRoles.includes('manager')" class="summary-card">
                  <span class="summary-dot dot--orange"></span>
                  <span class="summary-role-name">Sales</span>
                  <span class="summary-desc">Manage ticket sales and order.</span>
                </div>
                <div v-if="selectedRoles.includes('admin')" class="summary-card">
                  <span class="summary-dot dot--blue"></span>
                  <span class="summary-role-name">Admin</span>
                  <span class="summary-desc">Full access to manage events, ticket sales, orders, and team.</span>
                </div>
              </div>
            </div>

            <!-- Yellow Info Alert -->
            <div class="info-alert-box info-alert--yellow">
              <div class="info-icon">ⓘ</div>
              <p class="info-text">All events (recommended)</p>
            </div>

            <!-- Modal Footer Actions -->
            <div class="modal-footer">
              <button type="button" class="btn-cancel" :disabled="isSubmitting" @click="close">
                Cancel
              </button>
              <button type="submit" class="btn-save" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner"></span>
                <span>{{ isSubmitting ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  member?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': [payload: { memberId: string; roles: string[]; eventAccess: string }]
}>()

const selectedRoles = ref<string[]>(['admin', 'sales', 'promoter'])
const eventAccess = ref('all')
const showRoleDropdown = ref(false)
const isSubmitting = ref(false)

const availableRoles = [
  { key: 'super_admin', label: 'Super Admin', color: '#9333ea' },
  { key: 'admin', label: 'Admin', color: '#0284c7' },
  { key: 'sales', label: 'Sales', color: '#d97706' },
  { key: 'promoter', label: 'Promoter', color: '#db2777' },
  { key: 'ticket_scanner', label: 'Ticket Scanner', color: '#0d9488' },
  { key: 'customer_support', label: 'Customer Support', color: '#16a34a' },
]

function getRoleLabel(key: string): string {
  const found = availableRoles.find(r => r.key === key)
  return found ? found.label : key
}

function toggleRole(key: string) {
  if (selectedRoles.value.includes(key)) {
    selectedRoles.value = selectedRoles.value.filter(k => k !== key)
  } else {
    selectedRoles.value.push(key)
  }
}

function removeRole(key: string) {
  selectedRoles.value = selectedRoles.value.filter(k => k !== key)
}

function close() {
  emit('update:modelValue', false)
  showRoleDropdown.value = false
}

async function handleSubmit() {
  isSubmitting.value = true
  try {
    emit('saved', {
      memberId: props.member?.id || '',
      roles: selectedRoles.value,
      eventAccess: eventAccess.value,
    })
    close()
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.member, (newVal) => {
  if (newVal) {
    if (newVal.roleKey) {
      selectedRoles.value = [newVal.roleKey]
    }
  }
}, { immediate: true })
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 38, 21, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Outfit', sans-serif;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.75rem 1.25rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
}

.modal-body {
  padding: 0 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
}

.required-star {
  color: #ef4444;
}

.roles-chips-container {
  width: 100%;
  min-height: 48px;
  padding: 0.4rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.chips-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: 0.5rem;
  background: #e6f9e8;
  color: #16a34a;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid #bbf7d0;
}

.chip-remove-btn {
  background: transparent;
  border: none;
  color: #16a34a;
  font-size: 0.9rem;
  cursor: pointer;
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.role-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  z-index: 50;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.role-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  text-align: left;
  font-family: 'Outfit', sans-serif;
}

.role-dropdown-item:hover {
  background: #f3f4f6;
}

.role-dropdown-item--selected {
  background: #f0fdf4;
  color: #16a34a;
}

.role-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.check-mark {
  margin-left: auto;
  font-weight: 800;
  color: #16a34a;
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.75rem 2.25rem 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  background: #ffffff;
  appearance: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
}

.select-chevron {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #6b7280;
  pointer-events: none;
}

.info-alert-box {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.info-alert--green {
  background: #eefce8;
  border: 1px solid #cbf4c7;
  color: #166534;
}

.info-alert--yellow {
  background: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
}

.info-icon {
  font-weight: 800;
}

.info-text {
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0;
}

/* Summary Section */
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0;
}

.summary-cards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-card {
  background: #f8faf8;
  border: 1px solid #eef2ee;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot--pink { background: #db2777; }
.dot--orange { background: #d97706; }
.dot--blue { background: #0284c7; }

.summary-role-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #111827;
  min-width: 75px;
}

.summary-desc {
  font-size: 0.8rem;
  color: #6b7280;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.7rem 1.5rem;
  border-radius: 0.65rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
}

.btn-save {
  padding: 0.7rem 1.6rem;
  border-radius: 0.65rem;
  border: none;
  background: #3FD246;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
}
</style>

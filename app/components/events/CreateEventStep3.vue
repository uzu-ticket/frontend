<template>
  <div class="step3-form">
    <!-- Form Header Row -->
    <div class="form-header-row">
      <div>
        <h3 class="form-title">Tickets Types</h3>
        <p class="form-subtitle">Create one or more ticket options for attendees.</p>
      </div>
      <!-- Add Ticket button (only shown when tickets exist) -->
      <button v-if="tickets.length > 0" class="btn-add-ticket-top" @click="isModalOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Add Ticket</span>
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="tickets.length === 0" class="empty-state">
      <!-- Ticket Box Illustration -->
      <div class="ticket-illustration">
        <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg" class="ticket-svg">
          <!-- Box base -->
          <rect x="40" y="95" width="140" height="65" rx="8" fill="#3FD246" opacity="0.12" />
          <rect x="40" y="95" width="140" height="65" rx="8" fill="none" stroke="#3FD246" stroke-width="2" />
          <!-- Ticket stub 1 -->
          <g transform="rotate(-15, 110, 75)">
            <rect x="68" y="38" width="75" height="42" rx="6" fill="#ffffff" stroke="#3FD246" stroke-width="2" />
            <line x1="68" y1="56" x2="143" y2="56" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 3" />
            <circle cx="68" cy="56" r="4" fill="#F6FAF6" stroke="#3FD246" stroke-width="1.5" />
            <circle cx="143" cy="56" r="4" fill="#F6FAF6" stroke="#3FD246" stroke-width="1.5" />
          </g>
          <!-- Ticket stub 2 -->
          <g transform="rotate(8, 120, 65)">
            <rect x="90" y="22" width="75" height="42" rx="6" fill="#ffffff" stroke="#3FD246" stroke-width="2" />
            <line x1="90" y1="40" x2="165" y2="40" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 3" />
            <circle cx="90" cy="40" r="4" fill="#F6FAF6" stroke="#3FD246" stroke-width="1.5" />
            <circle cx="165" cy="40" r="4" fill="#F6FAF6" stroke="#3FD246" stroke-width="1.5" />
          </g>
          <!-- Coins at bottom right -->
          <ellipse cx="165" cy="148" rx="14" ry="7" fill="#3FD246" opacity="0.18" />
          <ellipse cx="165" cy="143" rx="14" ry="7" fill="#3FD246" opacity="0.35" />
          <ellipse cx="165" cy="138" rx="14" ry="7" fill="#3FD246" opacity="0.6" />
          <ellipse cx="165" cy="133" rx="14" ry="7" fill="#3FD246" />
        </svg>
      </div>

      <div class="empty-separator" />

      <h4 class="empty-title">No Ticket Type Added Yet</h4>
      <p class="empty-subtitle">You can create multiple ticket types like VIP, General Admission, Early Bird and more</p>

      <button class="btn-add-ticket-empty" @click="isModalOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Add Ticket Types</span>
      </button>
    </div>

    <!-- TICKETS LIST STATE -->
    <div v-else class="tickets-list">
      <div v-for="(ticket, index) in tickets" :key="index" class="ticket-card">
        <!-- Left Color Accent Strip -->
        <div class="ticket-accent-strip" :style="{ background: ticket.color }" />

        <!-- Ticket Content -->
        <div class="ticket-content">
          <div class="ticket-top-row">
            <!-- Type & Price -->
            <div class="ticket-meta">
              <span class="ticket-type" :style="{ color: ticket.color }">{{ ticket.type }}</span>
              <span class="ticket-price" :style="{ color: ticket.color }">{{ ticket.price }}</span>
            </div>

            <!-- Available -->
            <div class="ticket-avail">
              <span class="ticket-avail-label">Available</span>
              <span class="ticket-avail-count" :class="{ 'avail-green': ticket.color === '#3FD246' }">{{ ticket.quantity }}</span>
            </div>

            <!-- 3-Dots Action Menu -->
            <div class="ticket-action-wrapper" @click.stop>
              <button class="dots-btn" @click="openMenuIndex = openMenuIndex === index ? null : index">
                <svg xmlns="http://www.w3.org/2000/svg" class="dots-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              <div v-if="openMenuIndex === index" class="context-menu">
                <button class="menu-item" @click="openMenuIndex = null">
                  <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button class="menu-item" @click="openMenuIndex = null">
                  <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Duplicate</span>
                </button>
                <button class="menu-item" @click="openMenuIndex = null">
                  <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>Deactivate</span>
                </button>
                <button class="menu-item menu-item--delete" @click="deleteTicket(index)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Sales Period -->
          <div class="ticket-sales-row">
            <div class="sales-col">
              <span class="sales-label">Sales Start</span>
              <div class="sales-date-badge">
                <svg xmlns="http://www.w3.org/2000/svg" class="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ ticket.salesStart }}</span>
              </div>
            </div>

            <div class="sales-col">
              <span class="sales-label">Sales End</span>
              <div class="sales-date-badge">
                <svg xmlns="http://www.w3.org/2000/svg" class="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ ticket.salesEnd }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Ticket Modal -->
    <AddTicketModal v-model="isModalOpen" @save="handleAddTicket" />

    <!-- Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <button class="btn-next" @click="$emit('next')">
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AddTicketModal from '~/components/events/AddTicketModal.vue'

defineEmits<{ back: [], next: [] }>()

const isModalOpen = ref(false)
const openMenuIndex = ref<number | null>(null)

interface Ticket {
  type: string
  price: string
  quantity: string
  color: string
  salesStart: string
  salesEnd: string
}

const tickets = ref<Ticket[]>([
  { type: 'REGULAR', price: '₦10,000', quantity: '500', color: '#3FD246', salesStart: 'Aug 24, 2026 • 9:00 AM', salesEnd: 'Aug 24, 2026 • 9:00 AM' },
  { type: 'VIP', price: '₦20,000', quantity: '200', color: '#3FD246', salesStart: 'Aug 24, 2026 • 9:00 AM', salesEnd: 'Aug 24, 2026 • 9:00 AM' },
  { type: 'EARLY BIRD', price: '₦5,000', quantity: '500', color: '#f59e0b', salesStart: 'Aug 24, 2026 • 9:00 AM', salesEnd: 'Aug 24, 2026 • 9:00 AM' },
])

const typeColors: Record<string, string> = {
  regular: '#3FD246',
  vip: '#3FD246',
  default: '#f59e0b',
}

function handleAddTicket(ticket: any) {
  const typeLower = ticket.name.toLowerCase()
  const color = typeColors[typeLower] ?? typeColors.default
  tickets.value.push({
    type: ticket.name.toUpperCase(),
    price: ticket.price,
    quantity: ticket.quantity,
    color,
    salesStart: `${ticket.startDate} • ${ticket.startTime}`,
    salesEnd: `${ticket.endDate} • ${ticket.endTime}`,
  })
}

function deleteTicket(index: number) {
  openMenuIndex.value = null
  tickets.value.splice(index, 1)
}

function closeMenus() {
  openMenuIndex.value = null
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('click', closeMenus)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('click', closeMenus)
  }
})
</script>

<style scoped>
.step3-form {
  display: flex;
  flex-direction: column;
}

.form-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.form-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

/* Add Ticket Top Button */
.btn-add-ticket-top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  background: #ffffff;
  border: 1px solid #3FD246;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-add-ticket-top:hover {
  background: #f0fdf1;
}

.btn-icon {
  width: 1.05rem;
  height: 1.05rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  flex: 1;
}

.ticket-illustration {
  width: 220px;
  height: 180px;
}

.ticket-svg {
  width: 100%;
  height: 100%;
}

.empty-separator {
  width: 80%;
  height: 1px;
  background: #e5e7eb;
  margin: 1.5rem 0 1.75rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.5rem;
}

.empty-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 2rem;
  max-width: 360px;
  line-height: 1.5;
}

.btn-add-ticket-empty {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  width: 100%;
  max-width: 420px;
  justify-content: center;
  transition: all 0.15s ease;
}

.btn-add-ticket-empty:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

/* Tickets List */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.ticket-card {
  display: flex;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: visible;
}

.ticket-accent-strip {
  width: 5px;
  border-radius: 0.875rem 0 0 0.875rem;
  flex-shrink: 0;
}

.ticket-content {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ticket-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.ticket-type {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ticket-price {
  font-size: 1.3rem;
  font-weight: 800;
}

.ticket-avail {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.ticket-avail-label {
  font-size: 0.825rem;
  color: #6b7280;
  font-weight: 600;
}

.ticket-avail-count {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0E2615;
}

.avail-green {
  color: #3FD246;
}

/* 3-Dots Menu */
.ticket-action-wrapper {
  position: relative;
}

.dots-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.15s;
}

.dots-btn:hover {
  background: #f3f4f6;
}

.dots-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.context-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 155px;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  padding: 0.4rem 0;
  z-index: 50;
  animation: popoverFade 0.15s ease-out;
}

@keyframes popoverFade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.55rem 0.85rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover { background: #f9fafb; color: #0E2615; }
.menu-item--delete { color: #ef4444; }
.menu-item--delete:hover { background: #fef2f2; color: #dc2626; }

.item-icon { width: 1rem; height: 1rem; }

/* Sales Row */
.ticket-sales-row {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.sales-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sales-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: #374151;
}

.sales-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: #374151;
}

.date-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: #6b7280;
}

/* Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
  margin-top: auto;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.75rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0E2615;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-back:hover { background: #f9fafb; }

.btn-next {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 2rem;
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

.btn-next:hover { background: #34c03b; transform: translateY(-1px); }

.btn-arrow { width: 1rem; height: 1rem; }
</style>

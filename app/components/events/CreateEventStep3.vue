<template>
  <div class="step3-container">
    <!-- ========================================== -->
    <!-- SCREEN 1: TICKET TYPE SELECTION (Paid / Free) -->
    <!-- ========================================== -->
    <div v-if="viewMode === 'select'" class="step-view view-select">
      <div class="form-header">
        <h3 class="form-title">Tickets Types</h3>
        <p class="form-subtitle">You can create multiple ticket types like VIP, General Admission, Early Bird and more</p>
      </div>

      <div class="selection-cards">
        <!-- Paid Ticket Option -->
        <div
          class="ticket-type-option-card"
          :class="{ 'ticket-type-option-card--selected': selectedType === 'paid' }"
          @click="handleSelectOption('paid')"
          @dblclick="handleConfirmSelection('paid')"
        >
          <div class="option-left">
            <div class="option-icon-box icon-paid">
              <span>$</span>
            </div>
            <div class="option-info">
              <h4 class="option-title option-title-paid">Paid</h4>
              <p class="option-desc">You can create multiple ticket types like VIP, General Admission, Early Bird and more</p>
            </div>
          </div>
          <div class="option-right-select">
            <div class="radio-indicator" :class="{ 'radio-indicator--selected': selectedType === 'paid' }">
              <div v-if="selectedType === 'paid'" class="radio-dot" />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <!-- Free Ticket Option -->
        <div
          class="ticket-type-option-card"
          :class="{ 'ticket-type-option-card--selected': selectedType === 'free' }"
          @click="handleSelectOption('free')"
          @dblclick="handleConfirmSelection('free')"
        >
          <div class="option-left">
            <div class="option-icon-box icon-free">
              <svg xmlns="http://www.w3.org/2000/svg" class="heart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="option-info">
              <h4 class="option-title option-title-free">Free</h4>
              <p class="option-desc">You can create multiple ticket types like VIP, General Admission, Early Bird and more</p>
            </div>
          </div>
          <div class="option-right-select">
            <div class="radio-indicator" :class="{ 'radio-indicator--selected': selectedType === 'free' }">
              <div v-if="selectedType === 'free'" class="radio-dot" />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <span v-if="errors.selection" class="field-error selection-error">{{ errors.selection }}</span>
      </div>

      <!-- Navigation Footer -->
      <div class="form-footer">
        <button type="button" class="btn-back" @click="$emit('back')">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Back</span>
        </button>

        <button type="button" class="btn-next" @click="handleSelectionNext">
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- SCREEN 2: ADD / EDIT TICKET FORM VIEW -->
    <!-- ========================================== -->
    <div v-else-if="viewMode === 'add'" class="step-view view-add">
      <button type="button" class="back-link-btn" @click="handleCancelAdd">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-link-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <div class="add-ticket-header">
        <h3 class="add-ticket-title">{{ editingIndex !== null ? 'Edit Ticket' : 'Add Ticket' }}</h3>
        <p class="add-ticket-subtitle">Create a ticket type for your event</p>
      </div>

      <form class="add-ticket-form-body" novalidate @submit.prevent="handleSaveTicket">
        <!-- Ticket Name -->
        <div class="field-group">
          <label class="field-label">Ticket Name <span class="required-star">*</span></label>
          <input
            v-model="ticketForm.name"
            type="text"
            placeholder="e.g Early bird"
            class="form-input"
            :class="{ 'form-input--error': errors.name }"
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>

        <!-- Price -->
        <div class="field-group">
          <label class="field-label">Price <span class="required-star">*</span></label>
          <input
            v-model="ticketForm.price"
            type="text"
            placeholder="₦ 0.00"
            class="form-input"
            :class="{ 'form-input--error': errors.price }"
          />
          <span v-if="errors.price" class="field-error">{{ errors.price }}</span>
        </div>

        <!-- Available Quantity & Max per Order -->
        <div class="two-col-grid">
          <div class="field-group">
            <label class="field-label">Available Quantity <span class="required-star">*</span></label>
            <input
              v-model="ticketForm.quantity"
              type="text"
              placeholder="0"
              class="form-input"
              :class="{ 'form-input--error': errors.quantity }"
            />
            <span v-if="errors.quantity" class="field-error">{{ errors.quantity }}</span>
          </div>

          <div class="field-group">
            <label class="field-label">Max per Order <span class="required-star">*</span></label>
            <input
              v-model="ticketForm.maxPerOrder"
              type="text"
              placeholder="1"
              class="form-input"
              :class="{ 'form-input--error': errors.maxPerOrder }"
            />
            <span v-if="errors.maxPerOrder" class="field-error">{{ errors.maxPerOrder }}</span>
          </div>
        </div>

        <!-- Sales Start -->
        <div class="field-group">
          <label class="field-label">Sales Start <span class="required-star">*</span></label>
          <div class="combined-datetime-input" :class="{ 'combined-datetime-input--error': errors.salesStart }">
            <div class="datetime-part">
              <DatePicker v-model="ticketForm.startDate" placeholder="Aug 24, 2026" />
            </div>
            <div class="datetime-divider" />
            <div class="datetime-part">
              <TimePicker v-model="ticketForm.startTime" placeholder="10:00 AM" />
            </div>
          </div>
          <span v-if="errors.salesStart" class="field-error">{{ errors.salesStart }}</span>
        </div>

        <!-- Sales End -->
        <div class="field-group">
          <label class="field-label">Sales End <span class="required-star">*</span></label>
          <div class="combined-datetime-input" :class="{ 'combined-datetime-input--error': errors.salesEnd }">
            <div class="datetime-part">
              <DatePicker v-model="ticketForm.endDate" placeholder="Sep 24, 2026" />
            </div>
            <div class="datetime-divider" />
            <div class="datetime-part">
              <TimePicker v-model="ticketForm.endTime" placeholder="10:00 AM" />
            </div>
          </div>
          <span v-if="errors.salesEnd" class="field-error">{{ errors.salesEnd }}</span>
        </div>

        <!-- Description -->
        <div class="field-group">
          <label class="field-label">Description <span class="required-star">*</span></label>
          <textarea
            v-model="ticketForm.description"
            rows="3"
            placeholder="Describe this ticket type and what it includes"
            class="form-textarea"
            :class="{ 'form-textarea--error': errors.description }"
          />
          <span v-if="errors.description" class="field-error">{{ errors.description }}</span>
        </div>

        <!-- Form Actions -->
        <div class="add-ticket-actions">
          <button type="button" class="btn-cancel-form" @click="handleCancelAdd">
            Cancel
          </button>
          <button type="submit" class="btn-create-ticket">
            {{ editingIndex !== null ? 'Update Ticket Type' : 'Create Ticket Type' }}
          </button>
        </div>
      </form>
    </div>

    <!-- ========================================== -->
    <!-- SCREEN 3: TICKETS LIST VIEW -->
    <!-- ========================================== -->
    <div v-else-if="viewMode === 'list'" class="step-view view-list">
      <div class="list-header-row">
        <div>
          <h3 class="form-title">Tickets Type</h3>
          <p class="form-subtitle">Create one or more ticket options for attendees.</p>
        </div>
        <button type="button" class="btn-add-ticket-top" @click="handleOpenSelectView">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Add Ticket</span>
        </button>
      </div>

      <!-- Tickets Cards -->
      <div class="tickets-list">
        <div
          v-for="(ticket, index) in tickets"
          :key="index"
          class="ticket-card"
          :class="{ 'ticket-deactivated': ticket.deactivated }"
        >
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
                <button type="button" class="dots-btn" @click="openMenuIndex = openMenuIndex === index ? null : index">
                  <svg xmlns="http://www.w3.org/2000/svg" class="dots-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                <div v-if="openMenuIndex === index" class="context-menu">
                  <button type="button" class="menu-item" @click="editTicket(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>

                  <button type="button" class="menu-item" @click="duplicateTicket(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Duplicate</span>
                  </button>

                  <button type="button" class="menu-item" @click="toggleDeactivateTicket(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span>{{ ticket.deactivated ? 'Activate' : 'Deactivate' }}</span>
                  </button>

                  <button type="button" class="menu-item menu-item--delete" @click="deleteTicket(index)">
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

      <!-- Navigation Footer -->
      <div class="form-footer">
        <button type="button" class="btn-back" @click="$emit('back')">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Back</span>
        </button>

        <button type="button" class="btn-next" @click="handleNextStep">
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import DatePicker from '~/components/ui/DatePicker.vue'
import TimePicker from '~/components/ui/TimePicker.vue'

const emit = defineEmits<{
  back: []
  next: [data?: any]
}>()

interface TicketItem {
  type: string
  price: string
  quantity: string
  maxPerOrder?: string
  color: string
  salesStart: string
  salesEnd: string
  description?: string
  deactivated?: boolean
  startDateObj?: Date | null
  startTimeStr?: string
  endDateObj?: Date | null
  endTimeStr?: string
}

// Initial tickets list (starts empty so user lands on Screen 1: Ticket Type Selection)
const tickets = ref<TicketItem[]>([])

// View state: 'select' | 'add' | 'list'
const viewMode = ref<'select' | 'add' | 'list'>(tickets.value.length > 0 ? 'list' : 'select')
const selectedType = ref<'paid' | 'free' | null>(null)
const editingIndex = ref<number | null>(null)
const openMenuIndex = ref<number | null>(null)

// Add / Edit Ticket Form Data
const ticketForm = reactive({
  name: '',
  price: '₦ 0.00',
  quantity: '0',
  maxPerOrder: '1',
  startDate: new Date(2026, 7, 24) as Date | null,
  startTime: '10:00 AM',
  endDate: new Date(2026, 8, 24) as Date | null,
  endTime: '10:00 AM',
  description: '',
})

// Reactive error states matching Step 1 & Step 2 pattern
const errors = reactive({
  selection: '',
  name: '',
  price: '',
  quantity: '',
  maxPerOrder: '',
  salesStart: '',
  salesEnd: '',
  description: '',
})

function resetErrors() {
  errors.selection = ''
  errors.name = ''
  errors.price = ''
  errors.quantity = ''
  errors.maxPerOrder = ''
  errors.salesStart = ''
  errors.salesEnd = ''
  errors.description = ''
}

function handleOpenSelectView() {
  selectedType.value = null
  resetErrors()
  viewMode.value = 'select'
}

function handleSelectOption(type: 'paid' | 'free') {
  selectedType.value = type
  errors.selection = ''
}

function handleConfirmSelection(type: 'paid' | 'free') {
  selectedType.value = type
  handleSelectionNext()
}

function handleSelectionNext() {
  if (!selectedType.value) {
    errors.selection = 'Please select a ticket type (Paid or Free).'
    return
  }
  handleOpenAddForm(selectedType.value)
}

function handleOpenAddForm(type: 'paid' | 'free') {
  editingIndex.value = null
  resetErrors()
  ticketForm.name = ''
  ticketForm.price = type === 'free' ? '₦ 0.00' : '₦ 0.00'
  ticketForm.quantity = '0'
  ticketForm.maxPerOrder = '1'
  ticketForm.startDate = new Date(2026, 7, 24)
  ticketForm.startTime = '10:00 AM'
  ticketForm.endDate = new Date(2026, 8, 24)
  ticketForm.endTime = '10:00 AM'
  ticketForm.description = ''
  viewMode.value = 'add'
}

function handleCancelAdd() {
  resetErrors()
  if (tickets.value.length > 0) {
    viewMode.value = 'list'
  } else {
    viewMode.value = 'select'
  }
}

function formatDateStr(date: Date | null): string {
  if (!date) return 'Aug 24, 2026'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getColorForName(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('early')) return '#f59e0b' // Yellow accent for early bird
  return '#3FD246' // Default Uzu green accent
}

function validateForm() {
  resetErrors()
  let valid = true

  if (!ticketForm.name.trim()) {
    errors.name = 'Ticket name is required.'
    valid = false
  }

  if (!ticketForm.price.trim()) {
    errors.price = 'Price is required.'
    valid = false
  }

  if (!ticketForm.quantity.trim()) {
    errors.quantity = 'Available quantity is required.'
    valid = false
  }

  if (!ticketForm.maxPerOrder.trim()) {
    errors.maxPerOrder = 'Max per order is required.'
    valid = false
  }

  if (!ticketForm.startDate || !ticketForm.startTime) {
    errors.salesStart = 'Sales start date and time are required.'
    valid = false
  }

  if (!ticketForm.endDate || !ticketForm.endTime) {
    errors.salesEnd = 'Sales end date and time are required.'
    valid = false
  }

  if (!ticketForm.description.trim()) {
    errors.description = 'Description is required.'
    valid = false
  }

  return valid
}

function handleSaveTicket() {
  if (!validateForm()) return

  const typeFormatted = ticketForm.name.trim().toUpperCase() || 'GENERAL'
  const color = getColorForName(ticketForm.name)
  const startStr = `${formatDateStr(ticketForm.startDate)} • ${ticketForm.startTime || '10:00 AM'}`
  const endStr = `${formatDateStr(ticketForm.endDate)} • ${ticketForm.endTime || '10:00 AM'}`

  const newTicket: TicketItem = {
    type: typeFormatted,
    price: ticketForm.price || '₦ 0.00',
    quantity: ticketForm.quantity || '0',
    maxPerOrder: ticketForm.maxPerOrder || '1',
    color,
    salesStart: startStr,
    salesEnd: endStr,
    startDateObj: ticketForm.startDate,
    startTimeStr: ticketForm.startTime,
    endDateObj: ticketForm.endDate,
    endTimeStr: ticketForm.endTime,
    description: ticketForm.description,
  }

  if (editingIndex.value !== null) {
    tickets.value[editingIndex.value] = newTicket
    editingIndex.value = null
  } else {
    tickets.value.push(newTicket)
  }

  viewMode.value = 'list'
}

function editTicket(index: number) {
  openMenuIndex.value = null
  resetErrors()
  const t = tickets.value[index]
  if (!t) return

  editingIndex.value = index
  ticketForm.name = t.type
  ticketForm.price = t.price
  ticketForm.quantity = t.quantity
  ticketForm.maxPerOrder = t.maxPerOrder || '1'
  ticketForm.startDate = t.startDateObj || new Date(2026, 7, 24)
  ticketForm.startTime = t.startTimeStr || '9:00 AM'
  ticketForm.endDate = t.endDateObj || new Date(2026, 7, 24)
  ticketForm.endTime = t.endTimeStr || '9:00 AM'
  ticketForm.description = t.description || ''
  viewMode.value = 'add'
}

function duplicateTicket(index: number) {
  openMenuIndex.value = null
  const t = tickets.value[index]
  if (!t) return

  tickets.value.push({
    ...t,
    type: `${t.type} (COPY)`,
  })
}

function toggleDeactivateTicket(index: number) {
  openMenuIndex.value = null
  const t = tickets.value[index]
  if (t) {
    t.deactivated = !t.deactivated
  }
}

function deleteTicket(index: number) {
  openMenuIndex.value = null
  tickets.value.splice(index, 1)
  if (tickets.value.length === 0) {
    viewMode.value = 'select'
  }
}

function handleNextStep() {
  if (tickets.value.length === 0) {
    errors.selection = 'Please select a ticket type and add at least one ticket.'
    return
  }
  emit('next', tickets.value)
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
.step3-container {
  display: flex;
  flex-direction: column;
}

.step-view {
  display: flex;
  flex-direction: column;
}

/* Form Headers */
.form-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.35rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

/* ========================================== */
/* SCREEN 1: SELECTION VIEW STYLES */
/* ========================================== */
.selection-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2.25rem 0 3rem;
}

.ticket-type-option-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.75rem 2.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-type-option-card:hover {
  border-color: #3FD246;
  box-shadow: 0 8px 24px rgba(63, 210, 70, 0.08);
  transform: translateY(-2px);
}

.ticket-type-option-card--selected {
  border-color: #3FD246 !important;
  background: #f0fdf1 !important;
  box-shadow: 0 4px 16px rgba(63, 210, 70, 0.12) !important;
}

.option-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.option-icon-box {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-paid {
  background: #eaf8eb;
  color: #3FD246;
  font-size: 1.85rem;
  font-weight: 700;
}

.icon-free {
  background: #fdf0f0;
  color: #ef4444;
}

.heart-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #ef4444;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.option-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.option-title-paid {
  color: #0E2615;
}

.option-title-free {
  color: #ef4444;
}

.option-desc {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  max-width: 500px;
  line-height: 1.45;
}

.option-right-select {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.radio-indicator {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 1.5px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.radio-indicator--selected {
  border-color: #3FD246;
  background: #ffffff;
}

.radio-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: #3FD246;
}

.chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #374151;
  flex-shrink: 0;
}

.selection-error {
  font-size: 0.8rem;
  font-weight: 600;
}

/* ========================================== */
/* SCREEN 2: ADD TICKET FORM STYLES */
/* ========================================== */
.back-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.75rem;
  transition: opacity 0.15s;
  width: fit-content;
}

.back-link-btn:hover {
  opacity: 0.85;
}

.back-link-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.add-ticket-header {
  margin-bottom: 1.5rem;
}

.add-ticket-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.add-ticket-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.add-ticket-form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.825rem;
  font-weight: 700;
  color: #0E2615;
}

.required-star {
  color: #ef4444;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  transition: all 0.15s ease;
}

.form-input:focus, .form-textarea:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.form-input--error, .form-textarea--error {
  border-color: #ef4444 !important;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.2rem;
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

/* Combined Date & Time Box */
.combined-datetime-input {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  background: #ffffff;
  transition: all 0.15s ease;
}

.combined-datetime-input:focus-within {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

.combined-datetime-input--error {
  border-color: #ef4444 !important;
}

.datetime-part {
  flex: 1;
}

.datetime-part :deep(.date-trigger),
.datetime-part :deep(.time-trigger) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border-radius: 0 !important;
  padding: 0.65rem 0.85rem !important;
}

.datetime-divider {
  width: 1px;
  height: 1.75rem;
  background: #e5e7eb;
  flex-shrink: 0;
}

.add-ticket-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel-form {
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

.btn-cancel-form:hover {
  background: #f9fafb;
}

.btn-create-ticket {
  padding: 0.65rem 1.75rem;
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

.btn-create-ticket:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

/* ========================================== */
/* SCREEN 3: TICKETS LIST VIEW STYLES */
/* ========================================== */
.list-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.btn-add-ticket-top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  background: #ffffff;
  border: 1px dashed #3FD246;
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
  transition: all 0.15s ease;
}

.ticket-deactivated {
  opacity: 0.6;
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

/* Navigation Footer */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }

  .ticket-sales-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>

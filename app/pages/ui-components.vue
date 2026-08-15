<template>
  <div class="ui-showcase-page">
    <div class="page-header">
      <h1 class="page-title">UI Component Library</h1>
      <p class="page-sub">Reusable custom form components for the Uzu Ticket platform.</p>
    </div>

    <div class="components-grid">

      <!-- DATE PICKER -->
      <div class="component-card">
        <div class="card-label">Date Picker</div>
        <p class="card-desc">Fully custom calendar with month navigation, today shortcut, and clear button.</p>
        <div class="demo-field">
          <label class="demo-label">Select a date</label>
          <DatePicker v-model="selectedDate" placeholder="e.g. Aug 24, 2026" />
          <span class="demo-value" v-if="selectedDate">
            Selected: <strong>{{ selectedDate.toDateString() }}</strong>
          </span>
        </div>
        <div class="demo-field">
          <label class="demo-label">With error</label>
          <DatePicker v-model="selectedDate2" placeholder="Pick date" error="Please select a valid date." />
        </div>
      </div>

      <!-- TIME PICKER -->
      <div class="component-card">
        <div class="card-label">Time Picker</div>
        <p class="card-desc">Scrollable hour/minute column picker with AM/PM period toggle.</p>
        <div class="demo-field">
          <label class="demo-label">Event start time</label>
          <TimePicker v-model="selectedTime" placeholder="e.g. 09:00 AM" />
          <span class="demo-value" v-if="selectedTime">
            Selected: <strong>{{ selectedTime }}</strong>
          </span>
        </div>
        <div class="demo-field">
          <label class="demo-label">With error</label>
          <TimePicker v-model="selectedTime2" placeholder="Pick time" error="Please select a valid time." />
        </div>
      </div>

      <!-- CUSTOM SELECT (Single) -->
      <div class="component-card">
        <div class="card-label">Custom Select</div>
        <p class="card-desc">Searchable single-option dropdown with sub-labels, icons, and disabled states.</p>
        <div class="demo-field">
          <label class="demo-label">Event Category</label>
          <AppSelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="Select category"
            searchable
          />
          <span class="demo-value" v-if="selectedCategory">
            Selected: <strong>{{ selectedCategory }}</strong>
          </span>
        </div>
        <div class="demo-field">
          <label class="demo-label">Disabled state</label>
          <AppSelect
            v-model="selectedCategoryDisabled"
            :options="categoryOptions"
            placeholder="Disabled select"
            disabled
          />
        </div>
        <div class="demo-field">
          <label class="demo-label">With error</label>
          <AppSelect
            v-model="selectedCategoryErr"
            :options="categoryOptions"
            placeholder="Select category"
            error="Category is required."
          />
        </div>
      </div>

      <!-- MULTISELECT -->
      <div class="component-card">
        <div class="card-label">Multi Select</div>
        <p class="card-desc">Multi-selection with tag chips, checkboxes, search, select all / clear all, and count badge.</p>
        <div class="demo-field">
          <label class="demo-label">Event Tags</label>
          <MultiSelect
            v-model="selectedTags"
            :options="tagOptions"
            placeholder="Select multiple tags..."
          />
          <span class="demo-value" v-if="selectedTags.length > 0">
            Selected: <strong>{{ selectedTags.join(', ') }}</strong>
          </span>
        </div>
        <div class="demo-field">
          <label class="demo-label">With max 2 selections</label>
          <MultiSelect
            v-model="selectedTagsLimited"
            :options="tagOptions"
            placeholder="Max 2 selections..."
            :max-selections="2"
          />
        </div>
        <div class="demo-field">
          <label class="demo-label">With error</label>
          <MultiSelect
            v-model="selectedTagsErr"
            :options="tagOptions"
            placeholder="Select tags..."
            error="At least one tag is required."
          />
        </div>
      </div>

    </div>

    <!-- Usage Reference -->
    <div class="usage-card">
      <h2 class="usage-title">Component Usage Reference</h2>
      <div class="code-blocks">
        <div class="code-block">
          <span class="code-label">DatePicker</span>
          <pre class="code">{{ datepickerCode }}</pre>
        </div>
        <div class="code-block">
          <span class="code-label">TimePicker</span>
          <pre class="code">{{ timepickerCode }}</pre>
        </div>
        <div class="code-block">
          <span class="code-label">AppSelect</span>
          <pre class="code">{{ selectCode }}</pre>
        </div>
        <div class="code-block">
          <span class="code-label">MultiSelect</span>
          <pre class="code">{{ multiselectCode }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '~/components/ui/DatePicker.vue'
import TimePicker from '~/components/ui/TimePicker.vue'
import AppSelect from '~/components/ui/AppSelect.vue'
import MultiSelect from '~/components/ui/MultiSelect.vue'

definePageMeta({ layout: 'dashboard' })

const selectedDate = ref<Date | null>(null)
const selectedDate2 = ref<Date | null>(null)
const selectedTime = ref('')
const selectedTime2 = ref('')
const selectedCategory = ref<string | null>(null)
const selectedCategoryDisabled = ref<string | null>(null)
const selectedCategoryErr = ref<string | null>(null)
const selectedTags = ref<string[]>([])
const selectedTagsLimited = ref<string[]>([])
const selectedTagsErr = ref<string[]>([])

const categoryOptions = [
  { value: 'Technology', label: 'Technology', subLabel: 'Tech & Innovation' },
  { value: 'Music', label: 'Music & Concerts', subLabel: 'Live performances' },
  { value: 'Business', label: 'Business & Corporate', subLabel: 'Professional events' },
  { value: 'Arts', label: 'Arts & Culture', subLabel: 'Creative events' },
  { value: 'Sports', label: 'Sports & Fitness', subLabel: 'Active events' },
  { value: 'Food', label: 'Food & Drinks', subLabel: 'Culinary experiences' },
  { value: 'Disabled', label: 'Unavailable Category', disabled: true },
]

const tagOptions = [
  { value: 'vip', label: 'VIP' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'family', label: 'Family Friendly' },
  { value: 'networking', label: 'Networking' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'food', label: 'Food & Drinks' },
  { value: 'livestream', label: 'Live Stream' },
]

const datepickerCode = `<DatePicker
  v-model="selectedDate"
  placeholder="Select date"
  :min-date="new Date()"
/>`

const timepickerCode = `<TimePicker
  v-model="selectedTime"
  placeholder="Select time"
/>`

const selectCode = `<AppSelect
  v-model="selectedValue"
  :options="[{ value: 'a', label: 'Option A' }]"
  placeholder="Select..."
  searchable
/>`

const multiselectCode = `<MultiSelect
  v-model="selectedValues"
  :options="[{ value: 'a', label: 'Tag A' }]"
  placeholder="Select multiple..."
  :max-selections="5"
/>`

useHead({ title: 'UI Components — Uzu Ticket' })
</script>

<style scoped>
.ui-showcase-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  margin-bottom: 0.25rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.35rem;
}

.page-sub {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Grid */
.components-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .components-grid { grid-template-columns: 1fr; }
}

/* Component Card */
.component-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 1.75rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3FD246;
  background: #f0fdf1;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  width: fit-content;
}

.card-desc {
  font-size: 0.825rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.demo-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.demo-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
}

.demo-value {
  font-size: 0.775rem;
  color: #6b7280;
}

/* Usage Card */
.usage-card {
  background: #0E2615;
  border-radius: 15px;
  padding: 2rem;
}

.usage-title {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 1.5rem;
}

.code-blocks {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .code-blocks { grid-template-columns: 1fr; }
}

.code-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.code-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3FD246;
}

.code {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.65rem;
  padding: 1rem;
  font-size: 0.775rem;
  color: #d1fae5;
  font-family: 'Fira Code', 'Courier New', monospace;
  white-space: pre-wrap;
  line-height: 1.6;
  margin: 0;
}
</style>

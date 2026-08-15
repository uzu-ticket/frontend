<template>
  <div class="vertical-stepper-container">
    <!-- Back to Events Link -->
    <div class="back-link-wrapper">
      <NuxtLink to="/events" class="btn-back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back to events</span>
      </NuxtLink>
    </div>

    <!-- Stepper Timeline List -->
    <div class="stepper-timeline">
      <div
        v-for="(step, index) in steps"
        :key="step.number"
        class="stepper-item"
        :class="{
          'stepper-item--completed': step.number < currentStep,
          'stepper-item--active': step.number === currentStep,
          'stepper-item--last': index === steps.length - 1
        }"
      >
        <!-- Circle & Line Wrapper -->
        <div class="stepper-left-col">
          <div class="step-circle">
            <template v-if="step.number < currentStep">
              <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </template>
            <template v-else>
              <span>{{ step.number }}</span>
            </template>
          </div>

          <!-- Vertical Connector Line -->
          <div v-if="index < steps.length - 1" class="stepper-line" />
        </div>

        <!-- Labels -->
        <div class="stepper-right-col">
          <h4 class="step-title">{{ step.title }}</h4>
          <span class="step-status">
            {{ step.number < currentStep ? 'Completed' : (step.number === currentStep ? 'In Progress' : 'Pending') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bottom Progress Auto-save Badge -->
    <div class="auto-save-box">
      <div class="check-icon-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="save-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="save-text">
        Your progress is saved automatically as you go
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep?: number
}

withDefaults(defineProps<Props>(), {
  currentStep: 1,
})

const steps = [
  { number: 1, title: 'Event Details' },
  { number: 2, title: 'Venue & Schedule' },
  { number: 3, title: 'Tickets' },
  { number: 4, title: 'Sales' },
  { number: 5, title: 'Preview & Publish' },
]
</script>

<style scoped>
.vertical-stepper-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-right: 1.5rem;
}

.back-link-wrapper {
  margin-bottom: 2.25rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.15s ease;
}

.btn-back-link:hover {
  color: #0E2615;
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* Stepper Timeline */
.stepper-timeline {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stepper-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.stepper-left-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-circle {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s ease;
}

.stepper-item--active .step-circle {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.25);
}

.stepper-item--completed .step-circle {
  background: #3FD246;
  border-color: #3FD246;
  color: #ffffff;
}

.check-icon {
  width: 1rem;
  height: 1rem;
}

.stepper-line {
  width: 2px;
  min-height: 2.5rem;
  background: #e5e7eb;
  margin: 0.25rem 0;
}

.stepper-item--completed .stepper-line {
  background: #3FD246;
}

.stepper-right-col {
  display: flex;
  flex-direction: column;
  padding-top: 0.2rem;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.15rem;
}

.stepper-item--active .step-title {
  color: #0E2615;
  font-weight: 800;
}

.step-status {
  font-size: 0.75rem;
  color: #9ca3af;
}

.stepper-item--active .step-status {
  color: #3FD246;
  font-weight: 600;
}

/* Auto Save Box */
.auto-save-box {
  margin-top: 3rem;
  background: #E8F9E9;
  border: 1px solid #dcfce7;
  border-radius: 0.875rem;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.check-icon-circle {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #ffffff;
  color: #3FD246;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.save-icon {
  width: 1rem;
  height: 1rem;
}

.save-text {
  font-size: 0.775rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.35;
}
</style>

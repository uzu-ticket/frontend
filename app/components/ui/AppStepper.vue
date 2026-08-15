<template>
  <div class="stepper-wrapper">
    <!-- Progress Line Track -->
    <div class="stepper-line-track">
      <div class="stepper-line-progress" :style="{ width: progressPercentage }" />
    </div>

    <!-- Numbered Steps -->
    <div class="stepper-steps">
      <div
        v-for="step in totalSteps"
        :key="step"
        class="step-circle"
        :class="{
          'step-circle--active': step === currentStep,
          'step-circle--completed': step < currentStep,
          'step-circle--pending': step > currentStep,
        }"
      >
        <span>{{ step }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalSteps?: number
  currentStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalSteps: 4,
  currentStep: 1,
})

const progressPercentage = computed(() => {
  if (props.totalSteps <= 1) return '0%'
  const percentage = ((props.currentStep - 1) / (props.totalSteps - 1)) * 100
  return `${percentage}%`
})
</script>

<style scoped>
.stepper-wrapper {
  position: relative;
  width: 100%;
  margin: 1.25rem 0 2.25rem;
}

.stepper-line-track {
  position: absolute;
  top: 50%;
  left: 1.125rem;
  right: 1.125rem;
  height: 10px;
  background: #E2E8F0;
  border-radius: 9999px;
  transform: translateY(-50%);
  z-index: 0;
  overflow: hidden;
}

.stepper-line-progress {
  height: 100%;
  background: #3FD246;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.stepper-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  width: 100%;
}

.step-circle {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.step-circle--active,
.step-circle--completed {
  background: #3FD246;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(63, 210, 70, 0.25);
}

.step-circle--pending {
  background: #CBD5E1;
  color: #ffffff;
}
</style>

<template>
  <div class="checklist-card">
    <h3 class="card-title">Getting Started</h3>

    <div class="stepper">
      <!-- Step 1 (Completed) -->
      <div class="step-item step--completed">
        <div class="step-line-wrapper">
          <div class="step-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="step-connector" />
        </div>
        <span class="step-label">Create an account</span>
      </div>

      <!-- Step 2 (Completed) -->
      <div class="step-item step--completed">
        <div class="step-line-wrapper">
          <div class="step-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="step-connector" />
        </div>
        <span class="step-label">Verify your email</span>
      </div>

      <!-- Step 3 (Pending) -->
      <div class="step-item">
        <div class="step-line-wrapper">
          <div class="step-circle step-circle--pending" />
          <div class="step-connector" />
        </div>
        <span class="step-label">Create an organization</span>
      </div>

      <!-- Step 4 (Pending) -->
      <div class="step-item">
        <div class="step-line-wrapper">
          <div class="step-circle step-circle--pending" />
          <div class="step-connector" />
        </div>
        <span class="step-label">Create your first event</span>
      </div>

      <!-- Step 5 (Pending) -->
      <div class="step-item">
        <div class="step-line-wrapper">
          <div class="step-circle step-circle--pending" />
          <div class="step-connector" />
        </div>
        <span class="step-label">Publish event</span>
      </div>

      <!-- Step 6 (Pending - Last item, no connector line) -->
      <div class="step-item step--last">
        <div class="step-line-wrapper">
          <div class="step-circle step-circle--pending" />
        </div>
        <span class="step-label">Sell your first ticket</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checklist-card {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  height: 100%;
}

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1.25rem;
  letter-spacing: -0.01em;
}

.stepper {
  display: flex;
  flex-direction: column;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;

}

.step-line-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.5rem;
  flex-shrink: 0;
}

.step-circle {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: #ffffff;
  border: 2px solid #3FD246;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.step--completed .step-circle {
  background: #3FD246;
  border-color: #3FD246;
}

.step-circle--pending {
  background: #ffffff;
  border: 1.5px solid #a7f3d0;
}

.check-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: #ffffff;
}

.step-connector {
  width: 2px;
  min-height: 1.85rem;
  background: #e2f9e4;
  margin: 0.15rem 0;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  margin-top: 0.1rem;
}

.step--completed .step-label {
  color: #374151;
}
</style>

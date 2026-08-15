<template>
  <div class="step5-form">
    <!-- Header -->
    <div class="form-header">
      <h3 class="form-title">Preview & Publish</h3>
      <p class="form-subtitle">Review your event before making it live.</p>
    </div>

    <!-- 2-Column Grid -->
    <div class="preview-body-grid">
      <!-- Left Column: Event Card Preview -->
      <div class="preview-left-col">
        <!-- Banner Image -->
        <div class="cover-banner-wrapper">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"
            alt="Summer Tech Conference"
            class="cover-banner-img"
          />
        </div>

        <div class="preview-divider" />

        <!-- Event Details -->
        <div class="event-details-section">
          <h2 class="event-preview-title">Summer Tech Conference</h2>
          <p class="event-preview-desc">
            Join us for a full day of talks, workshop, and networking with industry leaders and innovators
          </p>

          <!-- 3 Info Cards Grid -->
          <div class="info-cards-grid">
            <!-- Date & Time Card -->
            <div class="info-card">
              <div class="card-icon-col">
                <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="card-text-col">
                <span class="info-primary">Saturday, August 24</span>
                <span class="info-secondary">9:00 AM - 4:00 PM</span>
              </div>
            </div>

            <!-- Location Card -->
            <div class="info-card">
              <div class="card-icon-col">
                <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="card-text-col">
                <span class="info-primary">Landmark Event Centre</span>
                <span class="info-secondary">Victoria Island, Lagos.</span>
              </div>
            </div>

            <!-- Visibility Card -->
            <div class="info-card">
              <div class="card-icon-col">
                <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div class="card-text-col">
                <span class="info-primary">Public Event</span>
                <span class="info-secondary">Anyone can view</span>
              </div>
            </div>
          </div>

          <!-- Ticket Options Grid -->
          <div class="tickets-preview-row">
            <!-- VIP Card -->
            <div class="ticket-preview-card ticket--purple">
              <span class="ticket-tag">VIP</span>
              <span class="ticket-price">₦20,000</span>
            </div>

            <!-- Regular Card -->
            <div class="ticket-preview-card ticket--green">
              <span class="ticket-tag">Regular</span>
              <span class="ticket-price">₦10,000</span>
            </div>

            <!-- Early Bird Card -->
            <div class="ticket-preview-card ticket--yellow">
              <span class="ticket-tag">Early Bird</span>
              <span class="ticket-price">₦5,000</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Media Controls -->
      <div class="preview-right-col">
        <div class="media-box-card">
          <h4 class="media-title">Event Media</h4>
          <p class="media-sub">These images will be visible to attendees.</p>

          <div class="media-field">
            <label class="media-label">
              Landscape Image (16:9) <span class="required-star">*</span>
            </label>

            <div class="media-thumbnails-row">
              <!-- Current Image Thumbnail -->
              <div class="thumb-preview">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300&auto=format&fit=crop"
                  alt="Thumbnail"
                  class="thumb-img"
                />
              </div>

              <!-- Change Image Trigger -->
              <div class="change-image-btn" @click="triggerImageSelect">
                <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="change-label">Change Image</span>
                <span class="change-sub">1600 x 900px<br>JPG, PNG or WebP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="form-footer">
      <button type="button" class="btn-back" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>

      <div class="footer-right-group">
        <button type="button" class="btn-draft" @click="$emit('save-draft')">
          Save as Draft
        </button>

        <button type="button" class="btn-publish" @click="$emit('publish')">
          <span>Publish Event</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: []
  'save-draft': []
  publish: []
}>()

function triggerImageSelect() {
  // Can trigger file picker
}
</script>

<style scoped>
.step5-form {
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 1.5rem;
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

/* 2-Column Grid */
.preview-body-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.75rem;
  margin-bottom: 2rem;
}

/* Left Column */
.preview-left-col {
  display: flex;
  flex-direction: column;
}

.cover-banner-wrapper {
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: 0.875rem;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.cover-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-divider {
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  margin: 1.5rem 0;
}

.event-preview-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.4rem;
}

.event-preview-desc {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

/* 3 Info Cards Grid */
.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 0.85rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.card-icon-col {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6b7280;
}

.card-text-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.info-primary {
  font-size: 0.775rem;
  font-weight: 700;
  color: #0E2615;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-secondary {
  font-size: 0.725rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ticket Options Grid */
.tickets-preview-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.ticket-preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1rem;
  border-radius: 0.75rem;
  gap: 0.35rem;
}

.ticket--purple {
  background: #F3E8FF;
}

.ticket--purple .ticket-tag {
  color: #7E22CE;
}

.ticket--purple .ticket-price {
  color: #6B21A8;
}

.ticket--green {
  background: #DCFCE7;
}

.ticket--green .ticket-tag {
  color: #15803D;
}

.ticket--green .ticket-price {
  color: #166534;
}

.ticket--yellow {
  background: #FEF3C7;
}

.ticket--yellow .ticket-tag {
  color: #B45309;
}

.ticket--yellow .ticket-price {
  color: #92400E;
}

.ticket-tag {
  font-size: 0.8rem;
  font-weight: 800;
}

.ticket-price {
  font-size: 1.1rem;
  font-weight: 800;
}

/* Right Column */
.preview-right-col {
  display: flex;
  flex-direction: column;
}

.media-box-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1.5rem;
  background: #ffffff;
}

.media-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.media-sub {
  font-size: 0.775rem;
  color: #6b7280;
  margin: 0 0 1.5rem;
}

.media-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0E2615;
  margin-bottom: 0.65rem;
  display: block;
}

.required-star {
  color: #ef4444;
}

.media-thumbnails-row {
  display: flex;
  gap: 0.75rem;
}

.thumb-preview {
  width: 120px;
  height: 75px;
  border-radius: 0.65rem;
  overflow: hidden;
  flex-shrink: 0;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-image-btn {
  flex: 1;
  border: 1.5px dashed #d1d5db;
  border-radius: 0.65rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.65rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.change-image-btn:hover {
  border-color: #3FD246;
  background: #f0fdf1;
}

.plus-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.change-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0E2615;
}

.change-sub {
  font-size: 0.65rem;
  color: #9ca3af;
  line-height: 1.3;
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

.footer-right-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.btn-draft {
  padding: 0.65rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-draft:hover { background: #f9fafb; }

.btn-publish {
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

.btn-publish:hover { background: #34c03b; transform: translateY(-1px); }
.btn-arrow { width: 1rem; height: 1rem; }
</style>

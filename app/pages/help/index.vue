<template>
  <div class="help-page">
    <!-- Top Hero Search Banner -->
    <div class="help-hero">
      <h2 class="hero-title">Hi Divine, how can we help you today ?</h2>
      <p class="hero-subtitle">Search our help article or browse by category.</p>

      <form class="search-form" @submit.prevent="handleSearch">
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for articles..."
            class="search-input"
          />
        </div>

        <button type="submit" class="btn-search">
          Search
        </button>
      </form>
    </div>

    <!-- Browse by Topic Section -->
    <div class="topics-section">
      <h3 class="section-title">Browse by Topic</h3>

      <div class="topics-card-wrapper">
        <div class="topics-grid">
          <HelpTopicCard
            v-for="topic in topics"
            :key="topic.id"
            :title="topic.title"
            :description="topic.description"
            :icon="topic.icon"
            :badge-bg="topic.badgeBg"
            :badge-color="topic.badgeColor"
          />
        </div>
      </div>
    </div>

    <!-- Still need help? Support Section -->
    <div class="support-section">
      <h3 class="support-title">Still need help?</h3>
      <p class="support-subtitle">Can't find what you're looking for? Our support team is hear for you</p>

      <a href="mailto:support@uzuticket.com" class="btn-contact-support" target="_blank" rel="noopener">
        <span>Contact Support</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="external-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HelpTopicCard from '~/components/help/HelpTopicCard.vue'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Help Center — Uzu Ticket',
  meta: [
    { name: 'description', content: 'Search help articles and browse categories.' },
  ],
})

const searchQuery = ref('')

const topics = [
  {
    id: 1,
    title: 'Scanner App',
    description: 'Scan tickets and manage devices',
    icon: 'scanner',
    badgeBg: '#e0f2fe',
    badgeColor: '#0284c7',
  },
  {
    id: 2,
    title: 'Organization',
    description: 'Learn how to manage your organization and team members',
    icon: 'organization',
    badgeBg: '#ffedd5',
    badgeColor: '#ea580c',
  },
  {
    id: 3,
    title: 'Events',
    description: 'Create, manage, and publish event',
    icon: 'events',
    badgeBg: '#d1fae5',
    badgeColor: '#059669',
  },
  {
    id: 4,
    title: 'Payments and Payouts',
    description: 'Wallet, payouts, and withdrawals',
    icon: 'payments',
    badgeBg: '#d1fae5',
    badgeColor: '#059669',
  },
  {
    id: 5,
    title: 'Marketing',
    description: 'Promoters, email marketing, and integrations',
    icon: 'marketing',
    badgeBg: '#f3e8ff',
    badgeColor: '#9333ea',
  },
  {
    id: 6,
    title: 'Tickets and Orders',
    description: 'Ticket types, order and refunds',
    icon: 'tickets',
    badgeBg: '#d1fae5',
    badgeColor: '#059669',
  },
]

function handleSearch() {
  // Add search logic or filter
}
</script>

<style scoped>
.help-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Search Banner */
.help-hero {
  background: #F0FDF1;
  border: 1px solid #e2f9e4;
  border-radius: 1.25rem;
  padding: 2.25rem 2.5rem;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.4rem;
  letter-spacing: -0.01em;
}

.hero-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 540px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.05rem;
  height: 1.05rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.65rem;
  font-size: 0.85rem;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-input:focus {
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.15);
}

.btn-search {
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
  flex-shrink: 0;
}

.btn-search:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

/* Topics Section */
.topics-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 1rem;
}

.topics-card-wrapper {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 1.75rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Support Section */
.support-section {
  margin-bottom: 2rem;
}

.support-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.support-subtitle {
  font-size: 0.825rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
}

.btn-contact-support {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  color: #3FD246;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 0.65rem;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-contact-support:hover {
  border-color: #3FD246;
  background: #f0fdf1;
}

.external-icon {
  width: 1.1rem;
  height: 1.1rem;
}

@media (max-width: 1024px) {
  .topics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .help-hero {
    padding: 2rem 1.5rem;
  }
  .search-form {
    flex-direction: column;
  }
  .btn-search {
    width: 100%;
  }
  .topics-grid {
    grid-template-columns: 1fr;
  }
  .topics-card-wrapper {
    padding: 1.5rem 1.25rem;
  }
}
</style>

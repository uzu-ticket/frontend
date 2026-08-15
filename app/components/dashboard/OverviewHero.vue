<template>
  <div class="overview-hero">
    <!-- Left Copy & Action -->
    <div class="hero-content">
      <h2 class="hero-title">You’re just one step away from amazing events</h2>
      <p class="hero-description">
        Create your first organization to start creating events, inviting team members and selling tickets.
      </p>
      <button id="btn-create-org" class="hero-btn" @click="handleCreateOrg">
        <svg xmlns="http://www.w3.org/2000/svg" class="hero-btn-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span>Create Your first Organization</span>
      </button>
    </div>

    <!-- Right Illustration -->
    <div class="hero-illustration">
      <img src="/overview-hero.png" alt="Workspace Illustration" class="illustration-img" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function handleCreateOrg() {
  router.push('/organizations/new')
}
</script>

<style scoped>
.overview-hero {
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  margin-bottom: 1.5rem;
}

/* Content */
.hero-content {
  max-width: 480px;
}
.hero-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.65rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.hero-description {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0 0 1.25rem;
  line-height: 1.55;
}

/* Button */
.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.65rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}
.hero-btn:hover {
  background: #34c03b;
  transform: translateY(-1px);
}
.hero-btn-icon {
  width: 1.05rem;
  height: 1.05rem;
}

/* Illustration */
.hero-illustration {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.illustration-img {
  width: 200px;
  height: auto;
  display: block;
  object-fit: contain;
}

@media (max-width: 900px) {
  .overview-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem 1.75rem;
  }
  .hero-illustration {
    align-self: center;
    width: 100%;
  }
  .illustration-img {
    width: 220px;
  }
}
</style>

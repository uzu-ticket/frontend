<template>
  <div class="invite-search-container">
    <!-- Top Back Row -->
    <div class="back-row">
      <button class="btn-back-link" @click="$emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>Back</span>
      </button>
    </div>

    <!-- Title & Subtitle -->
    <div class="header-section">
      <h2 class="section-title">Invite Team Members</h2>
      <p class="section-subtitle">Add your team members to start collaborating</p>
    </div>

    <!-- Search Bar -->
    <div class="search-box">
      <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or email"
        class="search-input"
      />
    </div>

    <!-- Search Results List -->
    <div class="members-list">
      <div
        v-for="member in filteredMembers"
        :key="member.id"
        class="member-item"
      >
        <!-- Left: Initials Avatar + Info -->
        <div class="member-left">
          <div class="initials-avatar" :style="{ background: member.bgColor, color: member.textColor }">
            {{ member.initials }}
          </div>
          <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
            <span class="member-email">{{ member.email }}</span>
          </div>
        </div>

        <!-- Right: + Invite Button -->
        <button
          class="btn-invite-member"
          :class="{ 'btn-invite-member--invited': isInvited(member.id) }"
          @click="toggleInvite(member)"
        >
          <template v-if="!isInvited(member.id)">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span>Invite</span>
          </template>
          <template v-else>
            <span>Invited</span>
          </template>
        </button>
      </div>
    </div>

    <!-- Recently Invited Section -->
    <div v-if="recentlyInvited.length > 0" class="recently-invited-section">
      <h3 class="recently-title">Recently Invited</h3>

      <div class="recently-list">
        <div
          v-for="item in recentlyInvited"
          :key="item.id"
          class="member-item"
        >
          <div class="member-left">
            <div class="initials-avatar" :style="{ background: item.bgColor, color: item.textColor }">
              {{ item.initials }}
            </div>
            <div class="member-info">
              <span class="member-name">{{ item.name }}</span>
              <span class="member-email">{{ item.email }}</span>
            </div>
          </div>

          <button class="btn-uninvite-member" @click="uninvite(item.id)">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span>Uninvite</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Actions Row -->
    <div class="footer-actions">
      <button class="btn-continue-send" @click="$emit('send-success')">
        Send Invites ({{ recentlyInvited.length }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  back: []
  'send-success': []
}>()

const searchQuery = ref('Patrick')

const allMembers = ref([
  { id: 1, name: 'Patrick Leye', email: 'patrickleye@gmail.com', initials: 'PL', bgColor: '#FEE2E2', textColor: '#EF4444' },
  { id: 2, name: 'Paul Kingsley', email: 'paulkingsley@gmail.com', initials: 'PK', bgColor: '#FEF9C3', textColor: '#CA8A04' },
  { id: 3, name: 'Peter Evans', email: 'tundenadeyemi@gmail.com', initials: 'PE', bgColor: '#FEE2E2', textColor: '#EF4444' },
  { id: 4, name: 'Paschal Ugo', email: 'gracepeter@gmail.com', initials: 'PU', bgColor: '#DCFCE7', textColor: '#16A34A' },
  { id: 5, name: 'Samuel Effiong', email: 'samueleffiong@gmail.com', initials: 'SE', bgColor: '#DBEAFE', textColor: '#2563EB' },
])

const recentlyInvitedIds = ref<number[]>([1, 2])

const filteredMembers = computed(() => {
  if (!searchQuery.value.trim()) return allMembers.value
  const query = searchQuery.value.toLowerCase()
  return allMembers.value.filter(
    m => m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query)
  )
})

const recentlyInvited = computed(() => {
  return allMembers.value.filter(m => recentlyInvitedIds.value.includes(m.id))
})

function isInvited(id: number) {
  return recentlyInvitedIds.value.includes(id)
}

function toggleInvite(member: typeof allMembers.value[0]) {
  if (isInvited(member.id)) {
    recentlyInvitedIds.value = recentlyInvitedIds.value.filter(i => i !== member.id)
  } else {
    recentlyInvitedIds.value.push(member.id)
  }
}

function uninvite(id: number) {
  recentlyInvitedIds.value = recentlyInvitedIds.value.filter(i => i !== id)
}
</script>

<style scoped>
.invite-search-container {
  width: 100%;
}

.back-row {
  margin-bottom: 1.25rem;
}

.btn-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.btn-back-link:hover { color: #0E2615; }
.back-icon { width: 1rem; height: 1rem; }

.header-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0E2615;
  margin: 0 0 0.25rem;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

/* Search Box */
.search-box {
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1.25rem 0.75rem 3rem;
  background: #EBF1F6;
  border: 1px solid transparent;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  background: #ffffff;
  border-color: #3FD246;
  box-shadow: 0 0 0 3px rgba(63, 210, 70, 0.12);
}

/* Members List */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.member-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.initials-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 0.925rem;
  font-weight: 800;
  color: #0E2615;
  margin-bottom: 0.15rem;
}

.member-email {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Invite Button */
.btn-invite-member {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.5rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 210, 70, 0.2);
  transition: all 0.15s ease;
}

.btn-invite-member:hover {
  background: #34c03b;
  transform: translateY(-1px);
}

.btn-invite-member--invited {
  background: #DCFCE7;
  color: #16A34A;
  box-shadow: none;
}

/* Recently Invited */
.recently-invited-section {
  border-top: 1px solid #f3f4f6;
  padding-top: 1.75rem;
  margin-bottom: 2.25rem;
}

.recently-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  margin: 0 0 1.25rem;
}

.recently-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Uninvite Button */
.btn-uninvite-member {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.5rem;
  background: #ffffff;
  border: 1px solid #FCA5A5;
  color: #EF4444;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-uninvite-member:hover {
  background: #FEF2F2;
  border-color: #EF4444;
}

.btn-icon {
  width: 0.9rem;
  height: 0.9rem;
}

/* Footer Actions */
.footer-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
}

.btn-continue-send {
  padding: 0.75rem 2rem;
  background: #3FD246;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(63, 210, 70, 0.22);
  transition: all 0.15s ease;
}

.btn-continue-send:hover {
  background: #34c03b;
  transform: translateY(-1px);
}
</style>

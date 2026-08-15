<template>
  <div class="invite-page">
    <div class="invite-card">
      <!-- State 1: Initial Screen -->
      <InviteInitial
        v-if="viewMode === 'initial'"
        @back="handleBackToOrgs"
        @start-search="viewMode = 'search'"
        @send-invite="viewMode = 'success'"
      />

      <!-- State 2: Member Search & Recently Invited List -->
      <InviteSearchList
        v-else-if="viewMode === 'search'"
        @back="viewMode = 'initial'"
        @send-success="viewMode = 'success'"
      />

      <!-- State 3: Invite Sent Success Screen -->
      <InviteSuccess
        v-else-if="viewMode === 'success'"
        @back="viewMode = 'search'"
        @done="handleBackToOrgs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InviteInitial from '~/components/organizations/InviteInitial.vue'
import InviteSearchList from '~/components/organizations/InviteSearchList.vue'
import InviteSuccess from '~/components/organizations/InviteSuccess.vue'

definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()
const viewMode = ref<'initial' | 'search' | 'success'>('initial')

function handleBackToOrgs() {
  router.push('/organizations')
}
</script>

<style scoped>
.invite-page {
  width: 100%;
}

.invite-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}
</style>

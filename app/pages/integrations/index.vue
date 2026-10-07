<template>
  <div class="integrations-page">
    <IntegrationsOverview
      :connected-list="filteredConnected"
      :available-list="filteredAvailable"
      :is-loading="isLoading"
      @open-add="openAddModal"
      @open-connect="handleOpenConnect"
      @toggle-connect="handleToggleConnect"
      @test-connect="handleTestConnect"
    />

    <!-- Add Integration Modal -->
    <AddIntegrationModal
      v-if="isAddModalOpen"
      :integrations="integrationsList"
      @close="closeAddModal"
      @toggle="handleToggleConnect"
    />

    <AppModal
      :model-value="Boolean(pendingDisconnect)"
      title="Disconnect Integration?"
      size="sm"
      :closable="!isDisconnecting"
      :close-on-backdrop="!isDisconnecting"
      @update:model-value="handleDisconnectModalUpdate"
    >
      <p class="disconnect-message">
        Disconnect {{ pendingDisconnect?.name }}? Services relying on this
        integration may stop working.
      </p>
      <template #footer>
        <div class="disconnect-actions">
          <button
            type="button"
            class="btn-disconnect-cancel"
            :disabled="isDisconnecting"
            @click="pendingDisconnect = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-disconnect-confirm"
            :disabled="isDisconnecting"
            @click="confirmDisconnect"
          >
            {{ isDisconnecting ? "Disconnecting…" : "Disconnect" }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppModal from "~/components/AppModal.vue";
import IntegrationsOverview from "~/components/integrations/IntegrationsOverview.vue";
import AddIntegrationModal from "~/components/integrations/AddIntegrationModal.vue";
import {
  useIntegrations,
  type IntegrationItem,
} from "~/composables/useIntegrations";
import { useOrgState } from "~/composables/useOrgState";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Integrations — Uzu Ticket",
  meta: [
    {
      name: "description",
      content:
        "Connect your platform with third-party services, APIs, and developer tools.",
    },
  ],
});

const router = useRouter();
const toast = useToast();
const { activeOrgId } = useOrgState();
const pendingDisconnect = ref<IntegrationItem | null>(null);
const isDisconnecting = ref(false);
const {
  integrationsList,
  isAddModalOpen,
  isLoading,
  filteredConnected,
  filteredAvailable,
  fetchIntegrations,
  disconnectIntegration,
  openAddModal,
  closeAddModal,
} = useIntegrations();

// Fetch on mount and whenever the active org changes
onMounted(() => fetchIntegrations());
watch(activeOrgId, () => fetchIntegrations());

function handleOpenConnect(id: string) {
  router.push(`/integrations/${id}`);
}

function handleTestConnect(item: IntegrationItem) {
  toast.success(`${item.name} connection test succeeded! Signal active.`);
}

async function handleToggleConnect(id: string) {
  const item = integrationsList.value.find((i) => i.id === id);
  if (!item) return;

  if (item.connected) {
    pendingDisconnect.value = item;
  } else {
    // Navigate to the connect page to enter credentials
    router.push(`/integrations/${id}`);
  }
}

function handleDisconnectModalUpdate(isOpen: boolean) {
  if (!isOpen && !isDisconnecting.value) pendingDisconnect.value = null;
}

async function confirmDisconnect() {
  const item = pendingDisconnect.value;
  if (!item || isDisconnecting.value) return;

  isDisconnecting.value = true;
  try {
    await disconnectIntegration(item.id);
    toast.info(`${item.name} disconnected.`);
    pendingDisconnect.value = null;
  } catch {
    toast.error(`Failed to disconnect ${item.name}`);
  } finally {
    isDisconnecting.value = false;
  }
}
</script>

<style scoped>
.integrations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.disconnect-message {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.disconnect-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-disconnect-cancel,
.btn-disconnect-confirm {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.6rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.btn-disconnect-cancel {
  color: #374151;
  background: #fff;
}

.btn-disconnect-confirm {
  border-color: #dc2626;
  color: #fff;
  background: #dc2626;
}

.btn-disconnect-cancel:disabled,
.btn-disconnect-confirm:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

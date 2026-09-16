<template>
  <div class="create-org-page">
    <!-- Success State — no card wrapper -->
    <CreateOrgSuccess v-if="isSuccess" :org-url="orgUrl" />

    <!-- Wizard Card -->
    <div v-else class="create-org-card">
      <!-- Card Top Header -->
      <div class="card-header">
        <h2 class="card-title">Create Organization</h2>
        <span class="step-indicator"
          >Step {{ currentStep }} of {{ totalSteps }}</span
        >
      </div>

      <!-- Reusable Progress Stepper -->
      <AppStepper :total-steps="totalSteps" :current-step="currentStep" />

      <!-- Step Forms -->
      <CreateOrgStep1
        v-if="currentStep === 1"
        :initial-data="(orgData.step1 as Record<string, unknown>) || undefined"
        :is-submitting="isSubmitting"
        @next="handleStep1"
      />
      <CreateOrgStep2
        v-else-if="currentStep === 2"
        :initial-data="(orgData.step2 as Record<string, unknown>) || undefined"
        :is-submitting="isSubmitting"
        @back="currentStep--"
        @next="handleStep2"
      />
      <CreateOrgStep3
        v-else-if="currentStep === 3"
        :initial-data="(orgData.step3 as Record<string, unknown>) || undefined"
        :is-submitting="isSubmitting"
        @back="currentStep--"
        @skip="currentStep++"
        @next="handleStep3"
      />
      <CreateOrgStep4
        v-else-if="currentStep === 4"
        :initial-data="(orgData.step4 as Record<string, unknown>) || undefined"
        @back="currentStep--"
        @submit="handleStep4"
        :is-submitting="isSubmitting"
        :submit-error="submitError"
      />
      <InviteInitial
        v-else-if="currentStep === 5"
        :is-submitting="isSubmitting"
        @back="currentStep--"
        @send-invite="handleStep5"
        @start-search="handleInviteSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppStepper from "~/components/ui/AppStepper.vue";
import CreateOrgStep1 from "~/components/organizations/CreateOrgStep1.vue";
import CreateOrgStep2 from "~/components/organizations/CreateOrgStep2.vue";
import CreateOrgStep3 from "~/components/organizations/CreateOrgStep3.vue";
import CreateOrgStep4 from "~/components/organizations/CreateOrgStep4.vue";
import InviteInitial from "~/components/organizations/InviteInitial.vue";
import CreateOrgSuccess from "~/components/organizations/CreateOrgSuccess.vue";
import { useOrgState } from "~/composables/useOrgState";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

definePageMeta({
  layout: "dashboard",
});

const STORAGE_KEY = "uzu-create-org-draft";
const currentStep = ref(1);
const totalSteps = ref(5);
const isSuccess = ref(false);
const isSubmitting = ref(false);
const submitError = ref("");
const orgUrl = ref("");
const organisationId = ref<string | null>(null);

const orgData = ref<Record<string, unknown>>({});
const { setActiveOrg, loadOrganizations } = useOrgState();
const { instance } = useApi();
const toast = useToast();

function sanitizeDraftData(data: unknown): unknown {
  if (data instanceof File) return null;
  if (data instanceof Blob) return null;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDraftData(item));
  }
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        sanitizeDraftData(value),
      ]),
    );
  }

  return data;
}

function persistDraft() {
  if (typeof window === "undefined") return;

  const draft = {
    currentStep: currentStep.value,
    organisationId: organisationId.value,
    data: sanitizeDraftData(orgData.value),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function hydrateDraft() {
  if (typeof window === "undefined") return;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw) as {
      currentStep?: number;
      organisationId?: string | null;
      data?: Record<string, unknown>;
    };

    if (draft.currentStep) {
      currentStep.value = Number(draft.currentStep);
    }
    if (draft.organisationId) {
      organisationId.value = draft.organisationId;
    }
    if (draft.data) {
      orgData.value = draft.data;
    }
  } catch (error) {
    console.error("Failed to restore organization draft", error);
    clearDraft();
  }
}

watch(
  orgData,
  () => {
    persistDraft();
  },
  { deep: true },
);

watch(currentStep, () => {
  persistDraft();
});

onMounted(() => {
  hydrateDraft();
});

const bankCodeMap: Record<string, string> = {
  access: "044",
  gtb: "058",
  zenith: "057",
  uba: "033",
  first: "011",
  sterling: "232",
  kuda: "000001",
  opay: "000002",
};

function extractOrganisationId(response: unknown): string | null {
  const root = response as Record<string, unknown> | null;
  const data = root?.data as Record<string, unknown> | null;
  const nestedData = data?.data as Record<string, unknown> | null;
  const organisation = data?.organisation as Record<string, unknown> | null;

  for (const candidate of [root, data, nestedData, organisation]) {
    if (typeof candidate?.id === "string" && candidate.id) return candidate.id;
  }

  return null;
}

function buildOrganisationPayloadFromDraft() {
  const step1 = orgData.value.step1 as
    | {
        name?: string;
        slug?: string;
        email?: string;
        phone?: string;
        industry?: string;
        description?: string;
      }
    | undefined;
  const step2 = orgData.value.step2 as
    | {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
      }
    | undefined;
  const step3 = orgData.value.step3 as
    | {
        country?: string;
        state?: string;
        city?: string;
        address?: string;
        supportEmail?: string;
        supportPhone?: string;
      }
    | undefined;
  const step4 = orgData.value.step4 as
    | {
        bankName?: string;
        accountNumber?: string;
        accountName?: string;
        cacNumber?: string;
        registeredBusinessName?: string;
      }
    | undefined;

  if (!step1?.name || !step1?.email) return null;

  return {
    name: step1.name,
    slug: step1.slug || undefined,
    contactEmail: step1.email,
    contactPhone: step1.phone || undefined,
    industry: step1.industry || undefined,
    description: step1.description ? String(step1.description) : undefined,
    facebook: step2?.facebook || undefined,
    twitter: step2?.twitter || undefined,
    instagram: step2?.instagram || undefined,
    linkedin: step2?.linkedin || undefined,
    country: step3?.country || undefined,
    state: step3?.state || undefined,
    city: step3?.city || undefined,
    address: step3?.address || undefined,
    supportEmail: step3?.supportEmail || undefined,
    supportPhone: step3?.supportPhone || undefined,
    bankName: step4?.bankName || undefined,
    cacNumber: step4?.cacNumber || undefined,
    registeredBusinessName: step4?.registeredBusinessName || undefined,
    settlementBankCode: step4?.bankName
      ? (bankCodeMap[step4.bankName] ?? step4.bankName)
      : undefined,
    settlementAccountNumber: step4?.accountNumber || undefined,
    settlementAccountName: step4?.accountName || undefined,
  };
}

async function syncStepData(stepKey: string, data: unknown): Promise<boolean> {
  orgData.value[stepKey] = data;

  const payload = buildOrganisationPayloadFromDraft();
  if (!payload) return false;

  try {
    if (!organisationId.value && stepKey !== "step1") {
      const mineResponse = await instance.get("/organisations/mine");
      const minePayload = mineResponse.data as
        | Array<{ id?: string; slug?: string; name?: string }>
        | { data?: Array<{ id?: string; slug?: string; name?: string }> };
      const mine = Array.isArray(minePayload)
        ? minePayload
        : (minePayload.data ?? []);
      const existing = mine.find(
        (organisation) =>
          (payload.slug && organisation.slug === payload.slug) ||
          organisation.name === payload.name,
      );
      if (existing?.id) organisationId.value = existing.id;
    }

    if (organisationId.value) {
      await instance.patch(`/organisations/${organisationId.value}`, payload);

      if (stepKey === "step2") {
        const step2 = data as {
          logoFile?: File | null;
          coverFile?: File | null;
        };
        const uploadData = new FormData();
        if (step2.logoFile) uploadData.append("logo", step2.logoFile);
        if (step2.coverFile) uploadData.append("cover", step2.coverFile);

        if (step2.logoFile || step2.coverFile) {
          await instance.post(
            `/organisations/${organisationId.value}/uploads`,
            uploadData,
          );
        }
      }

      return true;
    }

    const res = await instance.post("/organisations", payload);
    const createdId = extractOrganisationId(res.data);
    if (!createdId) {
      throw new Error(
        "The organisation was created but no organisation ID was returned.",
      );
    }
    organisationId.value = createdId;
    persistDraft();
    return Boolean(organisationId.value);
  } catch (error) {
    console.error("Failed to autosave organisation progress", error);
    const response = (
      error as {
        response?: { data?: { message?: string | string[] } };
      }
    ).response;
    const message = response?.data?.message;
    submitError.value = Array.isArray(message)
      ? message.join(", ")
      : message || "We could not save this step. Please try again.";
    toast.show({
      title: "Could not save step",
      message: submitError.value,
      type: "error",
    });
    return false;
  }
}

async function handleStep1(data: unknown) {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    if (await syncStepData("step1", data)) currentStep.value = 2;
  } finally {
    isSubmitting.value = false;
  }
}

async function handleStep2(data: unknown) {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    if (await syncStepData("step2", data)) currentStep.value = 3;
  } finally {
    isSubmitting.value = false;
  }
}

async function handleStep3(data: unknown) {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    if (await syncStepData("step3", data)) currentStep.value = 4;
  } finally {
    isSubmitting.value = false;
  }
}

function handleInviteSearch() {
  // placeholder for future invite-picker UI; keep step visible until user chooses to proceed.
}

async function handleStep4(data: unknown) {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    if (await syncStepData("step4", data)) currentStep.value = 5;
  } finally {
    isSubmitting.value = false;
  }
}

async function handleStep5(
  members: Array<{ email: string; role: string }> = [],
) {
  isSubmitting.value = true;
  submitError.value = "";

  const step1 = orgData.value.step1 as
    | {
        name?: string;
        email?: string;
        phone?: string;
        description?: string;
        slug?: string;
      }
    | undefined;
  const step4 = orgData.value.step4 as
    | {
        bankName?: string;
        accountNumber?: string;
        accountName?: string;
        cacNumber?: string;
        registeredBusinessName?: string;
      }
    | undefined;

  try {
    const draftPayload = buildOrganisationPayloadFromDraft();
    if (!organisationId.value && draftPayload) {
      const createRes = await instance.post("/organisations", draftPayload);
      const createdId = extractOrganisationId(createRes.data);
      if (!createdId) {
        throw new Error(
          "The organisation was created but no organisation ID was returned.",
        );
      }
      organisationId.value = createdId;
    }

    if (
      organisationId.value &&
      step4 &&
      step4.bankName &&
      step4.accountNumber &&
      step4.accountName &&
      step4.cacNumber
    ) {
      await instance.post(`/organisations/${organisationId.value}/kyb`, {
        cacNumber: step4.cacNumber,
        settlementBankCode: bankCodeMap[step4.bankName] ?? step4.bankName,
        settlementAccountNumber: step4.accountNumber,
        settlementAccountName: step4.accountName,
      });
    }

    if (organisationId.value && members.length) {
      await Promise.all(
        members.map((member) =>
          instance.post(`/organisations/${organisationId.value}/members`, {
            email: member.email,
            role: member.role,
          }),
        ),
      );
    }

    await loadOrganizations(true);
    setActiveOrg({ id: organisationId.value ?? "", name: step1?.name ?? "" });
    orgUrl.value = step1?.slug
      ? `https://${step1.slug}.uzuticet.com`
      : `https://${(orgData.value.step1 as { slug?: string } | undefined)?.slug ?? "organization"}.uzuticet.com`;

    clearDraft();
    isSuccess.value = true;
    toast.show({
      title: "Organization Created",
      message: `${step1?.name ?? "Organization"} was created successfully.`,
      type: "success",
    });
  } catch (e: unknown) {
    const errMsg =
      (e as { response?: { data?: { message?: string | string[] } } }).response
        ?.data?.message ??
      (e as { message?: string })?.message ??
      "Failed to create organization. Please try again.";
    submitError.value = Array.isArray(errMsg) ? errMsg.join(", ") : errMsg;
    toast.show({
      title: "Failed to Create Organization",
      message: submitError.value,
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.create-org-page {
  width: 100%;
}

.create-org-card {
  background: #ffffff;
  border-radius: 15px;
  border: 1px solid #eef2ee;
  padding: 2rem 2.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0e2615;
  margin: 0;
  letter-spacing: -0.01em;
}

.step-indicator {
  font-size: 0.825rem;
  font-weight: 600;
  color: #6b7280;
}
</style>

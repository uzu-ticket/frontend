import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import { useOrgState } from "~/composables/useOrgState";

export interface PromoterEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface PromoterInfo {
  name: string;
  email: string;
}

export interface PromoterLinkDetail {
  id: string;
  code: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
  event: PromoterEvent;
  promoter: PromoterInfo;
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  ticketType: string;
}

export interface PromoterSummary {
  totalCommissionEarnedMinor: number;
  pendingMinor: number;
  availableMinor: number;
  paidOutMinor: number;
}

export interface PromoterListItem {
  id: string;
  eventId: string;
  event: string;
  ticketsSold: number;
  commissionRate: string;
  commissionEarned: number;
  status: "Completed" | "Pending" | "Cancelled";
  promoterName: string;
  ticketTypeName: string;
}

export interface CreatePromoterLinkPayload {
  eventId: string;
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  expiration?: string;
}

export function usePromoters() {
  const { instance } = useApi();
  const { activeOrgId } = useOrgState();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchPromoterSummary(): Promise<PromoterSummary | null> {
    if (!activeOrgId.value) return null;
    isLoading.value = true;
    error.value = null;
    try {
      const res = await instance.get(
        `/organisations/${activeOrgId.value}/promoters/summary`,
      );
      return res.data?.data ?? res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPromotersList(): Promise<PromoterListItem[]> {
    if (!activeOrgId.value) return [];
    isLoading.value = true;
    error.value = null;
    try {
      const res = await instance.get(
        `/organisations/${activeOrgId.value}/promoters`,
      );
      const data = res.data?.data ?? res.data;
      return Array.isArray(data) ? data : [];
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createPromoterLink(
    payload: CreatePromoterLinkPayload,
  ): Promise<PromoterLinkDetail> {
    if (!activeOrgId.value) {
      throw new Error("No active organisation selected");
    }
    isLoading.value = true;
    error.value = null;
    try {
      const res = await instance.post(
        `/organisations/${activeOrgId.value}/promoters/links`,
        payload,
      );
      return res.data?.data ?? res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function getPromoterLink(
    linkId: string,
  ): Promise<PromoterLinkDetail | null> {
    if (!activeOrgId.value) return null;
    isLoading.value = true;
    error.value = null;
    try {
      const res = await instance.get(
        `/organisations/${activeOrgId.value}/promoters/links/${linkId}`,
      );
      return res.data?.data ?? res.data;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function acceptInvitation(linkId: string): Promise<boolean> {
    if (!activeOrgId.value) return false;
    isLoading.value = true;
    error.value = null;
    try {
      await instance.post(
        `/organisations/${activeOrgId.value}/promoters/links/${linkId}/accept`,
      );
      return true;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function declineInvitation(linkId: string): Promise<boolean> {
    if (!activeOrgId.value) return false;
    isLoading.value = true;
    error.value = null;
    try {
      await instance.post(
        `/organisations/${activeOrgId.value}/promoters/links/${linkId}/decline`,
      );
      return true;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    fetchPromoterSummary,
    fetchPromotersList,
    createPromoterLink,
    getPromoterLink,
    acceptInvitation,
    declineInvitation,
  };
}

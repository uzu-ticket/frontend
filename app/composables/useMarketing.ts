import { useApi } from "~/composables/useApi";
import { useOrgState } from "~/composables/useOrgState";

export interface MarketingCampaign {
  id: string;
  subject: string;
  status: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  totalRecipients: number;
  createdAt: string;
  _count?: { recipients: number };
}

export interface MarketingStats {
  totalCampaigns: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
}

function unwrap<T>(value: { data?: T } | T): T {
  return (value as { data?: T })?.data ?? (value as T);
}

export function useMarketing() {
  const { instance } = useApi();
  const { activeOrgId } = useOrgState();
  const campaigns = useState<MarketingCampaign[]>(
    "marketing:campaigns",
    () => [],
  );
  const stats = useState<MarketingStats>("marketing:stats", () => ({
    totalCampaigns: 0,
    emailsSent: 0,
    openRate: 0,
    clickRate: 0,
  }));
  const loading = useState("marketing:loading", () => false);

  async function fetchMarketing() {
    if (!activeOrgId.value) return;
    loading.value = true;
    try {
      const [campaignResponse, statsResponse] = await Promise.all([
        instance.get(`/organisations/${activeOrgId.value}/marketing/campaigns`),
        instance.get(
          `/organisations/${activeOrgId.value}/marketing/campaigns/stats`,
        ),
      ]);
      campaigns.value = unwrap(campaignResponse.data) as MarketingCampaign[];
      stats.value = unwrap(statsResponse.data) as MarketingStats;
    } finally {
      loading.value = false;
    }
  }

  async function createCampaign(payload: {
    subject: string;
    bodyHtml: string;
    scheduledAt?: string;
  }) {
    if (!activeOrgId.value) throw new Error("Select an organisation first");
    const response = await instance.post(
      `/organisations/${activeOrgId.value}/marketing/campaigns`,
      payload,
    );
    const campaign = unwrap(response.data) as MarketingCampaign;
    campaigns.value = [campaign, ...campaigns.value];
    return campaign;
  }

  async function sendCampaign(campaignId: string) {
    if (!activeOrgId.value) throw new Error("Select an organisation first");
    const response = await instance.post(
      `/organisations/${activeOrgId.value}/marketing/campaigns/${campaignId}/send`,
    );
    const campaign = unwrap(response.data) as MarketingCampaign;
    const index = campaigns.value.findIndex((item) => item.id === campaignId);
    if (index >= 0) campaigns.value[index] = campaign;
    return campaign;
  }

  return {
    campaigns,
    stats,
    loading,
    fetchMarketing,
    createCampaign,
    sendCampaign,
  };
}

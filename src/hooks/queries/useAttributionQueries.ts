import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";

export const useCampaignsQuery = (tenantId: string) => {
  return useQuery({
    queryKey: ["attribution-campaigns", tenantId],
    queryFn: () => aiApi.listCampaigns(tenantId),
    enabled: !!tenantId,
  });
};

export const useCampaignQuery = (id: string, tenantId: string) => {
  return useQuery({
    queryKey: ["attribution-campaign", id, tenantId],
    queryFn: () => aiApi.getCampaign(id, tenantId),
    enabled: !!id && !!tenantId,
  });
};

export const useAttributionReportQuery = (
  campaignId: string,
  tenantId: string
) => {
  return useQuery({
    queryKey: ["attribution-report", campaignId, tenantId],
    queryFn: () => aiApi.getAttributionReport(campaignId, tenantId),
    enabled: !!campaignId && !!tenantId,
  });
};

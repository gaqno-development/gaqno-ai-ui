import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";

export const useCampaignsQuery = () => {
  return useQuery({
    queryKey: ["attribution-campaigns"],
    queryFn: () => aiApi.listCampaigns(),
  });
};

export const useCampaignQuery = (id: string) => {
  return useQuery({
    queryKey: ["attribution-campaign", id],
    queryFn: () => aiApi.getCampaign(id),
    enabled: !!id,
  });
};

export const useAttributionReportQuery = (campaignId: string) => {
  return useQuery({
    queryKey: ["attribution-report", campaignId],
    queryFn: () => aiApi.getAttributionReport(campaignId),
    enabled: !!campaignId,
  });
};

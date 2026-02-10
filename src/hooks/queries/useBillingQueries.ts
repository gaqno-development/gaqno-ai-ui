import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";

export const useBillingSummaryQuery = (
  tenantId: string,
  from?: string,
  to?: string
) => {
  return useQuery({
    queryKey: ["billing-summary", tenantId, from, to],
    queryFn: () => aiApi.getBillingSummary(tenantId, from, to),
    enabled: !!tenantId,
  });
};

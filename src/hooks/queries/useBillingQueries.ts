import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";

export const useBillingSummaryQuery = (from?: string, to?: string) => {
  return useQuery({
    queryKey: ["billing-summary", from, to],
    queryFn: () => aiApi.getBillingSummary(from, to),
  });
};

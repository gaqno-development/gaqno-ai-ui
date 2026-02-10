import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";

export const useDistributionStatusQuery = (id: string) => {
  return useQuery({
    queryKey: ["distribution-status", id],
    queryFn: () => aiApi.getDistributionStatus(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "delivered" || data?.status === "failed")
        return false;
      return 3000;
    },
  });
};

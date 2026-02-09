import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type { PublishDistributionBody } from "@/utils/api/aiApi";

export const usePublishDistributionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PublishDistributionBody) =>
      aiApi.publishDistribution(body),
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.setQueryData(["distribution-status", data.id], data);
      }
    },
  });
};

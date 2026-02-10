import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type { CreateCampaignBody } from "@/utils/api/aiApi";

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCampaignBody) => aiApi.createCampaign(body),
    onSuccess: (_, variables) => {
      const tenantId =
        variables.tenantId ?? "00000000-0000-0000-0000-000000000000";
      queryClient.invalidateQueries({
        queryKey: ["attribution-campaigns", tenantId],
      });
    },
  });
};

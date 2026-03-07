import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type { CreateCampaignBody } from "@/utils/api/aiApi";

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCampaignBody) => aiApi.createCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attribution-campaigns"],
      });
    },
  });
};

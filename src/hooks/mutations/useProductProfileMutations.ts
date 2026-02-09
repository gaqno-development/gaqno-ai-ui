import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type { BuildProductProfileRequest } from "@/utils/api/aiApi";

export const useProductProfileBuildMutation = () => {
  const build = useMutation({
    mutationFn: (request: BuildProductProfileRequest) =>
      aiApi.buildProductProfile(request),
  });

  return { build };
};

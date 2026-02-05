import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type { ImageModelsResponse } from "@/utils/api/aiApi";

export const useImageModelsQueries = () => {
  const getAll = useQuery<ImageModelsResponse>({
    queryKey: ["image-models"],
    queryFn: () => aiApi.getImageModels(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    getAll,
  };
};

export const useImageGenerationQueries = () => {
  return {};
};

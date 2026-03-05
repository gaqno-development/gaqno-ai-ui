import { useQuery } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type { VideoModel } from "@/types/videos";
import type { VideoTemplateSummary } from "@/utils/api/aiApi";

export const useVideoModelsQueries = () => {
  const getAll = useQuery<VideoModel[]>({
    queryKey: ["video-models"],
    queryFn: () => aiApi.getVideoModels() as Promise<VideoModel[]>,
    staleTime: 5 * 60 * 1000,
  });

  return {
    getAll,
  };
};

export const useVideoTemplatesQueries = () => {
  const getAll = useQuery<VideoTemplateSummary[]>({
    queryKey: ["video-templates"],
    queryFn: () => aiApi.getVideoTemplates(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    getAll,
  };
};

function getPollingInterval(query: { state: { data?: unknown; dataUpdatedAt: number } }): number | false {
  const data = query.state.data as { status?: string } | undefined;
  if (data?.status === "completed" || data?.status === "failed") return false;

  const elapsed = Date.now() - query.state.dataUpdatedAt;
  if (elapsed < 30_000) return 3_000;
  if (elapsed < 2 * 60_000) return 5_000;
  if (elapsed < 10 * 60_000) return 10_000;
  return 30_000;
}

export const useVideoGenerationQueries = () => {
  const getStatus = (videoId: string) => {
    return useQuery({
      queryKey: ["video-generation", videoId],
      queryFn: () => aiApi.getVideoStatus(videoId),
      enabled: !!videoId,
      refetchInterval: getPollingInterval,
    });
  };

  return {
    getStatus,
  };
};

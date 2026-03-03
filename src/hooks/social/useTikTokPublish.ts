import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TikTokDirectPostBody } from "@gaqno-development/frontcore/utils/api";
import { aiApiClient } from "@gaqno-development/frontcore/utils/api";

export function usePublishVideoTikTokMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      videoId,
      body,
    }: {
      videoId: string;
      body: TikTokDirectPostBody;
    }) => aiApiClient.publishVideoTikTok(videoId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["ai", "videos", variables.videoId] });
    },
  });
}

const TERMINAL_STATUSES = new Set(["PUBLISH_COMPLETE", "FAILED"]);

export function useTikTokPublishStatus(
  videoId: string | null,
  publishId: string | null,
) {
  return useQuery({
    queryKey: ["ai", "videos", videoId, "tiktok-status", publishId],
    queryFn: () => aiApiClient.getTikTokPublishStatus(videoId!, publishId!),
    enabled: Boolean(videoId && publishId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.has(status)) return false;
      return 3000;
    },
  });
}

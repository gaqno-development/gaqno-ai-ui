import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApiClient } from "@gaqno-development/frontcore/utils/api";

export function usePublishVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      videoId,
      socialAccountIds,
      caption,
    }: {
      videoId: string;
      socialAccountIds: string[];
      caption?: string;
    }) => aiApiClient.publishVideo(videoId, { socialAccountIds, caption }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["ai", "videos", variables.videoId] });
    },
  });
}

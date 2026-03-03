import { useQuery } from "@tanstack/react-query";
import { aiApiClient } from "@gaqno-development/frontcore/utils/api";

export function useTikTokCreatorInfo(socialAccountId: string | null) {
  return useQuery({
    queryKey: ["ai", "tiktok", "creator-info", socialAccountId],
    queryFn: () => aiApiClient.getTikTokCreatorInfo(socialAccountId!),
    enabled: Boolean(socialAccountId),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApiClient } from "@gaqno-development/frontcore/utils/api";

export function useSocialAccountsQuery() {
  return useQuery({
    queryKey: ["ai", "social-accounts"],
    queryFn: () => aiApiClient.listSocialAccounts(),
  });
}

export function useDeleteSocialAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiApiClient.deleteSocialAccount(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "social-accounts"] }),
  });
}

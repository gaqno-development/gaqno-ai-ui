import { useState, useCallback } from "react";
import { coreAxiosClient } from "@gaqno-development/frontcore/utils/api";
import {
  useSocialAccountsQuery,
  useDeleteSocialAccountMutation,
} from "./useSocialAccounts";

export interface SocialAccount {
  id: string;
  platform: string;
  displayName?: string;
  externalId: string;
}

const AUTH_PATH = `${(coreAxiosClient.ai.defaults.baseURL ?? "").replace(/\/$/, "")}/auth`;

export function useSocialAccountsPage() {
  const { data: accounts = [], isLoading } = useSocialAccountsQuery();
  const deleteAccount = useDeleteSocialAccountMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const list = accounts as SocialAccount[];

  const handleConnect = useCallback((provider: string) => {
    window.location.href = `${AUTH_PATH}/${provider}/connect`;
  }, []);

  const handleDisconnect = useCallback(
    async (accountId: string) => {
      setDeletingId(accountId);
      try {
        await deleteAccount.mutateAsync(accountId);
      } finally {
        setDeletingId(null);
      }
    },
    [deleteAccount],
  );

  return {
    list,
    isLoading,
    deletingId,
    handleConnect,
    handleDisconnect,
  };
}

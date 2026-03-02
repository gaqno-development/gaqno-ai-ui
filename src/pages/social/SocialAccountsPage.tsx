import React from "react";
import { useSocialAccountsQuery, useDeleteSocialAccountMutation } from "@/hooks/social/useSocialAccounts";

const AUTH_BASE = "/api/v1/auth";

export function SocialAccountsPage() {
  const { data: accounts = [], isLoading } = useSocialAccountsQuery();
  const deleteAccount = useDeleteSocialAccountMutation();

  const list = accounts as Array<{
    id: string;
    platform: string;
    displayName?: string;
    externalId: string;
  }>;

  const handleConnect = (provider: string) => {
    window.location.href = `${AUTH_BASE}/${provider}/connect`;
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Contas conectadas</h2>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {list.map((acc) => (
            <li
              key={acc.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium capitalize">{acc.platform}</p>
                <p className="text-sm text-muted-foreground">
                  {acc.displayName || acc.externalId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteAccount.mutate(acc.id)}
                disabled={deleteAccount.isPending}
                className="text-sm text-destructive hover:underline disabled:opacity-50"
              >
                Desconectar
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleConnect("tiktok")}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Conectar TikTok
        </button>
        <button
          type="button"
          onClick={() => handleConnect("instagram")}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Conectar Instagram
        </button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Ao clicar, você será redirecionado para autorizar o acesso. Certifique-se de que
        as variáveis OAuth (TikTok/Facebook) estão configuradas no backend.
      </p>
    </div>
  );
}

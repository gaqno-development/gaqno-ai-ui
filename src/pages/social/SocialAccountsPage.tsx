import React from "react";
import { useSocialAccountsQuery, useDeleteSocialAccountMutation } from "@/hooks/social/useSocialAccounts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Separator,
  Skeleton,
  EmptyState,
} from "@gaqno-development/frontcore/components/ui";
import {
  Share2,
  Trash2,
  Plus,
  ExternalLink,
  Shield,
  Link2,
  Loader2,
  Music2,
  Instagram,
} from "lucide-react";

const AUTH_BASE =
  (import.meta.env.VITE_AI_SERVICE_URL as string)?.replace(/\/$/, "") ?? "";
const AUTH_PATH = `${AUTH_BASE}/api/v1/auth`;

type SocialAccount = {
  id: string;
  platform: string;
  displayName?: string;
  externalId: string;
};

const PLATFORM_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  tiktok: { label: "TikTok", icon: Music2, color: "text-foreground", bg: "bg-foreground/5" },
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-950/20" },
};

function PlatformCard({
  platform,
  description,
  onConnect,
}: {
  platform: string;
  description: string;
  onConnect: () => void;
}) {
  const config = PLATFORM_CONFIG[platform] ?? { label: platform, icon: Share2, color: "text-muted-foreground", bg: "bg-muted/50" };
  const Icon = config.icon;

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{config.label}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={onConnect}>
          <Plus className="h-3.5 w-3.5" />
          Conectar
        </Button>
      </CardContent>
    </Card>
  );
}

function AccountCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function SocialAccountsPage() {
  const { data: accounts = [], isLoading } = useSocialAccountsQuery();
  const deleteAccount = useDeleteSocialAccountMutation();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const list = accounts as SocialAccount[];

  const handleConnect = (provider: string) => {
    window.location.href = `${AUTH_PATH}/${provider}/connect`;
  };

  const handleDisconnect = async (accountId: string) => {
    setDeletingId(accountId);
    try {
      await deleteAccount.mutateAsync(accountId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contas sociais</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte suas redes para publicar vídeos diretamente do Studio.
        </p>
      </div>

      {/* Connected accounts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contas conectadas
          </h3>
          {!isLoading && (
            <Badge variant="secondary" className="ml-auto">
              {list.length}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <AccountCardSkeleton key={i} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="Nenhuma conta conectada"
            description="Conecte TikTok ou Instagram abaixo para começar a publicar vídeos nas redes sociais."
            size="sm"
          />
        ) : (
          <div className="space-y-3">
            {list.map((acc) => {
              const config = PLATFORM_CONFIG[acc.platform] ?? {
                label: acc.platform,
                icon: Share2,
                color: "text-muted-foreground",
                bg: "bg-muted/50",
              };
              const Icon = config.icon;
              const isDeleting = deletingId === acc.id;

              return (
                <Card key={acc.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.label}</span>
                        <Badge variant="outline" className="text-xs">
                          Conectado
                        </Badge>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {acc.displayName || acc.externalId}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDisconnect(acc.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Desconectar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Connect new accounts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Conectar nova conta
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformCard
            platform="tiktok"
            description="Publique vídeos curtos diretamente no TikTok"
            onConnect={() => handleConnect("tiktok")}
          />
          <PlatformCard
            platform="instagram"
            description="Publique Reels no Instagram automaticamente"
            onConnect={() => handleConnect("instagram")}
          />
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Segurança e privacidade</p>
          <p className="text-xs text-muted-foreground">
            Ao conectar, você será redirecionado para autorizar o acesso via OAuth.
            Seus tokens são criptografados e nunca compartilhados. Você pode desconectar a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SocialAccountsPage;

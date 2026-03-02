import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useVideoProjectQuery } from "@/hooks/studio/useVideoProjects";
import { useSocialAccountsQuery } from "@/hooks/social/useSocialAccounts";
import { usePublishVideoMutation } from "@/hooks/social/useVideoPublish";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Label,
  Textarea,
  Checkbox,
  Separator,
  Skeleton,
  EmptyState,
} from "@gaqno-development/frontcore/components/ui";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Film,
  Share2,
  ExternalLink,
  FileText,
  Play,
  AlertCircle,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  script: string;
  status: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  publishes?: Array<{ platform: string; status: string; publishedAt?: string }>;
};

type SocialAccount = { id: string; platform: string; displayName?: string };

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType; color: string }
> = {
  queued: { label: "Na fila", variant: "outline", icon: Clock, color: "text-muted-foreground" },
  processing: { label: "Processando", variant: "secondary", icon: Loader2, color: "text-blue-500" },
  completed: { label: "Concluído", variant: "default", icon: CheckCircle2, color: "text-green-500" },
  failed: { label: "Falhou", variant: "destructive", icon: XCircle, color: "text-destructive" },
};

function StatusIndicator({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.queued;
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${config.color} ${status === "processing" ? "animate-spin" : ""}`} />
      <Badge variant={config.variant}>{config.label}</Badge>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Skeleton className="h-5 w-32" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const label = platform.charAt(0).toUpperCase() + platform.slice(1);
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium capitalize">
      <Share2 className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useVideoProjectQuery(id ?? null);
  const { data: socialAccounts = [] } = useSocialAccountsQuery();
  const publishVideo = usePublishVideoMutation();
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);
  const [caption, setCaption] = React.useState("");

  const proj = project as Project | null;
  const accounts = socialAccounts as SocialAccount[];
  const canPublish = proj?.status === "completed" && proj?.videoUrl;

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((x) => x !== accountId) : [...prev, accountId]
    );
  };

  const handlePublish = async () => {
    if (!id || selectedAccounts.length === 0) return;
    await publishVideo.mutateAsync({
      videoId: id,
      socialAccountIds: selectedAccounts,
      caption: caption || undefined,
    });
    setSelectedAccounts([]);
    setCaption("");
  };

  if (isLoading) return <DetailSkeleton />;

  if (!proj) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <EmptyState
          icon={AlertCircle}
          title="Projeto não encontrado"
          description="O vídeo que você procura não existe ou foi removido."
          action={{
            label: "Voltar ao Studio",
            onClick: () => navigate("/ai/studio"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Back nav */}
      <Link
        to="/ai/studio"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Studio
      </Link>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Video Preview - 3 cols */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {proj.videoUrl ? (
              <div className="relative aspect-video bg-black">
                <video
                  src={proj.videoUrl}
                  controls
                  poster={proj.thumbnailUrl}
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted/30">
                {proj.status === "processing" ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Gerando vídeo...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Isso pode levar alguns minutos.
                    </p>
                  </div>
                ) : proj.status === "failed" ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <XCircle className="h-12 w-12 text-destructive/50" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Falha na geração
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tente criar um novo vídeo.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Aguardando processamento...
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Info panel - 2 cols */}
        <div className="space-y-4 lg:col-span-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{proj.title}</h1>
            {proj.createdAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Criado em{" "}
                {new Date(proj.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          <StatusIndicator status={proj.status} />

          {/* Script preview */}
          {proj.script && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  Roteiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="max-h-32 overflow-y-auto text-sm leading-relaxed text-muted-foreground">
                  {proj.script}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            {proj.videoUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(proj.videoUrl, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir vídeo
              </Button>
            )}
            {canPublish && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  document.getElementById("publish-section")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Send className="h-3.5 w-3.5" />
                Publicar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Publish section */}
      {canPublish && (
        <Card id="publish-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Publicar nas redes sociais
            </CardTitle>
            <CardDescription>
              Selecione as contas e adicione uma legenda para publicar o vídeo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Legenda</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
                placeholder="Escreva uma legenda para o vídeo (opcional)..."
                rows={3}
                className="resize-y"
              />
            </div>

            <Separator />

            {/* Account selection */}
            <div className="space-y-3">
              <Label>Contas</Label>
              {accounts.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <Share2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma conta conectada.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1"
                    onClick={() => navigate("/ai/social")}
                  >
                    Conectar conta
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccounts.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => toggleAccount(acc.id)}
                        className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "hover:border-muted-foreground/30 hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAccount(acc.id)}
                          className="pointer-events-none"
                        />
                        <div className="min-w-0 flex-1">
                          <PlatformIcon platform={acc.platform} />
                          {acc.displayName && (
                            <p className="truncate text-xs text-muted-foreground">
                              {acc.displayName}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Publish button */}
            {accounts.length > 0 && (
              <div className="flex justify-end">
                <Button
                  onClick={handlePublish}
                  disabled={publishVideo.isPending || selectedAccounts.length === 0}
                  className="gap-2"
                >
                  {publishVideo.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publicar em {selectedAccounts.length || ""} conta{selectedAccounts.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishes history */}
      {proj.publishes && proj.publishes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="h-4 w-4" />
              Histórico de publicações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proj.publishes.map((p, i) => {
                const pubStatus = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.queued;
                const PubIcon = pubStatus.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <PlatformIcon platform={p.platform} />
                    <div className="flex items-center gap-2">
                      <PubIcon
                        className={`h-4 w-4 ${pubStatus.color} ${
                          p.status === "processing" ? "animate-spin" : ""
                        }`}
                      />
                      <Badge variant={pubStatus.variant} className="text-xs">
                        {pubStatus.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCategoriesQuery } from "@/hooks/studio/useCategories";
import { useVideoProjectsQuery } from "@/hooks/studio/useVideoProjects";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Skeleton,
  EmptyState,
  Separator,
} from "@gaqno-development/frontcore/components/ui";
import {
  FolderOpen,
  Plus,
  Film,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Video,
  Sparkles,
} from "lucide-react";

type Category = { id: string; name: string; slug: string };
type VideoItem = {
  id: string;
  title: string;
  status: string;
  categoryId: string;
  createdAt: string;
  thumbnailUrl?: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
> = {
  queued: { label: "Na fila", variant: "outline", icon: Clock },
  processing: { label: "Gerando", variant: "secondary", icon: Loader2 },
  completed: { label: "Pronto", variant: "default", icon: CheckCircle2 },
  failed: { label: "Falhou", variant: "destructive", icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.queued;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  );
}

function VideoCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <Skeleton className="h-20 w-32 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function CategorySidebarSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full rounded-md" />
      ))}
    </div>
  );
}

export function StudioDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId");

  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: videosData, isLoading: videosLoading } = useVideoProjectsQuery({
    page: 1,
    limit: 50,
    categoryId: activeCategoryId ?? undefined,
  });

  const cats = categories as Category[];
  const items = (videosData?.items ?? []) as VideoItem[];

  const getCategoryName = (categoryId: string) =>
    cats.find((c) => c.id === categoryId)?.name ?? "";

  return (
    <div className="flex min-h-[60vh] gap-6 p-6">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="sticky top-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Categorias
            </h3>
          </div>

          {categoriesLoading ? (
            <CategorySidebarSkeleton />
          ) : (
            <nav className="space-y-1">
              <Link
                to="/ai/studio"
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  !activeCategoryId
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Film className="h-4 w-4" />
                Todos os vídeos
              </Link>
              {cats.map((c) => (
                <Link
                  key={c.id}
                  to={`/ai/studio?categoryId=${c.id}`}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeCategoryId === c.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  {c.name}
                </Link>
              ))}
            </nav>
          )}

          <Separator />

          <Button
            onClick={() => navigate("/ai/studio/new")}
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Novo vídeo
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {activeCategoryId
                ? getCategoryName(activeCategoryId)
                : "Todos os vídeos"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {videosLoading
                ? "Carregando projetos..."
                : `${items.length} projeto${items.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            onClick={() => navigate("/ai/studio/new")}
            className="gap-2 md:hidden"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Novo
          </Button>
        </div>

        {videosLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Video}
            title="Nenhum vídeo ainda"
            description="Crie seu primeiro vídeo com IA. Escolha uma categoria, escreva o roteiro e gere em segundos."
            action={{
              label: "Criar primeiro vídeo",
              onClick: () => navigate("/ai/studio/new"),
              icon: Sparkles,
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((v) => (
              <Link key={v.id} to={`/ai/studio/${v.id}`} className="group">
                <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
                  <div className="relative aspect-video bg-muted/50">
                    {v.thumbnailUrl ? (
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Film className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <StatusBadge status={v.status} />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="truncate font-semibold group-hover:text-primary transition-colors">
                      {v.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {getCategoryName(v.categoryId) && (
                        <>
                          <FolderOpen className="h-3 w-3" />
                          <span>{getCategoryName(v.categoryId)}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>
                        {new Date(v.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

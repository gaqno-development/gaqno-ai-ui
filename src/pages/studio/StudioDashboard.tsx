import React, { useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCategoriesQuery } from "@/hooks/studio/useCategories";
import { useVideoProjectsQuery } from "@/hooks/studio/useVideoProjects";
import {
  useImageFoldersQuery,
  useCreateImageFolderMutation,
  useMoveGalleryImageMutation,
} from "@/hooks/gallery";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Skeleton,
  EmptyState,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
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
  Image as ImageIcon,
} from "lucide-react";
import { ImageGalleryGrid } from "@/components/gallery/ImageGalleryGrid";

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

type MediaTab = "videos" | "images";

export function StudioDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") as MediaTab) || "videos";
  const activeCategoryId = searchParams.get("categoryId");
  const activeImageFolderId = searchParams.get("imageFolderId");

  const [draggingImageId, setDraggingImageId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();
  const { data: videosData, isLoading: videosLoading } = useVideoProjectsQuery({
    page: 1,
    limit: 50,
    categoryId: activeCategoryId ?? undefined,
  });
  const { data: imageFolders = [] } = useImageFoldersQuery();
  const createImageFolder = useCreateImageFolderMutation();
  const moveGalleryImage = useMoveGalleryImageMutation();

  const cats = categories as Category[];
  const items = (videosData?.items ?? []) as VideoItem[];
  const imageFolderList = imageFolders as { id: string; name: string }[];

  const getCategoryName = (categoryId: string) =>
    cats.find((c) => c.id === categoryId)?.name ?? "";

  const setTab = useCallback(
    (t: MediaTab) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", t);
        if (t === "videos") next.delete("imageFolderId");
        if (t === "images") next.delete("categoryId");
        return next;
      });
    },
    [setSearchParams]
  );

  const handleImageDragStart = useCallback((e: React.DragEvent, imageId: string) => {
    setDraggingImageId(imageId);
    e.dataTransfer.setData("application/x-gaqno-image-id", imageId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleImageDragEnd = useCallback(() => {
    setDraggingImageId(null);
  }, []);

  const handleFolderDrop = useCallback(
    (e: React.DragEvent, folderId: string | null) => {
      e.preventDefault();
      const imageId = e.dataTransfer.getData("application/x-gaqno-image-id");
      if (imageId) moveGalleryImage.mutate({ id: imageId, folderId });
      setDraggingImageId(null);
    },
    [moveGalleryImage]
  );

  const handleFolderDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleCreateFolder = useCallback(() => {
    const name = newFolderName.trim();
    if (!name) return;
    createImageFolder.mutate(
      { name },
      {
        onSuccess: () => {
          setNewFolderName("");
          setShowNewFolderInput(false);
        },
      }
    );
  }, [newFolderName, createImageFolder]);

  const imageFolderIdParam =
    activeImageFolderId === undefined || activeImageFolderId === ""
      ? undefined
      : activeImageFolderId === "null"
        ? null
        : activeImageFolderId;

  return (
    <div className="flex min-h-[60vh] gap-6 p-6">
      <aside className="hidden w-60 shrink-0 md:block">
        <div className="sticky top-4 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {tab === "videos" ? "Categorias" : "Pastas"}
          </h3>

          {tab === "videos" && (
            <>
              {categoriesLoading ? (
                <CategorySidebarSkeleton />
              ) : (
                <nav className="space-y-1">
                  <Link
                    to="/ai/studio?tab=videos"
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
                      to={`/ai/studio?tab=videos&categoryId=${c.id}`}
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
            </>
          )}

          {tab === "images" && (
            <>
              <nav className="space-y-1">
                <div
                  onDragOver={handleFolderDragOver}
                  onDrop={(e) => handleFolderDrop(e, null)}
                  className={`rounded-lg border border-dashed border-transparent transition-colors ${
                    draggingImageId ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <Link
                    to="/ai/studio?tab=images"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      !activeImageFolderId
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Todas as imagens
                  </Link>
                </div>
                {imageFolderList.map((f) => (
                  <div
                    key={f.id}
                    onDragOver={handleFolderDragOver}
                    onDrop={(e) => handleFolderDrop(e, f.id)}
                    className={`rounded-lg border border-dashed border-transparent transition-colors ${
                      draggingImageId ? "border-primary/50 bg-primary/5" : ""
                    }`}
                  >
                    <Link
                      to={`/ai/studio?tab=images&imageFolderId=${f.id}`}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        activeImageFolderId === f.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <FolderOpen className="h-4 w-4" />
                      {f.name}
                    </Link>
                  </div>
                ))}
              </nav>
              <Separator />
              {showNewFolderInput ? (
                <div className="flex gap-2">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nome da pasta"
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                      if (e.key === "Escape") {
                        setShowNewFolderInput(false);
                        setNewFolderName("");
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="h-8 shrink-0"
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim() || createImageFolder.isPending}
                  >
                    OK
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowNewFolderInput(true)}
                  className="w-full gap-2"
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  Nova pasta
                </Button>
              )}
            </>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Tabs value={tab} onValueChange={(v) => setTab(v as MediaTab)}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="videos" className="gap-2">
                <Film className="h-4 w-4" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Imagens
              </TabsTrigger>
            </TabsList>
            {tab === "videos" && (
              <Button
                onClick={() => navigate("/ai/studio/new")}
                className="gap-2 md:hidden"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            )}
          </div>

          <TabsContent value="videos" className="mt-0">
            <div className="mb-6">
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
                  <Link
                    key={v.id}
                    to={`/ai/studio/${v.id}`}
                    className="group"
                  >
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
                            {new Date(v.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "short",
                              }
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {activeImageFolderId
                  ? imageFolderList.find((f) => f.id === activeImageFolderId)
                      ?.name ?? "Pasta"
                  : "Todas as imagens"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Imagens salvas na galeria. Arraste para uma pasta para organizar.
              </p>
            </div>
            <ImageGalleryGrid
              folderId={imageFolderIdParam}
              draggingImageId={draggingImageId}
              onDragStart={handleImageDragStart}
              onDragEnd={handleImageDragEnd}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default StudioDashboard;

import React from "react";
import { Link } from "react-router-dom";
import { useCategoriesQuery } from "@/hooks/studio/useCategories";
import { useVideoProjectsQuery } from "@/hooks/studio/useVideoProjects";
import { FolderOpen, Plus, Film } from "lucide-react";

export function StudioDashboard() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: videosData, isLoading: videosLoading } = useVideoProjectsQuery({
    page: 1,
    limit: 20,
  });
  const items = (videosData?.items ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    categoryId: string;
    createdAt: string;
  }>;

  return (
    <div className="flex gap-6 p-4">
      <aside className="w-56 shrink-0 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Categorias</h3>
        {categoriesLoading ? (
          <p className="text-sm">Carregando...</p>
        ) : (
          <ul className="space-y-1">
            {(categories as Array<{ id: string; name: string; slug: string }>).map((c) => (
              <li key={c.id}>
                <Link
                  to={`/ai/studio?categoryId=${c.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <FolderOpen className="h-4 w-4" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/ai/studio/new"
          className="mt-4 flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Novo vídeo
        </Link>
      </aside>
      <main className="min-w-0 flex-1">
        <h2 className="mb-4 text-lg font-semibold">Projetos de vídeo</h2>
        {videosLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum projeto ainda.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => (
              <li key={v.id}>
                <Link
                  to={`/ai/studio/${v.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <Film className="h-8 w-8 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{v.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

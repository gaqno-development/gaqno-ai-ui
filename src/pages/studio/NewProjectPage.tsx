import React from "react";
import { useNavigate } from "react-router-dom";
import { useCategoriesQuery } from "@/hooks/studio/useCategories";
import { useCreateVideoMutation } from "@/hooks/studio/useVideoProjects";

export function NewProjectPage() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategoriesQuery();
  const createVideo = useCreateVideoMutation();
  const [title, setTitle] = React.useState("");
  const [script, setScript] = React.useState("");
  const [style, setStyle] = React.useState("dark");
  const [categoryId, setCategoryId] = React.useState("");

  React.useEffect(() => {
    const list = categories as Array<{ id: string }>;
    if (list.length > 0 && !categoryId) setCategoryId(list[0].id);
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;
    try {
      const result = await createVideo.mutateAsync({
        title: title || "Sem título",
        script,
        style,
        categoryId,
      });
      navigate(`/ai/studio/${result.projectId}`);
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h2 className="mb-4 text-lg font-semibold">Novo projeto de vídeo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Título do projeto"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Categoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {(categories as Array<{ id: string; name: string }>).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Estilo</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="dark">Dark</option>
            <option value="motivational">Motivacional</option>
            <option value="religious">Religioso</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Roteiro / texto</label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={6}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Digite o texto do vídeo..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={createVideo.isPending || !script.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {createVideo.isPending ? "Gerando..." : "Gerar vídeo"}
        </button>
      </form>
    </div>
  );
}

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCategoriesQuery } from "@/hooks/studio/useCategories";
import { useCreateVideoMutation } from "@/hooks/studio/useVideoProjects";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Separator,
} from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Palette,
  FolderOpen,
  FileText,
  Type,
} from "lucide-react";

type Category = { id: string; name: string };

const STYLES = [
  { value: "dark", label: "Dark", description: "Estilo sombrio e misterioso" },
  { value: "motivational", label: "Motivacional", description: "Energizante e inspirador" },
  { value: "religious", label: "Religioso", description: "Espiritual e reflexivo" },
] as const;

export function NewProjectPage() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const createVideo = useCreateVideoMutation();
  const [title, setTitle] = React.useState("");
  const [script, setScript] = React.useState("");
  const [style, setStyle] = React.useState("dark");
  const [categoryId, setCategoryId] = React.useState("");

  const cats = categories as Category[];

  React.useEffect(() => {
    if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
  }, [cats, categoryId]);

  const charCount = script.length;
  const isValid = script.trim().length > 0 && categoryId;

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
      // handled by mutation
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link
        to="/ai/studio"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Studio
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Novo vídeo com IA
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para gerar um vídeo. Apenas o roteiro é obrigatório.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Ex: Dicas de produtividade"
              />
              <p className="text-xs text-muted-foreground">
                Opcional. Se vazio, será "Sem título".
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  Categoria
                </Label>
                {categoriesLoading ? (
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                ) : (
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cats.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label htmlFor="style" className="flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                  Estilo
                </Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {STYLES.find((s) => s.value === style)?.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="script" className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Roteiro
                </Label>
                <span className="text-xs text-muted-foreground">{charCount} caracteres</span>
              </div>
              <Textarea
                id="script"
                value={script}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScript(e.target.value)}
                rows={8}
                placeholder="Escreva o texto que será narrado no vídeo..."
                className="resize-y"
                required
              />
              <p className="text-xs text-muted-foreground">
                Escreva o texto que a IA transformará em vídeo narrado.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/ai/studio")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createVideo.isPending || !isValid}
                className="gap-2"
              >
                {createVideo.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar vídeo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

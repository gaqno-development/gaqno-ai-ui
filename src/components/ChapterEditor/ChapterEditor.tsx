import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Progress } from "@gaqno-development/frontcore/components/ui";
import { SparklesIcon } from "@gaqno-development/frontcore/components/icons";
import { Save, Wand2 } from "lucide-react";
import { Spinner } from "@gaqno-development/frontcore/components/ui";
import { useChapterEditor } from "@/hooks/useChapterEditor";
import type { ChapterEditorProps } from "./types";

export function ChapterEditor({ bookId, chapterId }: ChapterEditorProps) {
  const {
    selectedChapter,
    book,
    title,
    summary,
    content,
    hasChanges,
    isGenerating,
    generationStep,
    currentWordCount,
    targetWordCount,
    pageInfo,
    chapterPages,
    handleContentChange,
    handleTitleChange,
    handleSummaryChange,
    handleSave,
    handleGenerateContent,
  } = useChapterEditor(bookId, chapterId);

  if (!selectedChapter) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Selecione um capítulo para editar
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressValue =
    generationStep === "analyzing"
      ? 20
      : generationStep === "generating"
        ? 50
        : generationStep === "expanding" && currentWordCount && targetWordCount
          ? Math.min(90, 50 + (currentWordCount / targetWordCount) * 40)
          : 70;

  const stepLabel =
    generationStep === "analyzing"
      ? "Analisando contexto e personagens..."
      : generationStep === "generating"
        ? "Gerando conteúdo do capítulo..."
        : generationStep === "expanding"
          ? `Expandindo capítulo para atingir o mínimo de ${targetWordCount} palavras... (${currentWordCount || 0} palavras geradas)`
          : "Gerando conteúdo...";

  const buttonLabel =
    generationStep === "analyzing"
      ? "Analisando contexto..."
      : generationStep === "generating"
        ? "Gerando capítulo..."
        : generationStep === "expanding"
          ? `Expandindo conteúdo... (${currentWordCount || 0}/${targetWordCount || 0} palavras)`
          : "Gerando...";

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Capítulo {selectedChapter.chapter_number}</CardTitle>
            <Button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  {buttonLabel}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Gerar com IA
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {isGenerating && (
          <div className="px-6 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stepLabel}</span>
                <SparklesIcon
                  className="h-4 w-4 animate-pulse text-primary"
                  size={16}
                />
              </div>
              <Progress value={progressValue} className="h-2" />
              {generationStep === "expanding" &&
                currentWordCount &&
                targetWordCount && (
                  <div className="text-xs text-muted-foreground">
                    Progresso: {currentWordCount} de {targetWordCount} palavras
                    ({Math.round((currentWordCount / targetWordCount) * 100)}%)
                  </div>
                )}
            </div>
          </div>
        )}
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chapter-title">Título</Label>
            <Input
              id="chapter-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chapter-summary">Resumo do Capítulo</Label>
            <Textarea
              id="chapter-summary"
              value={summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="Breve resumo do capítulo para análise de consistência..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chapter-content">Conteúdo</Label>
            <Textarea
              id="chapter-content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={20}
              className="font-mono"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>{pageInfo}</div>
              <div className="text-xs">Capítulo: {chapterPages} páginas</div>
            </div>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

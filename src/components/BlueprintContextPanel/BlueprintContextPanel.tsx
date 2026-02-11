import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import {
  BookIcon,
  FileDescriptionIcon,
  GearIcon,
} from "@gaqno-development/frontcore/components/icons";
import { Save } from "lucide-react";
import { CharacterList } from "../CharacterList";
import { ConsistencyAlerts } from "../ConsistencyAlerts";
import { useBlueprintContextPanel } from "@/hooks/useBlueprintContextPanel";
import type { BlueprintContextPanelProps } from "./types";

export function BlueprintContextPanel({ bookId }: BlueprintContextPanelProps) {
  const {
    book,
    chapters,
    totalWords,
    totalPages,
    minPagesPerChapter,
    localMinPages,
    setLocalMinPages,
    isSaving,
    handleSaveMinPages,
    formatPageInfo,
  } = useBlueprintContextPanel(bookId);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileDescriptionIcon className="h-4 w-4" size={16} />
            Estatísticas do Livro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3">
            <div>
              <span className="font-medium">Gênero:</span>{" "}
              {book?.genre || "Não definido"}
            </div>
            <div>
              <span className="font-medium">Estilo:</span>{" "}
              {book?.style || "Não definido"}
            </div>
            <div className="pt-2 border-t">
              <div className="font-medium mb-1">Progresso</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <BookIcon className="h-3 w-3" size={12} />
                  {chapters.length} capítulos
                </div>
                <div className="flex items-center gap-2">
                  <FileDescriptionIcon className="h-3 w-3" size={12} />
                  {totalWords.toLocaleString()} palavras
                </div>
                <div className="flex items-center gap-2">
                  <FileDescriptionIcon className="h-3 w-3" size={12} />
                  {totalPages} páginas
                </div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="font-medium mb-1">Análise de Páginas</div>
              <div className="text-xs text-muted-foreground">
                {formatPageInfo(totalWords, book?.genre)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <GearIcon className="h-4 w-4" size={16} />
            Configurações de Capítulos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="min-pages">Páginas Mínimas por Capítulo</Label>
            <div className="flex gap-2">
              <Input
                id="min-pages"
                type="number"
                min="1"
                max="50"
                value={localMinPages}
                onChange={(e) => setLocalMinPages(Number(e.target.value))}
                className="flex-1"
              />
              <Button
                onClick={handleSaveMinPages}
                disabled={isSaving || localMinPages === minPagesPerChapter}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Cada capítulo gerado terá pelo menos {localMinPages} páginas (~
              {localMinPages * 250} palavras)
            </p>
          </div>
        </CardContent>
      </Card>

      <CharacterList bookId={bookId} />
      <ConsistencyAlerts bookId={bookId} />
    </div>
  );
}

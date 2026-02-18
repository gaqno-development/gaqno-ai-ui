import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import {
  Label,
  Textarea,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { AISuggestionButton } from "../../AISuggestionButton";
import { useStructureStep } from "@/hooks/useStructureStep";
import type { IStructureStepProps } from "./types";
import {
  DownChevron,
  RightChevron,
  SparklesIcon,
} from "@gaqno-development/frontcore/components/icons";
import { Spinner } from "@gaqno-development/frontcore/components/ui";

export function StructureStep(props: IStructureStepProps) {
  const {
    isOpen,
    setIsOpen,
    plotSummary,
    initialChapters,
    mainConflict,
    generatingFor,
    isGeneratingAll,
    handleGeneratePlotSummary,
    handleGenerateChapters,
    handleGenerateConflict,
    handleGenerateAll,
    applyPlotSummary,
    applyInitialChapters,
    applyMainConflict,
  } = useStructureStep(props);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <DownChevron
                    className="h-4 w-4 text-muted-foreground"
                    size={16}
                  />
                ) : (
                  <RightChevron
                    className="h-4 w-4 text-muted-foreground"
                    size={16}
                  />
                )}
                <CardTitle className="text-base">
                  Estrutura Inicial da História (Opcional)
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-end pb-2 border-b">
              <Button
                type="button"
                onClick={handleGenerateAll}
                disabled={isGeneratingAll || generatingFor !== null}
                variant="outline"
                className="gap-2"
              >
                {isGeneratingAll ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4" size={16} />
                    Gerar Tudo com IA
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="plot_summary">Resumo do Enredo em 3 Atos</Label>
                <AISuggestionButton
                  onGenerate={handleGeneratePlotSummary}
                  onAccept={applyPlotSummary}
                  disabled={generatingFor === "plot" || isGeneratingAll}
                />
              </div>
              <Textarea
                id="plot_summary"
                placeholder="Descreva o enredo em três atos: introdução, desenvolvimento e conclusão..."
                value={plotSummary}
                onChange={(e) => applyPlotSummary(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="initial_chapters">
                  Capítulos Iniciais Sugeridos
                </Label>
                <AISuggestionButton
                  onGenerate={handleGenerateChapters}
                  onAccept={applyInitialChapters}
                  disabled={generatingFor === "chapters" || isGeneratingAll}
                />
              </div>
              <Textarea
                id="initial_chapters"
                placeholder="Lista de capítulos iniciais com títulos e resumos..."
                value={initialChapters}
                onChange={(e) => applyInitialChapters(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="main_conflict">Conflito Principal</Label>
                <AISuggestionButton
                  onGenerate={handleGenerateConflict}
                  onAccept={applyMainConflict}
                  disabled={generatingFor === "conflict" || isGeneratingAll}
                />
              </div>
              <Textarea
                id="main_conflict"
                placeholder="Qual é o conflito central que impulsiona a história?"
                value={mainConflict}
                onChange={(e) => applyMainConflict(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

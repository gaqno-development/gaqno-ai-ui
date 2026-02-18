import { Card, CardContent, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaqno-development/frontcore/components/ui';
import { BookIcon, DownChevron, RightChevron } from '@gaqno-development/frontcore/components/icons';
import { Circle, ChevronRight } from 'lucide-react';
import { Spinner } from "@gaqno-development/frontcore/components/ui";
import { cn } from '@gaqno-development/frontcore/lib/utils';
import {
  useBlueprintStructure,
  SECTION_NAMES,
  SECTION_ORDER,
} from '@/hooks/useBlueprintStructure';
import type { BlueprintStructureProps } from './types';

export function BlueprintStructure({ bookId, structure }: BlueprintStructureProps) {
  const {
    blueprintChapters,
    blueprintSections,
    openSections,
    creatingChapterNumber,
    generatingContent,
    groupedBySection,
    handleChapterClick,
    toggleSection,
  } = useBlueprintStructure(bookId, structure);

  if (blueprintChapters.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Nenhum capítulo definido na estrutura
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {SECTION_ORDER.map((sectionKey) => {
        const sectionChapters = groupedBySection[sectionKey];
        if (!sectionChapters || sectionChapters.length === 0) return null;
        const sectionName = blueprintSections?.[sectionKey]?.name || SECTION_NAMES[sectionKey] || sectionKey;
        const isOpen = openSections.has(sectionKey);
        const totalChapters = sectionChapters.length;

        return (
          <Collapsible key={sectionKey} open={isOpen} onOpenChange={() => toggleSection(sectionKey)}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <DownChevron className="h-4 w-4 text-muted-foreground" size={16} />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <CardTitle className="text-sm font-semibold">{sectionName}</CardTitle>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {totalChapters} {totalChapters === 1 ? 'sugestão' : 'sugestões'}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  {sectionChapters.map(({ chapter, index }) => {
                    const chapterNumber = (chapter.number ?? chapter.chapter_number ?? index + 1) as number;
                    const isCreating = creatingChapterNumber === chapterNumber;
                    const isGenerating = generatingContent === chapterNumber;
                    const isProcessing = isCreating || isGenerating;

                    return (
                      <Card
                        key={index}
                        className={cn(
                          'cursor-pointer hover:border-primary transition-colors',
                          isProcessing && 'opacity-50 cursor-wait',
                        )}
                        onClick={() => !isProcessing && handleChapterClick(chapterNumber, chapter)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (!isProcessing && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            handleChapterClick(chapterNumber, chapter);
                          }
                        }}
                        aria-label={`Criar capítulo ${chapterNumber}: ${chapter.title || 'Sem título'}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {isProcessing ? (
                                <Spinner className="h-5 w-5 text-primary" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Capítulo {chapterNumber}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                  Sugestão
                                </span>
                              </div>
                              <div className="text-sm font-medium mt-1">
                                {chapter.title || 'Sem título'}
                              </div>
                              {chapter.summary && !isGenerating && (
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {chapter.summary}
                                </div>
                              )}
                              {isGenerating && (
                                <div className="text-xs text-primary mt-1">
                                  Gerando conteúdo considerando capítulo anterior...
                                </div>
                              )}
                            </div>
                            {!isProcessing && (
                              <BookIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" size={16} />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}

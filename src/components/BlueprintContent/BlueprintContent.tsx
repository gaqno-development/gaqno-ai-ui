import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button } from '@gaqno-development/frontcore/components/ui';
import { BlueprintCard } from '../BlueprintCard';
import { BlueprintStructure } from '../BlueprintStructure';
import { useBlueprintContent } from '@/hooks/useBlueprintContent';
import type { BlueprintContentProps } from './types';
import { RefreshIcon, PenIcon } from '@gaqno-development/frontcore/components/icons';

export function BlueprintContent({ bookId, blueprint }: BlueprintContentProps) {
  const {
    isEditing,
    isUpdating,
    isCreating,
    handleGenerateBlueprint,
    handleSave,
    handleToggleEdit,
  } = useBlueprintContent(bookId);

  if (!blueprint) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Blueprint</CardTitle>
            <CardDescription>Gere a estrutura inicial do seu livro</CardDescription>
          </CardHeader>
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-muted-foreground">
              O blueprint ainda não foi gerado. Clique no botão abaixo para criar a estrutura inicial do livro.
            </p>
            <Button
              onClick={handleGenerateBlueprint}
              disabled={isCreating}
              size="lg"
            >
              {isCreating ? 'Gerando...' : 'Gerar Blueprint'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 space-y-2 sm:space-y-4 h-full flex flex-col min-h-0 overflow-hidden">
      <Card className="flex-shrink-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resumo</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleEdit}
              >
                <PenIcon className="h-4 w-4 mr-2" size={16} />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
              >
                <RefreshIcon className="h-4 w-4 mr-2" size={16} />
                Regenerar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BlueprintCard
            content={blueprint.summary || ''}
            isEditing={isEditing}
            onSave={handleSave}
          />
        </CardContent>
      </Card>

      <Card className="flex flex-col flex-1 min-h-0 overflow-hidden h-0">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle>Estrutura</CardTitle>
          <CardDescription>Capítulos e organização do livro</CardDescription>
        </CardHeader>
        <CardContent
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <BlueprintStructure bookId={bookId} structure={blueprint.structure} />
        </CardContent>
      </Card>
    </div>
  );
}

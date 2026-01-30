import { FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gaqno-development/frontcore/components/ui';
import { Button } from '@gaqno-development/frontcore/components/ui';
import { Progress } from '@gaqno-development/frontcore/components/ui';
import { ArrowNarrowLeftIcon, RightChevron } from '@gaqno-development/frontcore/components/icons';
import { Save, Loader2 } from 'lucide-react';
import { useCreateBookWizardPage } from './hooks/useCreateBookWizardPage';
import { BasicInfoStep } from './BasicInfoStep';
import { WorldSettingsStep } from './WorldSettingsStep';
import { CharactersStep } from './CharactersStep';
import { ItemsStep } from './ItemsStep';
import { ToneStyleStep } from './ToneStyleStep';
import { StructureStep } from './StructureStep';

export function CreateBookWizard() {
  const {
    form,
    currentStep,
    totalSteps,
    settings,
    setSettings,
    characters,
    setCharacters,
    items,
    setItems,
    structure,
    setStructure,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
    getProgress,
    selectedGenre,
    setSelectedGenre,
    selectedModel,
    setSelectedModel,
    isSaving,
    isCreatingBook,
    isCreating,
    bookContext,
    handleGenerateCompleteBlueprint,
    handleSaveDraft,
    handleCreateBook,
    STEP_TITLES,
  } = useCreateBookWizardPage();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            onGenreSelect={setSelectedGenre}
            selectedGenre={selectedGenre}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onGenerateCompleteBlueprint={handleGenerateCompleteBlueprint}
          />
        );
      case 2:
        return <WorldSettingsStep settings={settings} onSettingsChange={setSettings} bookContext={bookContext} />;
      case 3:
        return <CharactersStep characters={characters} onCharactersChange={setCharacters} bookContext={bookContext} />;
      case 4:
        return <ItemsStep items={items} onItemsChange={setItems} bookContext={bookContext} />;
      case 5:
        return <ToneStyleStep bookContext={bookContext} />;
      case 6:
        return <StructureStep bookContext={bookContext} onStructureChange={setStructure} structure={structure} />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Criar Novo Livro</CardTitle>
          <CardDescription>
            Defina os elementos essenciais da sua história. Você pode escrever manualmente ou pedir sugestões da IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Passo {currentStep} de {totalSteps}: {STEP_TITLES[currentStep - 1]}
                </span>
                <span className="text-muted-foreground">{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>

            <FormProvider {...form}>
              <div className="min-h-[400px]">{renderStep()}</div>
            </FormProvider>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Rascunho
                    </>
                  )}
                </Button>
                {canGoPrevious && (
                  <Button type="button" variant="outline" onClick={previousStep}>
                    <ArrowNarrowLeftIcon className="h-4 w-4 mr-2" size={16} />
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep} disabled={!canGoNext}>
                    Próximo
                    <RightChevron className="h-4 w-4 ml-2" size={16} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCreateBook}
                    disabled={isCreating || isCreatingBook || !canGoNext}
                  >
                    {isCreating || isCreatingBook ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar Livro'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

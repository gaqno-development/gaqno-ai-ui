import {
  Input,
  Label,
  Textarea,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { GenreSelector } from "../../GenreSelector";
import { AISuggestionButton } from "../../AISuggestionButton";
import { AIModelSelect } from "../../AIModelSelect";
import { useBasicInfoStep } from "@/hooks/useBasicInfoStep";
import type { IBasicInfoStepProps } from "./types";
import { SparklesIcon } from "@gaqno-development/frontcore/components/icons";
import { Spinner } from "@gaqno-development/frontcore/components/ui";

export function BasicInfoStep(props: IBasicInfoStepProps) {
  const {
    register,
    setValue,
    errors,
    isGeneratingTitle,
    isGeneratingPremise,
    isGeneratingAll,
    handleGenerateTitle,
    handleGeneratePremise,
    handleGenerateAll,
  } = useBasicInfoStep(props);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 pb-2 border-b">
        <AIModelSelect
          value={props.selectedModel}
          onValueChange={props.onModelChange}
          placeholder="Modelo de IA"
          loadingPlaceholder="Carregando modelos..."
          className="w-[220px]"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void handleGenerateAll();
                  }}
                  disabled={
                    isGeneratingAll ||
                    isGeneratingTitle ||
                    isGeneratingPremise ||
                    !props.selectedGenre
                  }
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
                      <SparklesIcon className="h-4 w-4" />
                      Gerar Tudo com IA
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {props.selectedGenre
                ? "Gera título, gênero e premissa com IA"
                : "Selecione pelo menos um gênero para usar esta função"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Título do Livro</Label>
          <AISuggestionButton
            onGenerate={handleGenerateTitle}
            onAccept={(suggestion) => setValue("title", suggestion)}
            disabled={isGeneratingTitle || isGeneratingAll}
          />
        </div>
        <Input
          id="title"
          placeholder="Ex: A Jornada do Herói"
          {...register("title", { required: "Título é obrigatório" })}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <GenreSelector
        selectedGenre={props.selectedGenre}
        onGenreSelect={props.onGenreSelect}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Premissa / Sinopse Curta</Label>
          <AISuggestionButton
            onGenerate={handleGeneratePremise}
            onAccept={(suggestion) => setValue("description", suggestion)}
            disabled={isGeneratingPremise || isGeneratingAll}
          />
        </div>
        <Textarea
          id="description"
          placeholder="Descreva a ideia central do seu livro, os personagens principais, o conflito ou qualquer informação que ajude a criar o livro..."
          rows={6}
          {...register("description")}
        />
      </div>
    </div>
  );
}

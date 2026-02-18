import { Input } from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { GenreSelector } from "../GenreSelector";
import { StyleSelector } from "../StyleSelector";
import { useBookForm } from "@/hooks/useBookForm";
import type { BookFormProps } from "./types";

export function BookForm({
  onSubmit,
  defaultValues,
  isLoading,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    selectedGenre,
    selectedStyle,
    handleGenreSelect,
    handleStyleSelect,
  } = useBookForm(onSubmit, defaultValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Livro</Label>
        <Input
          id="title"
          placeholder="Não tem título? Nós criamos para você"
          {...register("title")}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <GenreSelector
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />

      <div className="space-y-2">
        <Label htmlFor="description">Descrição ou Prompt Inicial</Label>
        <Textarea
          id="description"
          placeholder="Descreva sua ideia, personagens, enredo ou qualquer informação que ajude a criar o livro..."
          rows={6}
          {...register("description")}
        />
      </div>

      <StyleSelector
        selectedStyle={selectedStyle}
        onStyleSelect={handleStyleSelect}
      />

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
          aria-label={
            isLoading
              ? "Gerando estrutura do livro"
              : "Criar livro e gerar estrutura"
          }
        >
          {isLoading ? (
            <>
              <span className="mr-2">⏳</span>
              Gerando Estrutura...
            </>
          ) : (
            "Gerar Estrutura"
          )}
        </Button>
        {isLoading && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Isso pode levar alguns segundos...
          </p>
        )}
      </div>
    </form>
  );
}

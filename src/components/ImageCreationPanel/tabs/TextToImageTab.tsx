import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Textarea } from "@gaqno-development/frontcore/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { Label, Spinner } from "@gaqno-development/frontcore/components/ui";
import { Image as ImageIcon, Download, History } from "lucide-react";
import { useImageCreationPanel } from "@/hooks/useImageCreationPanel";

export function TextToImageTab() {
  const {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    generatedImageUrl,
    recordedImages,
    isSubmitLoading,
    isSubmitDisabled,
    providers,
    modelsForProvider,
    modelsLoading,
  } = useImageCreationPanel();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Texto para Imagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              {...register("prompt")}
              placeholder="Describe the image you want to generate..."
              className="min-h-[120px]"
            />
            {errors.prompt && (
              <p className="text-sm text-destructive mt-1">
                {errors.prompt.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="provider">Provedor</Label>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? "auto"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue
                        placeholder={
                          modelsLoading
                            ? "Carregando..."
                            : "Selecione o provedor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automático</SelectItem>
                      {providers.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="model">Modelo</Label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="model">
                      <SelectValue
                        placeholder={
                          modelsLoading
                            ? "Carregando..."
                            : modelsForProvider.length > 0
                              ? "Selecione o modelo"
                              : "Nenhum modelo disponível"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {modelsForProvider.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="style">Estilo (opcional)</Label>
              <Controller
                name="style"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Selecione o estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="3d">3D</SelectItem>
                      <SelectItem value="oil-painting">Oil Painting</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="aspect_ratio">Proporção</Label>
              <Controller
                name="aspect_ratio"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="aspect_ratio">
                      <SelectValue placeholder="Selecione a proporção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="3:4">3:4</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            loading={isSubmitLoading}
            disabled={isSubmitDisabled}
          >
            Gerar imagem
          </Button>
        </CardContent>
      </Card>

      {isSubmitLoading && !generatedImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Gerando imagem</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <Spinner className="h-10 w-10 text-primary" />
            <p className="text-sm text-muted-foreground">
              Aguarde enquanto a imagem é gerada...
            </p>
          </CardContent>
        </Card>
      )}

      {generatedImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Imagem gerada</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={generatedImageUrl}
              alt="Generated"
              className="w-full rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {recordedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Imagens geradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Imagens que você escolheu, disponíveis para download novamente.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordedImages.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border overflow-hidden bg-muted/30"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video relative"
                  >
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </a>
                  <div className="p-2 flex justify-end">
                    <a
                      href={item.url}
                      download={`generated-image-${item.id.slice(0, 8)}.png`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      Baixar
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

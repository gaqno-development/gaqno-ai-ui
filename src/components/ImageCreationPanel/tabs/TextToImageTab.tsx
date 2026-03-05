import React, { useState } from "react";
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
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Image as ImageIcon, Download, History, Copy, Check, RefreshCw } from "lucide-react";
import { useImageCreationPanel } from "@/hooks/useImageCreationPanel";
import { GenerationLoadingCard } from "@/components/shared";

export function TextToImageTab() {
  const {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    generatedImageUrls,
    selectedImageUrl,
    selectImage,
    resetToForm,
    recordedImages,
    resultsSectionRef,
    formSectionRef,
    isSubmitLoading,
    isSubmitDisabled,
    providers,
    modelsForProvider,
    modelsLoading,
  } = useImageCreationPanel();
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div ref={formSectionRef}>
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
      </div>

      {isSubmitLoading && generatedImageUrls.length === 0 && (
        <GenerationLoadingCard
          title="Gerando imagem"
          message="Aguarde enquanto a imagem é gerada."
        />
      )}

      {generatedImageUrls.length > 0 && !selectedImageUrl && (
        <div ref={resultsSectionRef}>
        <Card>
          <CardHeader>
            <CardTitle>Escolha sua favorita</CardTitle>
            <p className="text-sm text-muted-foreground">
              Clique na imagem que deseja salvar.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedImageUrls.map((url) => (
                <li key={url}>
                  <button
                    type="button"
                    onClick={() => selectImage(url)}
                    className="w-full rounded-lg border-2 border-transparent overflow-hidden bg-muted/30 hover:border-primary hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <span className="block aspect-square relative">
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-sm">
                        Selecionar
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </div>
      )}

      {selectedImageUrl && (
        <div ref={resultsSectionRef}>
        <Card>
          <CardHeader>
            <CardTitle>Imagem gerada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={selectedImageUrl}
              alt="Generated"
              className="w-full rounded-lg"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(selectedImageUrl)}
                className="gap-2"
              >
                {copiedUrl ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copiedUrl ? "Copiado!" : "Copiar URL"}
              </Button>
              <a
                href={selectedImageUrl}
                download={`generated-image-${Date.now()}.png`}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
              >
                <Download className="h-4 w-4" />
                Baixar
              </a>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={resetToForm}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Gerar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
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

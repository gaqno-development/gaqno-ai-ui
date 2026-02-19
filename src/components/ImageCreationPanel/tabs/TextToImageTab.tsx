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
import { Label } from "@gaqno-development/frontcore/components/ui";
import { Image as ImageIcon } from "lucide-react";
import { useImageCreationPanel } from "@/hooks/useImageCreationPanel";

export function TextToImageTab() {
  const {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    generatedImageUrl,
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
    </form>
  );
}

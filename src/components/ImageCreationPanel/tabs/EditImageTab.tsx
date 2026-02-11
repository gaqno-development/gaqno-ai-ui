import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import {
  Button,
  Textarea,
  Label,
} from "@gaqno-development/frontcore/components/ui";
import { PenIcon } from "@gaqno-development/frontcore/components/icons";
import { useEditImageTab } from "@/hooks/useEditImageTab";

export function EditImageTab() {
  const {
    register,
    handleSubmit,
    errors,
    file,
    fileError,
    onFileChange,
    onSubmit,
    editedImageUrl,
    edit,
    apiErrorMessage,
    previewUrl,
    instruction,
  } = useEditImageTab();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenIcon className="h-5 w-5" size={20} />
            Editar Imagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="edit-image-file">Imagem</Label>
            <input
              id="edit-image-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="block w-full text-sm border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground mt-1"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-24 rounded mt-1"
              />
            )}
            {fileError && (
              <p className="text-sm text-destructive mt-1">{fileError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-instruction">
              Instrução
              <span className="text-muted-foreground font-normal ml-1">
                {instruction?.length ?? 0} / 2000
              </span>
            </Label>
            <Textarea
              id="edit-instruction"
              {...register("instruction")}
              placeholder="Descreva a alteração: cor, estilo, objetos a adicionar ou remover…"
              className="min-h-[120px]"
            />
            {errors.instruction && (
              <p className="text-sm text-destructive mt-1">
                {errors.instruction.message}
              </p>
            )}
          </div>
          {apiErrorMessage && (
            <p className="text-sm text-destructive">{apiErrorMessage}</p>
          )}
          <Button type="submit" className="w-full" loading={edit.isPending}>
            Editar
          </Button>
        </CardContent>
      </Card>
      {editedImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Imagem editada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <img
              src={editedImageUrl}
              alt="Imagem editada"
              className="w-full rounded-lg"
            />
            <a
              download="edited.png"
              href={editedImageUrl}
              className="text-sm underline"
            >
              Baixar
            </a>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

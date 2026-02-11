import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useImageEditMutations } from "@/hooks/mutations/useImageMutations";

const schema = z.object({
  instruction: z
    .string()
    .min(1, "Descreva a alteração")
    .max(2000, "Máximo 2000 caracteres"),
});
export type EditImageTabFormData = z.infer<typeof schema>;

export const useEditImageTab = () => {
  const { edit } = useImageEditMutations();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditImageTabFormData>({
    resolver: zodResolver(schema),
    defaultValues: { instruction: "" },
  });

  const instruction = watch("instruction");

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setFileError(null);
  }, []);

  const onSubmit = useCallback(
    async (data: EditImageTabFormData) => {
      setFileError(null);
      if (!file || file.size === 0) {
        setFileError("Selecione uma imagem.");
        return;
      }
      const result = await edit.mutateAsync({
        file,
        instruction: data.instruction,
      });
      setEditedImageUrl(result.imageUrl);
    },
    [file, edit]
  );

  const apiErrorMessage = edit.isError
    ? edit.error instanceof Error
      ? edit.error.message
      : "Erro ao editar imagem."
    : null;

  return {
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
  };
};

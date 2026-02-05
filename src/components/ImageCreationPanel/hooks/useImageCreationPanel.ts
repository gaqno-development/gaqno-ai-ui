import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useImageGeneration, useImageModels } from "@/hooks/images";
import { useAIModelPreferences } from "@gaqno-development/frontcore/hooks";

const imageFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  style: z.string().optional(),
  aspect_ratio: z.string().optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
});

export type ImageFormData = z.infer<typeof imageFormSchema>;

export const useImageCreationPanel = () => {
  const { generate } = useImageGeneration();
  const { providers, allModels, isLoading: modelsLoading } = useImageModels();
  const [preferences] = useAIModelPreferences();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      style: "",
      aspect_ratio: "16:9",
      model: "",
      provider: "auto",
    },
  });

  useEffect(() => {
    if (preferences.image?.model) setValue("model", preferences.image.model);
    if (preferences.image?.provider && preferences.image.provider !== "auto")
      setValue("provider", preferences.image.provider);
  }, [preferences.image?.model, preferences.image?.provider, setValue]);

  const prompt = watch("prompt");
  const selectedProvider = watch("provider");

  const modelsForProvider =
    selectedProvider && selectedProvider !== "auto"
      ? (providers.find((p) => p.id === selectedProvider)?.models ?? [])
      : allModels.map((m) => ({ id: m.id, name: m.name }));

  const onSubmit = useCallback(
    async (data: ImageFormData) => {
      try {
        const result = await generate.mutateAsync({
          prompt: data.prompt,
          style: data.style || undefined,
          aspect_ratio: data.aspect_ratio || undefined,
          model: data.model || undefined,
          provider: data.provider === "auto" ? undefined : data.provider,
        });
        setGeneratedImageUrl(result.imageUrl);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    },
    [generate]
  );

  return {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    generatedImageUrl,
    isSubmitLoading: generate.isPending,
    isSubmitDisabled: !prompt,
    providers,
    modelsForProvider,
    modelsLoading,
  };
};

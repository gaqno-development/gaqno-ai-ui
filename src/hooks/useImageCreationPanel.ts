import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useImageGeneration, useImageModels } from "@/hooks/images";
import {
  useAIModelPreferences,
  useTaskStatus,
} from "@gaqno-development/frontcore/hooks/ai";

const imageFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  style: z.string().optional(),
  aspect_ratio: z.string().optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
});

export type ImageFormData = z.infer<typeof imageFormSchema>;

function imageUrlFromTaskResult(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;
  const r = result as Record<string, unknown>;
  if (
    Array.isArray(r.images) &&
    r.images[0] &&
    typeof (r.images[0] as Record<string, unknown>).url === "string"
  ) {
    return (r.images[0] as Record<string, unknown>).url as string;
  }
  if (typeof r.image_url === "string") return r.image_url;
  if (typeof r.url === "string") return r.url;
  return null;
}

export const useImageCreationPanel = () => {
  const { generate } = useImageGeneration();
  const { providers, allModels, isLoading: modelsLoading } = useImageModels();
  const [preferences] = useAIModelPreferences();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const { data: taskStatus } = useTaskStatus(currentTaskId);

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

  useEffect(() => {
    if (taskStatus?.status === "completed" && taskStatus.result) {
      const url = imageUrlFromTaskResult(taskStatus.result);
      if (url) setGeneratedImageUrl(url);
      setCurrentTaskId(null);
    }
    if (taskStatus?.status === "failed") {
      setCurrentTaskId(null);
    }
  }, [taskStatus?.status, taskStatus?.result]);

  const prompt = watch("prompt");
  const selectedProvider = watch("provider");

  const modelsForProvider =
    selectedProvider && selectedProvider !== "auto"
      ? (providers.find((p) => p.id === selectedProvider)?.models ?? []).map(
          (m) => ({ id: m.id, name: m.name })
        )
      : allModels.map((m) => ({ id: m.id, name: m.name }));

  const onSubmit = useCallback(
    async (data: ImageFormData) => {
      try {
        setGeneratedImageUrl(null);
        const result = await generate.mutateAsync({
          prompt: data.prompt,
          style: data.style ?? undefined,
          aspect_ratio: data.aspect_ratio ?? undefined,
          model: data.model ?? undefined,
          provider: data.provider === "auto" ? undefined : data.provider,
        });
        if (result.taskId) {
          setCurrentTaskId(result.taskId);
        }
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
    isSubmitLoading:
      generate.isPending ||
      Boolean(
        currentTaskId &&
        taskStatus?.status !== "completed" &&
        taskStatus?.status !== "failed"
      ),
    isSubmitDisabled: !prompt,
    providers,
    modelsForProvider,
    modelsLoading,
  };
};

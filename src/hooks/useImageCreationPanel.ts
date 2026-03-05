import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ImageProviderOrAuto } from "@/types/images/image";
import { useImageGeneration, useImageModels } from "@/hooks/images";
import { useSaveGalleryImageMutation } from "@/hooks/gallery";
import {
  useAIModelPreferences,
  useTaskStatus,
} from "@gaqno-development/frontcore/hooks/ai";
import { useGenerations } from "@/contexts/GenerationsContext";

const imageFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  style: z.string().optional(),
  aspect_ratio: z.string().optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
});

export type ImageFormData = z.infer<typeof imageFormSchema>;

export interface RecordedImage {
  id: string;
  url: string;
}

function imageUrlsFromTaskResult(result: unknown): string[] {
  if (!result || typeof result !== "object") return [];
  const r = result as Record<string, unknown>;
  if (Array.isArray(r.images)) {
    const fromImages = r.images
      .map((item) => {
        if (item && typeof item === "object" && typeof (item as Record<string, unknown>).url === "string")
          return (item as Record<string, unknown>).url as string;
        return null;
      })
      .filter((url): url is string => url !== null);
    if (fromImages.length > 0) return fromImages;
  }
  if (Array.isArray(r.urls)) {
    const fromUrls = r.urls.filter((u): u is string => typeof u === "string");
    if (fromUrls.length > 0) return fromUrls;
  }
  if (typeof r.image_url === "string") return [r.image_url];
  if (typeof r.url === "string") return [r.url];
  return [];
}

export const useImageCreationPanel = () => {
  const { generate } = useImageGeneration();
  const { providers, allModels, isLoading: modelsLoading } = useImageModels();
  const saveGalleryImage = useSaveGalleryImageMutation();
  const [preferences] = useAIModelPreferences();
  const { addJob } = useGenerations();
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [recordedImages, setRecordedImages] = useState<RecordedImage[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const { data: taskStatus } = useTaskStatus(currentTaskId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
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
      const urls = imageUrlsFromTaskResult(taskStatus.result);
      if (urls.length > 0) {
        setGeneratedImageUrls(urls);
        setSelectedImageUrl(null);
        resultsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setCurrentTaskId(null);
    }
    if (taskStatus?.status === "failed") {
      setCurrentTaskId(null);
    }
  }, [taskStatus?.status, taskStatus?.result]);

  const selectImage = useCallback(
    (url: string) => {
      setSelectedImageUrl(url);
      setRecordedImages((prev) => [{ id: crypto.randomUUID(), url }, ...prev]);
      const values = getValues();
      saveGalleryImage.mutate({
        url,
        prompt: values.prompt,
        style: values.style ?? undefined,
        aspectRatio: values.aspect_ratio ?? undefined,
        model: values.model ?? undefined,
        provider:
          values.provider && values.provider !== "auto"
            ? values.provider
            : undefined,
      });
    },
    [getValues, saveGalleryImage]
  );

  const resetToForm = useCallback(() => {
    setGeneratedImageUrls([]);
    setSelectedImageUrl(null);
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

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
        setGeneratedImageUrls([]);
        setSelectedImageUrl(null);
        const result = await generate.mutateAsync({
          prompt: data.prompt,
          style: data.style ?? undefined,
          aspect_ratio: data.aspect_ratio ?? undefined,
          model: data.model ?? undefined,
          provider:
            data.provider === "auto" ? undefined : (data.provider as ImageProviderOrAuto),
        });
        if (result.taskId) {
          setCurrentTaskId(result.taskId);
          addJob(result.taskId, "image");
        }
      } catch (error) {
        console.error("Error generating image:", error);
      }
    },
    [generate, addJob]
  );

  return {
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

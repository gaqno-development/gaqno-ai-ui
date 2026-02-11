import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VideoMode } from "@/types/videos/video-types";
import {
  useVideoModels,
  useVideoGeneration,
  useVideoUpload,
} from "@/hooks/videos";

const videoFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().min(1, "Model is required"),
  mode: z.nativeEnum(VideoMode).default(VideoMode.MODIFY_VIDEO),
});

export type VideoFormData = z.infer<typeof videoFormSchema>;

export const useVideoCreationPanel = (
  initialMode: VideoMode = VideoMode.MODIFY_VIDEO
) => {
  const [mode, setMode] = useState<VideoMode>(initialMode);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [addAudio, setAddAudio] = useState(false);
  const [addVoice, setAddVoice] = useState(false);

  const { data: models = [], isLoading: modelsLoading } = useVideoModels();
  const { generate } = useVideoGeneration();
  const uploadMutation = useVideoUpload();

  const { handleSubmit, setValue, watch } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      mode: initialMode,
      model: "",
      prompt: "",
    },
  });

  const selectedModel = watch("model");
  const prompt = watch("prompt");

  const onSubmit = useCallback(
    async (data: VideoFormData) => {
      try {
        let referenceVideoUrl: string | undefined;
        let referenceImageUrl: string | undefined;

        if (selectedVideo) {
          const uploadResult = await uploadMutation.mutateAsync({
            file: selectedVideo,
            type: "video",
          });
          referenceVideoUrl = uploadResult.url;
        }

        if (referenceImage) {
          const uploadResult = await uploadMutation.mutateAsync({
            file: referenceImage,
            type: "image",
          });
          referenceImageUrl = uploadResult.url;
        }

        await generate.mutateAsync({
          prompt: data.prompt,
          model: data.model,
          mode: data.mode,
          reference_video: referenceVideoUrl,
          reference_image: referenceImageUrl,
          settings: {
            add_audio: addAudio,
            add_voice: addVoice,
          },
        });
      } catch (error) {
        console.error("Error generating video:", error);
      }
    },
    [
      selectedVideo,
      referenceImage,
      addAudio,
      addVoice,
      uploadMutation,
      generate,
    ]
  );

  const handleSelectModifyVideo = useCallback(() => {
    setMode(VideoMode.MODIFY_VIDEO);
    setValue("mode", VideoMode.MODIFY_VIDEO);
  }, [setValue]);

  const handleSelectUseVideoReference = useCallback(() => {
    setMode(VideoMode.USE_VIDEO_REFERENCE);
    setValue("mode", VideoMode.USE_VIDEO_REFERENCE);
  }, [setValue]);

  const handleModelChange = useCallback(
    (value: string) => setValue("model", value),
    [setValue]
  );

  const handlePromptChange = useCallback(
    (value: string) => setValue("prompt", value),
    [setValue]
  );

  const handleRemoveVideo = useCallback(() => setSelectedVideo(null), []);

  const isSubmitDisabled = !selectedModel || !prompt || !selectedVideo;
  const isSubmitLoading = generate.isPending || uploadMutation.isPending;

  return {
    mode,
    selectedModel,
    prompt,
    selectedVideo,
    referenceImage,
    addAudio,
    addVoice,
    models,
    modelsLoading,
    handleSubmit,
    onSubmit,
    handleSelectModifyVideo,
    handleSelectUseVideoReference,
    handleModelChange,
    handlePromptChange,
    setSelectedVideo,
    setReferenceImage,
    setAddAudio,
    setAddVoice,
    handleRemoveVideo,
    isSubmitDisabled,
    isSubmitLoading,
  };
};

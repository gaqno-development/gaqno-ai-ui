import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAudioGeneration } from "@/hooks/audio";

const audioFormSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export type AudioFormData = z.infer<typeof audioFormSchema>;

export const useAudioCreationPanel = () => {
  const { generate } = useAudioGeneration();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AudioFormData>({
    resolver: zodResolver(audioFormSchema),
    defaultValues: { text: "" },
  });

  const text = watch("text");

  const onSubmit = useCallback(
    async (data: AudioFormData) => {
      try {
        const result = await generate.mutateAsync({ text: data.text });
        setAudioUrl(result.audioUrl);
      } catch (error) {
        console.error("Error generating audio:", error);
      }
    },
    [generate]
  );

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    audioUrl,
    isSubmitLoading: generate.isPending,
    isSubmitDisabled: !text,
  };
};

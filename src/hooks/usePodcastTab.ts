import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAudioGenerationMutations } from "@/hooks/mutations/useAudioMutations";

const schema = z.object({
  script: z.string().min(1, "Roteiro é obrigatório"),
  stability: z.coerce.number().min(0).max(1),
  similarityBoost: z.coerce.number().min(0).max(1),
  voiceId: z.string().optional(),
});
export type PodcastTabFormData = z.infer<typeof schema>;

export const usePodcastTab = () => {
  const { generate } = useAudioGenerationMutations();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PodcastTabFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      script: "",
      stability: 0.5,
      similarityBoost: 0.75,
      voiceId: "",
    },
  });

  const script = watch("script");

  const onSubmit = useCallback(
    async (data: PodcastTabFormData) => {
      const result = await generate.mutateAsync({
        text: data.script,
        stability: data.stability,
        similarityBoost: data.similarityBoost,
        voiceId: data.voiceId?.trim() || undefined,
      });
      setAudioUrl(result.audioUrl);
    },
    [generate]
  );

  const apiErrorMessage = generate.isError
    ? generate.error instanceof Error
      ? generate.error.message
      : "Erro ao gerar áudio."
    : null;

  return {
    register,
    handleSubmit,
    control,
    errors,
    watch,
    onSubmit,
    audioUrl,
    generate,
    apiErrorMessage,
    script,
  };
};

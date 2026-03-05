import React, { useRef, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { Volume2Icon } from "@gaqno-development/frontcore/components/icons";
import { useVoices } from "@/hooks/queries/useAudioQueries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAudioGenerationMutations } from "@/hooks/mutations/useAudioMutations";
import { AudioBarsVisualizer } from "../AudioBarsVisualizer";
import { GenerationLoadingCard } from "@/components/shared";
import { useScrollToResult } from "@/hooks/useScrollToResult";
import { RefreshCw } from "lucide-react";

const schema = z.object({
  text: z.string().min(1, "Text is required"),
  voiceId: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function TtsTab() {
  const { voices, isLoading } = useVoices();
  const { generate } = useAudioGenerationMutations();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  useScrollToResult(resultSectionRef, Boolean(audioUrl));

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: "", voiceId: "" },
  });
  const text = watch("text");

  useEffect(() => {
    return () => {
      if (audioUrl?.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await generate.mutateAsync({
        text: data.text,
        voiceId: data.voiceId?.trim() || undefined,
      });
      setAudioUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return result.audioUrl;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resetToForm = () => {
    setAudioUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div ref={formSectionRef}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2Icon className="h-5 w-5" size={20} />
            Text to Speech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="tts-text">Text</Label>
            <Textarea
              id="tts-text"
              {...register("text")}
              placeholder="Enter the text you want to convert to speech..."
              className="min-h-[120px]"
            />
            {errors.text && (
              <p className="text-sm text-destructive mt-1">
                {errors.text.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="tts-voice">Voice (optional)</Label>
            <Controller
              name="voiceId"
              control={control}
              render={({ field }) => (
                <Select
                  value={
                    field.value === "" || field.value == null
                      ? "__default__"
                      : field.value
                  }
                  onValueChange={(val) =>
                    field.onChange(val === "__default__" ? "" : val)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="tts-voice">
                    <SelectValue
                      placeholder={isLoading ? "Loading voices…" : "Default"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__default__">Default</SelectItem>
                    {voices.map((v) => (
                      <SelectItem key={v.voice_id} value={v.voice_id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              variant="outline"
              loading={generate.isPending}
              disabled={!text}
            >
              Generate Audio
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>

      {generate.isPending && (
        <GenerationLoadingCard
          title="Gerando áudio"
          message="Aguarde enquanto o áudio é gerado."
        />
      )}

      {audioUrl && (
        <div ref={resultSectionRef} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Áudio gerado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AudioBarsVisualizer
                state={isPlaying ? "playing" : "idle"}
                audioRef={audioRef}
                className="mb-2"
              />
              <audio
                key={audioUrl}
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full h-10"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                Your browser does not support the audio element.
              </audio>
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
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );
}

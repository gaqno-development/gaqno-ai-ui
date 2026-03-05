import React, { useEffect, useState } from "react";
import { VideoMode } from "@/types/videos/video-types";
import { VideoUploadArea } from "../VideoUploadArea";
import { ReferenceInputs } from "../ReferenceInputs";
import { PromptTextarea } from "../PromptTextarea";
import { VideoSettings } from "../VideoSettings";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { XIcon } from "@gaqno-development/frontcore/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { useVideoCreationPanel } from "@/hooks/useVideoCreationPanel";
import type { VideoCreationPanelProps } from "./types";

function VideoPreview({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!url) return null;
  return (
    <div className="relative">
      <video src={url} controls className="w-full rounded-lg max-h-[40vh]" />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={onRemove}
        aria-label="Remover vídeo"
      >
        <XIcon className="h-4 w-4" size={16} />
      </Button>
    </div>
  );
}

export const VideoCreationPanel: React.FC<VideoCreationPanelProps> = ({
  className,
  defaultMode,
}) => {
  const {
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
  } = useVideoCreationPanel(defaultMode);

  return (
    <div
      className={className}
    >
      <div className="h-full min-h-0 flex flex-col p-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:items-stretch">
        <div className="flex flex-col min-h-0 overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-md border border-input bg-background p-1">
                <Button
                  type="button"
                  variant={mode === VideoMode.MODIFY_VIDEO ? "default" : "ghost"}
                  size="sm"
                  onClick={handleSelectModifyVideo}
                >
                  Modificar vídeo
                </Button>
                <Button
                  type="button"
                  variant={
                    mode === VideoMode.USE_VIDEO_REFERENCE ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={handleSelectUseVideoReference}
                >
                  Usar referência
                </Button>
              </div>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={modelsLoading ? "Carregando..." : "Modelo"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <VideoUploadArea
              onFileSelect={setSelectedVideo}
              selectedFile={selectedVideo}
              onRemove={handleRemoveVideo}
              className="compact"
            />

            <ReferenceInputs
              referenceImage={referenceImage}
              onImageSelect={setReferenceImage}
              className="compact"
            />

            <PromptTextarea
              value={prompt}
              onChange={handlePromptChange}
              className="[&_textarea]:min-h-[80px]"
            />

            <VideoSettings
              addAudio={addAudio}
              addVoice={addVoice}
              onAddAudioChange={setAddAudio}
              onAddVoiceChange={setAddVoice}
              compact
            />

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitLoading}
              disabled={isSubmitDisabled}
            >
              Gerar vídeo
            </Button>
          </form>
        </div>

        <div className="min-h-[200px] lg:min-h-0 flex flex-col justify-center rounded-lg border border-dashed bg-muted/30 p-4 mt-4 lg:mt-0 overflow-auto">
          {selectedVideo ? (
            <VideoPreview file={selectedVideo} onRemove={handleRemoveVideo} />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Selecione um vídeo e preencha o prompt. A prévia aparecerá aqui.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

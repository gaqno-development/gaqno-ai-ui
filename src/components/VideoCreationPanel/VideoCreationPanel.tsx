import React from "react";
import { VideoMode } from "@/types/videos/video-types";
import { VideoUploadArea } from "../VideoUploadArea";
import { ReferenceInputs } from "../ReferenceInputs";
import { PromptTextarea } from "../PromptTextarea";
import { VideoSettings } from "../VideoSettings";
import { Button } from "@gaqno-development/frontcore/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { useVideoCreationPanel } from "@/hooks/useVideoCreationPanel";
import type { VideoCreationPanelProps } from "./types";

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
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-md border border-input bg-background p-1">
            <Button
              type="button"
              variant={mode === VideoMode.MODIFY_VIDEO ? "default" : "ghost"}
              size="sm"
              onClick={handleSelectModifyVideo}
            >
              Modify Video
            </Button>
            <Button
              type="button"
              variant={
                mode === VideoMode.USE_VIDEO_REFERENCE ? "default" : "ghost"
              }
              size="sm"
              onClick={handleSelectUseVideoReference}
            >
              Use Video Reference
            </Button>
          </div>

          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue
                placeholder={modelsLoading ? "Loading..." : "Select Model"}
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
        />

        <ReferenceInputs
          referenceImage={referenceImage}
          onImageSelect={setReferenceImage}
        />

        <PromptTextarea value={prompt} onChange={handlePromptChange} />

        <VideoSettings
          addAudio={addAudio}
          addVoice={addVoice}
          onAddAudioChange={setAddAudio}
          onAddVoiceChange={setAddVoice}
        />

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitLoading}
          disabled={isSubmitDisabled}
        >
          Create
        </Button>
      </form>
    </div>
  );
};

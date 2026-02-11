import React from "react";
import { Card, CardContent } from "@gaqno-development/frontcore/components/ui";
import { XIcon } from "@gaqno-development/frontcore/components/icons";
import { Upload, Video } from "lucide-react";
import { cn } from "@gaqno-development/frontcore/lib/utils";
import { useVideoUploadArea } from "@/hooks/useVideoUploadArea";
import type { VideoUploadAreaProps } from "./types";

export const VideoUploadArea: React.FC<VideoUploadAreaProps> = ({
  onFileSelect,
  selectedFile,
  onRemove,
  className,
}) => {
  const {
    isDragging,
    videoUrl,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
  } = useVideoUploadArea(onFileSelect, selectedFile);

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-6">
        {selectedFile && videoUrl ? (
          <div className="relative">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg max-h-[400px]"
            />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background border shadow-sm"
              aria-label="Remove video"
            >
              <XIcon className="h-4 w-4" size={16} />
            </button>
            <div className="mt-2 text-sm text-muted-foreground">
              {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports MP4/MOV files, 200MB max
            </p>
            <label className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              or drag and drop
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

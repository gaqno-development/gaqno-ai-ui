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

  const isCompact = className?.includes("compact");
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
      <CardContent className={isCompact ? "p-4" : "p-6"}>
        {selectedFile && videoUrl ? (
          <div className="relative">
            <video
              src={videoUrl}
              controls
              className={cn(
                "w-full rounded-lg",
                isCompact ? "max-h-[200px]" : "max-h-[400px]"
              )}
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
          <div
            className={cn(
              "flex flex-col items-center justify-center text-center",
              isCompact ? "py-6" : "py-12"
            )}
          >
            <div className={cn("rounded-full bg-muted", isCompact ? "mb-2 p-2" : "mb-4 p-4")}>
              <Video className={cn("text-muted-foreground", isCompact ? "h-5 w-5" : "h-8 w-8")} />
            </div>
            <h3 className={cn("font-semibold mb-2", isCompact ? "text-sm" : "text-lg")}>Upload Video</h3>
            <p className={cn("text-muted-foreground", isCompact ? "text-xs mb-2" : "text-sm mb-4")}>
              MP4/MOV, máx. 200MB
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

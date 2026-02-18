import { useState, useCallback, useMemo, useEffect } from "react";

const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024;

const isAcceptedVideo = (file: File) =>
  file.type.startsWith("video/") &&
  (file.type.includes("mp4") || file.type.includes("mov"));

export const useVideoUploadArea = (
  onFileSelect: (file: File) => void,
  selectedFile: File | null | undefined
) => {
  const [isDragging, setIsDragging] = useState(false);

  const videoUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const validateAndSelect = useCallback(
    (file: File) => {
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        alert("File size must be less than 200MB");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const videoFile = files.find(isAcceptedVideo);
      if (videoFile) validateAndSelect(videoFile);
    },
    [validateAndSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  return {
    isDragging,
    videoUrl,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
  };
};

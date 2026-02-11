import { useCallback, useMemo, useEffect } from "react";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const useReferenceInputs = (
  referenceImage: File | null | undefined,
  onImageSelect: (file: File | null) => void
) => {
  const imageUrl = useMemo(
    () => (referenceImage ? URL.createObjectURL(referenceImage) : null),
    [referenceImage]
  );

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && ACCEPTED_IMAGE_TYPES.some((t) => file.type.includes(t))) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleRemove = useCallback(() => onImageSelect(null), [onImageSelect]);

  return { imageUrl, handleFileInput, handleRemove };
};

import { useState, useCallback, useEffect } from "react";

export const useBlueprintCard = (
  content: string,
  isEditing: boolean,
  onSave: (content: string) => void
) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = useCallback(() => {
    onSave(editedContent);
  }, [editedContent, onSave]);

  const handleCancel = useCallback(() => {
    setEditedContent(content);
  }, [content]);

  return {
    editedContent,
    setEditedContent,
    handleSave,
    handleCancel,
  };
};

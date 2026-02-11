import { useState, useCallback } from "react";

export const useAISuggestionPopover = (
  onGenerate: () => Promise<string>,
  onAccept: (suggestion: string) => void
) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await onGenerate();
      setSuggestion(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao gerar sugestão");
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerate]);

  const handleAccept = useCallback(() => {
    if (suggestion) {
      onAccept(suggestion);
      setOpen(false);
      setSuggestion(null);
    }
  }, [suggestion, onAccept]);

  const handleGenerateAnother = useCallback(() => {
    setSuggestion(null);
    handleGenerate();
  }, [handleGenerate]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSuggestion(null);
    setError(null);
  }, []);

  const onOpenChange = useCallback((v: boolean) => {
    setOpen(v);
    if (!v) {
      setSuggestion(null);
      setError(null);
    }
  }, []);

  return {
    open,
    onOpenChange,
    isGenerating,
    suggestion,
    error,
    handleGenerate,
    handleAccept,
    handleGenerateAnother,
    handleClose,
  };
};

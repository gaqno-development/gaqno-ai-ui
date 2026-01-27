import { useState } from 'react';
import { useUIStore } from '@gaqno-development/frontcore/store/uiStore';

interface BookContextLike {
  title?: string;
  description?: string;
}

export function useWizardStepGeneration() {
  const { addNotification } = useUIStore();
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  function guardGenerateAll(
    bookContext: BookContextLike | null | undefined,
    message: string,
  ): boolean {
    if (!bookContext?.title && !bookContext?.description) {
      addNotification({
        type: 'warning',
        title: 'Informações necessárias',
        message,
        duration: 5000,
      });
      return true;
    }
    return false;
  }

  async function runWithGeneratingAll<T>(fn: () => Promise<T>): Promise<T> {
    setIsGeneratingAll(true);
    try {
      return await fn();
    } finally {
      setIsGeneratingAll(false);
    }
  }

  return {
    generatingFor,
    setGeneratingFor,
    isGeneratingAll,
    guardGenerateAll,
    runWithGeneratingAll,
  };
}

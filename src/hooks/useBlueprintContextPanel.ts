import { useMemo, useState, useEffect, useCallback } from "react";
import { useBook, useBooks } from "@/hooks/books/useBooks";
import { useBookChapters } from "@/hooks/books/useBookChapters";
import { formatPageInfo, calculatePages } from "@/utils/pageCalculator";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";

export const useBlueprintContextPanel = (bookId: string) => {
  const { book } = useBook(bookId);
  const { chapters } = useBookChapters(bookId);
  const { updateBook } = useBooks();
  const { addNotification } = useUIStore();

  const minPagesPerChapter = book?.metadata?.minPagesPerChapter ?? 5;
  const [localMinPages, setLocalMinPages] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalMinPages(book?.metadata?.minPagesPerChapter ?? 5);
  }, [book?.metadata?.minPagesPerChapter]);

  const totalWords = useMemo(
    () => chapters.reduce((sum, chapter) => sum + chapter.word_count, 0),
    [chapters]
  );

  const totalPages = useMemo(
    () => calculatePages(totalWords, book?.genre),
    [totalWords, book?.genre]
  );

  const handleSaveMinPages = useCallback(async () => {
    if (!book) return;
    setIsSaving(true);
    try {
      const result = await updateBook(bookId, {
        metadata: { ...book.metadata, minPagesPerChapter: localMinPages },
      });
      if (result.success) {
        addNotification({
          type: "success",
          title: "Configuração salva",
          message: `Páginas mínimas por capítulo atualizado para ${localMinPages}.`,
          duration: 3000,
        });
      } else {
        throw new Error(result.error ?? "Erro ao salvar");
      }
    } catch (err: unknown) {
      addNotification({
        type: "error",
        title: "Erro ao salvar",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível salvar a configuração.",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [book, bookId, localMinPages, updateBook, addNotification]);

  return {
    book,
    chapters,
    totalWords,
    totalPages,
    minPagesPerChapter,
    localMinPages,
    setLocalMinPages,
    isSaving,
    handleSaveMinPages,
    formatPageInfo,
  };
};

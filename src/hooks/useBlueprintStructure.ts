import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBookChapters } from "@/hooks/books/useBookChapters";
import { ChapterStatus } from "@/types/books/books";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";

export const SECTION_NAMES: Record<string, string> = {
  introdução: "Introdução",
  introduction: "Introdução",
  desenvolvimento: "Desenvolvimento",
  development: "Desenvolvimento",
  clímax: "Clímax",
  climax: "Clímax",
  conclusão: "Conclusão",
  conclusion: "Conclusão",
};

export const SECTION_ORDER = [
  "introdução",
  "desenvolvimento",
  "clímax",
  "conclusão",
  "outros",
];

type ChapterLike = {
  number?: number;
  chapter_number?: number;
  title?: string;
  summary?: string;
};
type SectionLike = { chapters?: ChapterLike[]; name?: string };

export const useBlueprintStructure = (
  bookId: string,
  structure: Record<string, unknown> | null | undefined
) => {
  const navigate = useNavigate();
  const { chapters, createChapter, isCreating } = useBookChapters(bookId);
  const { addNotification } = useUIStore();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["introdução", "desenvolvimento", "clímax", "conclusão"])
  );
  const [creatingChapterNumber, setCreatingChapterNumber] = useState<
    number | null
  >(null);
  const [generatingContent, setGeneratingContent] = useState<number | null>(
    null
  );

  const blueprintChapters = (structure?.chapters as ChapterLike[]) ?? [];
  const blueprintSections = structure?.sections as
    | Record<string, SectionLike>
    | undefined;

  const groupedBySection = useMemo(() => {
    const chaptersMap = new Map(chapters.map((c) => [c.chapter_number, c]));
    const groups: Record<
      string,
      Array<{ chapter: ChapterLike; index: number; existingChapter?: unknown }>
    > = {};

    if (blueprintSections) {
      Object.entries(blueprintSections).forEach(([sectionKey, sectionData]) => {
        const sectionChapters = sectionData?.chapters ?? [];
        sectionChapters.forEach((chapter: ChapterLike, index: number) => {
          const chapterNumber = chapter.number ?? chapter.chapter_number;
          const existingChapter = chaptersMap.get(chapterNumber as number);
          if (!existingChapter) {
            if (!groups[sectionKey]) groups[sectionKey] = [];
            groups[sectionKey].push({ chapter, index, existingChapter });
          }
        });
      });
    } else {
      blueprintChapters.forEach((chapter: ChapterLike, index: number) => {
        const chapterNumber =
          chapter.number ?? chapter.chapter_number ?? index + 1;
        const existingChapter = chaptersMap.get(chapterNumber);
        if (!existingChapter) {
          let sectionKey = "outros";
          const titleLower = (chapter.title ?? "").toLowerCase();
          if (
            titleLower.includes("introdução") ||
            titleLower.includes("introduction") ||
            chapterNumber === 1
          ) {
            sectionKey = "introdução";
          } else if (
            titleLower.includes("desenvolvimento") ||
            titleLower.includes("development")
          ) {
            sectionKey = "desenvolvimento";
          } else if (
            titleLower.includes("clímax") ||
            titleLower.includes("climax")
          ) {
            sectionKey = "clímax";
          } else if (
            titleLower.includes("conclusão") ||
            titleLower.includes("conclusion")
          ) {
            sectionKey = "conclusão";
          }
          if (!groups[sectionKey]) groups[sectionKey] = [];
          groups[sectionKey].push({ chapter, index, existingChapter });
        }
      });
    }
    return groups;
  }, [blueprintChapters, blueprintSections, chapters]);

  const handleChapterClick = useCallback(
    async (chapterNumber: number, chapterData: ChapterLike) => {
      const existingChapter = chapters.find(
        (c) => c.chapter_number === chapterNumber
      );
      if (existingChapter) {
        navigate(`/ai/books/${bookId}/chapters?chapter=${existingChapter.id}`);
        return;
      }
      setCreatingChapterNumber(chapterNumber);
      const result = await createChapter({
        book_id: bookId,
        chapter_number: chapterNumber,
        title: chapterData.title ?? null,
        content: null,
        status: ChapterStatus.DRAFT,
        notes: chapterData.summary ?? null,
      });
      setCreatingChapterNumber(null);
      if (!result.success || !result.data) {
        addNotification({
          type: "error",
          title: "Erro ao criar capítulo",
          message:
            result.error ??
            "Não foi possível criar o capítulo. Tente novamente.",
          duration: 5000,
        });
        return;
      }
      addNotification({
        type: "success",
        title: "Capítulo criado!",
        message: `Capítulo ${chapterNumber} foi criado. Redirecionando para edição...`,
        duration: 2000,
      });
      navigate(
        `/ai/books/${bookId}/chapters?chapter=${result.data.id}&generate=true`
      );
    },
    [bookId, chapters, createChapter, navigate, addNotification]
  );

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }, []);

  return {
    blueprintChapters,
    blueprintSections,
    openSections,
    creatingChapterNumber,
    generatingContent,
    groupedBySection,
    handleChapterClick,
    toggleSection,
    isCreating,
  };
};

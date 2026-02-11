import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBookChapters } from "@/hooks/books/useBookChapters";
import { useBookCharacters } from "@/hooks/books/useBookCharacters";
import { ChapterStatus } from "@/types/books/books";

export const useBookStructureMap = (bookId: string) => {
  const navigate = useNavigate();
  const {
    chapters,
    isLoading: chaptersLoading,
    createChapter,
  } = useBookChapters(bookId);
  const {
    characters,
    isLoading: charactersLoading,
    createCharacter,
  } = useBookCharacters(bookId);
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");

  const handleChapterClick = useCallback(
    (chapterId: string) => {
      navigate(`/ai/books/${bookId}/chapters?chapter=${chapterId}`);
    },
    [bookId, navigate]
  );

  const handleCreateChapter = useCallback(async () => {
    const nextChapterNumber =
      chapters.length > 0
        ? Math.max(...chapters.map((c) => c.chapter_number)) + 1
        : 1;
    const result = await createChapter({
      book_id: bookId,
      chapter_number: nextChapterNumber,
      title: chapterTitle || null,
      content: null,
      status: ChapterStatus.DRAFT,
    });
    if (result.success) {
      setShowChapterDialog(false);
      setChapterTitle("");
    } else {
      alert(`Erro ao criar capítulo: ${result.error}`);
    }
  }, [bookId, chapters, chapterTitle, createChapter]);

  const handleCreateCharacter = useCallback(async () => {
    const result = await createCharacter({
      book_id: bookId,
      name: characterName,
      description: characterDescription || null,
    });
    if (result.success) {
      setShowCharacterDialog(false);
      setCharacterName("");
      setCharacterDescription("");
    } else {
      alert(`Erro ao criar personagem: ${result.error}`);
    }
  }, [bookId, characterName, characterDescription, createCharacter]);

  return {
    chapters,
    chaptersLoading,
    characters,
    charactersLoading,
    showChapterDialog,
    setShowChapterDialog,
    showCharacterDialog,
    setShowCharacterDialog,
    chapterTitle,
    setChapterTitle,
    characterName,
    setCharacterName,
    characterDescription,
    setCharacterDescription,
    handleChapterClick,
    handleCreateChapter,
    handleCreateCharacter,
    navigate,
  };
};

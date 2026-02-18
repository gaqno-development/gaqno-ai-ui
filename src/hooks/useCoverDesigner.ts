import { useState, useCallback } from "react";
import { useBookCovers, useBookActiveCover } from "@/hooks/books/useBookCover";
import { useBook } from "@/hooks/books/useBooks";

export const useCoverDesigner = (bookId: string) => {
  const { book } = useBook(bookId);
  const { cover } = useBookActiveCover(bookId);
  const { createCover } = useBookCovers(bookId);
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState("Autor");

  const handleGenerateAI = useCallback(async () => {
    const result = await createCover({
      book_id: bookId,
      design_data: { title, author },
      is_active: true,
    });
    if (result.success) {
      alert("Capa gerada com sucesso!");
    }
  }, [bookId, title, author, createCover]);

  return {
    book,
    cover,
    title,
    setTitle,
    author,
    setAuthor,
    handleGenerateAI,
  };
};

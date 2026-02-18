import { useState, useCallback } from "react";
import { useBookBlueprint } from "@/hooks/books/useBookBlueprint";
import { useBook } from "@/hooks/books/useBooks";
import type { IBook } from "@/types/books/books";

const DEFAULT_CHAPTERS = [
  {
    number: 1,
    title: "O Início",
    summary: "Abertura da história e apresentação dos personagens principais",
  },
  {
    number: 2,
    title: "O Mundo",
    summary: "Estabelecimento do cenário e contexto",
  },
  {
    number: 3,
    title: "O Desafio",
    summary: "Primeiros obstáculos e desenvolvimento da trama",
  },
  {
    number: 4,
    title: "As Consequências",
    summary: "Desenvolvimento dos conflitos",
  },
  {
    number: 5,
    title: "A Escalada",
    summary: "Intensificação dos problemas",
  },
  {
    number: 6,
    title: "O Confronto",
    summary: "Ponto alto da história e resolução dos conflitos principais",
  },
  {
    number: 7,
    title: "A Revelação",
    summary: "Descobertas importantes",
  },
  {
    number: 8,
    title: "O Desfecho",
    summary: "Resolução final e conclusão da história",
  },
];

const DEFAULT_SECTIONS = {
  introdução: {
    name: "Introdução",
    chapters: [
      {
        number: 1,
        title: "O Início",
        summary:
          "Abertura da história e apresentação dos personagens principais",
      },
      {
        number: 2,
        title: "O Mundo",
        summary: "Estabelecimento do cenário e contexto",
      },
    ],
  },
  desenvolvimento: {
    name: "Desenvolvimento",
    chapters: [
      {
        number: 3,
        title: "O Desafio",
        summary: "Primeiros obstáculos e desenvolvimento da trama",
      },
      {
        number: 4,
        title: "As Consequências",
        summary: "Desenvolvimento dos conflitos",
      },
      {
        number: 5,
        title: "A Escalada",
        summary: "Intensificação dos problemas",
      },
    ],
  },
  clímax: {
    name: "Clímax",
    chapters: [
      {
        number: 6,
        title: "O Confronto",
        summary: "Ponto alto da história e resolução dos conflitos principais",
      },
      {
        number: 7,
        title: "A Revelação",
        summary: "Descobertas importantes",
      },
    ],
  },
  conclusão: {
    name: "Conclusão",
    chapters: [
      {
        number: 8,
        title: "O Desfecho",
        summary: "Resolução final e conclusão da história",
      },
    ],
  },
};

const buildDefaultBlueprintInput = (bookId: string, book: IBook | null) => ({
  book_id: bookId,
  summary: `Resumo do livro "${book?.title ?? ""}". ${book?.description ?? ""}`,
  structure: {
    sections: DEFAULT_SECTIONS,
    chapters: DEFAULT_CHAPTERS,
  },
  characters: [],
  context: {
    genre: book?.genre ?? "",
    style: book?.style ?? "",
  },
});

export const useBlueprintContent = (bookId: string) => {
  const { updateBlueprint, createBlueprint, isUpdating, isCreating } =
    useBookBlueprint(bookId);
  const { book } = useBook(bookId);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerateBlueprint = useCallback(async () => {
    const result = await createBlueprint(
      buildDefaultBlueprintInput(bookId, book ?? null)
    );
    if (!result.success) {
      alert(`Erro ao gerar blueprint: ${result.error}`);
    }
  }, [bookId, book, createBlueprint]);

  const handleSave = useCallback(
    (content: string) => {
      updateBlueprint(bookId, { summary: content });
      setIsEditing(false);
    },
    [bookId, updateBlueprint]
  );

  const handleToggleEdit = useCallback(() => setIsEditing((e) => !e), []);

  return {
    book,
    isEditing,
    isUpdating,
    isCreating,
    handleGenerateBlueprint,
    handleSave,
    handleToggleEdit,
  };
};

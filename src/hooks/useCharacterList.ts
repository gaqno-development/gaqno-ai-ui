import { useState, useCallback } from "react";
import { useBookCharacters } from "@/hooks/books/useBookCharacters";

const ROLE_LABELS: Record<string, string> = {
  protagonist: "Protagonista",
  antagonist: "Antagonista",
  supporting: "Coadjuvante",
};

export const getRoleLabel = (role: string | undefined): string =>
  ROLE_LABELS[role ?? ""] ?? "Secundário";

export const useCharacterList = (bookId: string) => {
  const { characters, isLoading, createCharacter } = useBookCharacters(bookId);
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = useCallback(async () => {
    const result = await createCharacter({
      book_id: bookId,
      name,
      description: description || null,
    });
    if (result.success) {
      setShowDialog(false);
      setName("");
      setDescription("");
    } else {
      alert(`Erro ao criar personagem: ${result.error}`);
    }
  }, [bookId, name, description, createCharacter]);

  return {
    characters,
    isLoading,
    showDialog,
    setShowDialog,
    name,
    setName,
    description,
    setDescription,
    handleCreate,
    getRoleLabel,
  };
};

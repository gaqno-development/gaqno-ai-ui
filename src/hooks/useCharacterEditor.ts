import { useState, useEffect, useCallback } from "react";
import { useBookCharacters } from "@/hooks/books/useBookCharacters";
import { useBook } from "@/hooks/books/useBooks";
import { useBookBlueprint } from "@/hooks/books/useBookBlueprint";
import { aiApi } from "@/utils/api/aiApi";
import { useAuth } from "@gaqno-development/frontcore/contexts";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import type { ICharacterDetails } from "@/types/books/character";

export const useCharacterEditor = (bookId: string, characterId?: string) => {
  const { user } = useAuth();
  const { characters, updateCharacter, isLoading } = useBookCharacters(bookId);
  const { book } = useBook(bookId);
  const { blueprint } = useBookBlueprint(bookId);
  const { addNotification } = useUIStore();

  const character = characterId
    ? characters.find((c) => c.id === characterId)
    : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [characterDetails, setCharacterDetails] =
    useState<ICharacterDetails | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description ?? "");
      setAvatarUrl(character.avatar_url ?? null);
      const details = character.metadata?.characterDetails;
      if (details) setCharacterDetails(details as ICharacterDetails);
    }
  }, [character]);

  const updateCharacterDetails = useCallback(
    (partial: Partial<ICharacterDetails>) => {
      setCharacterDetails((prev) => (prev ? { ...prev, ...partial } : prev));
    },
    []
  );

  const handleAnalyzeCharacter = useCallback(async () => {
    if (!name.trim()) {
      addNotification({
        type: "error",
        title: "Nome obrigatório",
        message: "O personagem precisa ter um nome para ser analisado.",
        duration: 3000,
      });
      return;
    }
    setIsAnalyzing(true);
    try {
      if (!user) throw new Error("Você precisa estar autenticado");
      const data = await aiApi.analyzeCharacter({
        characterName: name,
        characterDescription: description || undefined,
        bookContext: {
          title: book?.title ?? "",
          genre: book?.genre ?? undefined,
          style: book?.style ?? undefined,
          summary: blueprint?.summary ?? book?.description ?? undefined,
        },
      });
      if (data?.characterDetails) {
        setCharacterDetails(data.characterDetails as ICharacterDetails);
        addNotification({
          type: "success",
          title: "Personagem analisado!",
          message: "Os detalhes do personagem foram gerados com sucesso.",
          duration: 3000,
        });
      }
    } catch (err: unknown) {
      addNotification({
        type: "error",
        title: "Erro ao analisar personagem",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível analisar o personagem.",
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [name, description, book, blueprint, user, addNotification]);

  const handleGenerateAvatar = useCallback(async () => {
    if (!characterDetails?.avatarPrompt && !name) {
      addNotification({
        type: "error",
        title: "Análise necessária",
        message: "Analise o personagem primeiro para gerar o avatar.",
        duration: 3000,
      });
      return;
    }
    setIsGeneratingAvatar(true);
    try {
      if (!user) throw new Error("Você precisa estar autenticado");
      const data = await aiApi.generateCharacterAvatar({
        characterName: name,
        characterDescription: description || undefined,
      });
      if (data?.imageUrl) {
        setAvatarUrl(data.imageUrl);
        addNotification({
          type: "success",
          title: "Avatar gerado!",
          message: "O avatar do personagem foi gerado com sucesso.",
          duration: 3000,
        });
      } else if (data?.avatarPrompt) {
        addNotification({
          type: "info",
          title: "Prompt gerado",
          message:
            "O prompt foi gerado. Use-o para criar o avatar manualmente.",
          duration: 3000,
        });
      }
    } catch (err: unknown) {
      addNotification({
        type: "error",
        title: "Erro ao gerar avatar",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível gerar o avatar.",
        duration: 5000,
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  }, [name, description, characterDetails, user, addNotification]);

  const handleSave = useCallback(async () => {
    if (!characterId) return;
    const metadata = {
      ...character?.metadata,
      characterDetails: characterDetails ?? undefined,
    };
    const result = await updateCharacter(characterId, {
      name,
      description: description || null,
      avatar_url: avatarUrl || null,
      metadata,
    });
    if (result.success) {
      addNotification({
        type: "success",
        title: "Personagem salvo!",
        message: "As alterações foram salvas com sucesso.",
        duration: 3000,
      });
    } else {
      addNotification({
        type: "error",
        title: "Erro ao salvar",
        message: result.error ?? "Não foi possível salvar as alterações.",
        duration: 5000,
      });
    }
  }, [
    characterId,
    character?.metadata,
    characterDetails,
    name,
    description,
    avatarUrl,
    updateCharacter,
    addNotification,
  ]);

  return {
    character,
    name,
    setName,
    description,
    setDescription,
    isAnalyzing,
    isGeneratingAvatar,
    isLoading,
    characterDetails,
    avatarUrl,
    updateCharacterDetails,
    handleAnalyzeCharacter,
    handleGenerateAvatar,
    handleSave,
  };
};

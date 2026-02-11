import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "@/hooks/books/useBooks";
import { useCreateBookWizard } from "@/hooks/books/useCreateBookWizard";
import { BookStatus } from "@/types/books/books";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import { useAuth } from "@gaqno-development/frontcore/contexts";
import { useAIModelPreferences } from "@gaqno-development/frontcore/hooks/ai";
import { aiApi } from "@/utils/api/aiApi";
import { useBooksMutations } from "@/hooks/mutations/useBooksMutations";
import { useBookSettingsMutations } from "@/hooks/mutations/useBookSettingsMutations";
import { useBookItemsMutations } from "@/hooks/mutations/useBookItemsMutations";
import { useBookToneStyleMutations } from "@/hooks/mutations/useBookToneStyleMutations";

function normalizeBlueprintResponse(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const summaryRaw = obj.summary;
  if (typeof summaryRaw === "string" && summaryRaw.includes("```")) {
    const jsonBlock = summaryRaw
      .match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]
      ?.trim();
    if (jsonBlock) {
      try {
        const inner = JSON.parse(jsonBlock) as Record<string, unknown>;
        return {
          title: obj.title ?? inner.title,
          genre: obj.genre ?? inner.genre,
          summary:
            typeof inner.summary === "string" ? inner.summary : summaryRaw,
          description: inner.description ?? obj.description,
          chapters: inner.chapters ?? obj.chapters,
          sections: inner.sections ?? obj.sections,
          characters: inner.characters ?? obj.characters,
          context: inner.context ?? obj.context,
          structure:
            inner.structure ??
            obj.structure ??
            (inner.chapters || inner.plot_summary
              ? {
                  chapters: inner.chapters,
                  plot_summary: inner.plot_summary,
                  main_conflict: inner.main_conflict,
                  initial_chapters: inner.initial_chapters,
                }
              : obj.structure),
        };
      } catch {
        // keep raw if parse fails
      }
    }
  }
  return obj as Record<string, unknown>;
}

export const STEP_TITLES = [
  "Informações Básicas",
  "Mundo e Ambientação",
  "Personagens",
  "Itens Importantes",
  "Tom e Estilo",
  "Estrutura Inicial",
];

export const useCreateBookWizardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBook, isCreating } = useBooks();
  const { addNotification } = useUIStore();
  const [preferences] = useAIModelPreferences();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  const booksMutations = useBooksMutations();
  const settingsMutations = useBookSettingsMutations();
  const itemsMutations = useBookItemsMutations();
  const toneStyleMutations = useBookToneStyleMutations();

  const wizard = useCreateBookWizard();
  const { form, saveDraft, loadDraft, clearDraft } = wizard;

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  useEffect(() => {
    if (preferences.text?.model && !selectedModel) {
      setSelectedModel(preferences.text.model);
    }
  }, [preferences.text?.model, selectedModel]);

  const formValues = form.watch();
  const bookContext = {
    title: formValues.title || undefined,
    genre: selectedGenre || formValues.genre || undefined,
    description: formValues.description || undefined,
  };

  const handleGenerateCompleteBlueprint = useCallback(async () => {
    const genre = selectedGenre || formValues.genre;
    if (!genre?.trim()) {
      addNotification({
        type: "warning",
        title: "Gênero necessário",
        message:
          "Selecione um gênero (ex.: fantasia, ficção, romance) para gerar o blueprint com IA.",
        duration: 5000,
      });
      return;
    }
    try {
      const data = await aiApi.generateBlueprint({
        title: formValues.title?.trim() || undefined,
        genre: genre.trim(),
        description: formValues.description?.trim() || undefined,
      });
      const blueprint = normalizeBlueprintResponse(data?.blueprint || data);
      const context = blueprint?.context || {};

      if (blueprint?.title) form.setValue("title", blueprint.title);
      if (blueprint?.genre) setSelectedGenre(blueprint.genre);
      if (blueprint?.summary || blueprint?.description) {
        form.setValue(
          "description",
          blueprint.summary || blueprint.description || ""
        );
      }

      const settingsArray = context.setting || context.settings || [];
      if (Array.isArray(settingsArray) && settingsArray.length > 0) {
        const newSettings = settingsArray.map(
          (s: Record<string, unknown>, idx: number) => {
            let description = (s.description || s.summary || "") as string;
            if (s.importance && !description.includes(String(s.importance))) {
              description += description
                ? `\n\nImportância: ${s.importance}`
                : String(s.importance);
            }
            return {
              id: `temp-${Date.now()}-${idx}`,
              name: (s.name as string) || `Cenário ${idx + 1}`,
              description: description.trim(),
              timeline_summary: (s.timeline_summary ||
                s.timeline ||
                s.historical_context ||
                "") as string,
            };
          }
        );
        wizard.setSettings(newSettings);
      }

      const charactersData = blueprint?.characters || [];
      if (Array.isArray(charactersData) && charactersData.length > 0) {
        const newCharacters = charactersData.map(
          (char: Record<string, unknown>, idx: number) => {
            let description = (char.description ||
              char.backstory ||
              char.summary ||
              "") as string;
            const parts: string[] = [];
            if (char.personality)
              parts.push(`Personalidade: ${char.personality}`);
            if (char.motivations) parts.push(`Motivações: ${char.motivations}`);
            if (char.physical_description)
              parts.push(`Aparência: ${char.physical_description}`);
            if (char.arc) parts.push(`Arco narrativo: ${char.arc}`);
            if (parts.length > 0)
              description = description
                ? `${description}\n\n${parts.join("\n")}`
                : parts.join("\n");
            let role = char.role as string | undefined;
            if (!role) {
              const nameLower = ((char.name as string) || "").toLowerCase();
              if (
                nameLower.includes("protagonist") ||
                nameLower.includes("protagonista") ||
                idx === 0
              )
                role = "protagonist";
              else if (
                nameLower.includes("antagonist") ||
                nameLower.includes("antagonista") ||
                idx === 1
              )
                role = "antagonist";
              else role = "supporting";
            }
            return {
              id: `temp-${Date.now()}-${idx}`,
              name: (char.name as string) || `Personagem ${idx + 1}`,
              description: description.trim(),
              role,
            };
          }
        );
        wizard.setCharacters(newCharacters);
      }

      const itemsArray = context.item || context.items || [];
      if (Array.isArray(itemsArray) && itemsArray.length > 0) {
        const newItems = itemsArray.map(
          (item: Record<string, unknown>, idx: number) => ({
            id: `temp-${Date.now()}-${idx}`,
            name: (item.name as string) || `Item ${idx + 1}`,
            function: (item.function ||
              item.narrative_function ||
              item.role ||
              "") as string,
            origin: (item.origin || item.source || "") as string,
            relevance: (item.relevance ||
              item.importance ||
              item.significance ||
              "") as string,
          })
        );
        wizard.setItems(newItems);
      }

      if (context.tone) form.setValue("narrative_tone", context.tone as string);
      if (context.pacing) form.setValue("pacing", context.pacing as string);
      if (context.target_audience)
        form.setValue("target_audience", context.target_audience as string);
      if (context.central_themes)
        form.setValue("central_themes", context.central_themes as string);
      else if (Array.isArray(context.themes))
        form.setValue(
          "central_themes",
          (context.themes as string[]).join(", ")
        );

      const structureData = (blueprint?.structure || {}) as Record<
        string,
        unknown
      >;
      if (
        structureData.plot_summary ||
        structureData.main_conflict ||
        structureData.initial_chapters
      ) {
        wizard.setStructure({
          plotSummary: (structureData.plot_summary as string) || "",
          initialChapters: (structureData.initial_chapters as string) || "",
          mainConflict: (structureData.main_conflict as string) || "",
        });
      }

      addNotification({
        type: "success",
        title: "Blueprint completo gerado!",
        message:
          "Todos os steps foram preenchidos. Navegue entre os steps para revisar e editar.",
        duration: 5000,
      });
    } catch (err: unknown) {
      addNotification({
        type: "error",
        title: "Erro ao gerar blueprint",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível gerar o blueprint completo.",
        duration: 5000,
      });
    }
  }, [formValues, selectedGenre, form, wizard, addNotification]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      saveDraft();
      addNotification({
        type: "success",
        title: "Rascunho salvo",
        message: "Seu progresso foi salvo localmente.",
        duration: 3000,
      });
    } catch (err: unknown) {
      addNotification({
        type: "error",
        title: "Erro ao salvar rascunho",
        message:
          err instanceof Error
            ? err.message
            : "Não foi possível salvar o rascunho.",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [saveDraft, addNotification]);

  const handleCreateBook = useCallback(async () => {
    if (!formValues.title?.trim()) {
      addNotification({
        type: "error",
        title: "Título obrigatório",
        message: "O título do livro é obrigatório para criar o livro.",
        duration: 5000,
      });
      return;
    }
    setIsCreatingBook(true);
    try {
      if (!user) throw new Error("Usuário não autenticado");
      const bookResult = await booksMutations.create.mutateAsync({
        title: formValues.title,
        genre: selectedGenre || formValues.genre || null,
        description: formValues.description || null,
        style: formValues.narrative_tone || null,
        status: BookStatus.DRAFT,
      });
      const bookId = bookResult.id;
      await Promise.all([
        ...wizard.settings.map((s) =>
          settingsMutations.create.mutateAsync({
            book_id: bookId,
            name: s.name,
            description: s.description || null,
            timeline_summary: s.timeline_summary || null,
          })
        ),
        ...wizard.items.map((i) =>
          itemsMutations.create.mutateAsync({
            book_id: bookId,
            name: i.name,
            function: i.function || null,
            origin: i.origin || null,
            relevance: i.relevance || null,
          })
        ),
        toneStyleMutations.create.mutateAsync({
          book_id: bookId,
          narrative_tone: formValues.narrative_tone || null,
          pacing: formValues.pacing || null,
          target_audience: formValues.target_audience || null,
          central_themes: formValues.central_themes || null,
        }),
        ...wizard.characters.map((c) =>
          booksMutations.createCharacter.mutateAsync({
            bookId,
            data: {
              name: c.name,
              description: c.description || null,
              avatar_url: null,
              metadata: c.role ? { role: c.role } : {},
            },
          })
        ),
      ]);
      clearDraft();
      addNotification({
        type: "success",
        title: "Livro criado com sucesso!",
        message: "Redirecionando...",
        duration: 3000,
      });
      setTimeout(() => navigate(`/ai/books/${bookId}`), 500);
    } catch (err: unknown) {
      addNotification({
        type: "error",
        title: "Erro ao criar livro",
        message:
          err instanceof Error
            ? err.message
            : "Ocorreu um erro inesperado. Tente novamente.",
        duration: 5000,
      });
      setIsCreatingBook(false);
    }
  }, [
    formValues,
    selectedGenre,
    user,
    wizard,
    booksMutations,
    settingsMutations,
    itemsMutations,
    toneStyleMutations,
    clearDraft,
    addNotification,
    navigate,
  ]);

  return {
    ...wizard,
    form,
    selectedGenre,
    setSelectedGenre,
    selectedModel,
    setSelectedModel,
    isSaving,
    isCreatingBook,
    isCreating,
    formValues,
    bookContext,
    handleGenerateCompleteBlueprint,
    handleSaveDraft,
    handleCreateBook,
    STEP_TITLES,
  };
};

import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import { aiApi } from "@/utils/api/aiApi";
import type {
  ICharacter,
  ICharactersStepProps,
} from "@/components/CreateBookWizard/CharactersStep/types";
import { useWizardStepGeneration } from "@/hooks/useWizardStepGeneration";

export function useCharactersStep({
  characters,
  onCharactersChange,
  bookContext,
}: ICharactersStepProps) {
  const { addNotification } = useUIStore();
  const {
    generatingFor,
    setGeneratingFor,
    isGeneratingAll,
    guardGenerateAll,
    runWithGeneratingAll,
  } = useWizardStepGeneration();

  const handleAddCharacter = () => {
    const newCharacter: ICharacter = {
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      role: "supporting",
    };
    onCharactersChange([...characters, newCharacter]);
  };

  const handleRemoveCharacter = (id: string) => {
    onCharactersChange(characters.filter((c) => c.id !== id));
  };

  const handleUpdateCharacter = (
    id: string,
    field: keyof ICharacter,
    value: string
  ) => {
    onCharactersChange(
      characters.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleGenerateCharacterDetails = async (
    characterId: string,
    characterName: string
  ): Promise<string> => {
    setGeneratingFor(characterId);
    try {
      const data = await aiApi.analyzeCharacter({
        characterName,
        characterDescription:
          characters.find((c) => c.id === characterId)?.description ??
          undefined,
        bookContext: {
          title: bookContext?.title ?? "Novo Livro",
          genre: bookContext?.genre ?? undefined,
          style: undefined,
          summary: bookContext?.description ?? undefined,
        },
      });
      if (data?.characterDetails) {
        const details = data.characterDetails;
        const description = [
          details.backstory ? `Backstory: ${details.backstory}` : "",
          details.traits?.physical?.length
            ? `Traits: ${details.traits.physical.join(", ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");
        return description || characterName;
      }
      return characterName;
    } catch (err: unknown) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "Erro ao gerar detalhes do personagem"
      );
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGenerateAll = async () => {
    if (
      guardGenerateAll(
        bookContext,
        "Preencha pelo menos o título ou a premissa do livro antes de gerar personagens."
      )
    )
      return;
    await runWithGeneratingAll(async () => {
      try {
        const prompt = `Baseado no livro "${bookContext?.title ?? "Novo Livro"}" ${bookContext?.genre ? `do gênero ${bookContext.genre}` : ""}, ${bookContext?.description ? `com a premissa: ${bookContext.description.substring(0, 200)}` : ""}. Gere um elenco inicial de 3 a 5 personagens principais. Para cada personagem, forneça: nome, papel na história (protagonista, antagonista, coadjuvante, secundário), descrição física, personalidade, motivações e arco narrativo inicial.`;
        const data = await aiApi.generateBlueprint({
          title: bookContext?.title ?? "Novo Livro",
          genre: bookContext?.genre ?? "fiction",
          description: prompt,
        });
        const blueprint = data?.blueprint ?? data;
        const charactersData = blueprint?.characters ?? [];

        if (Array.isArray(charactersData) && charactersData.length > 0) {
          const newCharacters: ICharacter[] = (
            charactersData as Array<Record<string, unknown>>
          ).map((char, idx) => {
            let description = (char.description ??
              char.backstory ??
              char.summary ??
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
              const nameLower = ((char.name as string) ?? "").toLowerCase();
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
              name: (char.name as string) ?? `Personagem ${idx + 1}`,
              description: description.trim(),
              role,
            };
          });
          onCharactersChange(newCharacters);
        } else {
          const newCharacters: ICharacter[] = [
            {
              id: `temp-${Date.now()}-1`,
              name: "Protagonista",
              description: "O personagem principal da história.",
              role: "protagonist",
            },
            {
              id: `temp-${Date.now()}-2`,
              name: "Antagonista",
              description: "O personagem que se opõe ao protagonista.",
              role: "antagonist",
            },
            {
              id: `temp-${Date.now()}-3`,
              name: "Coadjuvante",
              description: "Um personagem importante que apoia o protagonista.",
              role: "supporting",
            },
          ];
          onCharactersChange(newCharacters);
        }
        addNotification({
          type: "success",
          title: "Personagens gerados!",
          message:
            "O elenco inicial foi gerado com sucesso. Você pode editá-los conforme necessário.",
          duration: 3000,
        });
      } catch (err: unknown) {
        addNotification({
          type: "error",
          title: "Erro ao gerar personagens",
          message:
            err instanceof Error
              ? err.message
              : "Não foi possível gerar os personagens automaticamente.",
          duration: 5000,
        });
      }
    });
  };

  return {
    generatingFor,
    isGeneratingAll,
    handleAddCharacter,
    handleRemoveCharacter,
    handleUpdateCharacter,
    handleGenerateCharacterDetails,
    handleGenerateAll,
  };
}

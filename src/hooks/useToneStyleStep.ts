import { useFormContext } from "react-hook-form";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import { aiApi } from "@/utils/api/aiApi";
import type { IToneStyleStepProps } from "@/components/CreateBookWizard/ToneStyleStep/types";
import { useWizardStepGeneration } from "@/hooks/useWizardStepGeneration";

export function useToneStyleStep({ bookContext }: IToneStyleStepProps) {
  const { addNotification } = useUIStore();
  const { register, setValue } = useFormContext();
  const {
    generatingFor,
    setGeneratingFor,
    isGeneratingAll,
    guardGenerateAll,
    runWithGeneratingAll,
  } = useWizardStepGeneration();

  const handleGenerateTone = async (): Promise<string> => {
    setGeneratingFor("tone");
    try {
      const data = await aiApi.generateBlueprint({
        title: bookContext?.title ?? "Novo Livro",
        genre: bookContext?.genre ?? "fiction",
        description: `Sugira um tom narrativo apropriado para: ${bookContext?.description ?? "um livro"}`,
      });
      const generated =
        data?.blueprint?.summary ?? data?.summary ?? "equilibrado";
      return typeof generated === "string"
        ? generated.substring(0, 50)
        : "equilibrado";
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Erro ao gerar tom");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGeneratePacing = async (): Promise<string> => {
    setGeneratingFor("pacing");
    try {
      const data = await aiApi.generateBlueprint({
        title: bookContext?.title ?? "Novo Livro",
        genre: bookContext?.genre ?? "fiction",
        description: `Sugira um ritmo narrativo apropriado para: ${bookContext?.description ?? "um livro"}`,
      });
      const generated =
        data?.blueprint?.summary ?? data?.summary ?? "equilibrado";
      return typeof generated === "string"
        ? generated.substring(0, 50)
        : "equilibrado";
    } catch (err: unknown) {
      throw new Error(
        err instanceof Error ? err.message : "Erro ao gerar ritmo"
      );
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGenerateAudience = async (): Promise<string> => {
    setGeneratingFor("audience");
    try {
      const data = await aiApi.generateBlueprint({
        title: bookContext?.title ?? "Novo Livro",
        genre: bookContext?.genre ?? "fiction",
        description: `Sugira um público-alvo para: ${bookContext?.description ?? "um livro"}`,
      });
      const generated =
        data?.blueprint?.summary ?? data?.summary ?? "Adultos jovens e adultos";
      return typeof generated === "string"
        ? generated.substring(0, 100)
        : "Adultos jovens e adultos";
    } catch (err: unknown) {
      throw new Error(
        err instanceof Error ? err.message : "Erro ao gerar público-alvo"
      );
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGenerateThemes = async (): Promise<string> => {
    setGeneratingFor("themes");
    try {
      const data = await aiApi.generateBlueprint({
        title: bookContext?.title ?? "Novo Livro",
        genre: bookContext?.genre ?? "fiction",
        description: `Sugira temas centrais e mensagens para: ${bookContext?.description ?? "um livro"}`,
      });
      const generated =
        data?.blueprint?.summary ??
        data?.summary ??
        "Temas universais de crescimento e descoberta";
      return typeof generated === "string"
        ? generated
        : JSON.stringify(generated);
    } catch (err: unknown) {
      throw new Error(
        err instanceof Error ? err.message : "Erro ao gerar temas"
      );
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGenerateAll = async () => {
    if (
      guardGenerateAll(
        bookContext,
        "Preencha pelo menos o título ou a premissa do livro antes de gerar tom e estilo."
      )
    )
      return;
    await runWithGeneratingAll(async () => {
      try {
        const prompt = `Baseado no livro "${bookContext?.title ?? "Novo Livro"}" ${bookContext?.genre ? `do gênero ${bookContext.genre}` : ""}, ${bookContext?.description ? `com a premissa: ${bookContext.description.substring(0, 200)}` : ""}. Gere uma análise completa de tom e estilo narrativo incluindo: tom narrativo (leve, sombrio, épico, etc.), ritmo (rápido, contemplativo, equilibrado, etc.), público-alvo apropriado e temas centrais/mensagens que o livro explora.`;
        const data = await aiApi.generateBlueprint({
          title: bookContext?.title ?? "Novo Livro",
          genre: bookContext?.genre ?? "fiction",
          description: prompt,
        });
        const blueprint = data?.blueprint ?? data;
        const summary = (blueprint?.summary ?? data?.summary ?? "") as string;
        const tone = summary.includes("sombrio")
          ? "sombrio"
          : summary.includes("leve")
            ? "leve"
            : summary.includes("épico")
              ? "épico"
              : "equilibrado";
        const pacingVal = summary.includes("rápido")
          ? "rápido"
          : summary.includes("contemplativo")
            ? "contemplativo"
            : "equilibrado";
        const audience = summary.includes("jovem")
          ? "Jovens adultos"
          : summary.includes("adulto")
            ? "Adultos"
            : "Público geral";
        const themes =
          summary || "Temas universais de crescimento e descoberta";
        setValue("narrative_tone", tone);
        setValue("pacing", pacingVal);
        setValue("target_audience", audience);
        setValue("central_themes", themes);
        addNotification({
          type: "success",
          title: "Tom e estilo gerados!",
          message:
            "Todos os campos de tom e estilo foram preenchidos com sucesso.",
          duration: 3000,
        });
      } catch (err: unknown) {
        addNotification({
          type: "error",
          title: "Erro ao gerar tom e estilo",
          message:
            err instanceof Error
              ? err.message
              : "Não foi possível gerar os campos automaticamente.",
          duration: 5000,
        });
      }
    });
  };

  return {
    register,
    setValue,
    generatingFor,
    isGeneratingAll,
    handleGenerateTone,
    handleGeneratePacing,
    handleGenerateAudience,
    handleGenerateThemes,
    handleGenerateAll,
  };
}

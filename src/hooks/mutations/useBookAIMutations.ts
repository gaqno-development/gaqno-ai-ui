import { useMutation } from '@tanstack/react-query';
import {
  aiApi,
  type GenerateBlueprintBody,
  type AnalyzeCharacterBody,
  type AnalyzeContextBody,
  type GenerateChapterBody,
} from '@/utils/api/aiApi';

export const useBookAIMutations = () => {
  const generateBlueprint = useMutation({
    mutationFn: (body: GenerateBlueprintBody) => aiApi.generateBlueprint(body),
  });

  const analyzeCharacter = useMutation({
    mutationFn: (body: AnalyzeCharacterBody) => aiApi.analyzeCharacter(body),
  });

  const generateCharacterAvatar = useMutation({
    mutationFn: (body: {
      characterName?: string;
      characterDescription?: string;
    }) => aiApi.generateCharacterAvatar(body),
  });

  const analyzeContext = useMutation({
    mutationFn: (body: AnalyzeContextBody) => aiApi.analyzeContext(body),
  });

  const generateChapter = useMutation({
    mutationFn: (body: GenerateChapterBody) => aiApi.generateChapter(body),
  });

  return {
    generateBlueprint,
    analyzeCharacter,
    generateCharacterAvatar,
    analyzeContext,
    generateChapter,
  };
};

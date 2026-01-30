import { useMutation } from '@tanstack/react-query';
import {
  aiApi,
  type GenerateTextOptions,
  type GenerateObjectOptions,
} from '@/utils/api/aiApi';

export const useGenerateTextMutation = () => {
  return useMutation({
    mutationFn: (options: GenerateTextOptions) => aiApi.generateText(options),
  });
};

export const useStreamTextMutation = () => {
  return useMutation({
    mutationFn: ({
      options,
      signal,
    }: {
      options: GenerateTextOptions;
      signal?: AbortSignal;
    }) => aiApi.streamText(options, signal),
  });
};

export const useGenerateObjectMutation = () => {
  return useMutation({
    mutationFn: <T = Record<string, unknown>>(options: GenerateObjectOptions) =>
      aiApi.generateObject<T>(options),
  });
};

export const useTextMutations = () => {
  const generateText = useGenerateTextMutation();
  const streamText = useStreamTextMutation();
  const generateObject = useGenerateObjectMutation();
  return {
    generateText,
    streamText,
    generateObject,
  };
};

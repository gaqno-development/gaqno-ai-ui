import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/utils/api/aiApi';
import type { ImageGenerationRequest } from '@/types/images';

export const useImageGenerationMutations = () => {
  const generate = useMutation({
    mutationFn: async (request: ImageGenerationRequest) => {
      return await aiApi.generateImage(request);
    },
  });

  return {
    generate,
  };
};

export const useImageEditMutations = () => {
  const edit = useMutation({
    mutationFn: async ({ file, instruction }: { file: File; instruction: string }) => {
      return await aiApi.editImage(file, instruction);
    },
  });

  return { edit };
};

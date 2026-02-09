import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/utils/api/aiApi';
import type { GenerateContentRequest } from '@/utils/api/aiApi';

export const useProductContentGenerateMutation = () => {
  const generate = useMutation({
    mutationFn: (request: GenerateContentRequest) =>
      aiApi.generateProductContent(request),
  });

  return { generate };
};

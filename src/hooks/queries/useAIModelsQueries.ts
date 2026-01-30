import { useQuery } from '@tanstack/react-query';
import { aiApi, type AIModel } from '@/utils/api/aiApi';

export const useAIModelsQueries = () => {
  const getAll = useQuery<AIModel[]>({
    queryKey: ['ai-models'],
    queryFn: () => aiApi.getModels(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    getAll,
  };
};

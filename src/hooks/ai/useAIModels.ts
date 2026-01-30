import { useAIModelsQueries } from '@/hooks/queries/useAIModelsQueries';

export const useAIModels = () => {
  const queries = useAIModelsQueries();
  return queries.getAll;
};

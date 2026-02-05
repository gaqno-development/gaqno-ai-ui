import { useImageModelsQueries } from "@/hooks/queries/useImageQueries";

export const useImageModels = () => {
  const queries = useImageModelsQueries();
  const { data, isLoading, error } = queries.getAll;

  const providers = data?.providers ?? [];
  const allModels = providers.flatMap((p) =>
    p.models.map((m) => ({ ...m, providerId: p.id, providerName: p.name }))
  );

  return {
    providers,
    allModels,
    isLoading,
    error,
  };
};

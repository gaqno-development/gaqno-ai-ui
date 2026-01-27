import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useBookMutations } from '@/hooks/mutations/useBookMutations';

type Mutations = ReturnType<typeof useBookMutations>['mutations'];

async function withSuccessError<T>(
  fn: () => Promise<T>,
  fallbackError: string,
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : fallbackError;
    return { success: false, error: message || fallbackError };
  }
}

export interface CreateUseBookEntityConfig<TItem, TCreate, TUpdate> {
  getQuery: (queries: ReturnType<typeof useBookMutations>['queries'], bookId: string) => UseQueryResult<TItem[] | undefined, Error>;
  getCreateMutate: (m: Mutations) => UseMutationResult<unknown, Error, unknown>;
  getUpdateMutate: (m: Mutations) => UseMutationResult<unknown, Error, unknown>;
  getDeleteMutate: (m: Mutations) => UseMutationResult<unknown, Error, unknown>;
  createAdapter: (input: TCreate) => unknown;
  updateAdapter: (id: string, input: TUpdate) => unknown;
  createError: string;
  updateError: string;
  deleteError: string;
}

export function createUseBookEntity<TItem, TCreate, TUpdate>(
  config: CreateUseBookEntityConfig<TItem, TCreate, TUpdate>,
) {
  return (bookId: string | null) => {
    const { queries, mutations } = useBookMutations();
    const { data, isLoading, refetch } = config.getQuery(queries, bookId || '');
    const createMutate = config.getCreateMutate(mutations);
    const updateMutate = config.getUpdateMutate(mutations);
    const deleteMutate = config.getDeleteMutate(mutations);

    const create = (input: TCreate) =>
      withSuccessError(
        () => createMutate.mutateAsync(config.createAdapter(input)) as Promise<unknown>,
        config.createError,
      );

    const update = (id: string, input: TUpdate) =>
      withSuccessError(
        () => updateMutate.mutateAsync(config.updateAdapter(id, input)) as Promise<unknown>,
        config.updateError,
      );

    const remove = (id: string) =>
      withSuccessError(() => deleteMutate.mutateAsync(id) as Promise<void>, config.deleteError);

    return {
      items: data ?? [],
      isLoading,
      refetch,
      create,
      update,
      remove,
      isCreating: createMutate.isPending,
      isUpdating: updateMutate.isPending,
      isDeleting: deleteMutate.isPending,
    };
  };
}

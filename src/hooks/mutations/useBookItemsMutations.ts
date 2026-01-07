import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import type { IBookItem, ICreateBookItemInput, IUpdateBookItemInput } from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

const transformBookItem = (item: any): IBookItem => ({
  id: item.id,
  book_id: item.bookId,
  name: item.name,
  function: item.function,
  origin: item.origin,
  relevance: item.relevance,
  metadata: item.metadata,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
});

export const useBookItemsMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation<IBookItem, Error, ICreateBookItemInput>({
    mutationFn: async (data) => {
      const response = await aiClient.post<any>('/book-items', data);
      return transformBookItem(response.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['book-items', data.book_id] });
    },
  });

  const update = useMutation<IBookItem, Error, { id: string; data: IUpdateBookItemInput }>({
    mutationFn: async ({ id, data }) => {
      const response = await aiClient.patch<any>(`/book-items/${id}`, data);
      return transformBookItem(response.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['book-items', data.book_id] });
      queryClient.invalidateQueries({ queryKey: ['book-item', data.id] });
    },
  });

  const deleteItem = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await aiClient.delete(`/book-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-items'] });
      queryClient.invalidateQueries({ queryKey: ['book-item'] });
    },
  });

  return {
    create,
    update,
    delete: deleteItem,
  };
};


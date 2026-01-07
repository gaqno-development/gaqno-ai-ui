import { useQuery } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';

const aiClient = coreAxiosClient.ai;

export interface IBookItem {
  id: string;
  book_id: string;
  name: string;
  function?: string;
  origin?: string;
  relevance?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

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

export const useBookItemsQueries = () => {
  const getByBookId = (bookId: string) => useQuery<IBookItem[]>({
    queryKey: ['book-items', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/book-items/book/${bookId}`);
      return response.data.map(transformBookItem);
    },
    enabled: !!bookId,
  });

  const getById = (id: string) => useQuery<IBookItem>({
    queryKey: ['book-item', id],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/book-items/${id}`);
      return transformBookItem(response.data);
    },
    enabled: !!id,
  });

  return {
    getByBookId,
    getById,
  };
};


import { useQuery } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';

const aiClient = coreAxiosClient.ai;

export interface IBookSetting {
  id: string;
  book_id: string;
  name: string;
  description?: string;
  timeline_summary?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

const transformBookSetting = (item: any): IBookSetting => ({
  id: item.id,
  book_id: item.bookId,
  name: item.name,
  description: item.description,
  timeline_summary: item.timelineSummary,
  metadata: item.metadata,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
});

export const useBookSettingsQueries = () => {
  const getByBookId = (bookId: string) => useQuery<IBookSetting[]>({
    queryKey: ['book-settings', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/book-settings/book/${bookId}`);
      return response.data.map(transformBookSetting);
    },
    enabled: !!bookId,
  });

  const getById = (id: string) => useQuery<IBookSetting>({
    queryKey: ['book-setting', id],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/book-settings/${id}`);
      return transformBookSetting(response.data);
    },
    enabled: !!id,
  });

  return {
    getByBookId,
    getById,
  };
};


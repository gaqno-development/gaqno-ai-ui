import { useQuery } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import { transformers } from '@/lib/api-transformers';
import type { IBookChapter } from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

export const useBookChaptersQueries = () => {
  const getChapters = (bookId: string) => useQuery<IBookChapter[]>({
    queryKey: ['book-chapters', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/books/${bookId}/chapters`);
      return transformers.chapters(response.data);
    },
    enabled: !!bookId,
  });

  const getChapterById = (chapterId: string) => useQuery<IBookChapter>({
    queryKey: ['book-chapter', chapterId],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/books/chapters/${chapterId}`);
      return transformers.chapter(response.data);
    },
    enabled: !!chapterId,
  });

  return {
    getChapters,
    getChapterById,
  };
};


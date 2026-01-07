import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import { transformers } from '@/lib/api-transformers';
import type {
  IBookChapter,
  ICreateBookChapterInput,
  IUpdateBookChapterInput,
} from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

export const useBookChaptersMutations = () => {
  const queryClient = useQueryClient();

  const createChapter = useMutation<IBookChapter, Error, { bookId: string; data: ICreateBookChapterInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/chapters`, data);
      return transformers.chapter(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-chapters', variables.bookId] });
    },
  });

  const updateChapter = useMutation<IBookChapter, Error, { chapterId: string; data: IUpdateBookChapterInput }>({
    mutationFn: async ({ chapterId, data }) => {
      const response = await aiClient.patch<any>(`/books/chapters/${chapterId}`, data);
      return transformers.chapter(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-chapters'] });
      queryClient.invalidateQueries({ queryKey: ['book-chapter'] });
    },
  });

  const deleteChapter = useMutation<void, Error, string>({
    mutationFn: async (chapterId) => {
      await aiClient.delete(`/books/chapters/${chapterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-chapters'] });
      queryClient.invalidateQueries({ queryKey: ['book-chapter'] });
    },
  });

  return {
    createChapter,
    updateChapter,
    deleteChapter,
  };
};


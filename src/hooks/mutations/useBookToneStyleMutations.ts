import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import type { IBookToneStyle, ICreateBookToneStyleInput, IUpdateBookToneStyleInput } from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

const transformBookToneStyle = (item: any): IBookToneStyle => ({
  id: item.id,
  book_id: item.bookId,
  narrative_tone: item.narrativeTone,
  pacing: item.pacing,
  target_audience: item.targetAudience,
  central_themes: item.centralThemes,
  metadata: item.metadata,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
});

export const useBookToneStyleMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation<IBookToneStyle, Error, ICreateBookToneStyleInput>({
    mutationFn: async (data) => {
      const response = await aiClient.post<any>('/book-tone-style', data);
      return transformBookToneStyle(response.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['book-tone-style', data.book_id] });
    },
  });

  const update = useMutation<IBookToneStyle, Error, { bookId: string; data: IUpdateBookToneStyleInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.patch<any>(`/book-tone-style/book/${bookId}`, data);
      return transformBookToneStyle(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-tone-style', variables.bookId] });
    },
  });

  return {
    create,
    update,
  };
};


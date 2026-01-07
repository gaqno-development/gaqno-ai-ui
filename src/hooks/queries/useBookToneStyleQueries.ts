import { useQuery } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';

const aiClient = coreAxiosClient.ai;

export interface IBookToneStyle {
  id: string;
  book_id: string;
  narrative_tone?: string;
  pacing?: string;
  target_audience?: string;
  central_themes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

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

export const useBookToneStyleQueries = () => {
  const getByBookId = (bookId: string) => useQuery<IBookToneStyle | null>({
    queryKey: ['book-tone-style', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/book-tone-style/book/${bookId}`);
      return response.data ? transformBookToneStyle(response.data) : null;
    },
    enabled: !!bookId,
  });

  return {
    getByBookId,
  };
};


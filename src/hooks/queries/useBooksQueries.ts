import { useQuery } from '@tanstack/react-query';
import { useTenant, useAuth } from '@gaqno-development/frontcore/contexts';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import { transformers } from '@/lib/api-transformers';
import type { IBook, IBookBlueprint, IBookCover, IBookHistory, IBookCharacter, IBookGlossary, IBookExport } from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

export const useBooksQueries = () => {
  const { tenantId } = useTenant();
  const { user } = useAuth();

  const getAll = useQuery<IBook[]>({
    queryKey: ['books', tenantId ?? 'no-tenant', user?.id ?? 'no-user'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const response = await aiClient.get<any[]>('/books', { params: tenantId ? { tenantId } : undefined });
      return transformers.books(response.data);
    },
    enabled: !!user,
  });

  const getById = (id: string) => useQuery<IBook>({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/books/${id}`);
      return transformers.book(response.data);
    },
    enabled: !!id,
  });

  const getBlueprint = (bookId: string) => useQuery<IBookBlueprint | null>({
    queryKey: ['book-blueprint', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/books/${bookId}/blueprint`);
      return response.data ? transformers.blueprint(response.data) : null;
    },
    enabled: !!bookId,
  });

  const getCovers = (bookId: string) => useQuery<IBookCover[]>({
    queryKey: ['book-covers', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/books/${bookId}/covers`);
      return transformers.covers(response.data);
    },
    enabled: !!bookId,
  });

  const getActiveCover = (bookId: string) => useQuery<IBookCover | null>({
    queryKey: ['book-cover-active', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any>(`/books/${bookId}/covers/active`);
      return response.data ? transformers.cover(response.data) : null;
    },
    enabled: !!bookId,
  });

  const getHistory = (bookId: string) => useQuery<IBookHistory[]>({
    queryKey: ['book-history', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/books/${bookId}/history`);
      return transformers.historyList(response.data);
    },
    enabled: !!bookId,
  });

  const getCharacters = (bookId: string) => useQuery<IBookCharacter[]>({
    queryKey: ['book-characters', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/books/${bookId}/characters`);
      return transformers.characters(response.data);
    },
    enabled: !!bookId,
  });

  const getGlossary = (bookId: string) => useQuery<IBookGlossary[]>({
    queryKey: ['book-glossary', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/books/${bookId}/glossary`);
      return transformers.glossaryList(response.data);
    },
    enabled: !!bookId,
  });

  const getExports = (bookId: string) => useQuery<IBookExport[]>({
    queryKey: ['book-exports', bookId],
    queryFn: async () => {
      const response = await aiClient.get<any[]>(`/books/${bookId}/exports`);
      return transformers.exports(response.data);
    },
    enabled: !!bookId,
  });

  return {
    getAll,
    getById,
    getBlueprint,
    getCovers,
    getActiveCover,
    getHistory,
    getCharacters,
    getGlossary,
    getExports,
  };
};


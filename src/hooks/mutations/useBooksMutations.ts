import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import { transformers } from '@/lib/api-transformers';
import type {
  IBook,
  IBookBlueprint,
  IBookCover,
  IBookHistory,
  IBookCharacter,
  IBookGlossary,
  IBookExport,
  ICreateBookInput,
  IUpdateBookInput,
  ICreateBookBlueprintInput,
  IUpdateBookBlueprintInput,
  ICreateBookCoverInput,
  IUpdateBookCoverInput,
  ICreateBookHistoryInput,
  ICreateBookCharacterInput,
  IUpdateBookCharacterInput,
  ICreateBookGlossaryInput,
  IUpdateBookGlossaryInput,
  ICreateBookExportInput,
  IUpdateBookExportInput,
} from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

export const useBooksMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation<IBook, Error, ICreateBookInput>({
    mutationFn: async (data) => {
      const response = await aiClient.post<any>('/books', data);
      return transformers.book(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const update = useMutation<IBook, Error, { id: string; data: IUpdateBookInput }>({
    mutationFn: async ({ id, data }) => {
      const response = await aiClient.patch<any>(`/books/${id}`, data);
      return transformers.book(response.data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
    },
  });

  const deleteBook = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await aiClient.delete(`/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const createBlueprint = useMutation<IBookBlueprint, Error, { bookId: string; data: ICreateBookBlueprintInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/blueprint`, data);
      return transformers.blueprint(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-blueprint', variables.bookId] });
    },
  });

  const updateBlueprint = useMutation<IBookBlueprint, Error, { bookId: string; data: IUpdateBookBlueprintInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.patch<any>(`/books/${bookId}/blueprint`, data);
      return transformers.blueprint(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-blueprint', variables.bookId] });
    },
  });

  const createCover = useMutation<IBookCover, Error, { bookId: string; data: ICreateBookCoverInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/covers`, data);
      return transformers.cover(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-covers', variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ['book-cover-active', variables.bookId] });
    },
  });

  const updateCover = useMutation<IBookCover, Error, { coverId: string; data: IUpdateBookCoverInput }>({
    mutationFn: async ({ coverId, data }) => {
      const response = await aiClient.patch<any>(`/books/covers/${coverId}`, data);
      return transformers.cover(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-covers'] });
      queryClient.invalidateQueries({ queryKey: ['book-cover-active'] });
    },
  });

  const createHistory = useMutation<IBookHistory, Error, { bookId: string; data: ICreateBookHistoryInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/history`, data);
      return transformers.history(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-history', variables.bookId] });
    },
  });

  const createCharacter = useMutation<IBookCharacter, Error, { bookId: string; data: ICreateBookCharacterInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/characters`, data);
      return transformers.character(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-characters', variables.bookId] });
    },
  });

  const updateCharacter = useMutation<IBookCharacter, Error, { characterId: string; data: IUpdateBookCharacterInput }>({
    mutationFn: async ({ characterId, data }) => {
      const response = await aiClient.patch<any>(`/books/characters/${characterId}`, data);
      return transformers.character(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-characters'] });
    },
  });

  const deleteCharacter = useMutation<void, Error, string>({
    mutationFn: async (characterId) => {
      await aiClient.delete(`/books/characters/${characterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-characters'] });
    },
  });

  const createGlossaryTerm = useMutation<IBookGlossary, Error, { bookId: string; data: ICreateBookGlossaryInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/glossary`, data);
      return transformers.glossary(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-glossary', variables.bookId] });
    },
  });

  const updateGlossaryTerm = useMutation<IBookGlossary, Error, { glossaryId: string; data: IUpdateBookGlossaryInput }>({
    mutationFn: async ({ glossaryId, data }) => {
      const response = await aiClient.patch<any>(`/books/glossary/${glossaryId}`, data);
      return transformers.glossary(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-glossary'] });
    },
  });

  const deleteGlossaryTerm = useMutation<void, Error, string>({
    mutationFn: async (glossaryId) => {
      await aiClient.delete(`/books/glossary/${glossaryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-glossary'] });
    },
  });

  const createExport = useMutation<IBookExport, Error, { bookId: string; data: ICreateBookExportInput }>({
    mutationFn: async ({ bookId, data }) => {
      const response = await aiClient.post<any>(`/books/${bookId}/exports`, data);
      return transformers.export(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-exports', variables.bookId] });
    },
  });

  const updateExport = useMutation<IBookExport, Error, { exportId: string; data: IUpdateBookExportInput }>({
    mutationFn: async ({ exportId, data }) => {
      const response = await aiClient.patch<any>(`/books/exports/${exportId}`, data);
      return transformers.export(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-exports'] });
    },
  });

  return {
    create,
    update,
    delete: deleteBook,
    createBlueprint,
    updateBlueprint,
    createCover,
    updateCover,
    createHistory,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    createGlossaryTerm,
    updateGlossaryTerm,
    deleteGlossaryTerm,
    createExport,
    updateExport,
  };
};


import type { ICreateBookCharacterInput, IUpdateBookCharacterInput } from '@/types/books/books';
import { createUseBookEntity } from './createUseBookEntity';

const useBookEntity = createUseBookEntity({
  getQuery: (q, bookId) => q.getCharacters(bookId),
  getCreateMutate: (m) => m.createCharacter,
  getUpdateMutate: (m) => m.updateCharacter,
  getDeleteMutate: (m) => m.deleteCharacter,
  createAdapter: (input) => ({
    bookId: input.book_id,
    data: {
      name: input.name,
      description: input.description,
      avatar_url: input.avatar_url,
      metadata: input.metadata,
    },
  }),
  updateAdapter: (characterId, input) => ({
    characterId,
    data: {
      name: input.name,
      description: input.description,
      avatar_url: input.avatar_url,
      metadata: input.metadata,
    },
  }),
  createError: 'Failed to create character',
  updateError: 'Failed to update character',
  deleteError: 'Failed to delete character',
});

export const useBookCharacters = (bookId: string | null) => {
  const raw = useBookEntity(bookId);
  return {
    characters: raw.items,
    isLoading: raw.isLoading,
    refetch: raw.refetch,
    createCharacter: raw.create,
    updateCharacter: raw.update,
    deleteCharacter: raw.remove,
    isCreating: raw.isCreating,
    isUpdating: raw.isUpdating,
    isDeleting: raw.isDeleting,
  };
};

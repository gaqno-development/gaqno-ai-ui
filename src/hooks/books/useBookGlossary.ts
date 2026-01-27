import type { ICreateBookGlossaryInput, IUpdateBookGlossaryInput } from '@/types/books/books';
import { createUseBookEntity } from './createUseBookEntity';

const useBookEntity = createUseBookEntity({
  getQuery: (q, bookId) => q.getGlossary(bookId),
  getCreateMutate: (m) => m.createGlossaryTerm,
  getUpdateMutate: (m) => m.updateGlossaryTerm,
  getDeleteMutate: (m) => m.deleteGlossaryTerm,
  createAdapter: (input) => ({
    bookId: input.book_id,
    data: { term: input.term, definition: input.definition },
  }),
  updateAdapter: (glossaryId, input) => ({ glossaryId, data: input }),
  createError: 'Failed to create glossary term',
  updateError: 'Failed to update glossary term',
  deleteError: 'Failed to delete glossary term',
});

export const useBookGlossary = (bookId: string | null) => {
  const raw = useBookEntity(bookId);
  return {
    glossary: raw.items,
    isLoading: raw.isLoading,
    refetch: raw.refetch,
    createGlossaryTerm: raw.create,
    updateGlossaryTerm: raw.update,
    deleteGlossaryTerm: raw.remove,
    isCreating: raw.isCreating,
    isUpdating: raw.isUpdating,
    isDeleting: raw.isDeleting,
  };
};

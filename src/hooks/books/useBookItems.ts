import type { ICreateBookItemInput, IUpdateBookItemInput } from '@/types/books/books';
import { createUseBookEntity } from './createUseBookEntity';

const useBookEntity = createUseBookEntity({
  getQuery: (q, bookId) => q.getItemsByBookId(bookId),
  getCreateMutate: (m) => m.createItem,
  getUpdateMutate: (m) => m.updateItem,
  getDeleteMutate: (m) => m.deleteItem,
  createAdapter: (input) => input,
  updateAdapter: (itemId, input) => ({ id: itemId, data: input }),
  createError: 'Failed to create item',
  updateError: 'Failed to update item',
  deleteError: 'Failed to delete item',
});

export const useBookItems = (bookId: string | null) => {
  const raw = useBookEntity(bookId);
  return {
    items: raw.items,
    isLoading: raw.isLoading,
    refetch: raw.refetch,
    createItem: raw.create,
    updateItem: raw.update,
    deleteItem: raw.remove,
    isCreating: raw.isCreating,
    isUpdating: raw.isUpdating,
    isDeleting: raw.isDeleting,
  };
};

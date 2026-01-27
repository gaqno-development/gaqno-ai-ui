import type { ICreateBookSettingInput, IUpdateBookSettingInput } from '@/types/books/books';
import { createUseBookEntity } from './createUseBookEntity';

const useBookEntity = createUseBookEntity({
  getQuery: (q, bookId) => q.getSettingsByBookId(bookId),
  getCreateMutate: (m) => m.createSetting,
  getUpdateMutate: (m) => m.updateSetting,
  getDeleteMutate: (m) => m.deleteSetting,
  createAdapter: (input) => input,
  updateAdapter: (settingId, input) => ({ id: settingId, data: input }),
  createError: 'Failed to create setting',
  updateError: 'Failed to update setting',
  deleteError: 'Failed to delete setting',
});

export const useBookSettings = (bookId: string | null) => {
  const raw = useBookEntity(bookId);
  return {
    settings: raw.items,
    isLoading: raw.isLoading,
    refetch: raw.refetch,
    createSetting: raw.create,
    updateSetting: raw.update,
    deleteSetting: raw.remove,
    isCreating: raw.isCreating,
    isUpdating: raw.isUpdating,
    isDeleting: raw.isDeleting,
  };
};

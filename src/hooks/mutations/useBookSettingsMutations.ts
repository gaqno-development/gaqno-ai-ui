import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coreAxiosClient } from '@gaqno-development/frontcore/utils/api';
import type { IBookSetting, ICreateBookSettingInput, IUpdateBookSettingInput } from '@/features/books/types/books';

const aiClient = coreAxiosClient.ai;

const transformBookSetting = (item: any): IBookSetting => ({
  id: item.id,
  book_id: item.bookId,
  name: item.name,
  description: item.description,
  timeline_summary: item.timelineSummary,
  metadata: item.metadata,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
});

export const useBookSettingsMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation<IBookSetting, Error, ICreateBookSettingInput>({
    mutationFn: async (data) => {
      const response = await aiClient.post<any>('/book-settings', data);
      return transformBookSetting(response.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['book-settings', data.book_id] });
    },
  });

  const update = useMutation<IBookSetting, Error, { id: string; data: IUpdateBookSettingInput }>({
    mutationFn: async ({ id, data }) => {
      const response = await aiClient.patch<any>(`/book-settings/${id}`, data);
      return transformBookSetting(response.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['book-settings', data.book_id] });
      queryClient.invalidateQueries({ queryKey: ['book-setting', data.id] });
    },
  });

  const deleteSetting = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await aiClient.delete(`/book-settings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-settings'] });
      queryClient.invalidateQueries({ queryKey: ['book-setting'] });
    },
  });

  return {
    create,
    update,
    delete: deleteSetting,
  };
};


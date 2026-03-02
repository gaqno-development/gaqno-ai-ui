import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApiClient } from "@gaqno-development/frontcore/utils/api";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["ai", "categories"],
    queryFn: () => aiApiClient.listCategories(),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string }) => aiApiClient.createCategory(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "categories"] }),
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      aiApiClient.updateCategory(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "categories"] }),
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiApiClient.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "categories"] }),
  });
}

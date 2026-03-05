import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";

const FOLDERS_QUERY_KEY = ["ai", "gallery", "folders"] as const;

export function useImageFoldersQuery() {
  return useQuery({
    queryKey: FOLDERS_QUERY_KEY,
    queryFn: () => aiApi.listImageFolders(),
  });
}

export function useCreateImageFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string }) => aiApi.createImageFolder(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
  });
}

export function useUpdateImageFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      aiApi.updateImageFolder(id, { name }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY }),
  });
}

export function useDeleteImageFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiApi.deleteImageFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["ai", "gallery", "images"] });
    },
  });
}

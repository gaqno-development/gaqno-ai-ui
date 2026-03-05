import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/utils/api/aiApi";
import type {
  ListGalleryImagesParams,
  SaveGalleryImageBody,
} from "@/utils/api/aiApi";

const GALLERY_QUERY_KEY = ["ai", "gallery", "images"] as const;

export function useGalleryImagesQuery(params?: ListGalleryImagesParams) {
  return useQuery({
    queryKey: [...GALLERY_QUERY_KEY, params ?? {}],
    queryFn: () => aiApi.listGalleryImages(params),
  });
}

export function useSaveGalleryImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveGalleryImageBody) => aiApi.saveGalleryImage(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY }),
  });
}

export function useMoveGalleryImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string | null }) =>
      aiApi.moveGalleryImage(id, folderId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY }),
  });
}

export function useDeleteGalleryImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiApi.deleteGalleryImage(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY }),
  });
}

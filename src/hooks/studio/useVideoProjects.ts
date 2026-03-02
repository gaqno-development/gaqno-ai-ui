import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApiClient } from "@gaqno-development/frontcore/utils/api";

export function useVideoProjectsQuery(params?: {
  categoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["ai", "videos", params],
    queryFn: () => aiApiClient.listVideos(params),
  });
}

export function useVideoProjectQuery(id: string | null) {
  return useQuery({
    queryKey: ["ai", "videos", id],
    queryFn: () => (id ? aiApiClient.getVideo(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useCreateVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      script: string;
      style: string;
      categoryId: string;
    }) => aiApiClient.createVideo(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "videos"] }),
  });
}

export function useUpdateVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      title,
      categoryId,
    }: {
      id: string;
      title?: string;
      categoryId?: string;
    }) => aiApiClient.updateVideo(id, { title, categoryId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "videos"] });
      queryClient.invalidateQueries({ queryKey: ["ai", "videos", variables.id] });
    },
  });
}

export function useDeleteVideoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiApiClient.deleteVideo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "videos"] }),
  });
}

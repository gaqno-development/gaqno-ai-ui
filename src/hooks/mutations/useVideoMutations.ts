import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '@/utils/api/aiApi';
import type { VideoGenerationRequest } from '@/types/videos';

export const useVideoMutations = () => {
  const queryClient = useQueryClient();

  const generate = useMutation({
    mutationFn: (request: VideoGenerationRequest) => aiApi.generateVideo(request),
    onSuccess: (data: { id?: string }) => {
      if (data?.id) queryClient.setQueryData(['video-generation', data.id], data);
    },
  });

  const upload = useMutation({
    mutationFn: ({ file, type }: { file: File; type: 'video' | 'image' }) =>
      aiApi.uploadVideoAsset(file, type),
  });

  return {
    generate,
    upload,
  };
};

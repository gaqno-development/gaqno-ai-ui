import { useQuery } from '@tanstack/react-query';
import { aiApi } from '@/utils/api/aiApi';
import type { VideoModel } from '@/types/videos';

export const useVideoModelsQueries = () => {
  const getAll = useQuery<VideoModel[]>({
    queryKey: ['video-models'],
    queryFn: () => aiApi.getVideoModels() as Promise<VideoModel[]>,
    staleTime: 5 * 60 * 1000,
  });

  return {
    getAll,
  };
};

export const useVideoGenerationQueries = () => {
  const getStatus = (videoId: string) => {
    return useQuery({
      queryKey: ['video-generation', videoId],
      queryFn: () => aiApi.getVideoStatus(videoId),
      enabled: !!videoId,
      refetchInterval: (query) => {
        const data = query.state.data;
        if (data?.status === 'completed' || data?.status === 'failed') {
          return false;
        }
        return 2000;
      },
    });
  };

  return {
    getStatus,
  };
};

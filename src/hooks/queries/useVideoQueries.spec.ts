import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVideoModels, useVideoGeneration, useVideoUpload } from '@/hooks/videos/useVideoGeneration';
import { aiApi } from '@/utils/api/aiApi';

vi.mock('@/utils/api/aiApi');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useVideoModels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch video models successfully', async () => {
    const mockModels = [
      { id: 'kling-o1', name: 'Kling O1', provider: 'kling' },
    ];
    vi.mocked(aiApi.getVideoModels).mockResolvedValue(mockModels as never);

    const { result } = renderHook(() => useVideoModels(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockModels);
  });
});

describe('useVideoGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate video successfully', async () => {
    const mockResponse = {
      id: 'video-123',
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    vi.mocked(aiApi.generateVideo).mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => useVideoGeneration(), {
      wrapper: createWrapper(),
    });

    const mutation = result.current.generate;

    mutation.mutate({
      prompt: 'Test prompt',
      model: 'kling-o1',
    });

    await waitFor(() => {
      expect(mutation.isSuccess).toBe(true);
    });

    expect(mutation.data).toEqual(mockResponse);
  });
});

describe('useVideoUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload video successfully', async () => {
    const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const mockResponse = {
      id: 'asset-123',
      url: 'https://example.com/video.mp4',
      type: 'video',
    };
    vi.mocked(aiApi.uploadVideoAsset).mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => useVideoUpload(), {
      wrapper: createWrapper(),
    });

    const mutation = result.current;

    mutation.mutate({
      file: mockFile,
      type: 'video',
    });

    await waitFor(() => {
      expect(mutation.isSuccess).toBe(true);
    });

    expect(mutation.data).toEqual(mockResponse);
  });
});

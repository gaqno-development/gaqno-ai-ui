import { useCallback } from 'react';
import { aiApi } from '@/utils/api/aiApi';

export interface UseAIOptions {
  onError?: (error: Error) => void;
}

function toError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

export const useAI = (options?: UseAIOptions) => {
  const onError = options?.onError;

  const wrap = useCallback(
    <T, A extends unknown[]>(fn: (...args: A) => Promise<T>) =>
      async (...args: A): Promise<T> => {
        try {
          return await fn(...args);
        } catch (e) {
          const err = toError(e);
          onError?.(err);
          throw err;
        }
      },
    [onError],
  );

  return {
    generateText: wrap(aiApi.generateText.bind(aiApi)),
    streamText: wrap(aiApi.streamText.bind(aiApi)),
    generateObject: wrap(aiApi.generateObject.bind(aiApi)),
    generateImage: wrap(aiApi.generateImage.bind(aiApi)),
  };
};

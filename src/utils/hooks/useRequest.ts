import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';

export function useRequest<T>(
  request: (...args) => Promise<AxiosResponse<T>>,
  callbacks?: {
    onStart?: () => void;
    onSuccess?: (res: T) => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;
  },
): {
  loading: boolean;
  success: boolean;
  fail: boolean;
  data: T | null;
  error: Error | null;
  called: boolean;
  fetch: (...args: any[]) => Promise<void>;
} {
  const [state, setState] = useState<{
    loading: boolean;
    success: boolean;
    fail: boolean;
    data: T | null;
    error: Error | null;
    called: boolean;
  }>({
    loading: false,
    success: false,
    fail: false,
    data: null,
    error: null,
    called: false,
  });

  const fetch = useCallback(
    async (...args: any[]) => {
      try {
        callbacks?.onStart?.();

        setState((prev) => ({
          ...prev,
          loading: true,
          success: false,
          fail: false,
          data: null,
          error: null,
        }));

        const response = await request(...args);

        callbacks?.onSuccess?.(response.data);

        setState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          data: response.data,
        }));
      } catch (err) {
        callbacks?.onError?.(err);

        setState((prev) => ({
          ...prev,
          loading: false,
          fail: true,
          error: err,
        }));
      } finally {
        callbacks?.onComplete?.();

        setState((prev) => ({
          ...prev,
          called: true,
        }));
      }
    },
    [callbacks, request],
  );

  return {
    ...state,
    fetch,
  };
}

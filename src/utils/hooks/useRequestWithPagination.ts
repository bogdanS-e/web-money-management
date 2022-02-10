import { useEffect, useState } from 'react';

type Request<T> = (...args: any[]) => Promise<{ items: T[]; total: number }>

type Callbacks<T, K> = {
  onStart?: () => void;
  onSuccess?: (data: { items: T[]; total: number, extraData: K }) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

type UseRequestWithPagination = <T, K = undefined>(
  request: Request<T>,
  params?: {
    callbacks?: Callbacks<T, K>,
    storageName?: string,
  },
) => {
  loading: boolean
  success: boolean
  fail: boolean
  finished: boolean
  data: T[]
  extraData: K | null,
  total: number
  isCompleted: boolean
  error: Error | null
  fetch: (...args: any[]) => Promise<void>
  extraFetch: (...args: any[]) => Promise<void> | undefined
  offlineFetch: (...args: any[]) => Promise<void>;
  update: (data: T[], total?: number) => void
}

const LIMIT = 25;

const useRequestWithPagination: UseRequestWithPagination = <T, K = undefined>(
  request: Request<T>,
  params?: {
    callbacks?: Callbacks<T, K>,
    storageName?: string,
  },
) => {
  const [state, setState] = useState<{
    loading: boolean
    success: boolean
    fail: boolean
    finished: boolean
    data: T[]
    extraData: K | null
    total: number
    error: Error | null
  }>({
    loading: false,
    success: false,
    fail: false,
    finished: false,
    data: [],
    extraData: null,
    total: 0,
    error: null,
  });

  useEffect(() => {
    if (params?.storageName && state.data.length !== 0) {
      localStorage.setItem(
        `OFFLINE_${params?.storageName}`,
        JSON.stringify({
          data: state.data,
          total: state.total,
          extraData: state.extraData,
        }),
      );
    }
  }, [state.data, state.total, state.extraData]);

  const fetch = async (
    isExtra: boolean,
    syncedData: {
      data: T[],
      extraData: K | null,
      total: number
    } | null,
    ...args: any[]
  ) => {
    try {
      params?.callbacks?.onStart?.();

      setState((prevState) => ({
        ...prevState,
        success: false,
        fail: false,
        finished: false,
        loading: true,
        error: null,
        ...(isExtra ? {} : { data: [], total: 0, extraData: null }),
        ...(syncedData === null ? {} : syncedData),
      }));

      const pagination = syncedData !== null
        ? {
          limit: Math.ceil(syncedData.data.length / LIMIT) * LIMIT,
          offset: 0,
        }
        : {
          limit: LIMIT,
          offset: isExtra ? state.data.length : 0
        };

      const { items, total, ...fields } = await request(pagination, ...args);

      params?.callbacks?.onSuccess?.({ items, total, extraData: fields as K });

      setState((prevState) => ({
        ...prevState,
        loading: false,
        success: true,
        data: [...(isExtra ? prevState.data : []), ...items],
        extraData: fields as K,
        total,
      }));
    } catch (error: any) {
      console.error('fetch error', error);
      params?.callbacks?.onError?.(error);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        fail: true,
        error,
      }));
    } finally {
      params?.callbacks?.onComplete?.();
      setState((prevState) => ({
        ...prevState,
        finished: (prevState.success || prevState.fail)
      }));
    }
  };

  const commonFetch = (...args: any[]) => fetch(false, null, ...args);

  const extraFetch = (...args: any[]) => state.data.length < state.total ? fetch(true, null, ...args) : undefined;

  const offlineFetch = (...args: any[]) => {
    const item = localStorage.getItem(`OFFLINE_${params?.storageName}`);

    if (item) {
      const data = JSON.parse(item);

      params?.callbacks?.onSuccess?.(data);

      return fetch(false, data, ...args);
    }

    return fetch(false, null, ...args);
  };

  const update = (data: T[], total?: number) => {
    setState((prevState) => ({ ...prevState, data, total: total ?? prevState.total }));
  };

  return {
    ...state,
    fetch: commonFetch,
    extraFetch,
    offlineFetch,
    update,
    isCompleted: state.data.length === state.total,
  };
};

export default useRequestWithPagination;

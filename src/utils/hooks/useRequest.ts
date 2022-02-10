import { useMemo, useState } from 'react';

import useRouter, { PageRoute } from './useRouter';
import { Awaited } from '../@types/utils';
import BaseLocalStorageHandler from '../../web/services/local-storage-handlers/base-local-storage-handler';
import { HTTPStatusCode, IBaseErrorResponse } from '../api/new/utils/types';

enum CacheName {
  NotebooksWithVideos = 'NotebooksWithVideos',
  Subscriptions = 'Subscriptions',
  Notebook = 'Notebook',
  Videos = 'Videos',
  Video = 'Video',
  Notes = 'Notes',
}

type TAnyFunction = (...args: any) => any;

interface IParameters<T extends TAnyFunction> {
  cacheName?: string;
  callbacks?: {
    onStart?: () => void;
    onCache?: (data: Awaited<ReturnType<T>>) => void;
    onSuccess?: (data: Awaited<ReturnType<T>>) => void;
    onError?: (error: IBaseErrorResponse) => void;
    onComplete?: () => void;
  };
}

interface IState<TRequest extends TAnyFunction> {
  loading: boolean;
  success: boolean;
  fail: boolean;
  finished: boolean;
  data: Awaited<ReturnType<TRequest>> | null;
  error: Error | null;
}

interface IOptions {
  isCached?: boolean;
  isInvisible?: boolean;
  isRedirectedPreventedOn401?: boolean;
}

type TRequestArguments<TRequest extends TAnyFunction> = [...Parameters<TRequest>] | [...Parameters<TRequest>, IOptions] | [];

interface IResponse<TRequest extends TAnyFunction> extends IState<TRequest> {
  fetch: (...args: TRequestArguments<TRequest>) => Promise<void>;
  update: (data: Awaited<ReturnType<TRequest>>) => void;
}

const useRequest = <TRequest extends TAnyFunction>(
  request: TRequest,
  parameters?: IParameters<TRequest>,
): IResponse<TRequest> => {
  type TRequestResponse = Awaited<ReturnType<TRequest>>;

  const router = useRouter();

  const [state, setState] = useState<IState<TRequest>>({
    loading: false,
    success: false,
    fail: false,
    finished: false,
    data: null,
    error: null,
  });

  const offlineStorage = useMemo<BaseLocalStorageHandler<TRequestResponse> | null>(() => {
    if (!parameters?.cacheName) return null;

    return new BaseLocalStorageHandler<TRequestResponse>({
      key: `Cache${parameters.cacheName}`,
    });
  }, []);

  const isOptionsType = (arg: any) => {
    return typeof arg === 'object' && (arg.isCached !== undefined || arg.isInvisible !== undefined || arg.isRedirectedPreventedOn401 !== undefined);
  };

  const fetch = async (...args: TRequestArguments<TRequest>) => {
    let options: IOptions = {};

    const lastArg = args[args.length - 1];

    if (isOptionsType(lastArg)) {
      options = lastArg;
      // @ts-ignore
      args = args.slice(0, args.length - 1);
    }

    if (options?.isCached && offlineStorage) {
      const data = offlineStorage.get();

      if (data) {
        parameters?.callbacks?.onCache?.(data);

        setState((prevState) => ({ ...prevState, data }));
      }
    }

    try {
      parameters?.callbacks?.onStart?.();

      setState((prev) => ({
        loading: true,
        success: false,
        fail: false,
        finished: false,
        error: null,
        data: options?.isInvisible ? prev.data : null,
      }));

      const response = await request(...args);

      parameters?.callbacks?.onSuccess?.(response);

      offlineStorage?.set(response);

      setState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        data: response,
      }));
    } catch (err: any) {
      if (!options.isRedirectedPreventedOn401 && err?.response?.status === HTTPStatusCode.Unauthorized) {
        router.push({ route: PageRoute.SignIn });
      }

      parameters?.callbacks?.onError?.(err);

      setState((prev) => ({
        ...prev,
        loading: false,
        fail: true,
        error: err,
      }));
    } finally {
      parameters?.callbacks?.onComplete?.();

      setState((prevState) => ({
        ...prevState,
        finished: (prevState.success || prevState.fail),
      }));
    }
  };

  const update = (updatedDate: TRequestResponse | ((data: TRequestResponse) => TRequestResponse)) => {
    // @ts-ignore
    const data: TRequestResponse = typeof updatedDate === 'function' ? updatedDate(state.data) : updatedDate;

    if (offlineStorage) {
      offlineStorage.set(data);
    }

    setState((prevState) => ({ ...prevState, data }));
  };

  const response = {
    ...state,
    fetch,
    update,
  };

  return response;
};

export default useRequest;

export {
  CacheName,
};

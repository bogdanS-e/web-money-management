import { useEffect, useState } from 'react';
import BaseLocalStorageHandler from './base-local-storage-handler';

type TUseLocalStorage<T> = [
  T | null,
  {
    set: (value: T) => void,
    remove: () => void,
  }
]

const useLocalStorage = <T>(handler: BaseLocalStorageHandler<T>): TUseLocalStorage<T>  => {
  const [value, setValue] = useState<T | null>(handler.get());

  useEffect(() => {
    handler.subscribe(setValue);

    return () => {
      handler.unsubscribe(setValue);
    };
  }, []);

  return [
    value,
    {
      set: (value) => handler.set(value),
      remove: () => handler.remove(),
    },
  ];
};

export default useLocalStorage;

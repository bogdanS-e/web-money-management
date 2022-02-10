import { useState } from 'react'

type TKey = string | number;

type TDirection = 'asc' | 'desc';

interface ISort {
  key: TKey;
  direction: TDirection;
}

interface IOptions {
  defaultDirection?: TDirection;
}

type TResponse = [
  ISort,
  {
    click: (key: TKey) => void;
    set: (sort: ISort) => void;
    clear: () => void;
  }
];

const useSort = (initialSort: ISort, options?: IOptions): TResponse => {
  const [sort, setSort] = useState<ISort>(initialSort);

  const click = (key: TKey) => {
    if (key === sort.key) {
      setSort({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
    } else {
      setSort({ key, direction: options?.defaultDirection ?? 'asc' })
    }
  };

  const set = (sort: ISort) => {
    setSort(sort);
  };

  const clear = () => {
    setSort(initialSort);
  };

  return [
    sort,
    {
      click,
      set,
      clear,
    }
  ];
};

export default useSort;

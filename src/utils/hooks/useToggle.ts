import { useState } from 'react';

interface IUseToggleActions {
  handleShowEditName();
  set: (value: boolean) => void;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  toggleThereAndBack: (time: number) => void;
}

type UseToggle = [
  boolean,
  IUseToggleActions,
]

type UseToggleWithData<T> = [
  boolean,
  Omit<IUseToggleActions, 'set'> & {
    set: (value: boolean, data?: T) => void
  },
  T,
]

function useToggle(initialValue: boolean): UseToggle;
function useToggle<T>(initialValue: boolean): UseToggleWithData<T | undefined>;
function useToggle<T>(initialValue: boolean, initialData: T): UseToggleWithData<T>;
function useToggle<T>(initialValue: boolean, initialData?: T) {
  const [value, setValue] = useState<boolean>(initialValue);
  const [data, setData] = useState(initialData);

  const set = (value: boolean, data?: T) => {
    setValue(value);
    setData(data);
  };

  const enable = () => setValue(true);

  const disable = () => setValue(false);

  const toggle = () => setValue(!value);

  const toggleThereAndBack = (time: number) => {
    setValue(!value);
    setTimeout(() => setValue(value), time);
  };

  return [
    value,
    {
      set,
      enable,
      disable,
      toggle,
      toggleThereAndBack,
    },
    ...(data !== undefined ? [data] : []),
  ];
}

export default useToggle;

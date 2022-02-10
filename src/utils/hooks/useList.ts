import { Dispatch, SetStateAction, useState } from 'react'

type TFilterCallback<T> = (item: T, index: number, itemsArray: T[]) => boolean;

type UseList<T> = [
  T[],
  {
    set: Dispatch<SetStateAction<T[]>>;
    add: (value: T) => void;
    remove: (value: T) => void;
    removeByIndex: (index: number) => void;
    removeBy: (condition: string | number | TFilterCallback<T>) => void;
    editBy: (id: string | number, newItem: T extends object ? Partial<T> : T) => void;
    clear: () => void;
  }
];

function useList<T>(initialValue: T[], key?: keyof T): UseList<T> {
  const [values, setValues] = useState<T[]>(initialValue);

  const add = (value: T) => setValues((prevValues) => [...prevValues, value]);

  const remove = (value: T) => setValues((prevValues) => prevValues.filter((item) => item !== value));

  const removeByIndex = (index: number) => setValues((prevValues) => prevValues.filter((_, i) => i !== index));

  const removeBy = (condition: string | number | ((item: T, index: number, itemsArray: T[]) => boolean)) => {
    if (typeof condition === 'function') {
      return setValues((prevValues) => prevValues.filter(condition));
    }

    if (!key) throw new Error('Key type was not provided for object');

    // @ts-ignore: No overlap
    setValues((prevValues) => prevValues.filter((value) => value[key] !== condition));
  }

  const editBy = (id: string | number, newItem: T extends object ? Partial<T> : T) => {
    setValues((prevValues) => {
      if (!key) throw new Error('Key type was not provided for object');

      // @ts-ignore: No overlap
      const valueIndex = prevValues.findIndex((value) => value[key] === id);

      if (valueIndex !== -1) {
        const copyValuesArray = [...prevValues];
        copyValuesArray[valueIndex] = {
          ...copyValuesArray[valueIndex],
          ...newItem,
        };

        return copyValuesArray;
      }

      return prevValues;
    });
  }

  const clear = () => setValues([]);

  return [
    values,
    {
      set: setValues,
      add,
      remove,
      removeByIndex,
      clear,
      removeBy,
      editBy,
    },
  ]
};

export default useList;

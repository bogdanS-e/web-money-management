import React, {
  Dispatch,
  DispatchWithoutAction,
  ChangeEvent,
  SetStateAction,
} from 'react';

type InputChngeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type InitialValueType = {
  [prop: string]: string;
};

export function useForm(
  initialValue: InitialValueType | (() => InitialValueType),
): [
  InitialValueType,
  (prop: string) => Dispatch<InputChngeEvent>,
  Dispatch<SetStateAction<InitialValueType>>,
  DispatchWithoutAction,
] {
  const [value, setValue] = React.useState<InitialValueType>(initialValue);

  const setValueProp = React.useCallback(
    (prop: string) => (e: InputChngeEvent) => {
      e.persist();

      setValue((prev) => ({
        ...prev,
        [prop]: e.target.value,
      }));
    },
    [],
  );

  // don't reassign initialValue
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clear = React.useCallback(() => setValue(initialValue), []);

  return [value, setValueProp, setValue, clear];
}

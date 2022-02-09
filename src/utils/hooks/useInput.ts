import React, {
  Dispatch,
  DispatchWithoutAction,
  ChangeEvent,
  SetStateAction,
} from 'react';

type InputChngeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export function useInput(
  initialValue: string | (() => string),
): [
  string,
  Dispatch<InputChngeEvent>,
  Dispatch<SetStateAction<string>>,
  DispatchWithoutAction,
] {
  const [value, setValue] = React.useState<string>(initialValue);

  const setInput = React.useCallback(
    (e: InputChngeEvent) => setValue(e.target.value),
    [],
  );

  const clear = React.useCallback(() => setValue(''), []);

  return [value, setInput, setValue, clear];
}

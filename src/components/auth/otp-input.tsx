import React, {
  FocusEvent,
  ClipboardEvent,
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css, keyframes } from 'styled-components';

import theme from '@/styles/theme';
import { TStyled } from '@/styles/types';
import useToggle from '@/utils/hooks/useToggle';
import { Row } from '@/styles/layout';


interface Props {
  disabled?: boolean;
  submitWhenFormIsFiled?: boolean;
  onChange?: (code: string) => void;
  onSubmit?: (code: string) => void;
}

enum Key {
  Backspace = 'Backspace',
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  Enter = 'Enter',
}

enum Direction {
  Left = 'Left',
  Right = 'Right',
}

const ERROR_ANIMATON_DURATION = 820;

const OtpInput: React.FC<Props> = ({
  onChange,
  onSubmit,
  disabled = false,
  submitWhenFormIsFiled = false,
}) => {
  const [isPasted, handleIsPasted] = useToggle(false);
  const [showError, handleShowError] = useToggle(false);

  const [focused, setFocused] = useState<null | number>(null);
  const [secureCode, setSecureCode] = useState<string[]>(['', '', '', '', '', '']);

  const code_0 = useRef(null);
  const code_1 = useRef(null);
  const code_2 = useRef(null);
  const code_3 = useRef(null);
  const code_4 = useRef(null);
  const code_5 = useRef(null);

  const inputs: MutableRefObject<any>[] = [
    code_0,
    code_1,
    code_2,
    code_3,
    code_4,
    code_5,
  ];

  useEffect(() => {
    handleDropDown();

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [secureCode, focused]);

  const handleChange = (code: string[]) => {
    setSecureCode(code);
    onChange?.(code.join(''));

    if(submitWhenFormIsFiled && code.join('').length === 6) {
      onSubmit?.(code.join(''));
    }
  };

  const handleSubmit = () => {
    const code = secureCode.join('');

    if (code.length < 6) {
      handleShowError.enable();
      setTimeout(handleShowError.disable, ERROR_ANIMATON_DURATION);

      return;
    }

    onSubmit?.(code);
  }

  const handleDropDown = (): void => {
    document.addEventListener('keydown', handleKeyDown, true);
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    e.stopPropagation();

    switch (e.key) {
      case Key.Backspace:
        onDelete();
        break;
      case Key.ArrowLeft:
        onKeyLeftOrRight(Direction.Left);
        break;
      case Key.ArrowRight:
        onKeyLeftOrRight(Direction.Right);
        break;
      case Key.Enter:
        handleSubmit();
        break;
    }
  };

  const onDelete = (): void => {
    if (focused === null) return;

    if (!secureCode[focused]) {
      const index = focused && focused - 1;

      inputs[index].current.focus();
    } else {
      const newSecureCode = [...secureCode];

      newSecureCode[focused] = '';

      handleChange(newSecureCode);
    }
  };

  const onKeyLeftOrRight = (direction: Direction): void => {
    if (focused === null) return;

    let index: number = 0;

    if (direction === Direction.Right) {
      if (focused === inputs.length - 1) index = 0;
      else index = focused + 1;
    }

    if (direction === Direction.Left) {
      if (focused === 0) index = inputs.length - 1;
      else index = focused - 1;
    }

    inputs[index].current.focus();
  };

  const handleSecureCode = (i: number) => ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(value)) && value !== ' ') {
      let newSecureCode = [...secureCode];

      newSecureCode[i] = value;

      if (newSecureCode[i] && i !== inputs.length - 1) {
        inputs[i + 1].current.focus();
      }

      handleChange(newSecureCode);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    handlePasteData(e.clipboardData.getData('Text'));
  };

  const handlePasteData = (data: string): void => {
    if (!isNaN(Number(data)) && data.length === 6) {
      handleChange(data.split(''));
      handleIsPasted.enable();
      handleRefs(5)?.current.focus();
    }
  };

  const handleRefs = (i: number): MutableRefObject<any> | null => {
    switch (i) {
      case 0:
        return code_0;
      case 1:
        return code_1;
      case 2:
        return code_2;
      case 3:
        return code_3;
      case 4:
        return code_4;
      case 5:
        return code_5;
    }

    return null;
  };

  const handleFocus = (i: number) => (
    _: FocusEvent<HTMLInputElement>,
  ) => {
    clipboard();
    setFocused(i);
  };

  const clipboard = async (): Promise<any> => {
    try {
      const data = await navigator.clipboard.readText();

      if (!isPasted) {
        handlePasteData(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledRow isError={showError} fluid>
      {secureCode.map((value, i) => (
        <Input
          isActive={!!value || i === focused}
          key={i}
          value={value}
          onChange={handleSecureCode(i)}
          onPaste={handlePaste}
          onFocus={handleFocus(i)}
          disabled={disabled}
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={1}
          required
          ref={handleRefs(i)}
        />
      )
      )}
    </StyledRow>
  );
};

export default OtpInput;

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const StyledRow: TStyled<typeof Row, { isError: boolean }> = styled(Row) <{ isError: boolean }>`
  ${({ isError }) => isError && css`
    animation: ${shake} ${ERROR_ANIMATON_DURATION}ms cubic-bezier(0.36,0.07,0.19,0.97) infinite;
  `};
`;

const Input = styled.input<{ isActive: boolean }>`
  background: transparent;
  text-align: center;
  font-size: 18px;
  line-height: 140%;
  text-align: center;
  letter-spacing: -0.02em;
  color: ${theme.colors.blackBase};
  max-width: 50px;
  border: none;
  outline: none;
  margin-right: 7px;
  flex: 1 1 auto;
  width: 0;
  border-bottom: 1px solid ${({ isActive }) => isActive ? theme.colors.blackBase : theme.colors.grey200};
  transition: border ${theme.transitionDuration.short};

  &:disabled {
    background: transparent;
    opacity: 0.7;
  }

  &:last-child {
    margin-right: 0;
  }
`;

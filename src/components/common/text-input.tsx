import React, {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';
import debounce from 'lodash.debounce';

import { onEnter as onEnterHandler } from '@/utils/events';
import theme from '@/styles/theme';
import circle_reset from '../../../public/assets/circle_reset.svg';
import useToggle from '@/utils/hooks/useToggle';
import useInput from '@/utils/hooks/useInput';

type TIconPosition = 'left' | 'right';

interface Props {
  inputAttributes?: InputHTMLAttributes<HTMLInputElement>;
  icon?: {
    position?: TIconPosition;
    onClick?: (e: MouseEvent) => void;
  };
  debounceTime?: number;
  extraButtons?: ReactNode;
  isStopPropagation?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onFocus?: (e: SyntheticEvent) => void;
  onBlur?: (e: SyntheticEvent) => void;
  onSubmit?: () => void;
}

const TextInput: React.FC<Props> = ({
  inputAttributes,
  icon,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
  onEnter,
  debounceTime = 0,
  isStopPropagation = true,
  extraButtons,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocus, handleIsFocus] = useToggle(false);
  const [text, setText] = useInput((inputAttributes?.value as string) ?? '');

  const onChangeDebounced = useCallback(debounce(onChange, debounceTime), []);

  const setFocusOnInput = (e: SyntheticEvent) => {
    inputRef.current?.focus();
    handleIsFocus.enable();
    onFocus?.(e);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChangeDebounced(newValue);
  };

  const handleOnSubmit = () => {
    inputRef.current?.blur();
    onSubmit?.();
  };

  const handleOnBlur = (e: SyntheticEvent) => {
    handleIsFocus.disable();
    onBlur?.(e);
  };

  const handleOnReset = (e: SyntheticEvent) => {
    isStopPropagation && e.stopPropagation();
    setFocusOnInput(e);
    setText('');
    onChange('');
  };

  const handleOnEnter = (_: SyntheticEvent) => {
    onEnter?.();
  };

  useEffect(() => {
    const inputValue = inputAttributes?.value;

    if (typeof inputValue === 'string') {
      setText(inputAttributes?.value as string);
    }

  }, [inputAttributes?.value]);

  return (
    <InputWrapper
      onKeyDown={onEnterHandler(handleOnEnter)}
      className={className}
    >
      <InputFieldContainer
        iconPosition={icon?.position ?? 'left'}
        isFocus={isFocus}
        isFilled={!!text}
        hasExtraButton={!!extraButtons}
        isDisabled={inputAttributes?.disabled ?? false}
        onClick={setFocusOnInput}
      >
        <Input
          {...inputAttributes}
          ref={inputRef}
          onKeyDown={onEnterHandler(handleOnSubmit)}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          value={text}
        />
        <ResetButton onClick={handleOnReset} />
      </InputFieldContainer>
      {extraButtons && (
        <ExtraButtonsWrapper>
          {extraButtons}
        </ExtraButtonsWrapper>
      )}
    </InputWrapper>
  );
};

export default TextInput;

const ResetButton = styled.div`
  background: transparent url(${circle_reset}) no-repeat center;
  border-radius: 50%;
  order: 1;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  position: relative;
  visibility: hidden;
  transition: visibility ${theme.transitionDuration.short};

  &:active {
    visibility: visible;
  }
`;

const Input = styled.input`
  border: none;
  padding: 0;
  display: block;
  order: 0;
  width: 100%;
  height: 40px;
  font-size: 16px;
  letter-spacing: -0.02em;
  color: inherit;
  background-color: transparent;
  cursor: pointer;

  &::placeholder {
    transition: color ${theme.transitionDuration.short};
    color: ${theme.colors.grey100}
  }
`;

const ExtraButtonsWrapper = styled.div`
  border-radius: 0 8px 8px 0;
  background-color: ${theme.colors.grey400};
  height: 100%;
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  height: 40px;
  align-items: center
`;

const InputFieldContainer = styled.div<{
  iconPosition: TIconPosition,
  isFocus: boolean,
  isFilled: boolean,
  isDisabled: boolean,
  hasExtraButton: boolean,
}>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  padding: 9px 12px;
  background-color: ${theme.colors.grey400};
  transition: background ${theme.transitionDuration.short};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.blackBase};
    background-color: ${theme.colors.grey300};

    ${Input} {
      &::placeholder {
        color: ${theme.colors.blackBase};
      }
    }
  }

  &:active {
    ${Input} {
      &::placeholder {
        color: transparent;
      }
    }
  }

  ${Input}:focus {
    outline: none;
    border: none;
    box-shadow: none;

    &::placeholder {
      color: transparent;
    }
  }

  ${({ isFocus, isFilled }) => (isFocus || isFilled) && css`
    color: ${theme.colors.blackBase};
    background-color: ${theme.colors.grey300};

    ${Input} {
      &::placeholder {
        color: ${theme.colors.blackBase};
      }
    }

    ${ResetButton} {
      visibility: visible;
    }
	`}

  ${({ isDisabled }) => isDisabled && css`
    background-color: ${theme.colors.grey300};
    pointer-events: none;

    ${Input} {
      &::placeholder {
        color: ${theme.colors.grey200};
      }
    }
	`}

  ${({ hasExtraButton }) => hasExtraButton && css`
    border-radius: 8px 0 0 8px;
    padding: 12px 6px 12px 9px;
  `}
`;

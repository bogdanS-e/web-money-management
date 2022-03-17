import theme from '@/styles/theme';
import { onEnter, onBackspace, events } from '@/utils/events';
import useInput from '@/utils/hooks/useInput';
import useToggle from '@/utils/hooks/useToggle';
import { X } from 'phosphor-react';
import React, { SyntheticEvent, useEffect, useRef } from 'react'
import styled from 'styled-components';


interface Props {
  values: string[];
  indicators?: (boolean | null)[];
  onAdd: (value: string) => void;
  onDelete: (index: number) => void;
  currentValue?: string;
  width?: string;
  isValid?: (value: string) => boolean;
  onFocus?: (e: SyntheticEvent) => void;
  onBlur?: (e: SyntheticEvent) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
}

const TagInput: React.FC<Props> = ({
  values,
  indicators,
  onAdd,
  onDelete,
  currentValue,
  width = '100%',
  isValid,
  onFocus,
  onBlur,
  onTextChange,
  placeholder,
}) => {
  const [value, setValue] = useInput(currentValue ?? '');
  const [error, handleError] = useToggle(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(currentValue);

  }, [currentValue]);

  const onType = (value: string) => {
    if (value[value.length - 1] === ',') {
      onSubmit()
    } else {
      setValue(value);
      onTextChange?.(value);
    }
  };

  const onSubmit = () => {
    if (isValid && !isValid(value)) {
      handleError.toggleThereAndBack(200);
    } else {
      onAdd(value);
      setValue('');
      onTextChange?.('');
    }
  };

  const onDeleteLast = () => {
    if (value.length) return;

    onDelete(values.length - 1);
  };

  const handleBlur = (e) => {
    if (value.length !== 0) {
      onSubmit();
    }
    onBlur?.(e);
  };

  const handleClick = (e: SyntheticEvent) => {
    inputRef.current?.focus();
    onFocus?.(e);
  };

  return (
    <InputWrapper
      width={width}
      onClick={handleClick}
    >
      {values.map((item, index) => (
        <Tag key={item}>
          {indicators && (
            <Indicator status={indicators[index]} />
          )}
          {item}
          <OptionClose onClick={(e) => {
            e.stopPropagation()
            onDelete(index)
          }}>
            <X
              size={10}
              onClick={(e) => {
                e.stopPropagation;
                onDelete(index);
              }}
            />
          </OptionClose>
        </Tag>
      ))}
      <TextInput
        ref={inputRef}
        value={value}
        onChange={({ target: { value } }) => onType(value)}
        placeholder={placeholder}
        error={error}
        onKeyDown={events(
          onEnter(onSubmit),
          onBackspace(onDeleteLast),
        )}
        onBlur={handleBlur}
      />
    </InputWrapper>
  );
};

export default TagInput;

interface InputWrapperProps {
  width: string;
}

const InputWrapper = styled.div<InputWrapperProps>`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: ${({ width }) => width};
  border: 1px solid ${theme.colors.secondary};
  border-radius: 4px;
  padding: 8px;
  background-color: ${theme.colors.whiteBase};
`;

const TextInput = styled.input<{ error: boolean }>`
  width: 240px;
  height: 22px;
  outline: none;
  background-color: transparent;
  border: 0;
  color: ${theme.colors.secondary};
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 4px;
  position: relative;
  box-sizing: border-box;
  pointer-events: none;

  &::placeholder {
    color: ${theme.colors.grey7};
  }

  ${({ error }) => error && `
    animation: shake 700ms cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
  `}

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-0.5px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(1px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-2px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(2px, 0, 0);
    }
  }
`;

const Tag = styled.div`
  position: relative;
  height: 22px;
  border-radius: 4px;
  border: 1px solid #aaaaaa;
  background: ${theme.colors.greyF0};
  font-size: 14px;
  margin: 0 4px 4px 0;
  padding: 4px 16px 4px 4px;
  display: flex;
  align-items: center;
  color: ${theme.colors.secondary};
  white-space: nowrap;
  box-sizing: border-box;
`;

const Indicator = styled.div<{ status: boolean | null }>`
  width: 6px;
  height: 6px;
  margin-right: 4px;
  border-radius: 50%;
  background-color: ${({ status }) => status === null ? theme.colors.grey7 : (status ? theme.colors.green : theme.colors.red)};
`

const OptionClose = styled.div`
  position: absolute;
  right: 1px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 16px;
  height: 16px;  
  display: flex;
  align-items: center;
  justify-content: center;
`

import React from 'react';
import styled from 'styled-components';

import DropdownMenu from './dropdown-menu';

import theme from '../../styles/theme';
import { Icon, ArrowDown  } from 'phosphor-react';
import { TStyled } from '@/styles/types';

type TDropdownAlign = 'left' | 'center' | 'right';

interface IOption<T extends string> {
  key: T;
  title: string;
  icon?: Icon;
  onClick?: (key: T) => void;
}

interface Props<T extends string> {
  onChange?: (key: T) => void;
  options: IOption<T>[];
  className?: string;
  activeStyle?: string;
  dropdownLabel?: string;
  hasArrow?: boolean;
  isArrowAnimated?: boolean;
  isAutocomplete?: boolean;
  isAutocompletePreventDefault?: boolean;
  buttonLabel?: string;
  align?: TDropdownAlign;
  stopPropagation?: boolean;
  Icon?: Icon;
}

const Select = <T extends string>({
  options,
  onChange,
  dropdownLabel,
  buttonLabel,
  align = 'left',
  stopPropagation = false,
  hasArrow = true,
  isArrowAnimated = false,
  isAutocomplete = false,
  isAutocompletePreventDefault = true,
  Icon,
  className,
  activeStyle,
}: Props<T>) => {
  const renderTrigger = (isActive: boolean) => (
    <Button
      className={className}
      isActive={isActive}
      activeStyle={activeStyle}
    >
      {Icon && (
        <ButtonIcon>
          <Icon />
        </ButtonIcon>
      )}
      <Label>
        {buttonLabel}
      </Label>
      {hasArrow && (
        <ArrowIcon
          isActive={isArrowAnimated && isActive}
          size={18}
        />
      )}
    </Button>
  );

  return (
    <DropdownMenu
      triggerArea={renderTrigger}
      stopPropagation={stopPropagation}
      label={dropdownLabel}
      align={align}
      onChange={onChange}
      options={options}
      isAutocomplete={isAutocomplete}
      isAutocompletePreventDefault={isAutocompletePreventDefault}
    />
  );
};

export default Select;

const Button = styled.button<{ isActive: boolean; activeStyle?: string }>`
  border-radius: 6px;
  background-color: ${theme.colors.grey400};
  padding: 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: none;
  ${({ isActive, activeStyle }) => isActive && activeStyle};
`;

const ButtonIcon= styled.div`
  margin-right: 10px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const ArrowIcon: TStyled<typeof ArrowDown , { isActive: boolean }> = styled(ArrowDown ) <{ isActive: boolean }>`
  margin-left: auto;
  transform: rotateZ(${({ isActive }) => (isActive ? '180deg' : '0deg')});
  transition: transform 0.2s;
`;

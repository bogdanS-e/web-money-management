import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import useToggle from '@/utils/hooks/useToggle';
import usePrevious from '@/utils/hooks/usePrevious';
import useEventOnToggle from '@/utils/hooks/useEventOnToggle';
import { events, onEnter } from '../../utils/events';

import theme from '../../styles/theme';
import { Icon } from 'phosphor-react';
import { Row } from '@/styles/layout';

type TDropdownAlign = 'left' | 'center' | 'right';

enum AutocompleteControllers {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
}

const AutocompleteInit = -1;

interface IOption<T extends string> {
  key: T;
  title: string;
  icon?: Icon;
  onClick?: (key: T) => void;
}

interface Props<T extends string> {
  triggerArea: (isActive: boolean) => React.ReactNode;
  onChange?: (key: T) => void;
  filterOptions?: (option: IOption<T>, index: number, optionsArray: IOption<T>[]) => boolean;
  isAutocomplete?: boolean;
  isAutocompletePreventDefault?: boolean;
  isShown?: boolean;
  options: IOption<T>[];
  label?: string;
  width?: string;
  align?: TDropdownAlign;
  stopPropagation?: boolean;
}

const DropdownMenu = <T extends string>({
  triggerArea,
  onChange,
  filterOptions,
  options,
  label,
  align = 'left',
  isShown = false,
  stopPropagation = false,
  isAutocomplete = false,
  isAutocompletePreventDefault = true,
}: Props<T>) => {
  const dropdownMenu = useRef<HTMLDivElement | null>(null);

  const [isDropdownShown, handleDropdownShown] = useToggle(false);

  const [autocompleteIndex, setAutocompleteIndex] = useState(AutocompleteInit);

  const filtredOptions = useMemo(() => {
    if (!filterOptions) {
      return options;
    }

    return options.filter(filterOptions);
  }, [filterOptions, options]);

  const onCloseDropdown = () => {
    if (isShown) return;

    handleDropdownShown.disable();
    setAutocompleteIndex(AutocompleteInit);
  }

  const onClickOutside = (event) => {
    if (dropdownMenu && !dropdownMenu.current?.contains(event.target)) {
      onCloseDropdown();
    }
  };

  const getAutocompleteIndex = useCallback((index: number) => {
    const maxIndex = filtredOptions.length - 1;
    if (index < 0) {
      return maxIndex;
    }

    if (index > maxIndex) {
      return 0;
    }

    return index;
  }, [filtredOptions]);

  const handleAutocomplete = useCallback((event) => events((e) => {
    isAutocompletePreventDefault && e.preventDefault();

    if (!isAutocomplete) return;

    const { key } = e;

    if (AutocompleteControllers[key]) {
      if (key === AutocompleteControllers.ArrowUp) {
        setAutocompleteIndex((prevIndex) => getAutocompleteIndex(prevIndex - 1));

        return;
      }

      setAutocompleteIndex((prevIndex) => getAutocompleteIndex(prevIndex + 1));
    }

  })(event), [isAutocomplete, getAutocompleteIndex]);

  const onChooseAutocomplete = useCallback((event) => onEnter(() => {
    if (autocompleteIndex === AutocompleteInit) return;

    const option = filtredOptions[autocompleteIndex];

    if (option) {
      onCloseDropdown();
      option.onClick?.(option.key);
      onChange?.(option.key);
    }

  })(event), [autocompleteIndex, onChange, filtredOptions]);

  const prevAutoOnChoose = usePrevious(onChooseAutocomplete);
  const prevAutoHandle = usePrevious(handleAutocomplete);

  useEventOnToggle(document, isDropdownShown, 'click', onClickOutside);

  useEffect(() => {
    if (!isShown) {
      onCloseDropdown();
    }

    handleDropdownShown.set(isShown);
  }, [isShown]);

  useEffect(() => {//useEffect to manage listener function. In case if it was update, we update listener
    if (!prevAutoOnChoose || !isAutocomplete) return;

    if (prevAutoOnChoose !== onChooseAutocomplete) {
      document.removeEventListener('keydown', prevAutoOnChoose);
      document.addEventListener('keydown', onChooseAutocomplete);
    }
  }, [isAutocomplete, prevAutoOnChoose, onChooseAutocomplete]);

  useEffect(() => {//useEffect to manage listener function. In case if it was update, we update listener
    if (!prevAutoHandle || !isAutocomplete) return;

    if ((prevAutoHandle !== handleAutocomplete)) {
      document.removeEventListener('keydown', prevAutoHandle);
      document.addEventListener('keydown', handleAutocomplete);
    }
  }, [isAutocomplete, prevAutoHandle, handleAutocomplete]);

  useEffect(() => {
    if (!isAutocomplete && autocompleteIndex === AutocompleteInit) return;

    if (!isDropdownShown) {//remove eventlisteners when dropdown is close
      document.removeEventListener('keydown', onChooseAutocomplete);
      document.removeEventListener('keydown', handleAutocomplete);
      return;
    }

    if (autocompleteIndex === AutocompleteInit) {//Add event listeners when dropdown is open
      document.addEventListener('keydown', onChooseAutocomplete);
      document.addEventListener('keydown', handleAutocomplete);
    }

  }, [isAutocomplete, autocompleteIndex, isDropdownShown, onChooseAutocomplete, handleAutocomplete]);

  const onOptionClick = (event, option: IOption<T>) => {
    if (event) {
      event.stopPropagation();
    }

    onCloseDropdown();

    option.onClick?.(option.key);
    onChange?.(option.key);
  };

  return (
    <Container ref={dropdownMenu}>
      <Trigger onClick={(e) => {
        stopPropagation && e.stopPropagation();
        handleDropdownShown.toggle();
      }}>
        {triggerArea(isDropdownShown && !!filtredOptions.length)}
      </Trigger>
      <Dropdown
        align={align}
        isShown={isDropdownShown && !!filtredOptions.length}
      >
        {label && (
          <Label>
            {label}
          </Label>
        )}
        {filtredOptions.map((option, index) => (
          <Option
            isActive={index === autocompleteIndex}
            key={option.key}
            onClick={(event) => onOptionClick(event, option)}
          >
            {option.icon && (
              <OptionIcon>
                <option.icon size={18} />
              </OptionIcon>
            )}
            {option.title}
          </Option>
        ))}
      </Dropdown>
    </Container>
  );
};

export default DropdownMenu;

const Container = styled.div`
  position: relative;
`;

const Trigger = styled.div`
  cursor: pointer;
`;

const Dropdown = styled.div<{
  align: TDropdownAlign;
  isShown: boolean;
}>`
  min-width: 180px;
  position: absolute;
  top: calc(100% + 6px);
  z-index: 1;
  padding: 6px;
  border-radius: 14px;
  background-color: ${theme.colors.whiteBase};
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.16);
  opacity: 0;
  visibility: hidden;
  transition: opacity ${theme.transitionDuration.short}, visibility 0s ${theme.transitionDuration.short};

  ${({ isShown }) => isShown && css`
    transition: opacity ${theme.transitionDuration.short};
    opacity: 1;
    visibility: visible;
  `}

  ${({ align }) => align === 'left' && css`
    left: 0;
  `}
  
  ${({ align }) => align === 'center' && css`
    left: 50%;
    transform: translateX(-50%);
  `}
  
  ${({ align }) => align === 'right' && css`
    right: 0;
  `}
`;

const Label = styled.div`
  width: 100%;
  height: 36px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 14px;
  color: ${theme.colors.blackBase};
  display: flex;
  align-items: center;
`;
const OptionIcon = styled(Row)`
  margin-right: 12px;
`;

const OptionHoverCSS = css`
  color: ${theme.colors.blackBase};
  background-color: ${theme.colors.grey300};
`;

const Option = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 36px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 14px;
  color: ${theme.colors.grey100};
  background-color: ${theme.colors.whiteBase};
  transition: background-color ${theme.transitionDuration.short}, color ${theme.transitionDuration.short};
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;

  ${({ isActive }) => isActive && OptionHoverCSS}

  &:hover {
    ${OptionHoverCSS};
  }

  span.highlighted-text {
    font-weight: bold;
  }
`;

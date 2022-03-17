import React from 'react';
import styled from 'styled-components';

import theme from '../../styles/theme';

interface Props {
  selected: boolean;
  onSelect: (selected: boolean) => void;
  className?: string;
}

const Toggle: React.FC<Props> = ({ selected, onSelect, className }) => (
  <Container className={className}>
    <Switch selected={selected} onClick={() => onSelect(!selected)}>
      <Circle selected={selected} />
    </Switch>
  </Container>
);

export default Toggle;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled.div<{ selected: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  cursor: pointer;
  border-radius: 20px;
  background-color: ${({ selected }) =>
    selected ? theme.colors.success : theme.colors.grey200};
  transition: background-color ${theme.transitionDuration.short};
`;

const Circle = styled.div<{ selected: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ selected }) => (selected ? '21px' : '3px')};
  background-color: ${theme.colors.whiteBase};
  transition: left ${theme.transitionDuration.short};
`;

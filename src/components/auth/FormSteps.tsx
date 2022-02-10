import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';

interface IStep {
  title: string;
  isActive?: boolean;
}

interface Props {
  steps: IStep[];
  className?: string;
}

const FormSteps: React.FC<Props> = ({ steps, className }) => (
  <List className={className}>
    {steps.map(({ title, isActive = false }, index) => (
      <ListItem
        isActive={isActive}
        key={title + index}
      >
        {title}
      </ListItem>
    ))}
  </List>
);

export default FormSteps;

const List = styled.ol`
  margin: 0;
  display: flex;
  padding: 0;
  position: relative;
  z-index: 1;
`;

const ListItem = styled.li<{ isActive: boolean }>`
  flex: 1 1;
  list-style-position: inside;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.02em;
  color: ${({ isActive }) => isActive ? theme.colors.primary : theme.colors.grey100};
  position: relative;
  padding-bottom: 10px;
  margin-left: 8px;

  &::first-child {
    margin-left: 0;
  }

  &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    content: '';
    width: 100%;
    height: 2px;
    background-color: ${({ isActive }) => isActive ? theme.colors.primary : theme.colors.grey100};
  }
`;
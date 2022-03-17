import React, { CSSProperties, UIEventHandler } from 'react';
import styled from 'styled-components';

import theme from '../../styles/theme';

interface PropScrollingWrapper {
  children: React.ReactNode;
  styles?: CSSProperties;
  onScroll?: UIEventHandler;
  className?: string;
}

const ScrollingWrapper: React.FC<PropScrollingWrapper> = ({
  children,
  styles,
  onScroll,
  className,
}) => {
  return (
    <ScrollWrapper
      className={className}
      style={{ ...styles }}
      onScroll={onScroll}
    >
      <ChildrenContainer>
        {children}
      </ChildrenContainer>
    </ScrollWrapper>
  );
};

export default ScrollingWrapper;

const ChildrenContainer = styled.div`
  color: ${theme.colors.blackBase};
`;

const ScrollWrapper = styled.div`
  overflow-y: scroll;
  color: transparent;
  scroll-behavior: smooth;
  transition: color ${theme.transitionDuration.short};

  ::-webkit-scrollbar {
      width: 6px;
  }

  ::-webkit-scrollbar-track {
      background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
      background: transparent;
      box-shadow: inset 0 0 0 10px;
      border-radius: 16px;
  }

  ::-webkit-scrollbar-button {
      display:none;
  }

  &:hover {
    color: ${theme.colors.scrollBar};
  }
`;

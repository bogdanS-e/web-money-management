import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

import vars from '@vars';

import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const ModalWrapper: React.FC<Props> = ({ onClose, children, className }) => {
  return (
    <Wrapper className={className}>
      <StyledIconButton onClick={onClose}>
        <CloseRoundedIcon />
      </StyledIconButton>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${vars.colors.white};
  border-radius: 4px;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
`;

export default ModalWrapper;

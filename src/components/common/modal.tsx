import { onEscape } from '@/utils/events';
import useEventOnToggle from '@/utils/hooks/useEventOnToggle';
import usePortal from '@/utils/hooks/usePortal';
import { Button } from '@material-ui/core';
import { X } from 'phosphor-react';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import theme from '../../styles/theme';

interface Props {
  isShown: boolean;
  onClose: () => void;
  header: string;
  content?: React.ReactNode;
  isLoading?: boolean;
  actions?: {
    submit: {
      title: string;
      onClick: () => void;
      disabled?: boolean;
    };
    hasCancel: boolean;
  };
  width?: string;
}

const Modal: React.FC<Props> = ({
  isShown,
  onClose,
  header,
  content,
  actions,
  width = '50%',
  isLoading = false,
}) => {
  const [handlePortal] = usePortal();

  const onKeyClick = (event) => onEscape(onClose)(event);

  useEventOnToggle(document, isShown, 'keydown', onKeyClick);

  const renderContent = (
    <ModalOverlay isShown={isShown} onClick={onClose}>
      <ModalContent width={width} onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalHeading>
            {header}
          </ModalHeading>
          <CloseButton  onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>
        {content && (
          <ModalBody>
            {content}
          </ModalBody>
        )}
        {actions && (
          <ModalFooter>
            {actions.hasCancel && (
              <Button
                variant='contained'
                color='secondary'
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
            <Button
              variant='contained'
              color='primary'
              disabled={isLoading || actions.submit.disabled}
              onClick={actions.submit.onClick}
            >
              {actions.submit.title}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );

  return handlePortal.createPortal(renderContent);
};

export default Modal;

const ModalOverlay = styled.div<{ isShown: boolean }>`
  display: ${({ isShown }) => (isShown ? 'block' : 'none')};
  position: fixed;
  z-index: 2147483645;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div<{ width: string }>`
  background-color: ${theme.colors.greyBackground};
  padding: 30px;
  border: 1px solid ${theme.colors.greyBorder};
  width: ${({ width }) => width};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-name: animatetop;
  animation-duration: 0.4s;
  border-radius: 12px;

  @media (max-width: 812px) {
    width: 80% !important;
  }

  > div:not(:last-child) {
    margin-bottom: 30px;
  }
`;

const ModalHeader = styled.div`
  padding: 0;
`;

const ModalHeading = styled.h5`
  margin: 0;
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: ${theme.colors.secondary};
  display: flex;
  align-items: center;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 0;
`;

const ModalFooter = styled.div`
  padding: 0;
  display: flex;
  justify-content: flex-end;

  > button {
    color: ${theme.colors.whiteBase};
    background-color: ${theme.colors.grey100};
    text-transform: none;
    margin-left: 10px;

    &:last-child {
      background-color: ${theme.colors.blackBase};
    }
  }
`;

export const ModalText = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: #2e2a4f;
  opacity: 0.65;
`;

import React from 'react'
import styled from 'styled-components'

import theme from '@/styles/theme'

interface Props {
  message: string | React.ReactNode | null;
  className?: string;
}

const ErrorMessage: React.FC<Props> = ({ message, className }) => {
  return message ? (
    <MessageContainer className={className}>{message}</MessageContainer>
  ) : null
}

export default ErrorMessage

const MessageContainer = styled.div`
  font-weight: 500;
  font-size: 14px;
  background-color: ${theme.colors.red};
  color: ${theme.colors.whiteBase};
  text-align: center;
  padding: 5px 10px;
  border-radius: 6px;
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

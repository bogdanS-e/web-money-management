import React, { useEffect, useState, useRef, useCallback } from 'react'
import styled, { css } from 'styled-components'

import Loader from './Loader'

import theme from '../../styles/theme'
import Link from './Link'

export function useIsMounted() {
  const isMountedRef = useRef(true)
  const isMounted = useCallback(() => isMountedRef.current, [])

  useEffect(() => {
    return () => void (isMountedRef.current = false)
  }, [])

  return isMounted
}

interface Props {
  onClick?: (e: React.MouseEvent) => void;
  link?: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  type?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconMargin?: string;
  className?: string;
  lineHeight?: string;
}

type ButtonType = 'primary' | 'secondary' | 'tertiary'

const TextButton: React.FC<Props> = ({
  onClick,
  link,
  children,
  width = 'auto',
  height = '40px',
  type = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconMargin = '15px',
  lineHeight,
  className
}) => {
  const [state, setState] = useState(loading)
  const isMounted = useIsMounted()

  async function handleClick(event) {
    if (loading || disabled) return

    setState(true)
    try {
      if (onClick) {
        return await onClick(event)
      }
    } finally {
      if (isMounted()) setState(false)
    }
  }
  useEffect(() => {
    setState(loading)
  }, [loading])

  const renderContent = () => (
    <>
      {state ? (
        <Loader />
      ) : (
        <>
          {leftIcon && (
            <IconWrapper side="left" margin={iconMargin}>
              {leftIcon}
            </IconWrapper>
          )}
          {children}
          {rightIcon && (
            <IconWrapper side="right" margin={iconMargin}>
              {rightIcon}
            </IconWrapper>
          )}
        </>
      )}
    </>
  )
  // FIX for not triggering default action when in focus
  const hdleKey = event => {
    if (event.keyCode == 13) {
      event.preventDefault()
    }
  }
  return link ? (
    <div onClick={handleClick} >
      <LinkContainer
        width={width}
        height={height}
        type={type}
        loading={loading ? 'true' : 'false'}
        disabled={disabled}
        href={link}
      >
        {renderContent()}
      </LinkContainer>
    </div>
  ) : (
    // @ts-ignore
    <ButtonContainer
      type={type}
      width={width}
      height={height}
      lineHeight={lineHeight}
      loading={loading ? 'true' : 'false'}
      disabled={disabled}
      className={className}
      onClick={handleClick}
      onKeyPress={hdleKey}
      onKeyDown={hdleKey}
    >
      {renderContent()}
    </ButtonContainer>
  )
}

export default TextButton

const ButtonContainer = styled.button<{
  type: ButtonType,
  width: string,
  height: string,
  lineHeight: string,
  disabled: boolean,
  loading: 'true' | 'false',
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  outline: none;
  height: ${({ height }) => height};
  line-height: ${({ lineHeight }) => lineHeight ? lineHeight : '40px'};
  font-size: 14px;
  font-weight: 500;
  padding: 0 10px;
  width: ${({ width }) => width};
  cursor: pointer;
  transition-property: background-color, color, opacity;
  transition-duration: 0.2s;
  white-space: nowrap;
  
  ${({ type }) =>
    type === 'primary' &&
    css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.whiteBase};

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.primary};
      }
    `}
  
  ${({ type }) =>
    type === 'secondary' &&
    css`
      background-color: ${theme.colors.transparentSecondary};
      color: ${theme.colors.secondary};

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.transparentSecondary2};
      }
    `}
  
  ${({ type }) =>
    type === 'tertiary' &&
    css`
      background-color: ${theme.colors.tertiary};
      color: ${theme.colors.secondary};

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.background};
      }
    `}
  
  ${({ loading }) =>
    loading === 'true' &&
    css`
      cursor: default;
    `}
   
  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${theme.colors.whiteBase};
      color: ${theme.colors.secondary};
      border: 1px solid ${theme.colors.secondary};
      opacity: 0.2;
      cursor: default;

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.whiteBase};
      }
    `}
`

const LinkContainer = styled(Link) <{
  type: ButtonType,
  width: string,
  height: string,
  disabled: boolean,
  loading: 'true' | 'false',
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  outline: none;
  height: ${({ height }) => height};
  line-height: 40px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 10px;
  width: ${({ width }) => width};
  cursor: pointer;
  text-decoration: none;
  transition-property: background-color, color, opacity;
  transition-duration: 0.2s;
  
  ${({ type }) =>
    type === 'primary' &&
    css`
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.whiteBase};

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.primary};
      }
    `}
  
  ${({ type }) =>
    type === 'secondary' &&
    css`
      background-color: ${theme.colors.transparentSecondary};
      color: ${theme.colors.secondary};

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.transparentSecondary2};
      }
    `}
  
  ${({ loading }) =>
    loading &&
    css`
      cursor: default;
    `}
  
  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${theme.colors.whiteBase};
      color: ${theme.colors.secondary};
      border: 1px solid ${theme.colors.secondary};
      opacity: 0.2;
      cursor: default;

      &:hover,
      &:active,
      &:focus {
        background-color: ${theme.colors.whiteBase};
      }
    `}
`

const IconWrapper = styled.div<{ side: 'right' | 'left'; margin: string }>`
  display: inline-flex;
  margin-left: ${({ side, margin }) => (side === 'right' ? margin : '0')};
  margin-right: ${({ side, margin }) => (side === 'left' ? margin : '0')};
`

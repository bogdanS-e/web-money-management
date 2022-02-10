import React from 'react'
import styled, { css } from 'styled-components'
import theme from '@/styles/theme'

interface Props {
  block?: boolean;
  width?: string;
  height?: string;
  inverted?: boolean;
  overlay?: boolean;
  relative?: boolean;
}

const Loader: React.FC<Props> = ({
  block = false,
  width = '100%',
  height = '100%',
  inverted = false,
  overlay = false,
  relative = false
}) => {
  return block ? (
    <Container
      width={width}
      height={height}
      overlay={overlay}
      relative={relative}
    >
      <LoaderSquare inverted={inverted}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </LoaderSquare>
    </Container>
  ) : (
    <LoaderInline inverted={inverted}>
      <div />
      <div />
      <div />
      <div />
    </LoaderInline>
  )
}

export default Loader

const Container = styled.div<{
  width: string,
  height: string,
  overlay: boolean,
  relative: boolean,
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ overlay, relative }) =>
    overlay &&
    css`
      backdrop-filter: blur(2px);
      position: ${relative ? 'absolute' : 'fixed'};
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
    `}
`

const LoaderSquare = styled.div<{ inverted: boolean }>`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({ inverted }) =>
      inverted ? theme.colors.whiteBase : theme.colors.primary};
    animation: lds-grid 1.2s linear infinite;

    &:nth-child(1) {
      top: 8px;
      left: 8px;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      top: 8px;
      left: 32px;
      animation-delay: -0.4s;
    }

    &:nth-child(3) {
      top: 8px;
      left: 56px;
      animation-delay: -0.8s;
    }

    &:nth-child(4) {
      top: 32px;
      left: 8px;
      animation-delay: -0.4s;
    }

    &:nth-child(5) {
      top: 32px;
      left: 32px;
      animation-delay: -0.8s;
    }

    &:nth-child(6) {
      top: 32px;
      left: 56px;
      animation-delay: -1.2s;
    }

    &:nth-child(7) {
      top: 56px;
      left: 8px;
      animation-delay: -0.8s;
    }

    &:nth-child(8) {
      top: 56px;
      left: 32px;
      animation-delay: -1.2s;
    }

    &:nth-child(9) {
      top: 56px;
      left: 56px;
      animation-delay: -1.6s;
    }
  }

  @keyframes lds-grid {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const LoaderInline = styled.div<{ inverted: boolean }>`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 20px;

  div {
    position: absolute;
    top: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ inverted }) =>
      inverted ? theme.colors.whiteBase : theme.colors.primary};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }

    &:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    &:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    &:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`

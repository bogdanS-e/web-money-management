import styled, { css } from 'styled-components'

import theme from './theme'

export const TwoColumnContainer = styled.div`
  width: 100vw;
  height: calc(100vh - ${theme.sizes.headerHeight});
  background-color: ${theme.colors.whiteBase};
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-column-gap: 0;
  align-items: stretch;
  justify-content: center;
`

export const Column = styled.div<{ inverted?: boolean }>`
  background-color: ${({ inverted = false }) =>
    inverted ? theme.colors.secondary : theme.colors.whiteBase};
  padding: 20px;

  ${({ inverted }) =>
    inverted &&
    css`
      background-image: url(${/* backgroundImage */''});
      background-position: 100% 0;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    `}
`

const ALIGN_HORIZONTAL = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end'
}

const ALIGN_VERTICAL = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  spaced: 'space-between'
}

export const Row = styled.div<{
  alignHorizontal?: 'top' | 'center' | 'bottom'
  alignVertical?: 'left' | 'center' | 'right' | 'spaced'
  rotated?: boolean
}>`
  display: flex;
  align-items: ${({ alignHorizontal }) =>
    ALIGN_HORIZONTAL[alignHorizontal ?? 'center']};
  justify-content: ${({ alignVertical }) =>
    ALIGN_VERTICAL[alignVertical ?? 'center']};
  flex-flow: ${({ rotated }) => (rotated ? 'column nowrap' : 'row nowrap')};
`

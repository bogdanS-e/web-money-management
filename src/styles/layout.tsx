import styled from 'styled-components';

const alignItems = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

type TAlignItems = 'start' | 'center' | 'end' | 'stretch';

const justifyContent = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  'spaced-between': 'space-between',
  'spaced-evenly': 'space-evenly',
  'spaced-around': 'space-around',
};

type TJustifyContent = 'start' | 'center' | 'end' | 'stretch' | 'spaced-between' | 'spaced-evenly' | 'spaced-around';

const Row = styled.div<{
  horizontal?: TJustifyContent,
  vertical?: TAlignItems,
  reversed?: boolean,
  wrapped?: boolean,
  fluid?: boolean,
}>`
  display: flex;
  width: ${({ fluid = false }) => fluid ? '100%' : 'auto'};
  align-items: ${({ vertical }) => alignItems[vertical ?? 'center']};
  justify-content: ${({ horizontal }) => justifyContent[horizontal ?? 'center']};
  flex-direction: ${({ reversed = false }) => reversed ? 'row-reverse' : 'row'};
  flex-wrap: ${({ wrapped = false }) => wrapped ? 'wrap' : 'nowrap'};
`;

const Column = styled.div<{
  horizontal?: TAlignItems,
  vertical?: TJustifyContent,
  reversed?: boolean,
  wrapped?: boolean,
  fluid?: boolean,
}>`
  display: flex;
  width: ${({ fluid = false }) => fluid ? '100%' : 'auto'};
  align-items: ${({ horizontal }) => alignItems[horizontal ?? 'center']};
  justify-content: ${({ vertical }) => justifyContent[vertical ?? 'center']};
  flex-direction: ${({ reversed = false }) => reversed ? 'column-reverse' : 'column'};
  flex-wrap: ${({ wrapped = false }) => wrapped ? 'wrap' : 'nowrap'};
`;

const Grid = styled.div<{
  columnsTemplate?: string,
  rowsTemplate?: string,
  columnsGap?: string,
  rowsGap?: string,
  horizontal?: TAlignItems,
  vertical?: TAlignItems,
  fluid?: boolean,
}>`
  width: ${({ fluid = false }) => fluid ? '100%' : 'auto'};
  display: grid;
  grid-template-columns: ${({ columnsTemplate }) => columnsTemplate};
  grid-template-rows: ${({ rowsTemplate }) => rowsTemplate};
  grid-column-gap: ${({ columnsGap }) => columnsGap};
  grid-row-gap: ${({ rowsGap }) => rowsGap};
  align-items: ${({ vertical }) => vertical ? alignItems[vertical] : 'normal'};
  justify-items: ${({ horizontal }) => horizontal ? justifyContent[horizontal] : 'normal'};
`;

export {
  Row,
  Column,
  Grid,
};

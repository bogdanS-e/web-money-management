import { DefaultTheme, StyledComponent, ThemedCssFunction } from 'styled-components';

type TStyled<C extends keyof JSX.IntrinsicElements | React.ComponentType<any>, K extends object = {}> = C & StyledComponent<C, any, K>

type TStyle = ThemedCssFunction<DefaultTheme> | undefined;

enum DeviceType {
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
}

export {
  DeviceType,
};

export type {
  TStyled,
  TStyle,
};

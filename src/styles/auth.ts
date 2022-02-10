import styled, { css } from 'styled-components'
import { Column, Row } from './layout';
import ATM from '../../public/assets/money.png';
import ATM1 from '../../public/assets/money1.png';
import Logo from '../../public/assets/logo.png';
import LogoText from '../../public/assets/logo-text.png';

import theme from './theme'
import { TStyled } from './types';

export const AuthPageContainer = styled(Column)`
  height: 100vh;
  

  &::after {
    background: url(${ATM1}) no-repeat center;
    background-size: cover;
    content: '';
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(4px);
    z-index: 0;
  }
`;

export const FormContainer: TStyled<typeof Column, {
  width?: string
  extension?: boolean
}> = styled(Column) <{
  width?: string
  extension?: boolean
}>`
  position: relative;
  z-index:1;
  width: ${({ width }) => width ?? '460px'};
  min-height: 660px;
  padding: 139px 44px 24px;
  box-shadow: 0 20px 30px 0 rgba(46, 42, 79, 0.15);
  border: 1px solid ${theme.colors.grey200};
  border-radius: 20px;
  position: relative;
  background: url(${Logo}) 55px 54px no-repeat, url(${LogoText}) 110px 54px no-repeat ${theme.colors.whiteBase};
  background-size: 41px, 115px 35px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: -348px;
    bottom: -20px;
    width: 483px;
    height: 686px;
    background: url('/atm.png') center;
  }

  &::after {
    background-image: url('');
    width: 700px;
    height: 843px;
    left: 89px;
    bottom: -16px;
  }

  ${({ extension }) =>
      extension &&
      css`
      border: none;
      padding: 0;
      background-color: transparent;
      box-shadow: none;
    `}
`;

export const FormHeader = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  letter-spacing: -0.01em;
  color: ${theme.colors.blackBase};
  margin-bottom: 14px;
`;

export const FormHeaderSubtitle = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  letter-spacing: -0.02em;
  color: ${theme.colors.blackBase};
  margin-bottom: 44px;
`;

export const GoogleButton: TStyled<typeof Row, { text: string }> = styled(Row) <{ text: string }>`
  width: 100%;
  height: 66px;
  background-color: ${theme.colors.whiteBase};
  border: 1px solid ${theme.colors.grey300};
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  cursor: pointer;

  &::before {
    content: '';
    width: 34px;
    height: 34px;
    background: url('google_logo') no-repeat;
    background-size: contain;
    margin-right: 12px;
  }

  &::after {
    content: '${({ text }) => text}';
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.02em;
    color: ${theme.colors.blackBase};
  }
`;

export const Divider = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 140%;
  text-trnsform: uppercase;
  text-align: center;
  letter-spacing: -0.02em;
  color: ${theme.colors.grey100};
  margin: 14px 0;
`;

export const MessageContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
  margin-top: -15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
`

export const TextWrapper = styled.div`
  padding-top: 15px;
  text-align: center;
`

export const InputsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 20px;
`

export const MessageWrapper = styled.div`
  width: 80%;
  margin: 30px auto;
`

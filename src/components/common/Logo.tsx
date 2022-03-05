import { Row } from '@/styles/layout';
import React from 'react';
import styled, { css } from 'styled-components';

import LogoImg from '../../../public/assets/logo.png';
import LogoText from '../../../public/assets/logo-text.png';

interface Props {
  className?: string;
}

const Logo: React.FC<Props> = ({ className }) => {

  return (
    <Row className={className}>
      <img style={{ height: '100%' }} src={LogoImg} alt="logo" />
      <LogoTextWrapper>
        <img style={{ height: '100%' }} src={LogoText} alt="logo-text" />
      </LogoTextWrapper>
    </Row>
  );
};

export default Logo;

const LogoTextWrapper = styled.div`
  margin-left: 6px;
  margin-top: -3px;
  height: 100%;
`;


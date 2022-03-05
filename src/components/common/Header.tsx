import { Row } from '@/styles/layout';
import { Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Logo from './logo';
import UserMenu from './user-menu';

interface Props {

}

const Header: React.FC<Props> = () => {
  return (
    <HeaderWrapper fluid>
      <Container>
        <Row fluid>
          <StyledLogo />
          <MenuWrapper>
            <UserMenu />
          </MenuWrapper>
        </Row>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled(Row)`
  min-height: 60px;
  padding: 0px 40px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 14px;
`;

const MenuWrapper = styled.div`
  margin-left: auto;
`;

const StyledLogo = styled(Logo)`
  height: 30px;
`;
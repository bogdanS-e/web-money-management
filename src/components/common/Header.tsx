import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Menu, MenuItem } from '@material-ui/core';

import vars from '@vars';

import { isSignedIn, logout } from '@/api/auth';

import {
  loginFail,
  loginSuccess,
  logout as logoutAction,
  redirectTo,
} from '@/store/auth/actions';
import {
  selectIsChecked,
  selectIsLoggedIn,
  selectUser,
} from '@/store/selectors';

import Logo from '@/components/common/Logo';
import Link from '@/components/common/Link';

interface Props {
  hubTitle?: string;
  headerLink?: string;
}

const Header: React.FC<Props> = ({ hubTitle, headerLink }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isChecked = useSelector(selectIsChecked);

  const openMenuHandelr = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const closeMenuHandler = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const signOutHandler = React.useCallback(() => {
    logout()
      .then(() => {
        dispatch(logoutAction());
      })
      .catch(console.error);
    closeMenuHandler();
  }, [closeMenuHandler, dispatch]);

  const getCurrentUrlHandler = React.useCallback(
    () => {
      let pathName = router.pathname;
      if (pathName === '/sign-in' || pathName === '/sign-up' || pathName === '/refresh-password') {
        return;
      }

      Object.entries(router.query).forEach(([key, value]) => {
        if (pathName.includes(`/[${key}]`)) {
          pathName = pathName.replace(`/[${key}]`, `/${value as string}`);

        }
      });
      dispatch(redirectTo(pathName));
    },
    [dispatch, router.pathname, router.query],
  );

  React.useEffect(() => {
    if (isChecked) return;

    isSignedIn()
      .then(() => {
        dispatch(loginSuccess());
      })
      .catch(() => dispatch(loginFail()));
  }, [dispatch, isChecked]);

  return (
    <StyledHeader id='header'>
      <Container>
        <LogoLink href='/?r=true' >
          <LogoWrapper>
            <Logo />
            <HamletHub>HamletHub</HamletHub>
          </LogoWrapper>
        </LogoLink>
        {hubTitle && headerLink && <HamletHub>
          <HubLink href={headerLink}>
            {hubTitle}
          </HubLink>
        </HamletHub>}
        {isLoggedIn ? (
          <UserWrapper onClick={openMenuHandelr}>
            <StyledAvatar>{user?.email[0].toUpperCase()}</StyledAvatar>
            <UserName>{user?.email}</UserName>
          </UserWrapper>
        ) : (
            <StyledLink href='/sign-in'>
              <SignLink onClick={getCurrentUrlHandler}>
                Sign in
              </SignLink>
            </StyledLink>
          )}
      </Container>
      <StyledMenu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenuHandler}
      >
        <StyledMenuItem onClick={signOutHandler}>Sign out</StyledMenuItem>
      </StyledMenu>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  height: 60px;
  background-color: ${vars.colors.green};
  position: relative;
  overflow: hidden;
`;

const SignLink = styled.span`
  margin-right: 10px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  height: 100%;
  margin: 0 auto;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HamletHub = styled.div`
  font-size: 30px;
  margin-left: 10px;
  color: #ffffff;
  user-select: none;

  @media (max-width: 580px) {
    font-size: 18px;
  }
`;

const LogoLink = styled(Link)`
  color: inherit;

  & :hover {
    text-decoration: none;
  }
`;

const HubLink = styled(Link)`
  color: inherit;
`;

const UserWrapper = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background-color: #888;
`;

const UserName = styled.div`
  margin-right: 10px;
  font-size: 14px;
  color: #ffffff;

  @media (max-width: 580px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  color: #ffffff;
`;

const StyledMenu = styled(Menu).attrs({
  anchorOrigin: {
    vertical: 48,
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
  keepMounted: true,
})`
  & > .MuiPaper-root {
    width: 220px;
    border-radius: 0 0 4px 4px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &:not(:last-child) {
    border-bottom: 1px solid ${vars.colors.grey};
  }
`;

export default Header;

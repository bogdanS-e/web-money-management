import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { TStyled } from '@/styles/types';
import Select from './select';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/store/selectors';
import { SignOut } from 'phosphor-react';
import { clearCookie } from '@/utils/cookies';
import { setUser } from '@/store/user/actions';
import { loginFail } from '@/store/auth/actions';

interface Props {

}

const UserMenu: React.FC<Props> = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const onSignOut = () => {
    clearCookie();
    dispatch(setUser(null));
    dispatch(loginFail());
    router.push('sign-in');
  };

  if (!user) return null;

  return (
    <StyledSelect
      align='right'
      options={[{
        key: 'sign_out',
        title: 'Sign out',
        icon: SignOut,
        onClick: onSignOut
      }]}
      isArrowAnimated
      buttonLabel={user.name ?? '...'}
    />
  );
};

export default UserMenu;

const StyledSelect: TStyled<typeof Select> = styled(Select)`
  font-size: 14px;
  line-height: 22px;
  background: transparent;
  padding: 0;
`;

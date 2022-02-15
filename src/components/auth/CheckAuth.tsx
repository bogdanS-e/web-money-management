import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser } from '@/api/user';
import { useRequest } from '@/utils/hooks/useRequest';
import { selectIsLoggedIn } from '@/store/selectors';
import { loginFail, loginSuccess } from '@/store/auth/actions';
import { setUser } from '@/store/user/actions';

interface Props {

}

const CheckAuth: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const getUserRequest = useRequest(getUser, {
    onSuccess: (user) => {
      dispatch(setUser(user));
      dispatch(loginSuccess());
    },
    onError: () => {
      dispatch(loginFail());
    },
  })

  useEffect(() => {
    if (isLoggedIn) return;
    
    getUserRequest.fetch();
  }, [isLoggedIn]);

  return null;
};

export default CheckAuth;

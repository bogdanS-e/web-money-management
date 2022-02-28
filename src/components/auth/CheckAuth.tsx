import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getUser } from '@/api/user';
import { useRequest } from '@/utils/hooks/useRequest';
import { loginFail, loginSuccess } from '@/store/auth/actions';
import { setUser } from '@/store/user/actions';

interface Props {

}

const CheckAuth: React.FC<Props> = () => {
  const dispatch = useDispatch();

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
    getUserRequest.fetch();
  }, []);

  return null;
};

export default CheckAuth;

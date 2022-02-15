import { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';
import { getUser } from '@/api/user';
import useSSRRequest from '@/utils/hooks/useSSRRequest';
import { IUser } from '@/api/models/user';
import Page from '@/components/common/Page';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUser } from '@/store/selectors';
import { useRouter } from 'next/router';
import { useRequest } from '@/utils/hooks/useRequest';
import { loginFail, loginSuccess } from '@/store/auth/actions';
import { setUser } from '@/store/user/actions';

interface Props {
  user?: IUser;
}

const Home: React.FC<Props> = () => {
  const user = useSelector(selectUser);

  const router = useRouter();
  const dispatch = useDispatch();
  
  const isLoggedIn = useSelector(selectIsLoggedIn);
  
  const getUserRequest = useRequest(getUser, {
    onSuccess: (userData) => {
      dispatch(loginSuccess());
      dispatch(setUser(userData));
    },
    onError: () => {
      dispatch(loginFail());
    },
  })

  useEffect(() => {
    if (isLoggedIn === null) return;

    if (isLoggedIn && !user) {
      getUserRequest.fetch();
    }
  }, [user, isLoggedIn]);

  if (isLoggedIn === null) {
    return null;
  }

  if (!isLoggedIn) {
    router.push('/sign-in', undefined, { shallow: true });

    return (
      <Page title='Web money page' />
    );
  }
  
  return (
    <Page title={user ? `${user.name}'s page` : 'Web money page'}>
      lollol
    </Page>
  );
};

/* export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const resp = await useSSRRequest(req, res, '/user/get-user/');

  if (resp.status === 200) {
    const user = await resp.json();

    return {
      props: {
        user,
      },
    }
  }

  return { props: {} }
} */


export default Home;

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  TextField,
  Button,
  LinearProgress,
  Link as MaterialLink,
} from '@material-ui/core';

import vars from '@vars';
import { useInput } from '@/utils/hooks';
import { toast } from '@/utils/toast';

import { Auth } from '@/api/auth';

import { loginSuccess } from '@/store/auth/actions';
import { selectIsChecked, selectIsLoggedIn, selectRedirectPath } from '@/store/selectors';

import Page from '@/components/common/Page';
import Link from '@/components/common/Link';
// import SocialAuth from '@/components/auth/SocialAuth';

interface Props { }

const SignIn: React.FC<Props> = () => {
  const router = useRouter();
  const [email, setEmail] = useInput('');
  const [password, setPassword] = useInput('');
  const [code, setCode] = useInput('');
  const [isPending, setIsPending] = React.useState(false);
  const [isConfirmCode, setIsConfirmCode] = React.useState(false);
  const [authInstance, setAuthInstance] = React.useState<Auth>();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const allowRender = useSelector(selectIsChecked);
  const redirectTo = useSelector(selectRedirectPath);

  const signInHandler = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setIsPending(true);

      const auth = new Auth(email, password);

      setAuthInstance(auth);

      auth
        .signIn()
        .then(() => dispatch(loginSuccess()))
        .catch((error: Error) => {
          if (error.name === 'UserNotConfirmedException') {
            setIsConfirmCode(true);

            auth.resendCode();
          }
          toast('error', error.message || 'Something went wrong');
        })
        .finally(() => setIsPending(false));
    },
    [dispatch, email, password],
  );

  const confirmEmail = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setIsPending(true);

      authInstance
        ?.confirmEmail(code)
        .then(() => authInstance.signIn())
        .then(() => dispatch(loginSuccess()))
        .catch((error: Error) => toast('error', error.message || 'Something went wrong'))
        .finally(() => setIsPending(false));
    },
    [authInstance, code, dispatch],
  );

  const resendCodeHandler = React.useCallback(() => {
    setIsPending(true);

    authInstance
      ?.resendCode()
      .then(() => toast('success', 'Confirmation code has been sent'))
      .catch((error: Error) => toast('error', error.message || 'Something went wrong'))
      .finally(() => setIsPending(false));
  }, [authInstance]);

  React.useEffect(() => {
    if (!isLoggedIn) return;

    router.push(redirectTo || '/');
  }, [isLoggedIn, router, redirectTo]);

  if (isLoggedIn) return null;
  // if (isLoggedIn || !allowRender) return null;

  return (
    <Page>
      {isPending && <LinearProgress />}
      <MainHeading>Sign in</MainHeading>
      <FormContainer>
        <form onSubmit={isConfirmCode ? confirmEmail : signInHandler}>
          {isConfirmCode ? (
            <StyledTextField
              value={code}
              onChange={setCode}
              label='Code'
              variant='outlined'
              size='small'
              fullWidth
            />
          ) : (
              <>
                <StyledTextField
                  value={email}
                  onChange={setEmail}
                  label='Email'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
                <StyledTextField
                  value={password}
                  onChange={setPassword}
                  type='password'
                  label='Password'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              </>
            )}
          <SubmitButton disabled={isPending}>
            {isConfirmCode ? 'Confirm email' : 'Sign in'}
          </SubmitButton>
        </form>
        {
          /* !isConfirmCode && <SocialAuth /> */
        }
        {isConfirmCode ? (
          <ResendButtonWrapper>
            <ResendButton onClick={resendCodeHandler}>
              Resend confirmation code
            </ResendButton>
          </ResendButtonWrapper>
        ) : (
            <>
              <Typography variant='body2' align='center'>
                Don’t have an account yet? <Link href='/sign-up'>Sign up</Link>
              </Typography>
              <Typography variant='body2' align='center'>
                Forgot your password? <Link href='/refresh-password'>Refresh password</Link>
              </Typography>
            </>
          )}
      </FormContainer>
    </Page>
  );
};

const MainHeading = styled(Typography).attrs({
  component: 'h1',
  variant: 'h5',
})`
  display: block;
  margin: 30px 0 40px 0;
  text-align: center;
`;

const FormContainer = styled.div`
  width: 400px;
  margin: 0 auto;

  @media (max-width: 568px){
    width: 95%;
  }
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 30px;
  }
`;

const SubmitButton = styled(Button).attrs({
  variant: 'contained',
  color: 'primary',
  fullWidth: true,
  type: 'submit',
})`
  margin-bottom: 20px;

  & > .MuiButton-label {
    color: ${vars.colors.white};
    text-transform: none;
    text-decoration: underline;
    font-size: 15px;
  }
`;

const ResendButtonWrapper = styled.div`
  display: flex;
`;

const ResendButton = styled(MaterialLink).attrs({
  component: 'button',
  variant: 'body2',
})`
  margin: 0 auto;
`;

export default SignIn;

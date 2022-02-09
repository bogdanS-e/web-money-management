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

const SignUp: React.FC<Props> = () => {
  const router = useRouter();
  const [email, setEmail] = useInput('');
  const [password, setPassword] = useInput('');
  const [code, setCode] = useInput('');
  const [isPending, setIsPending] = React.useState(false);
  const [hasCodeSent, setHasCodeSent] = React.useState(false);
  const [authInstance, setAuthInstance] = React.useState<Auth>();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const allowRender = useSelector(selectIsChecked);
  const redirectTo = useSelector(selectRedirectPath);

  const signUpHandler = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setIsPending(true);

      const auth = new Auth(email, password);

      auth
        .signUp()
        .then(() => {
          setHasCodeSent(true);
        })
        .catch((error: Error) => toast('error', error.message || 'Something went wrong'))
        .finally(() => setIsPending(false));

      setAuthInstance(auth);
    },
    [email, password],
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
      <MainHeading>Sign up</MainHeading>
      <FormContainer>
        <form onSubmit={hasCodeSent ? confirmEmail : signUpHandler}>
          {hasCodeSent ? (
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
                <PasswordPolicy>
                  <li>Password must be at least 7 characters</li>
                  <li>Contain numbers and only latin characters</li>
                  <li>Uppercase and lowercase letters</li>
                  <li>
                    Contain special character from this set:
                    <div>
                      {'= + - ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < \' : ; | _ ~ `'}
                    </div>
                  </li>
                </PasswordPolicy>
              </>
            )}
          <SubmitButton disabled={isPending}>
            {hasCodeSent ? 'Confirm email' : 'Sign up'}
          </SubmitButton>
        </form>
        {
          /* !hasCodeSent && <SocialAuth /> */
        }
        {hasCodeSent ? (
          <ResendButtonWrapper>
            <ResendButton onClick={resendCodeHandler}>
              Resend confirmation code
            </ResendButton>
          </ResendButtonWrapper>
        ) : (
            <Typography variant='body2' align='center'>
              Already have an account? <Link href='/sign-in'>Sign in</Link>
            </Typography>
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

const PasswordPolicy = styled.ul`
  margin-top: -20px;
  padding-left: 17px;

  > li {
    color: rgba(0, 0, 0, 0.54);
    margin: 0;
    font-size: 0.75rem;
    margin-top: 3px;
    font-weight: 400;
    line-height: 1.66;
    letter-spacing: 0.03333em;

    > div {
      color: ${vars.colors.black};
      font-weight: bold;
      padding: 5px 10px;
      font-size: 0.78rem;
      letter-spacing: 1.7px;
      border-radius: 3px;
      background-color: #8080801f;
    }
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

export default SignUp;

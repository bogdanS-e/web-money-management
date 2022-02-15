import React from 'react';
import styled from 'styled-components';

import ClickableText from '@/components/common/ClickableText';
import TextButton from '@/components/common/TextButton';
import ErrorMessage from '@/components/common/ErrorMessage';
import TextInput from '@/components/common/text-input';
import FormFooter from './FormFooter';
import FormSteps from './FormSteps';
import cookieCutter from 'cookie-cutter';

import {
  FormContainer,
  FormHeader,
  TextWrapper,
  FormHeaderSubtitle,
  MessageContainer,
} from '@/styles/auth';
import theme from '@/styles/theme';
import { Column } from '@/styles/layout';
import { useRouter } from 'next/router';
import useForm, { VALIDATORS } from '@/utils/hooks/useForm';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useRequest } from '@/utils/hooks/useRequest';
import { signIn } from '@/api/auth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/auth/actions';

interface Props {

}

const SignInForm: React.FC<Props> = () => {
  const { email } = useQueryParams<{ code: string; email: string }>();

  const dispatch = useDispatch();

  const router = useRouter();

  const signInForm = useForm(
    {
      name: '',
      email: email ?? '',
      password: '',
    },
    {
      email: [VALIDATORS.NOT_EMPTY_STRING('Email'), VALIDATORS.VALID_EMAIL()],
      password: [
        VALIDATORS.NOT_EMPTY_STRING('Password'),
      ],
    },
  );

  const signInRequest = useRequest(signIn, {
    onSuccess: (data) => {
      cookieCutter.set('access_token', data.accessToken);
      cookieCutter.set('refresh_token', data.refreshToken);
      dispatch(loginSuccess());
      router.push('/sign-up', undefined, { shallow: true });
    },
  });

  const onSignIn = () => {
    if (!signInForm.isValid()) return;

    signInRequest.fetch({
      email: signInForm.data.email,
      password: signInForm.data.password,
    });
  };

  const renderForm = () => (
    <Column>
      <FormContainer>
        <FormHeader>Sign In to start management!</FormHeader>
        <FormHeaderSubtitle>The cross-platform app for online money management.</FormHeaderSubtitle>
        <MessageContainer>
          {signInRequest.fail && (
            <ErrorMessage
              message={signInRequest.error?.message ?? 'Something went wrong'}
            />
          )}
        </MessageContainer>
        <div style={{ width: '100%' }}>
          <StyledTextInput
            onChange={signInForm.edit('email')}
            onEnter={onSignIn}
            inputAttributes={{
              placeholder: 'Email address',
              value: signInForm.data.email,
              name: 'email',
              type: 'email',
            }}
          />
          {signInForm.errors.email[0] && (
            <InputErrorMessage message={signInForm.errors.email[0]} />
          )}

          <StyledTextInput
            onChange={signInForm.edit('password')}
            onEnter={onSignIn}
            inputAttributes={{
              placeholder: 'Password',
              value: signInForm.data.password,
              name: 'password',
              type: 'password',
            }}
          />
          {signInForm.errors.password[0] && (
            <InputErrorMessage message={signInForm.errors.password[0]} />
          )}

          <SubmitWrapper>
            <TextButton
              onClick={onSignIn}
              width='100%'
              loading={signInRequest.loading}
              disabled={signInRequest.loading}
            >
              Sign In
            </TextButton>
          </SubmitWrapper>
          <TextWrapper>
            <ClickableText
              text='Do not have an account? ~~Sign up~~'
              onClick={() => {
                router.push('/sign-up', undefined, { shallow: true });
              }}
            />
          </TextWrapper>
        </div>
        <FooterWrapper>
          <FormFooter />
        </FooterWrapper>
      </FormContainer>
    </Column >
  );

  return (
    <>
      <StyledFormSteps
        steps={[
          {
            title: 'Create your account',
            isActive: true,
          },
          {
            title: 'Start manage your buget',
          },
        ]}
      />
      {renderForm()}
    </>
  );
};

export default SignInForm;

const FooterWrapper = styled.div`
  margin-top: auto;
`;

const StyledFormSteps = styled(FormSteps)`
  max-width: 830px;
  width: 100%;
  margin: 24px 0 20px;
`;

const StyledTextInput = styled(TextInput)`
  margin-top: 14px;
`;

const SubmitWrapper = styled.div`
  margin-top: 24px;
`;

const InputLabel = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: ${theme.colors.grey100};
  margin: 8px 0 8px 12px;
`;

const InputErrorMessage = styled(ErrorMessage)`
  display: inline-flex;
  margin-top: 10px;
`;
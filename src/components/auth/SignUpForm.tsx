import React from 'react';
import styled from 'styled-components';
import cookieCutter from 'cookie-cutter';

import ClickableText from '@/components/common/ClickableText';
import TextButton from '@/components/common/TextButton';
import ErrorMessage from '@/components/common/ErrorMessage';
import TextInput from '@/components/common/text-input';
import FormFooter from './FormFooter';
import FormSteps from './FormSteps';

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
import useToggle from '@/utils/hooks/useToggle';
import { useRequest } from '@/utils/hooks/useRequest';
import { confirmSignUp, resendCode, signUp } from '@/api/auth';
import LinkAndOtpForm from './LinkAndOtpForm';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/auth/actions';
interface Props {

}

const SignUpForm: React.FC<Props> = () => {
  const dispatch = useDispatch();
   
  const { email } = useQueryParams<{ code: string; email: string }>();

  const [isSubmitted, handleIsSubmitted] = useToggle(false);

  const router = useRouter();

  const signUpForm = useForm(
    {
      name: '',
      email: email ?? '',
      password: '',
    },
    {
      name: [VALIDATORS.NOT_EMPTY_STRING('Name')],
      email: [VALIDATORS.NOT_EMPTY_STRING('Email'), VALIDATORS.VALID_EMAIL()],
      password: [
        VALIDATORS.NOT_EMPTY_STRING('Password'),
      ],
    },
  );

  const signUpRequest = useRequest(signUp, {
    onSuccess: () => handleIsSubmitted.enable(),
  });

  const confirmSignUpRequest = useRequest(confirmSignUp, {
    onSuccess: (data) => {
      cookieCutter.set('access_token', data.accessToken);
      cookieCutter.set('refresh_token', data.refreshToken);
      dispatch(loginSuccess());
      router.push('/', undefined, { shallow: true });
    },
  });

  const resendCodeRequest = useRequest(resendCode);

  const onConfirmSignUp = (otpCode: string) => {
    confirmSignUpRequest.fetch({
      email: signUpForm.data.email,
      code: otpCode,
    });
  };

  const onSignUp = () => {
    if (!signUpForm.isValid()) return;

    signUpRequest.fetch({
      name: signUpForm.data.name,
      email: signUpForm.data.email,
      password: signUpForm.data.password,
    });
  };

  const renderForm = () => (
    <Column>
      <FormContainer>
        {isSubmitted ? (
          <ConfirmationMessageWrapper>
            <LinkAndOtpForm
              title={<>Verify your account. <Emoji>🎉</Emoji></>}
              disabled={confirmSignUpRequest.loading}
              onSubmit={onConfirmSignUp}
            />
            {confirmSignUpRequest.fail && (
              <ErrorMessage
                message={confirmSignUpRequest.error?.message ?? 'Something went wrong'}
              />
            )}
            <MessageText>
              Didn’t receive the link? <span
                onClick={() => resendCodeRequest.fetch(signUpForm.data.email)}>Click here</span> to resend the verification link.
            </MessageText>
            {resendCodeRequest.loading && (
              <SuccessMessage message='Sending confirmation email...' />
            )}
            {resendCodeRequest.success && (
              <SuccessMessage
                message='Confirmation email was re-sent. Please follow the instructions to complete the sign up' />
            )}
            {resendCodeRequest.fail && (
              <ErrorMessage
                message={resendCodeRequest.error?.message ?? 'Something went wrong'}
              />
            )}
          </ConfirmationMessageWrapper>
        ) : (
          <>
            <FormHeader>Sign up to start management!</FormHeader>
            <FormHeaderSubtitle>The cross-platform app for online money management.</FormHeaderSubtitle>
            <MessageContainer>
              {signUpRequest.fail && (
                <ErrorMessage
                  message={signUpRequest.error?.message ?? 'Something went wrong'}
                />
              )}
            </MessageContainer>
            <div style={{ width: '100%' }}>
              <StyledTextInput
                onChange={signUpForm.edit('name')}
                onEnter={onSignUp}
                inputAttributes={{
                  placeholder: 'Full name',
                  value: signUpForm.data.name,
                  name: 'name'
                }}
              />
              {signUpForm.errors.name[0] && (
                <InputErrorMessage message={signUpForm.errors.name[0]} />
              )}

              <StyledTextInput
                onChange={signUpForm.edit('email')}
                onEnter={onSignUp}
                inputAttributes={{
                  placeholder: 'Email address',
                  value: signUpForm.data.email,
                  name: 'email',
                  type: 'email',
                }}
              />
              {signUpForm.errors.email[0] && (
                <InputErrorMessage message={signUpForm.errors.email[0]} />
              )}

              <StyledTextInput
                onChange={signUpForm.edit('password')}
                onEnter={onSignUp}
                inputAttributes={{
                  placeholder: 'Password',
                  value: signUpForm.data.password,
                  name: 'password',
                  type: 'password',
                }}
              />
              <InputLabel>Must contain at least 8 characters</InputLabel>
              {signUpForm.errors.password[0] && (
                <InputErrorMessage message={signUpForm.errors.password[0]} />
              )}

              <SubmitWrapper>
                <TextButton
                  onClick={onSignUp}
                  width='100%'
                  loading={signUpRequest.loading}
                  disabled={signUpRequest.loading}
                >
                  Sign up with email
                </TextButton>
              </SubmitWrapper>
              <TextWrapper>
                <ClickableText
                  text='Already have an account? ~~Sign in~~'
                  onClick={() => {
                    router.push('/sign-in', undefined, { shallow: true });
                  }}
                />
              </TextWrapper>
            </div>
          </>
        )}
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

export default SignUpForm;

const FooterWrapper = styled.div`
  margin-top: auto;
`;

const ConfirmationMessageWrapper = styled(Column)`
  margin-top: 44px;
`;

const SuccessMessage = styled(ErrorMessage)`
  background: green;
`;

const MessageText = styled.div`
  width: 280px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: ${theme.colors.blackBase};
  margin-bottom: 9px;
  
  a, span {
    cursor: pointer;
    white-space: nowrap;
    color: ${theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Emoji = styled.span`
  font-weight: normal;
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
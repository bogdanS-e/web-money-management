import React from 'react';
import styled from 'styled-components';

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
} from '@/styles/auth';
import theme from '@/styles/theme';
import { Column } from '@/styles/layout';
import { useRouter } from 'next/router';
import useForm, { VALIDATORS } from '@/utils/hooks/useForm';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useToggle from '@/utils/hooks/useToggle';

interface Props {

}

const SignUpForm: React.FC<Props> = () => {
  const { email } = useQueryParams<{ code: string; email: string }>();

  const [isSubmitted, handleIsSubmitted] = useToggle(false);
  const [isShownPassword, handleIsShownPassword] = useToggle(false);

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

  const renderForm = () => (
    <Column>
      <FormContainer>
        <FormHeader>Sign up to start management!</FormHeader>
        <FormHeaderSubtitle>The cross-platform app for online money management.</FormHeaderSubtitle>
        {/* <MessageContainer>
                {signUpRequest.fail && (
                  <ErrorMessage
                    message={signUpRequest.error?.message ?? 'Something went wrong'}
                  />
                )}
              </MessageContainer> */}
        <div>
          <StyledTextInput
            onChange={signUpForm.edit('name')}
            //onEnter={onSignUp}
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
            //onEnter={onSignUp}
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
            //onEnter={onSignUp}
            inputAttributes={{
              placeholder: 'Password',
              value: signUpForm.data.password,
              name: 'password',
              type: isShownPassword ? 'text' : 'password',
            }}
          />
          <InputLabel>Must contain at least 8 characters and 1 capital letter</InputLabel>
          {signUpForm.errors.password[0] && (
            <InputErrorMessage message={signUpForm.errors.password[0]} />
          )}

          <SubmitWrapper>
            <TextButton
              //onClick={onSignUp}
              width='100%'
            //loading={signUpRequest.loading}
            //disabled={signUpRequest.loading}
            >
              Sign up with email
            </TextButton>
          </SubmitWrapper>
          <TextWrapper>
            <ClickableText
              text='Already have an account? ~~Sign in~~'
              onClick={() => {
                router.push('/sign-in');
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

export default SignUpForm;

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
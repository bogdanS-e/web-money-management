import { confirmSignUp, resendCode } from '@/api/auth';
import useForm, { VALIDATORS } from '@/utils/hooks/useForm';
import { useRequest } from '@/utils/hooks/useRequest';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import cookieCutter from 'cookie-cutter';

import {
  FormContainer,
  FormHeader,
  MessageContainer,
  TextWrapper,
} from '../../styles/auth';
import ClickableText from '../common/ClickableText';
import ErrorMessage from '../common/ErrorMessage';
import TextInput from '../common/text-input';
import TextButton from '../common/TextButton';
import OtpInput from './otp-input';
import { loginSuccess } from '@/store/auth/actions';
import { useDispatch } from 'react-redux';

interface Props {
  email: string;
  code: string;
}

const ConfirmSignUpForm: React.FC<Props> = (props) => {
  const params = props;
  
  const dispatch = useDispatch();
  const router = useRouter();

  const confirmSignUpForm = useForm(
    {
      email: params?.email ?? '',
      code: params?.code ?? '',
    },
    {
      email: [VALIDATORS.NOT_EMPTY_STRING('Email'), VALIDATORS.VALID_EMAIL()],
      code: [VALIDATORS.NOT_EMPTY_STRING('Code')],
    },
  );


  const confirmSignUpRequest = useRequest(confirmSignUp, {
    onSuccess: (data) => {
      cookieCutter.set('access_token', data.accessToken);
      cookieCutter.set('refresh_token', data.refreshToken);
      dispatch(loginSuccess());
      router.push('/', undefined, { shallow: true });
    }
  });

  const resendCodeRequest = useRequest(resendCode);

  useEffect(() => {
    if (params.email && params.code) {
      confirmSignUpRequest.fetch(params);
    } else {
      router.push('/sign-up', undefined, { shallow: true });
    }
  }, []);

  const onConfirm = () => {
    if (!confirmSignUpForm.isValid() || !confirmSignUpRequest.loading) return;

    confirmSignUpRequest.fetch(
      confirmSignUpForm.data.email,
      confirmSignUpForm.data.code,
    );
  };

  const onResend = () => {
    resendCodeRequest.fetch(confirmSignUpForm.data.email);
  };

  return (
    <FormContainer vertical='start'>
      <FormHeader>Confirm sign up</FormHeader>
      <MessageContainer>
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
        {confirmSignUpRequest.fail && (
          <ErrorMessage
            message={confirmSignUpRequest.error?.message ?? 'Something went wrong'}
          />
        )}
      </MessageContainer>
      <div>
        <TextInput
          onChange={confirmSignUpForm.edit('email')}
          onEnter={onConfirm}
          inputAttributes={{
            placeholder: 'Email address',
            value: confirmSignUpForm.data.email,
            name: 'email',
            type: 'email',
          }}
        />
        {confirmSignUpForm.errors.email[0] && (
          <InputErrorMessage message={confirmSignUpForm.errors.email[0]} />
        )}

        {!params.code && (
          <OtpWrapper>
            <OtpInput
              submitWhenFormIsFiled
              disabled={confirmSignUpRequest.loading}
              onSubmit={onConfirm}
              onChange={confirmSignUpForm.edit('code')}
            />
          </OtpWrapper>
        )}
        <TextButton
          onClick={onConfirm}
          width='100%'
          loading={confirmSignUpRequest.loading}
          disabled={confirmSignUpRequest.loading}
        >
          Confirm
        </TextButton>
        <TextWrapper>
          <ClickableText
            text="If you don't receive the email, click ~~here~~ to resend it"
            onClick={onResend}
          />
        </TextWrapper>
      </div>
    </FormContainer>
  );
};

export default ConfirmSignUpForm;

const InputErrorMessage = styled(ErrorMessage)`
  display: inline-flex;
  margin-top: 10px;
`;

const SuccessMessage = styled(ErrorMessage)`
  background: green;
`;

const OtpWrapper = styled.div`
  margin: 24px 0 84px;
  width: 100%;
`;

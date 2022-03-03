import React, { useMemo } from 'react';
import styled from 'styled-components';

import ClickableText from '@/components/common/ClickableText';
import TextButton from '@/components/common/TextButton';
import ErrorMessage from '@/components/common/ErrorMessage';
import TextInput from '@/components/common/text-input';
import cookieCutter from 'cookie-cutter';

import {
  FormContainer,
  FormHeader,
  TextWrapper,
  FormHeaderSubtitle,
  MessageContainer,
} from '@/styles/auth';
import theme from '@/styles/theme';
import { Column, Row } from '@/styles/layout';
import { useRouter } from 'next/router';
import useForm, { VALIDATORS } from '@/utils/hooks/useForm';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useRequest } from '@/utils/hooks/useRequest';
import { signIn } from '@/api/auth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/auth/actions';
import FormFooter from '../auth/FormFooter';
import { TextField } from '@material-ui/core';
import { setBudget } from '@/api/user';
import CategoryForm from '../common/category-form';
import { IBudget } from '@/api/models/user';

interface Props {
  budget: IBudget;
}

const SplitBugetForm: React.FC<Props> = ({ budget }) => {
  const dispatch = useDispatch();

  const router = useRouter();

  const onSubmit = (categories) => {
    console.log(categories);

  };

  const renderForm = () => (
    <Column>
      <StyledFormContainer>
        <FormHeader>Nice, you created your first budget <Emoji>🎉</Emoji></FormHeader>
        <FormHeaderSubtitle>Let's try to split it in different categories</FormHeaderSubtitle>
        <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
          <CategoryForm
            budgetId={budget.id}
            onSubmit={onSubmit}
            triggerArea={(
              <SubmitWrapper>
                <TextButton
                  width='55%'
                //loading={isLoading}
                //disabled={isLoading}
                >
                  Done
                </TextButton>
              </SubmitWrapper>
            )}
          />

          {/* signInForm.errors.email[0] && (
            <InputErrorMessage message={signInForm.errors.email[0]} />
          ) */}


        </div>
        <FooterWrapper>
          <FormFooter />
        </FooterWrapper>
      </StyledFormContainer>
    </Column >
  );

  return (
    renderForm()
  );
};

export default SplitBugetForm;

const FooterWrapper = styled.div`
  margin-top: auto;
`;

const Emoji = styled.span`
  font-weight: normal;
`;

const SubmitWrapper = styled.div`
  margin: 24px 0;
`;

const StyledFormContainer = styled(FormContainer)`
  min-height: 0;
`;
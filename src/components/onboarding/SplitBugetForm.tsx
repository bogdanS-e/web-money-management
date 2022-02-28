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

interface Props {
  
}

const SplitBugetForm: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const budgetForm = useForm(
    {
      name: 'My EUR budget',
      budget: ''
    },
    {
      name: [VALIDATORS.NOT_EMPTY_STRING('Name')],
      budget: [VALIDATORS.NOT_EMPTY_STRING('Budget')],
    },
  );

  const setBudgetRequest = useRequest(setBudget, {
    onSuccess: (budget) => {
      console.log(budget);
    }
  });

  const isLoading = useMemo(() => {
    return setBudgetRequest.loading
  }, [setBudgetRequest.loading]);

  const handleSetBudget = () => {
    const parsedBudget = parseInt(budgetForm.data.budget);

    if (isNaN(parsedBudget) || !budgetForm.isValid()) return;

    setBudgetRequest.fetch({
      amount: parsedBudget,
      name: budgetForm.data.name,
    });
  }

  const renderForm = () => (
    <Column>
      <StyledFormContainer>
        <FormHeader>Nice, you created your first budget <Emoji>🎉</Emoji></FormHeader>
        <FormHeaderSubtitle>Let's try to split it in different categories</FormHeaderSubtitle>
        <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
          <Column>
            
          </Column>

          {/* signInForm.errors.email[0] && (
            <InputErrorMessage message={signInForm.errors.email[0]} />
          ) */}

          <SubmitWrapper>
            <TextButton
              onClick={handleSetBudget}
              width='55%'
              loading={isLoading}
              disabled={isLoading}
            >
              Done
            </TextButton>
          </SubmitWrapper>
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
import React, { useMemo } from 'react';
import styled from 'styled-components';

import TextButton from '@/components/common/TextButton';
import ErrorMessage from '@/components/common/ErrorMessage';

import {
  FormContainer,
  FormHeader,
  FormHeaderSubtitle,
} from '@/styles/auth';
import { Column } from '@/styles/layout';
import useForm, { VALIDATORS } from '@/utils/hooks/useForm';
import { useRequest } from '@/utils/hooks/useRequest';
import { useDispatch } from 'react-redux';
import FormFooter from '../auth/FormFooter';
import { TextField } from '@material-ui/core';
import { setBudget } from '@/api/user';
import { addBudget } from '@/store/user/actions';

interface Props {
  username: string;
  onNextStep: () => void;
}

const CreateBugetForm: React.FC<Props> = ({ username, onNextStep }) => {
  const dispatch = useDispatch();

  const budgetForm = useForm(
    {
      name: 'My EUR budget',
      amount: ''
    },
    {
      name: [VALIDATORS.NOT_EMPTY_STRING('Name')],
      amount: [VALIDATORS.NOT_EMPTY_STRING('Amount')],
    },
  );

  const setBudgetRequest = useRequest(setBudget, {
    onSuccess: (budget) => {
      dispatch(addBudget(budget));
      onNextStep();
    }
  });

  const isLoading = useMemo(() => {
    return setBudgetRequest.loading
  }, [setBudgetRequest.loading]);

  const handleSetBudget = () => {
    const parsedBudget = parseInt(budgetForm.data.amount);

    if (!budgetForm.isValid() || isNaN(parsedBudget)) return;

    setBudgetRequest.fetch({
      amount: parsedBudget,
      name: budgetForm.data.name,
    });
  }

  const renderForm = () => (
    <Column>
      <StyledFormContainer>
        <FormHeader>Hi, {username}</FormHeader>
        <FormHeaderSubtitle>Let's start managing yor budget</FormHeaderSubtitle>
        <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
          <Column>
            <TextField
              onChange={({ target }) => budgetForm.edit('name')(target.value)}
              label='Enter your budget name'
              value={budgetForm.data.name}
              error={!!budgetForm.errors.name[0]}
              helperText={budgetForm.errors.name[0] || ''}
              margin='dense'
              inputProps={{
                style: {
                  textAlign: 'center',
                  width: '200px',
                },
              }}
            />
            <TextField
              onChange={({ target }) => budgetForm.edit('amount')(target.value)}
              label='Enter your budget amount'
              value={budgetForm.data.amount}
              error={!!budgetForm.errors.amount[0]}
              helperText={budgetForm.errors.amount[0] || ''}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 0,
                max: 10,
                style: {
                  textAlign: 'center',
                  width: '200px',
                },
              }}
              type="number"
            />
          </Column>

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

export default CreateBugetForm;

const FooterWrapper = styled.div`
  margin-top: auto;
`;

const SubmitWrapper = styled.div`
  margin: 24px 0;
`;

const StyledFormContainer = styled(FormContainer)`
  min-height: 0;
`;
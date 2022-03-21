import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { InputAdornment, TextField } from '@material-ui/core';

import { useRequest } from '@/utils/hooks/useRequest';
import { toast } from '@/utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserBudget } from '@/store/selectors';
import { updateBudget as updateBudgetApi } from '@/api/user';

import { Column, Row } from '@/styles/layout';
import { editBudgetAmountById } from '@/api/user';
import { updateBudget } from '@/store/user/actions';
import TextButton from './TextButton';

interface Props {
  budgetId: string;
  onSubmit?: () => void;
}

const IncrementBudgetForm: React.FC<Props> = ({ budgetId, onSubmit }) => {
  const dispatch = useDispatch();

  const budget = useSelector(selectUserBudget(budgetId));
  const [amount, setAmount] = useState('');

  const totalMoney = useMemo(() => {
    if (!budget) return null;

    const parsedAmount = parseInt(amount as string);

    if (isNaN(parsedAmount)) return budget.amount;

    return budget.amount + parsedAmount;
  }, [budget, amount]);

  const availableMoney = useMemo(() => {
    if (!budget) return null;

    const parsedAmount = parseInt(amount as string);

    if (isNaN(parsedAmount)) return budget.availableAmount;

    return budget.availableAmount + parsedAmount;
  }, [budget, amount]);

  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const updateRequest = useRequest(updateBudgetApi, {
    onSuccess: (budget) => {
      dispatch(updateBudget(budget));
      onSubmit?.();
    }
  });

  const handleOnSubmit = () => {
    if (!budget) return;

    if (availableMoney && availableMoney < 0) {
      toast('error', 'Available money cannot be negative number');
      return;
    }

    updateRequest.fetch({ id: budget.id, amount: totalMoney, availableAmount: availableMoney });
  };

  if (!budget) {
    throw new Error('Couldn`t find budget');
  }

  return (
    <FormContainer>
      {(totalMoney || totalMoney === 0) && (
        <Title>
          Total money: {totalMoney}
        </Title>
      )}
      {(availableMoney || availableMoney === 0) && (
        <Title>
          Available money: {availableMoney}
        </Title>
      )}
      <FormControl>
        <StyledTextField
          onChange={handleOnChange}
          value={amount}
          type="number"
          InputProps={{
            startAdornment: <StyledInputAdornment position="start">+</StyledInputAdornment>,
          }}
          inputProps={{
            placeholder: 'Enter amount',
          }}
        />
      </FormControl>

      <div style={{ width: '100%' }}>
        <SubmitWrapper>
          <TextButton
            width='55%'
            onClick={handleOnSubmit}
            loading={updateRequest.loading}
            disabled={updateRequest.loading}
          >
            Done
          </TextButton>
        </SubmitWrapper>
      </div>
    </FormContainer>
  );
};

export default IncrementBudgetForm;

const Title = styled.h2`
  margin-top: 0px;
`;

const FormContainer = styled(Column)`
  width: 100%;
`;

const FormControl = styled(Row)`
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  
`;

const StyledInputAdornment = styled(InputAdornment)`
  > * {
    font-size: 32px;
  }
`;

const SubmitWrapper = styled(Row)`
  margin: 24px 0;
`;

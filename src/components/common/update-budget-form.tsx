import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import { useRequest } from '@/utils/hooks/useRequest';
import { toast } from '@/utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserBudget } from '@/store/selectors';

import { Column, Row } from '@/styles/layout';
import { editBudgetAmountById } from '@/api/user';
import { updateBudget } from '@/store/user/actions';
import TextButton from './TextButton';

interface Props {
  budgetId: string;
  onSubmit?: () => void;
}

const UpdateBudgetForm: React.FC<Props> = ({ budgetId, onSubmit }) => {
  const dispatch = useDispatch();

  const budget = useSelector(selectUserBudget(budgetId));
  const [amount, setAmount] = useState(budget?.amount || '');

  const availableMoney = useMemo(() => {
    if (!budget) return null;

    const parsedAmount = parseInt(amount as string);

    if (isNaN(parsedAmount)) return;

    const difference = budget.amount - parsedAmount

    return budget.availableAmount - difference;
  }, [budget, amount]);

  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const updateRequest = useRequest(editBudgetAmountById, {
    onSuccess: (data) => {
      dispatch(updateBudget(data));
      onSubmit?.();
    },
  });

  const handleOnSubmit = () => {
    if (!budget) return;

    if (availableMoney && availableMoney < 0) {
      toast('error', 'Available money couldnot be negative number');
      return;
    }

    updateRequest.fetch(budget.id, parseInt(amount as string));
  };

  if (!budget) {
    throw new Error('Couldn`t find budget');
  }

  return (
    <FormContainer>
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
          inputProps={{
            placeholder: 'Enter new amount',
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

export default UpdateBudgetForm;

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

const SubmitWrapper = styled(Row)`
  margin: 24px 0;
`;

import React, { useState } from 'react';
import styled from 'styled-components';
import { InputAdornment, TextField } from '@material-ui/core';

import { useRequest } from '@/utils/hooks/useRequest';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserMoneyBox } from '@/store/selectors';
import { updateBox as updateBoxApi } from '@/api/user';

import { Column, Row } from '@/styles/layout';
import { updateBox, updateBudget } from '@/store/user/actions';
import TextButton from './TextButton';

interface Props {
  boxId: string;
  onSubmit?: () => void;
}

const IncrementBoxGoalForm: React.FC<Props> = ({ boxId, onSubmit }) => {
  const dispatch = useDispatch();

  const box = useSelector(selectUserMoneyBox(boxId));
  const [amount, setAmount] = useState('');

  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const updateRequest = useRequest(updateBoxApi, {
    onSuccess: (box) => {
      dispatch(updateBox(box));
      onSubmit?.();
    }
  });

  const handleOnSubmit = () => {
    if (!box) return;

    const parsedAmount = parseInt(amount);

    updateRequest.fetch({ id: box.id, goal: parsedAmount });
  };

  if (!box) {
    throw new Error('Couldn`t find box');
  }

  return (
    <FormContainer>
      <Title>
        Current amount: {box.goal}
      </Title>

      <FormControl>
        <StyledTextField
          onChange={handleOnChange}
          value={amount}
          type="number"
          inputProps={{
            placeholder: 'Change the goal',
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

export default IncrementBoxGoalForm;

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

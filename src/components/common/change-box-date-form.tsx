import React, { useState } from 'react';
import styled from 'styled-components';
import { InputAdornment, TextField } from '@material-ui/core';

import { useRequest } from '@/utils/hooks/useRequest';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserMoneyBox } from '@/store/selectors';
import { updateBox as updateBoxApi } from '@/api/user';

import { Column, Row } from '@/styles/layout';
import { updateBox } from '@/store/user/actions';
import TextButton from './TextButton';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';

import 'react-day-picker/dist/style.css';

interface Props {
  boxId: string;
  onSubmit?: () => void;
}

const ChangeBoxDateForm: React.FC<Props> = ({ boxId, onSubmit }) => {
  const dispatch = useDispatch();

  const box = useSelector(selectUserMoneyBox(boxId));
  const [selected, setSelected] = useState<Date | undefined>(new Date(box?.goalDate || Date.now()));

  const updateRequest = useRequest(updateBoxApi, {
    onSuccess: (box) => {
      dispatch(updateBox(box));
      onSubmit?.();
    }
  });

  const handleOnSubmit = () => {
    if (!box || !selected) return;

    updateRequest.fetch({ id: box.id, goalDate: selected.toISOString() });
  };

  if (!box) {
    throw new Error('Couldn`t find box');
  }

  let footer = <p>Please pick a date until you want to colect this amount of money</p>;

  if (selected) {
    footer = <p>You want to colect this amount of money until: <b>{moment(selected).format('DD.MM.YYYY')}</b></p>;
  }

  return (
    <FormContainer>
      <Title>
        Current goal date: {moment(box.goalDate).format('DD.MM.YYYY')}
      </Title>
      <DayPicker
        mode="single"
        defaultMonth={new Date(box.goalDate)}
        fromDate={new Date(box.startDate)}
        selected={selected}
        footer={footer}
        required
        onSelect={setSelected}
      />

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

export default ChangeBoxDateForm;

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

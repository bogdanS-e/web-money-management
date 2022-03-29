
import { Column, Row } from "@/styles/layout";
import useForm, { VALIDATORS } from "@/utils/hooks/useForm";
import useToggle from "@/utils/hooks/useToggle";
import { Button, Container, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { DayPicker } from 'react-day-picker';
import styled from "styled-components";
import Modal from "../common/modal";

import 'react-day-picker/dist/style.css';
import moment from "moment";
import { addMoneyBox } from "@/api/user";
import { useRequest } from "@/utils/hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
import { selectUserMoneyBoxes } from "@/store/selectors";
import MoneyBoxCard from "./MoneyBoxCard";
import { addMoneyBoxA } from "@/store/user/actions";

interface Props {
}

const MoneyBoxContainer: React.FC<Props> = () => {
  const moneyBoxes = useSelector(selectUserMoneyBoxes());
  const dispatch = useDispatch();

  const [showAddBox, handleShowAddBox] = useToggle(false);
  const [selected, setSelected] = useState<Date | undefined>(new Date(Date.now() + 1000 * 60 * 60 * 24));

  const budgetForm = useForm(
    {
      name: 'My new box',
      goal: ''
    },
    {
      name: [VALIDATORS.NOT_EMPTY_STRING('Name')],
      goal: [VALIDATORS.NOT_EMPTY_STRING('Goal')],
    },
  );

  let footer = <p>Please pick a date until you want to colect this amount of money</p>;

  if (selected) {
    footer = <p>You want to colect this amount of money until: <b>{moment(selected).format('DD.MM.YYYY')}</b></p>;
  }

  const setAddBoxRequest = useRequest(addMoneyBox, {
    onSuccess: (box) => {
      dispatch(addMoneyBoxA(box));
      handleShowAddBox.disable();
    }
  });

  const handleSetBudget = () => {
    const parsedBudget = parseInt(budgetForm.data.goal);

    if (!budgetForm.isValid() || isNaN(parsedBudget) || !selected) return;

    setAddBoxRequest.fetch({
      goal: parsedBudget,
      name: budgetForm.data.name,
      date: selected.toISOString(),
    });
  }

  return (
    <StyledContainer>
      <Row horizontal="start" vertical="start" wrapped>
        {moneyBoxes.map((box) => (
          <StyledBoxCard key={box.id} moneyBox={box} />
        ))}
      </Row>
      <AddBudgetButton>
        <Button
          variant='contained'
          color='primary'
          onClick={handleShowAddBox.enable}
        >
          Add new Money box
        </Button>
      </AddBudgetButton>

      {showAddBox && (
        <Modal
          header='Add new Money box'
          isShown={showAddBox}
          onClose={handleShowAddBox.disable}
          width='420px'
          content={(
            <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
              <Column>
                <TextField
                  onChange={({ target }) => budgetForm.edit('name')(target.value)}
                  label='Enter your box name'
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
                  onChange={({ target }) => budgetForm.edit('goal')(target.value)}
                  label='Enter your goal'
                  value={budgetForm.data.goal}
                  error={!!budgetForm.errors.goal[0]}
                  helperText={budgetForm.errors.goal[0] || ''}
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

                <DayPicker
                  mode="single"
                  defaultMonth={new Date()}
                  fromDate={new Date(Date.now() + 1000 * 60 * 60 * 24)}
                  selected={selected}
                  footer={footer}
                  required
                  onSelect={setSelected}
                />
              </Column>
            </div>
          )}
          actions={{
            hasCancel: true,
            submit: {
              title: 'Yes, add',
              onClick: handleSetBudget,
              //disabled: isLoading,
            },
          }}
        />
      )}
    </StyledContainer>
  );
};

export default MoneyBoxContainer;

const StyledContainer = styled(Container)`
  margin-top: 40px;
  min-height: calc(100vh - 100px);
  position: relative;
`;

const AddBudgetButton = styled.div`
  margin-top: 20px;
`;

const SubmitWrapper = styled.div`
  margin: 24px 0;
`;

const StyledBoxCard = styled(MoneyBoxCard)`
  width: calc(33.333333% - 15px);
  margin-bottom: 15px;

  &:not(:last-child) {
    margin-right: 15px;
  }
`;
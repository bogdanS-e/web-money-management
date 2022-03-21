import { setCategories } from "@/api/category";
import { ICreateCategory } from "@/api/models/category";
import { IBudget } from "@/api/models/user";
import { setBudget } from "@/api/user";
import { selectUserBudgets } from "@/store/selectors";
import { addBudget, updateBudget } from "@/store/user/actions";
import { Column, Row } from "@/styles/layout";
import useForm, { VALIDATORS } from "@/utils/hooks/useForm";
import { useRequest } from "@/utils/hooks/useRequest";
import useToggle from "@/utils/hooks/useToggle";
import { Button, Container, TextField } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CategoryForm from "../common/category-form";
import Modal from "../common/modal";
import BudgetCard from "./BudgetCard";
import TextButton from '@/components/common/TextButton';
import MoneyHistory from "@/mongo/moneyHistory";

interface Props {
}

const CardsContainer: React.FC<Props> = () => {
  const budgets = useSelector(selectUserBudgets());
  const [showAddBudget, handleShowAddBudget] = useToggle(false);
  const [showSplitBudget, handleShowSplitBudget] = useToggle(false);

  const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null);

  const dispatch = useDispatch();

  const budgetForm = useForm(
    {
      name: 'My new budget',
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
      setSelectedBudget(budget);
      handleShowSplitBudget.enable();
      handleShowAddBudget.disable();
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

  const setCategoriesRequest = useRequest(setCategories, {
    onSuccess: (resp) => {
      dispatch(updateBudget(resp));
      handleShowSplitBudget.disable();
    }
  });

  const onSubmit = (budgetId: string, categories: ICreateCategory[]) => {
    setCategoriesRequest.fetch({ budgetId, categories })
  };

  console.log(new MoneyHistory(budgets[0], budgets[1], 'h'));

  return (
    <StyledContainer>
      <Row horizontal="start" vertical="start" wrapped>
        {budgets.map((budget) => (
          <StyledBudgetCard key={budget.id} budget={budget} />
        ))}
      </Row>
      <AddBudgetButton>
        <Button
          variant='contained'
          color='primary'
          onClick={handleShowAddBudget.enable}
        >
          Add new budget
        </Button>
      </AddBudgetButton>

      {showAddBudget && (
        <Modal
          header='Add new Budget'
          isShown={showAddBudget}
          onClose={handleShowAddBudget.disable}
          width='420px'
          content={(
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
            </div>
          )}
          actions={{
            hasCancel: true,
            submit: {
              title: 'Add',
              onClick: handleSetBudget,
              disabled: isLoading,
            },
          }}
        />
      )}

      {showSplitBudget && selectedBudget && (
        <Modal
          header='Split budget'
          isShown={showSplitBudget}
          onClose={handleShowSplitBudget.disable}
          width='420px'
          content={(
            <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
              <CategoryForm
                budgetId={selectedBudget.id}
                onSubmit={onSubmit}
                triggerArea={(
                  <SubmitWrapper>
                    <TextButton
                      width='55%'
                      loading={setCategoriesRequest.loading}
                      disabled={setCategoriesRequest.loading}
                    >
                      Done
                    </TextButton>
                  </SubmitWrapper>
                )}
              />
            </div>
          )}
        />
      )}
    </StyledContainer>
  );
};

export default CardsContainer;

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

const StyledBudgetCard = styled(BudgetCard)`
  width: calc(33.333333% - 15px);
  margin-bottom: 15px;

  &:not(:last-child) {
    margin-right: 15px;
  }
`;
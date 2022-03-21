import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { MenuItem, Select, TextField, Button, InputAdornment } from '@material-ui/core';
import { CarSimple, House, Pizza, Bandaids, CurrencyDollar, Fire, Money, DotsThreeOutline, Plus, TrashSimple } from 'phosphor-react';

import { useRequest } from '@/utils/hooks/useRequest';
import { getCategories, incrementCategory } from '@/api/category';
import { TCategoryName, ICategory, ICreateCategory } from '@/api/models/category';
import { toast } from '@/utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserBudget } from '@/store/selectors';

import { Column, Row } from '@/styles/layout';
import theme from '@/styles/theme';
import { MappedIcon } from './category-form';
import { updateBudget } from '@/store/user/actions';

interface Props {
  onSubmit: () => void;
  categoryId: number;
  budgetId: string;
}

const IncrementCategoryForm: React.FC<Props> = ({ categoryId, budgetId, onSubmit }) => {
  const dispatch = useDispatch();

  const budget = useSelector(selectUserBudget(budgetId));
  const [amount, setAmount] = useState('');

  const [categories, setCategories] = useState<null | ICategory[]>(null);

  const availableMoney = useMemo(() => {
    if (!budget) return null;

    const parsedAmount = parseInt(amount as string);

    if (isNaN(parsedAmount)) return budget.availableAmount;

    return budget.availableAmount - parsedAmount;
  }, [budget, amount]);

  const getCategoriesRequest = useRequest(getCategories, {
    onSuccess: (data) => setCategories(data)
  });

  useEffect(() => {
    getCategoriesRequest.fetch();
  }, []);

  const handleOnChange = (e) => {
    setAmount(e.target.value);
  };

  const incrementCategoryRequest = useRequest(incrementCategory, {
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

    const parsedAmount = parseInt(amount as string);

    if (isNaN(parsedAmount)) return;

    incrementCategoryRequest.fetch({
      id: categoryId,
      amount: parsedAmount,
      budgetId,
    })
  };
  
  if (!categories) return null;

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
        <StyledSelect
          value={categoryId}
          disabled
          MenuProps={{
            style: { zIndex: '2147483646' }
          }}
        >
          <MenuItem value=''>Select category </MenuItem>
          {categories?.map(({ name, id }) => (
            <MenuItem
              key={id}
              value={id}
            >
              <Icon>
                {MappedIcon[name]}
              </Icon>
              {name}
            </MenuItem>
          ))}
        </StyledSelect>
        <StyledTextField
          onChange={handleOnChange}
          type="number"
          value={amount}
          InputProps={{
            startAdornment: <StyledInputAdornment position="start">+</StyledInputAdornment>,
          }}
          inputProps={{
            placeholder: 'Enter budget',
            style: {
              textAlign: 'center',
            },
          }}
        />
      </FormControl>

      <Row fluid horizontal='start'>
        <StyledButton
          color="primary"
          variant="contained"
          onClick={handleOnSubmit}
        >
          Done
        </StyledButton>
      </Row>
    </FormContainer>
  );
};

export default IncrementCategoryForm;

const Title = styled.h2`
  margin-top: 0px;
`;

const FormContainer = styled(Column)`
  width: 100%;
`;

const StyledInputAdornment = styled(InputAdornment)`
  > * {
    font-size: 32px;
  }
`;

const StyledButton = styled(Button)`
  text-transform: none;
  margin-top: 20px;
`;

const FormControl = styled(Row)`
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  margin: 2px 0 0 auto;
  width: 105px;
`;

const Icon = styled(Row)`
  margin-right: 6px;
`;

const StyledSelect = styled(Select)`
  .MuiSelect-select.MuiSelect-select{
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

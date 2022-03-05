import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { MenuItem, Select, TextField, Button } from '@material-ui/core';
import { CarSimple, House, Pizza, Bandaids, CurrencyDollar, Fire, Money, DotsThreeOutline, Plus } from 'phosphor-react';

import { useRequest } from '@/utils/hooks/useRequest';
import { getCategories } from '@/api/category';
import { TCategoryName, ICategory, ICreateCategory } from '@/api/models/category';
import { toast } from '@/utils/toast';
import { useSelector } from 'react-redux';
import { selectUserBudget } from '@/store/selectors';

import { Column, Row } from '@/styles/layout';

interface Props {
  onSubmit: (budgetId: string, data: ICreateCategory[]) => void;
  triggerArea: ReactNode;
  budgetId: string;
}

type IMappedIcon = {
  [key in TCategoryName]: ReactNode;
};

export const MappedIcon: IMappedIcon = {
  'Housing': <House size={18} />,
  'Transportation': <CarSimple size={18} />,
  'Food': <Pizza size={18} />,
  'Medical & Healthcare': <Bandaids size={18} />,
  'Personal Spending': <CurrencyDollar size={18} />,
  'Entertainment': <Fire size={18} />,
  'Bills': <Money size={18} />,
  'Other': <DotsThreeOutline size={18} />,
}

const CategoryForm: React.FC<Props> = ({ triggerArea, budgetId, onSubmit }) => {
  const budget = useSelector(selectUserBudget(budgetId));

  const [inputsCounter, setInputsCounter] = useState(1);
  const [categories, setCategories] = useState<null | ICategory[]>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<(number | null)[]>([]);

  const availableMoney = useMemo(() => {
    if (!budget) return null;

    const initAmount = budget.availableAmount;

    if (!inputValues) return initAmount;

    const inputSum = inputValues.reduce((total, cur) => (total || 0) + (cur || 0), 0);

    return initAmount - (inputSum || 0);
  }, [budget, inputValues]);

  const availableCategories = useMemo(() => {
    if (!categories) return [];

    return categories.filter(({ id }) => !selectedCategories.includes(id));
  }, [categories, selectedCategories]);

  const getCategoriesRequest = useRequest(getCategories, {
    onSuccess: (data) => setCategories(data)
  });

  const onAddCategory = () => {
    if (selectedCategories.length !== inputsCounter) return;

    setInputsCounter((prev) => prev + 1);
  };

  const handleSelect = (index: number) => (event) => {
    if (!event.target.value) return;

    const copySelected = [...selectedCategories];
    copySelected[index] = parseInt(event.target.value);
    setSelectedCategories(copySelected);

    setInputValues((prev) => {
      const copyInputsData = [...prev];

      if (!copyInputsData[index]) {
        copyInputsData[index] = null;
      }

      return copyInputsData;
    });
  };

  const handleOnChangeValue = (index: number) => (event) => {
    if (!event.target.value) return;

    const value = parseInt(event.target.value);

    setInputValues((prev) => {
      const copyInputsData = [...prev];
      copyInputsData[index] = value;

      return copyInputsData;
    });
  };

  const handleSubmit = () => {
    const mappedData: ICreateCategory[] = [];

    if (availableMoney && availableMoney < 0) {
      toast('error', 'Available money couldnot be negative number');
      return;
    }

    for (let i = 0; i < selectedCategories.length; i++) {
      if (!selectedCategories[i] || !inputValues[i]) {
        toast('error', 'Complete all fields');
        return;
      }

      const categoryId = selectedCategories[i];
      const categoryName = categories?.find(({ id }) => id === categoryId)?.name;

      if (!categoryName) {
        toast('error', 'Something went wrong');
        return;
      }

      mappedData.push({
        id: selectedCategories[i],
        amount: inputValues[i],
        name: categoryName,
      });
    }

    if (!mappedData.length) {
      toast('error', 'Complete all fields');
      return;
    }

    onSubmit(budgetId, mappedData);
  };

  useEffect(() => {
    getCategoriesRequest.fetch();
  }, []);

  const inputComponent = useCallback((index) => (
    <FormControl key={index}>
      <StyledSelect
        value={selectedCategories[index] || ''}
        onChange={handleSelect(index)}
        displayEmpty
      >
        <MenuItem value=''>Select category </MenuItem>
        {categories?.map(({ name, id }) => (
          <MenuItem
            key={id}
            value={id}
            disabled={selectedCategories.includes(id)}
          >
            <Icon>
              {MappedIcon[name]}
            </Icon>
            {name}
          </MenuItem>
        ))}
      </StyledSelect>
      <StyledTextField
        onChange={handleOnChangeValue(index)}
        type="number"
        disabled={!selectedCategories[index]}
        inputProps={{
          placeholder: 'Enter budget',
          inputMode: 'numeric',
          pattern: '[0-9]*',
          min: 0,
          max: 10,
          style: {
            textAlign: 'center',
          },
        }}
      />
    </FormControl>
  ), [availableCategories, selectedCategories]);

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

      {Array.from(new Array(inputsCounter)).map((_, index) => {
        return inputComponent(index);
      })}

      <Row fluid horizontal='start'>
        <StyledButton
          color="primary"
          variant="contained"
          startIcon={<Plus />}
          onClick={onAddCategory}
        >
          Add category
        </StyledButton>
      </Row>
      <div style={{ width: '100%' }} onClick={handleSubmit}>
        {triggerArea}
      </div>
    </FormContainer>
  );
};

export default CategoryForm;

const Title = styled.h2`
  margin-top: 0px;
`;

const FormContainer = styled(Column)`
  width: 100%;
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
  margin: 2px 0 0 20px;
  width: 120px;
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

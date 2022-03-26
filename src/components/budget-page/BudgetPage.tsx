import styled, { css } from 'styled-components';

import { IBudget } from '@/api/models/user';
import { Avatar, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, TextField, Typography } from '@material-ui/core';
import React, { Fragment, useState } from 'react';


import Header from '../common/Header';
import useToggle from '@/utils/hooks/useToggle';
import { ArrowLeft, Minus, PencilSimple, Plus, TrashSimple } from 'phosphor-react';
import Modal from '../common/modal';
import TextButton from '../common/TextButton';
import { Column, Row } from '@/styles/layout';
import { useRequest } from '@/utils/hooks/useRequest';
import { deleteUserFromBudget, updateBudget as updateBudgetApi } from '@/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateBudget } from '@/store/user/actions';
import CategoryForm, { MappedIcon } from '../common/category-form';
import { setCategories } from '@/api/category';
import { ICreateCategory } from '@/api/models/category';
import { useRouter } from 'next/router';
import { stringAvatar } from "@/utils/maping";
import ShareBudgetContainer from '../main/share-video-container';
import { selectUser } from '@/store/selectors';
import IncrementBudgetForm from '../common/increment-budget-form';
import theme from '@/styles/theme';
import DecrementBudgetForm from '../common/decrement-budget-form';
import IncrementCategoryForm from '../common/increment-category-form';
import DecrementCategoryForm from '../common/decrement-category-form';
import BudgetHistory from './BudgetHistory';

interface Props {
  budget: IBudget;
}

const BudgetPage: React.FC<Props> = ({ budget }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector(selectUser);

  const [showEditName, handleShowEditName] = useToggle(false);
  const [showEditCategories, handleShowEditCategories] = useToggle(false);
  const [showShareBudget, handleShowShareBudget] = useToggle(false);
  const [showIncrementBudget, handleShowIncrementBudget] = useToggle(false);
  const [showDecrementBudget, handleShowDecrementBudget] = useToggle(false);
  const [showIncrementCategory, handleShowIncrementCategory, categoryToIncrement] = useToggle<number | null>(false, null);
  const [showDecrementCategory, handleShowDecrementCategory, categoryToDecrement] = useToggle<number | null>(false, null);
  const [showDeleteUser, handleShowDeleteUser, userToDelete] = useToggle<string | null>(false, null);

  const [initialName, setInitialName] = useState(budget.name);

  const updateBudgetRequest = useRequest(updateBudgetApi, {
    onSuccess: (budget) => {
      dispatch(updateBudget(budget));
      handleShowEditName.disable();
    }
  });

  const handleChangeName = (e) => {
    setInitialName(e.target.value);
  };

  const handleOnSubmitName = () => {
    updateBudgetRequest.fetch({ id: budget.id, name: initialName });
  }

  const setCategoriesRequest = useRequest(setCategories, {
    onSuccess: (budget) => {
      dispatch(updateBudget(budget));
      handleShowEditCategories.disable();
    }
  });

  const onSubmit = (budgetId: string, categories: ICreateCategory[]) => {
    setCategoriesRequest.fetch({ budgetId, categories })
  };

  const deleteUserRequest = useRequest(deleteUserFromBudget, {
    onSuccess: (budget) => {
      dispatch(updateBudget(budget));
      handleShowDeleteUser.set(false, null);
    }
  });

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    deleteUserRequest.fetch({
      budgetId: budget.id,
      email: userToDelete,
    })
  }

  return (
    <>
      <Header />
      <Container>
        <br />
        <Button
          color='primary'
          variant='outlined'
          onClick={() => router.push('/', undefined, { shallow: true })}
        >
          <ArrowLeft size={18} />
          Go back
        </Button>
        <Title>
          <Typography
            variant='h3'
            component='h1'
          >
            {budget.name}

            <ShareButton onClick={(e) => {
              e.stopPropagation();
              handleShowEditName.enable();
            }}>
              <PencilSimple size={24} />
            </ShareButton>
          </Typography>
        </Title>

        <Typography variant="h5">
          <div>
            <Sub>
              Total money:
            </Sub>
            <CategoryAmount variant="h4">
              {budget.amount}

              <PlusAction onClick={handleShowIncrementBudget.enable}>
                <Plus size={18} />
              </PlusAction>
              <MinusAction onClick={handleShowDecrementBudget.enable}>
                <Minus size={18} />
              </MinusAction>
            </CategoryAmount>
          </div>
          <div>
            <Sub>
              Available money:
            </Sub>
            <CategoryAmount variant="h4">
              {budget.availableAmount}
            </CategoryAmount>
          </div>
        </Typography>

        <Row horizontal='start' vertical='start'>
          <StyledCard>
            <CardContent>
              <CategoryItem horizontal="start">
                <Typography variant="subtitle1">
                  Category
                </Typography>
                <CategoryAmount variant="h6">
                  Money
                </CategoryAmount>
                <CategoryAction>
                  <Typography variant="h6">
                    &nbsp;&nbsp;&nbsp;Actions&nbsp;
                  </Typography>
                </CategoryAction>
              </CategoryItem>
              <StyledDivider />
              {budget.categories.map(({ id, name, amount }) => (
                <Fragment key={id}>
                  <CategoryItem horizontal="start">
                    <Icon>
                      {MappedIcon[name]}
                    </Icon>
                    <Typography variant="subtitle1">
                      {name}
                    </Typography>
                    <CategoryAmount variant="h6">
                      {amount}
                    </CategoryAmount>
                    <CategoryAction>
                      <PlusAction onClick={() => handleShowIncrementCategory.set(true, id)}>
                        <Plus size={18} />
                      </PlusAction>
                      <MinusAction onClick={() => handleShowDecrementCategory.set(true, id)}>
                        <Minus size={18} />
                      </MinusAction>
                    </CategoryAction>
                  </CategoryItem>
                  <StyledDivider />
                </Fragment>
              ))}
              <br />
              <Button
                color='primary'
                variant='contained'
                onClick={handleShowEditCategories.enable}
              >
                Manage categories
              </Button>
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent>
              <CategoryItem horizontal="start">
                <Typography variant="h6">
                  Users
                </Typography>
              </CategoryItem>
              <StyledDivider />
              {budget.users.map((email) => (
                <Fragment key={email}>
                  <CategoryItem horizontal="start">
                    <StyledAvatar {...stringAvatar(email)} />
                    <Typography variant="subtitle1">
                      {email}
                    </Typography>
                    {(user && user.email === email) ? (
                      <DeleteUser disabled>
                        You
                      </DeleteUser>
                    ) : (
                      <DeleteUser onClick={() => handleShowDeleteUser.set(true, email)}>
                        <TrashSimple size={18} />
                      </DeleteUser>
                    )}
                  </CategoryItem>
                  <StyledDivider />
                </Fragment>
              ))}
              <br />
              <Button
                color='primary'
                variant='contained'
                onClick={handleShowShareBudget.enable}
              >
                Add new
              </Button>
            </CardContent>
          </StyledCard>
        </Row>

        <Row>
          <StyledCard fluid>
            <BudgetHistory budget={budget} />
          </StyledCard>
        </Row>

        {userToDelete && (
          <Dialog
            open={showDeleteUser}
            onClose={handleShowDeleteUser.disable}
          >
            <DialogTitle>
              Delete user
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure want to delete user <b>{userToDelete}</b> from <b>{budget.name}</b>?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleShowDeleteUser.disable}>Cancel</Button>
              <Button onClick={handleDeleteUser} autoFocus>
                Yes, delete
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {showEditName && (
          <Modal
            header='Change budget name'
            isShown={showEditName}
            onClose={handleShowEditName.disable}
            width='300px'
            content={(
              <Column>
                <FormControl>
                  <StyledTextField
                    onChange={handleChangeName}
                    value={initialName}
                    inputProps={{
                      placeholder: 'Enter new amount',
                    }}
                  />
                </FormControl>

                <div style={{ width: '100%' }}>
                  <SubmitWrapper>
                    <TextButton
                      width='55%'
                      onClick={handleOnSubmitName}
                      loading={updateBudgetRequest.loading}
                      disabled={updateBudgetRequest.loading}
                    >
                      Done
                    </TextButton>
                  </SubmitWrapper>
                </div>
              </Column>
            )}
          />
        )}

        {showShareBudget && (
          <ShareBudgetContainer
            isShownModal={showShareBudget}
            onClose={handleShowShareBudget.disable}
            selectedBudget={budget}
          />
        )}

        {showIncrementBudget && (
          <Modal
            header='Replenish the budget'
            isShown={showIncrementBudget}
            onClose={handleShowIncrementBudget.disable}
            width='420px'
            content={<IncrementBudgetForm budgetId={budget.id} onSubmit={handleShowIncrementBudget.disable} />}
          />
        )}

        {showIncrementCategory && categoryToIncrement && (
          <Modal
            header='Add money to category'
            isShown={showIncrementCategory}
            onClose={handleShowIncrementCategory.disable}
            width='420px'
            content={<IncrementCategoryForm categoryId={categoryToIncrement} budgetId={budget.id} onSubmit={handleShowIncrementCategory.disable} />}
          />
        )}

        {showDecrementCategory && categoryToDecrement && (
          <Modal
            header='Spend money from category'
            isShown={showDecrementCategory}
            onClose={handleShowDecrementCategory.disable}
            width='420px'
            content={<DecrementCategoryForm categoryId={categoryToDecrement} budgetId={budget.id} onSubmit={handleShowDecrementCategory.disable} />}
          />
        )}

        {showDecrementBudget && (
          <Modal
            header='How mutch did you spend?'
            isShown={showDecrementBudget}
            onClose={handleShowDecrementBudget.disable}
            width='420px'
            content={<DecrementBudgetForm budgetId={budget.id} onSubmit={handleShowDecrementBudget.disable} />}
          />
        )}

        {showEditCategories && (
          <Modal
            header='Change budget amount'
            isShown={showEditCategories}
            onClose={handleShowEditCategories.disable}
            width='420px'
            content={(
              <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
                <CategoryForm
                  budgetId={budget.id}
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
      </Container>
    </>
  );
};

export default BudgetPage;

const StyledAvatar = styled(Avatar)`
  margin-right: 8px;
`;

const Title = styled.div`
  margin: 20px 0;
`;

const StyledTextField = styled(TextField)`
  
`;

const StyledCard = styled(Card) <{ fluid?: boolean }>`
  width: calc(50% - 7px);
  box-shadow: 0px 2px 9px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgb(0 0 0 / 14%), 0px 1px 3px 1px rgb(0 0 0 / 12%);
  border-radius: 10px;
  margin: 20px 0;

  &:nth-of-type(odd) {
    margin-right: 7px;
  }

  &:nth-of-type(even) {
    margin-left: 7px;
  }

  ${({ fluid }) => fluid && css`
    margin: 0;
    width: 100%;

    &:nth-of-type(odd) {
      margin-right: 0;
    }
  
    &:nth-of-type(even) {
      margin-left: 0;
    }
  `};
`;

const StyledDivider = styled(Divider)`
  background-color: rgb(171 195 195);
`;

const SubmitWrapper = styled(Row)`
  margin: 24px 0;
`;

const Icon = styled(Row)`
  margin-right: 6px;
`;

const Sub = styled.span`
  margin-right: 15px;
`;

const ShareButton = styled(IconButton)`
  color: black;
  margin-left: 13px;
`;

const CategoryAction = styled.span`
  margin-left: 15px;
`;

const PlusAction = styled(IconButton)`
  margin-left: 5px;
  background-color: ${theme.colors.success};
  color: black;

  &:hover {
    background-color: ${theme.colors.successLight};
  }
`;

const MinusAction = styled(IconButton)`
  margin-left: 5px;
  background-color: ${theme.colors.danger};
  color: black;

  &:hover {
    background-color: ${theme.colors.dangerLight};
  }
`;

const DeleteUser = styled(IconButton)`
  color: black;
  margin-left: auto;
  font-size: 20px;
`;

const CategoryItem = styled(Row)`
  margin: 5px 0;
`;

const CategoryAmount = styled(Typography)`
  margin-left: auto;
  display: inline;
`;
import styled, { css } from 'styled-components';

import { IBudget, IMoneyBox } from '@/api/models/user';
import { Avatar, Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, LinearProgress, LinearProgressProps, TextField, Typography } from '@material-ui/core';
import React, { Fragment, useMemo, useState } from 'react';


import Header from '../common/Header';
import useToggle from '@/utils/hooks/useToggle';
import { ArrowLeft, Minus, PencilSimple, Plus, TrashSimple } from 'phosphor-react';
import Modal from '../common/modal';
import TextButton from '../common/TextButton';
import { Column, Row } from '@/styles/layout';
import { useRequest } from '@/utils/hooks/useRequest';
import { deleteBox, deleteUserFromBox, deleteUserFromBudget, updateBox as updateBoxApi } from '@/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMoneyBoxA, updateBox, updateBudget } from '@/store/user/actions';
import CategoryForm, { MappedIcon } from '../common/category-form';
import { setCategories } from '@/api/category';
import { ICreateCategory } from '@/api/models/category';
import { useRouter } from 'next/router';
import { stringAvatar } from "@/utils/maping";
import ShareBudgetContainer from '../main/share-video-container';
import { selectUser } from '@/store/selectors';
import IncrementBudgetForm from '../common/increment-budget-form';
import theme from '@/styles/theme';
import moment from 'moment';
import ShareBoxContainer from '../main/share-box-container';
import IncrementBoxGoalForm from '../common/increment-box-goal-form';
import IncrementBoxAmountForm from '../common/increment-box-amount';
import DecrementBoxAmountForm from '../common/decrement-box-amount';
import ChangeBoxDateForm from '../common/change-box-date-form';

interface Props {
  moneyBox: IMoneyBox
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const MoneyBoxPage: React.FC<Props> = ({ moneyBox }) => {
  const { name, id, users, goal, actualAmount, goalDate, completed } = moneyBox;

  const dispatch = useDispatch();
  const router = useRouter();

  const daysLeft = moment(goalDate).diff(Date.now(), 'days');
  const progress = (actualAmount * 100) / goal;
  const user = useSelector(selectUser);

  const [showDeleteUser, handleShowDeleteUser, userToDelete] = useToggle<string | null>(false, null);
  const [showShareBudget, handleShowShareBudget] = useToggle(false);
  const [showIncrement, handleShowIncrement] = useToggle(false);
  const [showDecrement, handleShowDecrement] = useToggle(false);
  const [showIncrementGoal, handleShowIncrementGoal] = useToggle(false);
  const [showChangeDate, handleShowChangeDate] = useToggle(false);
  const [showDeleteBox, handleShowDeleteBox] = useToggle(false);
  const [showEditName, handleShowEditName] = useToggle(false);

  const [initialName, setInitialName] = useState(moneyBox.name);

  const updateBudgetRequest = useRequest(updateBoxApi, {
    onSuccess: (box) => {
      dispatch(updateBox(box));
      handleShowEditName.disable();
    }
  });

  const handleChangeName = (e) => {
    setInitialName(e.target.value);
  };

  const handleOnSubmitName = () => {
    updateBudgetRequest.fetch({ id: id, name: initialName });
  }

  const deleteUserRequest = useRequest(deleteUserFromBox, {
    onSuccess: (box) => {
      dispatch(updateBox(box));
      handleShowDeleteUser.set(false, null);
    }
  });

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    deleteUserRequest.fetch({
      boxId: moneyBox.id,
      email: userToDelete,
    })
  }

  const addPerDay = useMemo(() => {
    const remainToAdd = goal - actualAmount;

    if (daysLeft < 31) {
      return `${Math.ceil(remainToAdd / daysLeft)} per day`;
    }

    return `${Math.ceil(remainToAdd / (daysLeft / 30))} per month`;
  }, [goal, actualAmount, daysLeft]);

  const deleteBoxRequest = useRequest(deleteBox, {
    onSuccess: ({ id }) => {
      dispatch(deleteMoneyBoxA(id));
      handleShowDeleteBox.disable();
      router.push('/', undefined, { shallow: true })
    }
  });

  const handleDeleteBox = (e) => {
    e.stopPropagation();
    deleteBoxRequest.fetch(id);
  };

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
        <ProgressWrapper>
          <Typography
            variant='h6'
            component='div'
          >
            Your progress:

          </Typography>
          <LinearProgressWithLabel value={progress} />
        </ProgressWrapper>

        <Row vertical='stretch' horizontal='spaced-between'>
          <div>
            <Title>
              <Typography
                variant='h3'
                component='h1'
              >
                {moneyBox.name}
                <ShareButton onClick={handleShowEditName.enable}>
                  <PencilSimple size={24} />
                </ShareButton>
              </Typography>
            </Title>

            <Typography variant="h5">
              <div>
                <Sub>
                  Your goal:
                </Sub>
                <CategoryAmount variant="h4">
                  {goal}
                  <ShareButton disabled={completed} onClick={handleShowIncrementGoal.enable}>
                    <PencilSimple size={24} />
                  </ShareButton>
                </CategoryAmount>
              </div>
              <div>
                <Sub>
                  You added:
                </Sub>
                <CategoryAmount variant="h4">
                  {actualAmount}
                  <PlusAction disabled={completed} onClick={handleShowIncrement.enable}>
                    <Plus size={18} />
                  </PlusAction>
                  <MinusAction disabled={completed} onClick={handleShowDecrement.enable}>
                    <Minus size={18} />
                  </MinusAction>
                </CategoryAmount>
              </div>
              <div>
                <Sub>
                  Time left:
                </Sub>
                <CategoryAmount variant="h4">
                  {moment(goalDate).fromNow(true)} ({daysLeft} days)

                  <ShareButton disabled={completed} onClick={handleShowChangeDate.enable}>
                    <PencilSimple size={24} />
                  </ShareButton>
                </CategoryAmount>
              </div>
              <div>
                <Sub>
                  You need to add:
                </Sub>
                <CategoryAmount variant="h4">
                  {addPerDay}
                </CategoryAmount>
              </div>
            </Typography>
          </div>

          <StyledCard>
            <CardContent>
              <CategoryItem horizontal="start">
                <Typography variant="h6">
                  Users
                </Typography>
              </CategoryItem>
              <StyledDivider />
              {users.map((email) => (
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

        {showEditName && (
          <Modal
            header='Change box name'
            isShown={showEditName}
            onClose={handleShowEditName.disable}
            width='300px'
            content={(
              <Column>
                <FormControl>
                  <TextField
                    onChange={handleChangeName}
                    value={initialName}
                    inputProps={{
                      placeholder: 'Enter new name',
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

        {completed && (
          <>
            <Typography
              variant='h4'
              component='h4'
              align='center'
            >
              Nice, you have already collected final sum! <Emoji>🎉</Emoji>
            </Typography>
            <Column>
              <Typography
                variant='h6'
                component='h6'
                align='center'
              >
                Now you can delete the money box
              </Typography>
              <Button
                color='secondary'
                variant='contained'
                onClick={handleShowDeleteBox.enable}
              >
                Delete
              </Button>
            </Column>
          </>
        )}

        {showDeleteBox && (
          <Dialog
            open={showDeleteBox}
            onClose={handleShowDeleteBox.disable}
          >
            <DialogTitle>
              Delete Money box
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure want to delete <b>{name}</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDeleteBox.disable();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteBox} autoFocus>
                Yes, delete
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {showChangeDate && (
          <Modal
            header='Add money to your box'
            isShown={showChangeDate}
            onClose={handleShowChangeDate.disable}
            width='420px'
            content={<ChangeBoxDateForm boxId={moneyBox.id} onSubmit={handleShowChangeDate.disable} />}
          />
        )}

        {showShareBudget && (
          <ShareBoxContainer
            isShownModal={showShareBudget}
            onClose={handleShowShareBudget.disable}
            selectedBox={moneyBox}
          />
        )}

        {showIncrementGoal && (
          <Modal
            header='Change your goal the budget'
            isShown={showIncrementGoal}
            onClose={handleShowIncrementGoal.disable}
            width='420px'
            content={<IncrementBoxGoalForm boxId={moneyBox.id} onSubmit={handleShowIncrementGoal.disable} />}
          />
        )}

        {showIncrement && (
          <Modal
            header='Add money to your box'
            isShown={showIncrement}
            onClose={handleShowIncrement.disable}
            width='420px'
            content={<IncrementBoxAmountForm boxId={moneyBox.id} onSubmit={handleShowIncrement.disable} />}
          />
        )}

        {showDecrement && (
          <Modal
            header='Decrement your box money'
            isShown={showDecrement}
            onClose={handleShowDecrement.disable}
            width='420px'
            content={<DecrementBoxAmountForm boxId={moneyBox.id} onSubmit={handleShowDecrement.disable} />}
          />
        )}

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
                Are you sure want to delete user <b>{userToDelete}</b> from <b>{moneyBox.name}</b>?
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
      </Container>
    </>
  );
};

export default MoneyBoxPage;

const StyledAvatar = styled(Avatar)`
  margin-right: 8px;
`;

const Title = styled.div`
  margin: 20px 0;
`;

const SubmitWrapper = styled(Row)`
  margin: 24px 0;
`;


const Emoji = styled.span`
  font-weight: normal;
`;

const ProgressWrapper = styled(Column)`
  
`;

const StyledCard = styled(Card) <{ fluid?: boolean }>`
  width: calc(50% - 7px);
  box-shadow: 0px 2px 9px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgb(0 0 0 / 14%), 0px 1px 3px 1px rgb(0 0 0 / 12%);
  border-radius: 10px;
  margin: 20px 0 50px;

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

const Sub = styled.span`
  margin-right: 15px;
`;

const ShareButton = styled(IconButton)`
  color: black;
  margin-left: 13px;
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
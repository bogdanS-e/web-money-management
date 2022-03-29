import { setCategories } from "@/api/category";
import { ICreateCategory } from "@/api/models/category";
import { IBudget, IMoneyBox } from "@/api/models/user";
import { deleteBox, deleteBudget } from "@/api/user";
import { selectUser } from "@/store/selectors";
import { updateBudget, deleteBudget as deleteBudgetAction, deleteMoneyBoxA } from "@/store/user/actions";
import { Row } from "@/styles/layout";
import { useRequest } from "@/utils/hooks/useRequest";
import useToggle from "@/utils/hooks/useToggle";
import { stringAvatar } from "@/utils/maping";
import { Avatar, Button, Card, CardActions, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Typography } from "@material-ui/core";
import moment from "moment";
import { useRouter } from "next/router";
import { CaretDown, PencilSimple, ShareNetwork, TrashSimple } from "phosphor-react";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import AvatarGroup from "../common/avatar-group";
import CategoryForm, { MappedIcon } from "../common/category-form";
import Modal from "../common/modal";
import TextButton from "../common/TextButton";
import UpdateBudgetForm from "../common/update-budget-form";
import ShareBoxContainer from "./share-box-container";
import ShareBudgetContainer from "./share-video-container";

interface Props {
  moneyBox: IMoneyBox;
  className?: string;
}

const MoneyBoxCard: React.FC<Props> = ({
  moneyBox,
  className,
}) => {
  const { name, id, users, goal, actualAmount, startDate, goalDate } = moneyBox;
  const dispatch = useDispatch();
  const router = useRouter();

  const [showDeleteBox, handleShowDeleteBox] = useToggle(false);
  const [showShareBox, handleShowShareBox] = useToggle(false);

  const user = useSelector(selectUser);

  const deleteBoxRequest = useRequest(deleteBox, {
    onSuccess: ({ id }) => {
      dispatch(deleteMoneyBoxA(id));
      handleShowDeleteBox.disable();
    }
  });

  const handleDeleteBox = (e) => {
    e.stopPropagation();
    deleteBoxRequest.fetch(id);
  };

  if (!user) return null;

  return (
    <StyledCard
      //onClick={() => router.push(`/budget/${id}`, undefined, { shallow: true })}
      className={className}
    >
      <CardContent>
        <Title gutterBottom variant="h5">
          {name}
        </Title>
        <StyledAvatarGroup
          size={35}
          max={4}
          total={users.length}
          bordersColor='rgb(80, 80, 80)'
        >
          {users.map((name) => (
            <Avatar {...stringAvatar(name)} />
          ))}
        </StyledAvatarGroup>

        <Typography variant="subtitle1">
          Your goal:
          <CategoryAmount variant="h5">
            {goal}
          </CategoryAmount>
          Remain to add:
          <CategoryAmount variant="h4">
            {goal - actualAmount}
          </CategoryAmount>
          Time left:
          <CategoryAmount variant="h5">
            {moment(goalDate).fromNow(true)} ({moment(goalDate).diff(Date.now(), 'days')} days)
          </CategoryAmount>
        </Typography>
      </CardContent>
      <Actions>
        <ShareButton onClick={(e) => {
          e.stopPropagation();
          handleShowShareBox.enable();
        }}
        >
          <ShareNetwork size={24} />
        </ShareButton>
        <ShareButton>
          <PencilSimple size={24} />
        </ShareButton>
        <ShareButton onClick={(e) => {
          e.stopPropagation();
          handleShowDeleteBox.enable();
        }}
        >
          <TrashSimple size={24} />
        </ShareButton>
      </Actions>

      {showShareBox && (
        <ShareBoxContainer
          isShownModal={showShareBox}
          onClose={handleShowShareBox.disable}
          selectedBox={moneyBox}
        />
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
    </StyledCard >
  );
};

const SwapButton = styled(Button)`
  text-transform: none;
`;

const StyledDivider = styled(Divider)`
  background-color: rgb(171 195 195);
`;

const SubmitWrapper = styled(Row)`
  margin: 24px 0;
`;

const StyledAvatarGroup = styled(AvatarGroup)`
  position: absolute;
  right: 10px;
  top: 10px;

  > * {
    font-size: 1rem;
  }
`;

const Icon = styled(Row)`
  margin-right: 6px;
`;

const CategoryAmount = styled(Typography)`
  margin-left: auto;
  margin-bottom: 10px;
  color: white;
`;

const StyledCard = styled(Card)`
  cursor: pointer;
  position: relative;
  max-width: 400px;
  background-color: rgb(80, 80, 80);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
`;

const Actions = styled(CardActions)`
  padding: 0;
`;

const CategoryItem = styled(Row)`
  margin: 5px 0;
`

const Title = styled(Typography)`
  color: white
`;

const ShareButton = styled(IconButton)`
  color: white;
  margin: 0!important;
`;

const ExpandButton = styled(IconButton) <{ expanded: boolean }>`
  margin-left: auto!important;
  color: white;
  transform: ${({ expanded }) => !expanded ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: transform 0.3s,
`;

export default MoneyBoxCard;

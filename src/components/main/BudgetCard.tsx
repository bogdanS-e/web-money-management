import { setCategories } from "@/api/category";
import { ICreateCategory } from "@/api/models/category";
import { IBudget } from "@/api/models/user";
import { deleteBudget } from "@/api/user";
import { selectUser } from "@/store/selectors";
import { updateBudget, deleteBudget as deleteBudgetAction } from "@/store/user/actions";
import { Row } from "@/styles/layout";
import { useRequest } from "@/utils/hooks/useRequest";
import useToggle from "@/utils/hooks/useToggle";
import { stringAvatar } from "@/utils/maping";
import { Avatar, Button, Card, CardActions, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Typography } from "@material-ui/core";
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
import ShareBudgetContainer from "./share-video-container";

interface Props {
  budget: IBudget;
  className?: string;
}

const BudgetCard: React.FC<Props> = ({
  budget,
  className,
}) => {
  const { name, id, amount, availableAmount, categories, users } = budget;
  const dispatch = useDispatch();
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const user = useSelector(selectUser);

  const [showEditBudget, handleShowEditBudget] = useToggle(false);
  const [showDeleteBudget, handleShowDeleteBudget] = useToggle(false);
  const [showEditCategories, handleShowEditCategories] = useToggle(false);
  const [showShareBudget, handleShowShareBudget] = useToggle(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const setCategoriesRequest = useRequest(setCategories, {
    onSuccess: (resp) => {
      dispatch(updateBudget(resp));
      handleShowEditBudget.disable();
    }
  });

  const onSubmit = (budgetId: string, categories: ICreateCategory[]) => {
    setCategoriesRequest.fetch({ budgetId, categories })
  };

  const deleteBudgetRequest = useRequest(deleteBudget, {
    onSuccess: ({ id }) => {
      dispatch(deleteBudgetAction(id));
      handleShowDeleteBudget.disable();
    }
  });

  const handleDeleteBudget = (e) => {
    e.stopPropagation();
    deleteBudgetRequest.fetch(budget.id);
  };

  if (!user) return null;

  return (
    <StyledCard
      onClick={() => router.push(`/budget/${id}`, undefined, { shallow: true })}
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
          Total money:
          <CategoryAmount variant="h5">
            {amount}
          </CategoryAmount>
          Available money:
          <CategoryAmount variant="h4">
            {availableAmount}
          </CategoryAmount>
        </Typography>
      </CardContent>
      <Actions>
        <ShareButton onClick={(e) => {
          e.stopPropagation();
          handleShowShareBudget.enable();
        }}>
          <ShareNetwork size={24} />
        </ShareButton>
        <ShareButton onClick={(e) => {
          e.stopPropagation();
          handleShowEditBudget.enable();
        }}>
          <PencilSimple size={24} />
        </ShareButton>
        <ShareButton onClick={(e) => {
          e.stopPropagation();
          handleShowDeleteBudget.enable();
        }}>
          <TrashSimple size={24} />
        </ShareButton>

        {!!categories.length && (
          <ExpandButton
            onClick={(e) => {
              e.stopPropagation();
              handleExpandClick();
            }}
            expanded={expanded}
          >
            <CaretDown size={24} />
          </ExpandButton>
        )}
      </Actions>
      {
        !!categories.length && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <CategoryItem horizontal="start">
                <Typography variant="subtitle1">
                  Category
                </Typography>
                <CategoryAmount variant="h6">
                  Money
                </CategoryAmount>
              </CategoryItem>
              <StyledDivider />
              {categories.map(({ id, name, amount }) => (
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
                  </CategoryItem>
                  <StyledDivider />
                </Fragment>
              ))}
            </CardContent>
          </Collapse>
        )
      }

      {showShareBudget && (
        <ShareBudgetContainer
          isShownModal={showShareBudget}
          onClose={handleShowShareBudget.disable}
          selectedBudget={budget}
        />
      )}

      {showDeleteBudget && (
        <Dialog
          open={showDeleteBudget}
          onClose={handleShowDeleteBudget.disable}
        >
          <DialogTitle>
            Delete BudgetPage
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure want to delete <b>{budget.name}</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleShowDeleteBudget.disable();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteBudget} autoFocus>
              Yes, delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showEditBudget && (
        <Modal
          header='Change budget amount'
          isShown={showEditBudget}
          onClose={handleShowEditBudget.disable}
          width='420px'
          content={(
            <>
              {showEditCategories ? (
                <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
                  <CategoryForm
                    budgetId={id}
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
              ) : (
                <UpdateBudgetForm onSubmit={handleShowEditBudget.disable} budgetId={id} />
              )}

              <Row>
                <SwapButton
                  color='primary'
                  variant='outlined'
                  onClick={handleShowEditCategories.toggle}
                >
                  Manage {showEditCategories ? 'categories' : 'budget amount'}
                </SwapButton>
              </Row>
            </>
          )}
        />
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

export default BudgetCard;

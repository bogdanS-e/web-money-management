import { setCategories } from "@/api/category";
import { ICreateCategory } from "@/api/models/category";
import { IBudget } from "@/api/models/user";
import { selectUser } from "@/store/selectors";
import { updateBudget } from "@/store/user/actions";
import { Row } from "@/styles/layout";
import { useRequest } from "@/utils/hooks/useRequest";
import useToggle from "@/utils/hooks/useToggle";
import { stringAvatar } from "@/utils/maping";
import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Collapse, Divider, IconButton, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { CaretDown, PencilSimple, ShareNetwork } from "phosphor-react";
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

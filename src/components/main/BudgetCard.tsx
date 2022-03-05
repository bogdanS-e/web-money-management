import { IBudget } from "@/api/models/user";
import { selectUser } from "@/store/selectors";
import { Row } from "@/styles/layout";
import { stringAvatar } from "@/utils/maping";
import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Collapse, Divider, IconButton, Typography } from "@material-ui/core";
import { CaretDown, ShareNetwork } from "phosphor-react";
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import AvatarGroup from "../common/avatar-group";
import { MappedIcon } from "../common/category-form";

interface Props {
  budget: IBudget;
}

const BudgetCard: React.FC<Props> = ({ budget: { name, amount, availableAmount, categories } }) => {
  const [expanded, setExpanded] = useState(false);
  const user = useSelector(selectUser);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!user) return null;

  return (
    <StyledCard>
      <CardContent>
        <Title gutterBottom variant="h5">
          {name}
        </Title>
        <StyledAvatarGroup
          size={35}
          max={3}
          total={40}
          bordersColor='rgb(80, 80, 80)'
        >
          <Avatar {...stringAvatar(user.name.toUpperCase())} />
          <Avatar {...stringAvatar(user.name)} />
          <Avatar {...stringAvatar('here you go')} />
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
        <ShareButton>
          <ShareNetwork size={24} />
        </ShareButton>
        <ExpandButton
          onClick={handleExpandClick}
          expanded={expanded}
        >
          <CaretDown size={24} />
        </ExpandButton>
      </Actions>
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
    </StyledCard>
  );
};

const StyledDivider = styled(Divider)`
  background-color: rgb(171 195 195);
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
`;

const ExpandButton = styled(IconButton) <{ expanded: boolean }>`
  margin-left: auto!important;
  color: white;
  transform: ${({ expanded }) => !expanded ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: transform 0.3s,
`;

export default BudgetCard;

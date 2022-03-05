import { IBudget } from "@/api/models/user";
import { Row } from "@/styles/layout";
import { Button, Card, CardActions, CardContent, CardMedia, Collapse, Divider, IconButton, Typography } from "@material-ui/core";
import { CaretDown } from "phosphor-react";
import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { MappedIcon } from "../common/category-form";

interface Props {
  budget: IBudget;
}

const BudgetCard: React.FC<Props> = ({ budget: { name, amount, availableAmount, categories } }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledCard>
      <CardContent>
        <Title gutterBottom variant="h5">
          {name}
        </Title>
        <Typography variant="subtitle1">
          Total money: {amount}<br />
          Available money: {availableAmount}
        </Typography>
      </CardContent>
      <Actions>
        <ExpandButton
          onClick={handleExpandClick}
          expanded={expanded}
        >
          <CaretDown size={24} />
        </ExpandButton>
      </Actions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
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
              <Divider>H</Divider>
            </Fragment>
          ))}
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};

const Icon = styled(Row)`
  margin-right: 6px;
`;

const CategoryAmount = styled(Typography)`
  margin-left: auto;
  color: white;
`;

const StyledCard = styled(Card)`
  cursor: pointer;
  max-width: 400px;
  background-color: rgb(80, 80, 80);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
`;

const Actions = styled(CardActions)`
  padding: 0;
`;

const CategoryItem = styled(Row)`
  margin-bottom: 10px;
`

const Title = styled(Typography)`
  color: white
`;

const ExpandButton = styled(IconButton) <{ expanded: boolean }>`
  margin-left: auto;
  margin-top: -12px;
  color: white;
  transform: ${({ expanded }) => !expanded ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: transform 0.3s,
`;

export default BudgetCard;
import { selectUserBudgets } from "@/store/selectors";
import { Container } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import BudgetCard from "./BudgetCard";

interface Props {
}

const CardsContainer: React.FC<Props> = () => {
  const budgets = useSelector(selectUserBudgets());

  return (
    <StyledContainer>
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </StyledContainer>
  );
};

export default CardsContainer;

const StyledContainer = styled(Container)`
  margin-top: 40px;
`
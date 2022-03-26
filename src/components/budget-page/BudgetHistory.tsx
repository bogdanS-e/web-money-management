import styled from 'styled-components';

import { IBudget } from '@/api/models/user';
import { Avatar, Divider, Typography } from '@material-ui/core';
import React from 'react';
import moment from 'moment';

import {  ArrowRight } from 'phosphor-react';
import { Column, Row } from '@/styles/layout';
import { stringAvatar } from "@/utils/maping";

import theme from '@/styles/theme';

interface Props {
  budget: IBudget;
}

const BudgetHistory: React.FC<Props> = ({ budget: { history } }) => {
  return (
    <HistoryWrapper>
      {history.map(({ date, title, history }) => (
        <HistoryCard key={date}>
          <Row horizontal='start'>
            <StyledAvatar {...stringAvatar(title.split(' ')[1].slice(0, -1))} />
            <Typography variant='body1' style={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Date variant='caption'>
              {moment(date).fromNow()}
            </Date>
          </Row>
          <HistoryActionWrapper fluid horizontal='start' vertical='start'>
            {history.map(({ title: historyTitle, oldValue, newValue }, index) => (
              <HistoryAction key={title}>
                <Typography variant='body1' style={{ fontWeight: 500 }}>
                  {`${index + 1}) ${historyTitle}`}
                </Typography>
                <Row horizontal='start'>
                  <HistoryOldValue>
                    {oldValue ?? ' '}
                  </HistoryOldValue>
                  <StyledArrowRight size={28} />
                  <HistoryNewValue>
                    {newValue ?? ' '}
                  </HistoryNewValue>
                </Row>
              </HistoryAction>
            ))}
          </HistoryActionWrapper>
          <StyledDivider />
        </HistoryCard>
      ))}
    </HistoryWrapper>
  );
};

export default BudgetHistory;

const StyledAvatar = styled(Avatar)`
  margin-right: 8px;
`;

const StyledDivider = styled(Divider)`
  margin-top: 15px;
`;

const HistoryWrapper = styled.div`
  padding: 20px 15px;
`;

const HistoryCard = styled.div`
  margin-bottom: 15px;
`;

const StyledArrowRight = styled(ArrowRight)`
  margin-top: 5px;
`;

const HistoryActionWrapper = styled(Column)`
  margin-left: 66px;
`;

const HistoryAction = styled.div`
  margin-bottom: 10px;
`;

const HistoryOldValue = styled.div`
  margin-right: 6px;
  margin-top: 5px;
  font-size: 18px;
  font-weight: 500;
  background: ${theme.colors.dangerLight};
  padding: 2px 6px;
  border-radius: 8px;
  min-height: 30px;
  min-width: 40px;
`;

const HistoryNewValue = styled.div`
  margin-left: 6px;
  margin-top: 5px;
  font-size: 19px;
  font-weight: 500;
  background: ${theme.colors.warningLight};
  padding: 2px 6px;
  border-radius: 8px;
  min-height: 30px;
  min-width: 40px;
`;

const Date = styled(Typography)`
  margin-left: auto;
`;
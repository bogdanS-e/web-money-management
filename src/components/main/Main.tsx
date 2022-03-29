import { Box, Tab, Tabs, Container } from '@material-ui/core';
import React from 'react';

import Header from '../common/Header';
import TabPanel from '../common/TabPanel';
import CardsContainer from './CardsContainer';
import MoneyBoxContainer from './MoneyBoxContainer';

interface Props {

}

const Main: React.FC<Props> = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (_, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Header />
      <Container>
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab label='Budgets' />
          <Tab label='Money boxes' />
        </Tabs>
      </Container>
      <TabPanel value={activeTab} index={0}>
        <CardsContainer />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <MoneyBoxContainer />
      </TabPanel>
    </>
  );
};

export default Main;

import React from 'react';

import Header from '../common/Header';
import CardsContainer from './CardsContainer';

interface Props {

}

const Main: React.FC<Props> = () => {
  return (
    <>
      <Header />
      <CardsContainer />
    </>
  );
};

export default Main;

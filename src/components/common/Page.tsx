import React from 'react';

import Head from '@/components/common/Head';
import Header from '@/components/common/Header';

interface Props {
  title?: string;
  children?: React.ReactNode;
  headerText?: string;
  headerLink?: string;
}

const Page: React.FC<Props> = ({ title, children, headerText, headerLink }) => {
  return (
    <>
      <Head title={title} />
      <Header hubTitle={headerText} headerLink={headerLink} />
      {children}
    </>
  );
};

export default Page;

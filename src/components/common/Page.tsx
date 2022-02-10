import React from 'react';

import Head from '@/components/common/Head';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head title={title} />
      {children}
    </>
  );
};

export default Page;

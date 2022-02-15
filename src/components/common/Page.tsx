import React from 'react';

import Head from '@/components/common/Head';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head title={title ?? 'Web Coins'} />
      {children}
    </>
  );
};

export default Page;

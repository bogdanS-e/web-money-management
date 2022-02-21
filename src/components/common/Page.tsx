import React from 'react';

import Head from '@/components/common/Head';

interface Props {
  description?: string;
  title?: string;
  children?: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, description, children }) => {
  return (
    <>
      <Head metaDescription={description} title={title ?? 'Web Coins'} />
      {children}
    </>
  );
};

export default Page;

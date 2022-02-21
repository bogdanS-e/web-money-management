import React from 'react';
import NextHead from 'next/head';

interface Props {
  title?: string;
  og?: {
    title: string;
    type: string;
    url: string;
    description: string;
    image: string;
    sitename: string;
  }
  metaDescription?: string;
  metaKeywords?: string
}

const Head: React.FC<Props> = ({ title, metaDescription, metaKeywords, og }) => {
  return (
    <NextHead>
      <title>{title || 'HamletHub'}</title>
      <meta
        name='viewport'
        content='width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
      />
      <meta charSet='UTF-8' />
      <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
      <link
        href='https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap'
        rel='stylesheet'
      />
      <meta name='description' content={metaDescription || 'Web Coins - Online money mangement'} />
      {metaKeywords &&
        <meta name='keywords' content={metaKeywords} />
      }
      {og &&
        <>
          <meta property="og:title" content={og.title} />
          <meta property="og:image" content={og.image} />
          <meta property="og:type" content={og.type} />
          <meta property="og:url" content={og.url} />
          <meta property="og:site_name" content={og.sitename} />
          <meta property="og:description" content={og.description} />
        </>
      }
    </NextHead>
  );
};

export default Head;

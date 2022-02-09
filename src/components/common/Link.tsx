import React from 'react';
import NextLink from 'next/link';
import {
  Link as MaterialLink,
  Button,
  LinkProps,
  ButtonProps,
} from '@material-ui/core';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  button?: boolean;
  buttonProps?: ButtonProps;
  linkProps?: LinkProps;
}

const Link: React.FC<Props> = ({
  href,
  children,
  className,
  button = false,
  buttonProps,
  linkProps,
}) => {
  if (button) {
    return (
      <NextLink href={href} passHref>
        <Button className={className} {...buttonProps}>
          {children}
        </Button>
      </NextLink>
    );
  }

  return (
    <NextLink href={href} passHref>
      <MaterialLink color='secondary' className={className} {...linkProps}>
        {children}
      </MaterialLink>
    </NextLink>
  );
};

export default Link;

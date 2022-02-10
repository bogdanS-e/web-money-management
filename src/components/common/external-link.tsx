import React, { CSSProperties } from 'react';
import styled from 'styled-components';

interface Props {
  href: string;
  style?: CSSProperties;
  className?: string;
}

const ExternalLink: React.FC<Props> = ({ style, href, children, className }) => (
  <Link
    target='_blank'
    rel='noopener noreferrer'
    href={href}
    className={className}
    style={{ ...style }}
  >
    {children ?? href}
  </Link>
);

export default ExternalLink;

const Link = styled.a`
  text-decoration: underline;
  color: inherit;
  display: inline-block;
`;

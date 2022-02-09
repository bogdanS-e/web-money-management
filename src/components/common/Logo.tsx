import React from 'react';
import styled from 'styled-components';

interface Props {
  size?: string;
  className?: string;
}

const Logo: React.FC<Props> = ({ size = '48px', className }) => {
  return (
    <StyledLogo
      width={size}
      height={size}
      className={className}
      src='/logo.png'
      alt='logo'
    />
  );
};

const StyledLogo = styled.img<{ width: string; height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  flex-shrink: 0;
  border-radius: 50%;
`;

export default Logo;

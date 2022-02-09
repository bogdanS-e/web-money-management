import React from 'react';
import styled from 'styled-components';

import vars from '@vars';

import PanoramaOutlinedIcon from '@material-ui/icons/PanoramaOutlined';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';

interface Props {
  width?: string;
  height?: string;
  className?: string;
  type?: 'empty' | 'error';
}

const ImagePlaceholder: React.FC<Props> = ({
  className,
  width = '100%',
  height = 'auto',
  type = 'empty',
}) => {
  return (
    <Placeholder className={className} width={width} height={height}>
      {type === 'empty' && <PanoramaOutlinedIcon />}
      {type === 'error' && <BrokenImageIcon />}
    </Placeholder>
  );
};

const Placeholder = styled.div<{ width: string; height: string }>`
  display: flex;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: ${vars.colors.green_background};

  & > svg {
    width: 50%;
    height: 50%;
    margin: auto;
    fill: ${vars.colors.white};
  }
`;

export default ImagePlaceholder;

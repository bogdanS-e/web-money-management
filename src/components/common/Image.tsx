import React from 'react';
import styled from 'styled-components';

import { useToggle } from '@/utils/hooks';

import ImagePlaceholder from 'components/common/ImagePlaceholder';

interface Props {
  src: string;
  width?: string;
  height?: string;
  className?: string;
}

const Image: React.FC<Props> = ({
  src,
  className,
  width = '100%',
  height = 'auto',
}) => {
  const [isImageError, ignoredresetImageError, setImageError] = useToggle(
    false,
  );

  return (
    <ImageWrapper className={className} width={width} height={height}>
      {src && !isImageError && (
        <StyledImage src={src} onError={setImageError} />
      )}
      {isImageError && <StyledImagePlaceholder type='error' />}
      {!src && <StyledImagePlaceholder />}
    </ImageWrapper>
  );
};

const ImageWrapper = styled.div<{ width: string; height: string }>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

const StyledImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  object-fit: cover;
`;

const StyledImagePlaceholder = styled(ImagePlaceholder)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default Image;

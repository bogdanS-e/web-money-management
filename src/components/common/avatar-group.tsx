import { Row } from "@/styles/layout";
import { Avatar } from "@material-ui/core";
import React from "react";
import { isFragment } from 'react-is';
import styled, { css } from "styled-components";

interface Props {
  max: number;
  total: number;
  className?: string;
  bordersColor?: string;
  size?: number;
}

const AvatarGroup: React.FC<Props> = ({ max, total, children: childrenProp, className, bordersColor, size }) => {
  let clampedMax = max < 2 ? 2 : max;

  const children = React.Children.toArray(childrenProp).filter((child) => {
    if (isFragment(child)) {
      console.error(
        [
          "The AvatarGroup component doesn't accept a Fragment as a child.",
          'Consider providing an array instead.',
        ].join('\n'),
      );
    }

    return React.isValidElement(child);
  });

  const totalAvatars = total || children.length;

  if (totalAvatars === clampedMax) {
    clampedMax += 1;
  }

  clampedMax = Math.min(totalAvatars + 1, clampedMax);

  const maxAvatars = Math.min(children.length, clampedMax - 1);
  const extraAvatars = Math.max(totalAvatars - clampedMax, totalAvatars - maxAvatars, 0);

  return (
    <Group
      horizontal="start"
      className={className}
      bordersColor={bordersColor}
      size={size}
    >
      {extraAvatars ? (
        <Avatar style={{ paddingLeft: '5px' }}>
          +{extraAvatars}
        </Avatar>
      ) : null}

      {children.slice(0, maxAvatars).reverse()}
    </Group>
  );
};


export default AvatarGroup;

const Group = styled(Row) <{ bordersColor?: string, size?: number }>`
  flex-direction: row-reverse;

  > * {
    margin-left: -8px;
    border: 2px solid ${({ bordersColor }) => bordersColor || 'rgb(18, 18, 18)'};

    ${({ size }) => size && css`
      width: ${size}px;
      height: ${size}px;
    `};
  }
`;
import React from 'react';
import styled from 'styled-components';

import theme from '@/styles/theme';
import { Column, Row } from '@/styles/layout';
import ExternalLink from '../common/external-link';

interface Props {
}

const FormFooter: React.FC<Props> = () => (
  <Column>
    <Row>
      <StyledExternalLink href='#'>Home</StyledExternalLink>
      <StyledExternalLink href='#'>Contact us</StyledExternalLink>
      <StyledExternalLink href='#'>Support</StyledExternalLink>
    </Row>
    <CopyRights>
      Web coin ©{new Date().getFullYear()} All Rights Reserved.
    </CopyRights>
  </Column>
);

export default FormFooter;

const StyledExternalLink = styled(ExternalLink)`
  font-size: 14px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${theme.colors.grey100};
  margin: 0 12px 14px;
  text-decoration: none;
`;

const CopyRights = styled.div`
  font-size: 14px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${theme.colors.blackBase};
`;

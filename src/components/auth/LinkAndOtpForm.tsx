import React from 'react';
import styled from 'styled-components';

import { FormHeader } from '../../styles/auth';

import theme from '@/styles/theme';
import OtpInput from './otp-input';
import { Row } from '@/styles/layout';
import ExternalLink from '../common/external-link';

import GmailImg from '../../../public/assets/gmail.png';
import OutloockImg from '../../../public/assets/outloock.png';

interface Props {
  title: React.ReactNode;
  onSubmit: (code: string) => void;
  onChangeCode?: (code: string) => void;
  disabled?: boolean;
}


const LinkAndOtpForm: React.FC<Props> = ({
  title,
  onSubmit,
  onChangeCode,
  disabled = false
}) => (
  <>
    <FormHeader>{title}</FormHeader>
    <MessageText>To continue, please follow the instructions we sent to your email</MessageText>
    <SmallMessageText>open the verification link</SmallMessageText>
    <EmailsWrapper>
      <Gmail href='https://mail.google.com'>Open Gmail</Gmail>
      <Outlook href='https://outlook.office.com/mail/'>Open Outlook</Outlook>
    </EmailsWrapper>
    <BoldText>
      Don’t see your email provider? Access your email account manually.
    </BoldText>
    <SmallMessageText>or enter the code we sent</SmallMessageText>
    <OtpWrapper>
      <OtpInput
        submitWhenFormIsFiled
        disabled={disabled}
        onSubmit={onSubmit}
        onChange={onChangeCode}
      />
    </OtpWrapper>
  </>
);

export default LinkAndOtpForm;

const EmailsWrapper = styled(Row)`
  margin: 26px 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -34px;
    left: -29px;
    width: 324px;
    height: 1px;
    background-color: ${theme.colors.grey200};
  }
`;

const EmailButton = styled(ExternalLink)`
  padding-left: 34px;
  height: 24px;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${theme.colors.blackBase};
  background-repeat: no-repeat;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const Gmail = styled(EmailButton)`
  background-image: url(${GmailImg});
`;

const Outlook = styled(EmailButton)`
  margin-left: 36px;
  background-image: url(${OutloockImg});
`;

const OtpWrapper = styled.div`
  margin: 24px 0 84px;
  width: 100%;
`;

const MessageText = styled.div`
  width: 280px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: ${theme.colors.blackBase};
  margin-bottom: 9px;
  
  a, span {
    cursor: pointer;
    white-space: nowrap;
    color: ${theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BoldText = styled(MessageText)`
  font-weight: bold;
  margin-top: 20px;
`;

const SmallMessageText = styled(MessageText)`
  color: ${theme.colors.grey100};
  margin: 34px 0 0;
  width: 330px;
`;
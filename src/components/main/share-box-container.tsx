import { IBudget, IMoneyBox } from '@/api/models/user';
import { shareBox, shareBudget } from '@/api/user';
import storage from '@/services/local-storage-handlers';
import useLocalStorage from '@/services/local-storage-handlers/use-local-storage';
import { updateBox, updateBudget } from '@/store/user/actions';
import { Row } from '@/styles/layout';
import theme from '@/styles/theme';
import { TStyled } from '@/styles/types';
import { VALIDATORS } from '@/utils/hooks/useForm';
import useInput from '@/utils/hooks/useInput';
import useList from '@/utils/hooks/useList';
import { useRequest } from '@/utils/hooks/useRequest';
import useToggle from '@/utils/hooks/useToggle';
import { toast } from '@/utils/toast';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import DropdownMenu from '../common/dropdown-menu';
import Modal from '../common/modal';
import TagInput from '../common/TagInput';
import TextArea from '../common/textArea';
import Toggle from '../common/toggle';

interface Props {
  isShownModal: boolean;
  selectedBox: IMoneyBox;
  onClose: () => void;
}

const INIT_MESSAGE = 'Hello,\nPlease check out this money box:';

const ShareBoxContainer: React.FC<Props> = ({
  isShownModal,
  selectedBox,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [currentEmail, setCurrentEmail] = useInput('');
  const [emails, handleEmails] = useList<string>([]);
  const [
    emailsAutocomplete,
    handleEmailsAutocomplete,
  ] = useLocalStorage<string[]>(storage.emailAutocomplete);

  const [isOpenTextArea, handleIsOpenTextArea] = useToggle(false);
  const [isOpenDropdown, handleIsOpenDropdown] = useToggle(false);

  const [message, setMessage] = useInput(INIT_MESSAGE);

  const shareBoxRequest = useRequest(shareBox, {
    onSuccess: (box) => {
      toast('success', `Box "${selectedBox.name}" was shared with ${emails.length} users`);
      onClose();
      handleEmails.clear();
      setMessage(INIT_MESSAGE);
      handleIsOpenTextArea.disable();
      dispatch(updateBox(box));
    },
  });

  const onAddNewEmail = (email: string) => {
    if (emailsAutocomplete) {
      const newEmailsAutocomplete = emailsAutocomplete.filter((emailElement) => emailElement !== email);
      newEmailsAutocomplete.unshift(email);
      handleEmailsAutocomplete.set(newEmailsAutocomplete);
    } else {
      handleEmailsAutocomplete.set([email]);
    }

    handleEmails.add(email);
    setCurrentEmail('');
  };

  const onSubmit = () => {
    const includes = emails.some((email) => {
      if (selectedBox.users.includes(email)) {
        toast('error', `User ${email} already has access to the budget`);
        return true;
      }
    });

    if (includes) return;

    shareBoxRequest.fetch({
      id: selectedBox.id,
      emails,
      message: isOpenTextArea ? message : '',
    });
  };

  const handleOpenTextArea = (selected: boolean) => {
    handleIsOpenTextArea.set(selected);
  };

  const renderAutocomplete = () => {
    if (emailsAutocomplete) {
      return emailsAutocomplete.map((email) => ({
        title: email,
        key: email,
      }));
    }

    return [];
  };

  const renderInput = () => {
    return (
      <TagInput
        onFocus={(e) => {
          e.stopPropagation();
          handleIsOpenDropdown.enable();
        }}
        onBlur={(e) => {
          e.stopPropagation();
          handleIsOpenDropdown.disable();
        }}
        onTextChange={setCurrentEmail}
        values={emails}
        currentValue={currentEmail}
        onAdd={onAddNewEmail}
        onDelete={handleEmails.removeByIndex}
        placeholder='email address'
        isValid={VALIDATORS.VALID_EMAIL().check}
      />
    );
  };

  if (!isShownModal) return null;

  return (
    <Modal
      header='Share'
      isShown={isShownModal}
      isLoading={shareBoxRequest.loading}
      width='530px'
      onClose={onClose}
      content={(
        <ShareVideoWrapper>
          <VideoNameWrapper horizontal='start'>
            {selectedBox.name}
          </VideoNameWrapper>
          <Title>Add email addresses to share with</Title>
          <DropdownMenu
            triggerArea={renderInput}
            options={renderAutocomplete()}
            onChange={onAddNewEmail}
            filterOptions={(option) => option.title.includes(currentEmail) && !emails.includes(option.title)}
            label='Recipient emails'
            isShown={isOpenDropdown}
            isAutocompletePreventDefault={false}
            isAutocomplete
          />
          <ToggleContainer>
            <StyledToggle
              selected={isOpenTextArea}
              onSelect={handleOpenTextArea}
            />
            <Title>Write a message for the recipients</Title>
          </ToggleContainer>
          {isOpenTextArea && (
            <StyledTextArea
              onChange={setMessage}
              textAreaAtributes={{
                value: message,
                placeholder: 'Type in your message',
                rows: 3,
              }}
              isAutoGrow
            />
          )}
        </ShareVideoWrapper>
      )}
      actions={{
        hasCancel: false,
        submit: {
          disabled: !emails.length || shareBoxRequest.loading,
          title: 'Share',
          onClick: onSubmit,
        }
      }}
    />
  );
};

export default ShareBoxContainer;

const VideoNameWrapper = styled(Row)`
  font-weight: normal;
  font-size: 14px;
  letter-spacing: 0.004em;
  color: ${theme.colors.blackBase};
  margin: -20px 0 24px;
`;

const ToggleContainer = styled.div`
  display: flex;
`;

const StyledTextArea: TStyled<typeof TextArea> = styled(TextArea)`
  max-height: 400px;
`;

const StyledToggle: TStyled<typeof Toggle> = styled(Toggle)`
  margin-right: 12px;
`;

const ModalContent = styled.div`
  color: ${theme.colors.grey100};
`;

const ShareVideoWrapper: TStyled<typeof ModalContent> = styled(ModalContent)`
  margin: 0 0 10px;
`;

const Title = styled.div`
  margin: 12px 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.02em;
  color: ${theme.colors.grey100};
`;

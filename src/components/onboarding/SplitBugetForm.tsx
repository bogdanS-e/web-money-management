import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { IBudget } from '@/api/models/user';
import { setCategories } from '@/api/category';
import { ICreateCategory } from '@/api/models/category';
import { updateBudget, updateUser } from '@/store/user/actions';
import { useRequest } from '@/utils/hooks/useRequest';

import TextButton from '@/components/common/TextButton';
import ErrorMessage from '@/components/common/ErrorMessage';
import FormFooter from '../auth/FormFooter';
import CategoryForm from '../common/category-form';
import {
  FormContainer,
  FormHeader,
  FormHeaderSubtitle,
  MessageContainer,
} from '@/styles/auth';
import { Column } from '@/styles/layout';

interface Props {
  budget: IBudget;
}

const SplitBugetForm: React.FC<Props> = ({ budget }) => {
  const dispatch = useDispatch();

  const setCategoriesRequest = useRequest(setCategories, {
    onSuccess: (newBudget) => {
      dispatch(updateUser({ onboarded: true }));
      dispatch(updateBudget(newBudget));

    }
  });

  const onSubmit = (budgetId: string, categories: ICreateCategory[]) => {
    setCategoriesRequest.fetch({ budgetId, categories })
  };

  const renderForm = () => (
    <Column>
      <StyledFormContainer>
        <FormHeader>Nice, you created your first budget <Emoji>🎉</Emoji></FormHeader>
        <FormHeaderSubtitle>Let's try to split it in different categories</FormHeaderSubtitle>
        <div style={{ width: '100%', marginTop: '-25px', textAlign: 'center' }}>
          <CategoryForm
            budgetId={budget.id}
            onSubmit={onSubmit}
            triggerArea={(
              <SubmitWrapper>
                <TextButton
                  width='55%'
                  loading={setCategoriesRequest.loading}
                  disabled={setCategoriesRequest.loading}
                >
                  Done
                </TextButton>
              </SubmitWrapper>
            )}
          />
          <MessageContainer>
            {setCategoriesRequest.fail && (
              <ErrorMessage
                message={setCategoriesRequest.error?.message ?? 'Something went wrong'}
              />
            )}
          </MessageContainer>
        </div>
        <FooterWrapper>
          <FormFooter />
        </FooterWrapper>
      </StyledFormContainer>
    </Column >
  );

  return (
    renderForm()
  );
};

export default SplitBugetForm;

const FooterWrapper = styled.div`
  margin-top: auto;
`;

const Emoji = styled.span`
  font-weight: normal;
`;

const SubmitWrapper = styled.div`
  margin: 24px 0;
`;

const StyledFormContainer = styled(FormContainer)`
  min-height: 0;
`;
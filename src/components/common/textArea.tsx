import useInput from '@/utils/hooks/useInput';
import React, { TextareaHTMLAttributes, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';


import theme from '../../styles/theme';
import ScrollingWrapper from './scrolling-wrapper';

interface Props {
  onChange: (text: string) => void;
  isAutoGrow?: boolean;
  textAreaAtributes?: TextareaHTMLAttributes<HTMLTextAreaElement>
  head?: string;
  className?: string;
}

const TextArea: React.FC<Props> = ({
  onChange,
  isAutoGrow = false,
  head,
  textAreaAtributes,
  className,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useInput((textAreaAtributes?.value as string) ?? '');

  useEffect(() => {
    const inputValue = textAreaAtributes?.value;

    if (typeof inputValue === 'string') {
      setText(textAreaAtributes?.value as string);
    }
  }, [textAreaAtributes?.value]);

  const handleHeight = () => {
    if (!isAutoGrow || !textAreaRef.current) return;

    const textarea = textAreaRef.current;

    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';

    setText(textarea.value);
    onChange(textarea.value);
  }

  useEffect(() => {
    //firstly we need to insert element and on the next iteration to take scrollHeight of real DOM element
    setTimeout(handleHeight, 0);
  }, []);

  return (
    <Container
      isAutoGrow={isAutoGrow && !!head}
      className={className}
    >
      {head && (
        <Head>{head}</Head>
      )}
      <ScrollingWrapper>
        <StyledTextArea
          onChange={handleHeight}
          ref={textAreaRef}
          value={text}
          {...textAreaAtributes}
        />
      </ScrollingWrapper>
    </Container>
  );
};

export default TextArea;

const Head = styled.div`
  padding: 8px 12px;
  background-color: ${theme.colors.grey300};
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  resize: none;
  padding: 12px;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
`;

const Container = styled.div<{ isAutoGrow: boolean; }>`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${theme.colors.blackBase};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${theme.colors.grey400};

  ${({ isAutoGrow }) => isAutoGrow && css`
    ${StyledTextArea} {
      overflow: hidden;
      padding-top: 0;
    }

    ${Head} {
      margin-bottom: 12px;
    }
  `};
`;


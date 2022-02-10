import React from 'react'
import styled from 'styled-components'

import theme from '@/styles/theme'
import Link from './Link'

interface Props {
  text: string
  onClick?: () => void
  link?: string
  className?: string
}

const ClickableText: React.FC<Props> = ({ text, onClick, link, className }) => {
  const texts = text.split('~~')

  const isInternal = link?.startsWith('/')

  return (
    <Container>
      {texts[0].length !== 0 && <Text>{texts[0]}</Text>}
      {!link ? (
        <TextClick className={className} onClick={onClick}>
          {texts[1]}
        </TextClick>
      ) : isInternal ? (
        <TextLink href={link} className={className}>
          {texts[1]}
        </TextLink>
      ) : (
        <TextLinkExternal
          href={link}
          target="_blank"
          className={className}
          onClick={onClick}
        >
          {texts[1]}
        </TextLinkExternal>
      )}
      {texts[2].length !== 0 && <Text>{texts[2]}</Text>}
    </Container>
  )
}

export default ClickableText

const Container = styled.div``

const Text = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(46, 42, 79, 0.65);
`

const TextClick = styled.span`
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: ${theme.colors.primary};
`

const TextLink = styled(Link)`
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: ${theme.colors.primary};
  text-decoration: none;
`

const TextLinkExternal = styled.a`
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: ${theme.colors.primary};
  text-decoration: none;
`

import { Column, Row } from 'components/Flex'
import { CloseIcon } from 'components/Icons/Close'
import { styled } from 'styled-components'
import { ThemedText } from 'theme/components'

const StyledContent = styled.div`
  border: 3px solid ${({ theme }) => theme.neutral1};
  padding: 32px;
  background: ${({ theme }) => theme.bg1};
  z-index: 1060;
  position: fixed;
  left: 50%;
  top: 50%;
  width: 386px;
  transform: translate(-50%, -50%);
`

const TitleContainer = styled(Row)`
  position: absolute;
  top: -32px;
  width: 100%;
  padding: 0 4px;

  & > div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`

const CloseContainer = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.neutral1};
  width: 28px;
  height: 28px;
  padding: 4px;
  cursor: pointer;
  border: 3px solid ${({ theme }) => theme.neutral1};
  top: -3px;
  right: -3px;

  & > svg {
    display: block;
  }
`

interface ContentProps {
  children: React.ReactNode
  title: string
  close: () => void
}

export default function Content({ children, title, close }: ContentProps) {
  return (
    <StyledContent>
      <Column gap={32}>
        <TitleContainer>
          <ThemedText.HeadlineSmall>{title}</ThemedText.HeadlineSmall>
        </TitleContainer>

        <CloseContainer onClick={close}>
          <CloseIcon />
        </CloseContainer>

        {children}
      </Column>
    </StyledContent>
  )
}

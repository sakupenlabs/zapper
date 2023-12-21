import { Column } from 'components/Flex'
import Inventory from 'components/Inventory'
import { Token, tokensList } from 'constants/tokens'
import useBalances from 'hooks/useBalances'
import { useState } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'

const Section = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 32px 12px 32px;

  @media only screen and (min-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 64px;
  }
`

const Error = styled(ThemedText.HeadlineLarge)`
  color: ${({ theme }) => theme.error};
  animation: shake 250ms ease-in-out;

  @keyframes shake {
    33% {
      transform: translateX(-12px);
    }

    66% {
      transform: translateX(12px);
    }
  }
`

const Retry = styled(ThemedText.HeadlineSmall)`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const InventoryContainer = styled(Column)`
  align-items: flex-start;
  padding: 24px 16px;
  gap: 8px;
`

const InventoryStatus = styled(ThemedText.HeadlineSmall)`
  margin-left: 8px !important;
`

export default function HomePage() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)

  const { data, loading, error, refetch } = useBalances(tokensList)

  if (error) {
    console.error(error)
  }

  return (
    <Section>
      {error ? (
        <Column gap={8}>
          <Error>Error.</Error>
          <Retry onClick={() => refetch()}>Retry</Retry>
        </Column>
      ) : (
        <InventoryContainer>
          <Inventory balances={data ?? {}} selectToken={setSelectedToken} />
          <InventoryStatus>
            {loading
              ? 'Loading...'
              : selectedToken
              ? `${selectedToken.symbol} ${data?.[selectedToken.address].toFixed(6, { groupSeparator: ',' }) ?? 0}`
              : ''}
          </InventoryStatus>
        </InventoryContainer>
      )}
    </Section>
  )
}

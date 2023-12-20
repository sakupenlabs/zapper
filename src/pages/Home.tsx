import { Column } from 'components/Flex'
import { tokensList } from 'constants/tokens'
import useBalances from 'hooks/useBalances'
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

const Error = styled(ThemedText.HeadlineMedium)`
  color: ${({ theme }) => theme.error};
`

export default function HomePage() {
  const { data, loading, error } = useBalances(tokensList)

  if (error) {
    console.error(error)
  }

  return (
    <Section>
      {loading && <ThemedText.HeadlineMedium textAlign="center">Loading...</ThemedText.HeadlineMedium>}

      {error && <Error>Error.</Error>}

      {!!data && (
        <Column>
          {tokensList.map((token) => (
            <ThemedText.BodyPrimary key={token.address}>
              {data[token.address].toSignificant(6)} {token.symbol}
            </ThemedText.BodyPrimary>
          ))}
        </Column>
      )}
    </Section>
  )
}

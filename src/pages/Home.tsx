import { useAccount, useContractWrite } from '@starknet-react/core'
import { SecondaryButton } from 'components/Button'
import { Column } from 'components/Flex'
import { ArrowIcon } from 'components/Icons/Arrow'
import Inventory from 'components/Inventory'
import Slot from 'components/Inventory/Slot'
import Toggle from 'components/Toggle'
import { OWL, TOKENS_LIST } from 'constants/tokens'
import { useAggregateQuotes, useQuotes, UseQuotesTokenFrom, useSwapBuilder } from 'hooks/useAvnu'
import useBalances from 'hooks/useBalances'
import useToken from 'hooks/useToken'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { decimalsScale } from 'utils/decimals'

const Section = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 16px 12px 32px;

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

const FirstArticle = styled(Column)`
  gap: 32px;

  @media only screen and (min-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    gap: 64px;
  }
`

const InventoryContainer = styled(Column)`
  align-items: flex-start;
  padding: 0 16px;
  gap: 8px;
`

const Status = styled(ThemedText.HeadlineSmall)`
  padding-left: 28px;
  text-align: left;
  width: 100%;
`

const SelectedTokenInfos = styled(ThemedText.HeadlineSmall)`
  padding-left: 28px;
  text-align: left;
  width: 100%;
`

const AllInContainer = styled(Column)`
  gap: 16px;

  @media only screen and (min-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    gap: 32px;
    flex-direction: row;
  }
`

const ZapButton = styled(SecondaryButton)`
  width: 250px;
`

const ArrowIconContainer = styled.div`
  width: 48px;
  height: 48px;

  @media only screen and (min-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    transform: rotate(270deg);
  }
`

const SLIPPAGES = [500, 1_000, 2_000]

export default function HomePage() {
  const [slippageIndex, setSlippageIndex] = useState(0)

  const { address: accountAddress } = useAccount()
  const { writeAsync, isPending } = useContractWrite({})

  // tokens
  const { disabledTokenAddresses } = useToken()

  // balances
  const balances = useBalances(TOKENS_LIST)

  // quotes
  const tokensFrom = useMemo(
    (): UseQuotesTokenFrom[] =>
      TOKENS_LIST.map((token) => ({
        address: token.address,
        decimals: token.decimals,
        amount: balances.data?.[token.address].multiply(decimalsScale(token.decimals)).quotient.toString() ?? 0,
      })).filter((token) => +token.amount && !disabledTokenAddresses[token.address]),
    [balances.data, disabledTokenAddresses]
  )
  const quotes = useQuotes(tokensFrom, OWL.address)
  const buyAmount = useAggregateQuotes(quotes.data)

  // token selection
  const { selectedToken } = useToken()

  const selectedTokenInfos = useMemo(() => {
    if (selectedToken) {
      const balance = selectedToken.address === OWL.address ? buyAmount : balances.data?.[selectedToken.address]
      return `${selectedToken.symbol} ${balance ? balance.toSignificant(6, { groupSeparator: ',' }) : ''}`
    }

    return <>&nbsp;</>
  }, [balances.data, selectedToken, buyAmount])

  // ALL IN
  const buildSwap = useSwapBuilder(SLIPPAGES[slippageIndex])
  const allIn = useCallback(async () => {
    try {
      const calls = await buildSwap(quotes.data)
      await writeAsync({ calls })
    } catch (err) {
      console.error(err)
    }
  }, [buildSwap, writeAsync, quotes.data])

  // error loading
  const loading = balances.loading || quotes.loading || isPending

  const status = useMemo(() => {
    if (!accountAddress) return 'No wallet connected.'

    if (loading) return 'Loading...'

    return <>&nbsp;</>
  }, [accountAddress, loading])

  if (balances.error) {
    console.error(balances.error)
  }

  return (
    <Section>
      {accountAddress && balances.error ? (
        <Column gap={8}>
          <Error>Error.</Error>
          <Retry onClick={() => balances.refetch()}>Retry</Retry>
        </Column>
      ) : (
        <FirstArticle>
          <Column gap={8}>
            <Status>{status}</Status>

            <InventoryContainer>
              <Inventory balances={balances.data ?? {}} />
            </InventoryContainer>

            <SelectedTokenInfos>{selectedTokenInfos}</SelectedTokenInfos>
          </Column>

          <AllInContainer>
            <Column gap={16}>
              <Column alignItems="flex-start" gap={8}>
                <ThemedText.BodyPrimary>Slippage:</ThemedText.BodyPrimary>
                <Toggle
                  options={SLIPPAGES.map((slippage) => `${slippage / 100}%`)}
                  selectedOption={slippageIndex}
                  selectOption={setSlippageIndex}
                />
              </Column>

              <ZapButton disabled={loading || !quotes.data.length} onClick={allIn}>
                {isPending ? 'Signing...' : 'ALL IN'}
              </ZapButton>
            </Column>

            <ArrowIconContainer>
              <ArrowIcon />
            </ArrowIconContainer>

            <Slot token={OWL} balance={buyAmount} />
          </AllInContainer>
        </FirstArticle>
      )}
    </Section>
  )
}

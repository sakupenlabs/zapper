import { buildApproveTx, fetchBuildExecuteTransaction, fetchQuotes, Quote, QuoteRequest, Token } from '@avnu/avnu-sdk'
import { useAccount, useBlockNumber } from '@starknet-react/core'
import { Fraction } from '@uniswap/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Call } from 'starknet'
import { decimalsScale } from 'utils/decimals'

export interface UseQuotesTokenFrom {
  address: string
  decimals: number
  amount: string | number
}

type ZapperQuote = Quote & { decimals: Token['decimals'] }

interface UseQuotesResult {
  data: ZapperQuote[]
  loading: boolean
}

export function useQuotes(tokensFrom: UseQuotesTokenFrom[], tokenAddressTo: string): UseQuotesResult {
  const [quotes, setQuotes] = useState<Record<string, ZapperQuote>>({})
  const [loadingCount, setLoadingCount] = useState(0)

  const { data: blockNumber } = useBlockNumber({ refetchInterval: 3000 })

  useEffect(() => {
    if (!blockNumber) return

    setLoadingCount(tokensFrom.length)

    const abortController = new AbortController()

    for (const tokenFrom of tokensFrom) {
      const params: QuoteRequest = {
        sellTokenAddress: tokenFrom.address,
        buyTokenAddress: tokenAddressTo,
        sellAmount: BigInt(tokenFrom.amount),
      }
      fetchQuotes(params, { abortSignal: abortController.signal })
        .then((quotes) => {
          setQuotes((state) => ({
            ...state,
            [tokenFrom.address]: { ...quotes[0], sellTokenAddress: tokenFrom.address, decimals: tokenFrom.decimals },
          }))
          setLoadingCount((state) => state - 1)
        })
        .catch((error) => {
          if (!abortController.signal.aborted) {
            console.log(error)
          }
          setLoadingCount((state) => state - 1)
        })
    }

    return () => abortController.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tokensFrom), tokenAddressTo, blockNumber])

  return { data: Object.values(quotes), loading: !!loadingCount }
}

export function useAggregateQuotes(quotes: ZapperQuote[]) {
  return useMemo(
    () =>
      quotes.reduce<Fraction>(
        (acc, quote) => acc.add(new Fraction((quote.buyAmount ?? 0).toString(), decimalsScale(quote.decimals))),
        new Fraction(0)
      ),
    [quotes]
  )
}

export function useSwapBuilder(slippage: number): (quotes: Quote[]) => Promise<Call[] | undefined> {
  const { address: accountAddress } = useAccount()

  return useCallback(
    async (quotes: Quote[]) => {
      if (!accountAddress) return

      return Promise.all(
        quotes.map((quote) => fetchBuildExecuteTransaction(quote.quoteId, undefined, accountAddress, slippage / 10_000))
      ).then((calls) => {
        return [
          ...quotes.map((quote) => buildApproveTx(quote.sellTokenAddress, quote.sellAmount, quote.chainId)),
          ...calls,
        ]
      })
    },
    [accountAddress, slippage]
  )
}

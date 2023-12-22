import { fetchQuotes, QuoteRequest } from '@avnu/avnu-sdk'
import { Fraction } from '@uniswap/sdk-core'
import { useEffect, useMemo, useState } from 'react'
import { decimalsScale } from 'utils/decimals'

export interface UseQuotesTokenFrom {
  address: string
  decimals: number
  amount: string | number
}

export function useQuotes(tokensFrom: UseQuotesTokenFrom[], tokenAddressTo: string): Fraction {
  const [quotes, setQuotes] = useState<Record<UseQuotesTokenFrom['address'], string>>({})

  useEffect(() => {
    const abortController = new AbortController()

    for (const tokenFrom of tokensFrom) {
      const params: QuoteRequest = {
        sellTokenAddress: tokenFrom.address,
        buyTokenAddress: tokenAddressTo,
        sellAmount: BigInt(tokenFrom.amount),
      }
      fetchQuotes(params, { abortSignal: abortController.signal })
        .then((quotes) => {
          setQuotes((state) => ({ ...state, [tokenFrom.address]: quotes[0].buyAmount.toString() }))
        })
        .catch((error) => {
          if (!abortController.signal.aborted) {
            console.log(error)
          }
        })
    }

    return () => abortController.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tokensFrom), tokenAddressTo])

  return useMemo(
    () =>
      tokensFrom.reduce<Fraction>(
        (acc, token) => acc.add(new Fraction(quotes[token.address] ?? 0, decimalsScale(token.decimals))),
        new Fraction(0)
      ),
    [quotes, tokensFrom]
  )
}

import { useAccount, useContractRead, UseContractReadResult } from '@starknet-react/core'
import { Fraction } from '@uniswap/sdk-core'
import { compiledMulticall, MULTICALL_ADDRESS } from 'constants/contracts'
import { BALANCE_OF_CAMEL_SELECTOR, BALANCE_OF_SELECTOR } from 'constants/misc'
import { Token } from 'constants/tokens'
import { useMemo } from 'react'
import { CallStruct, uint256 } from 'starknet'
import { decimalsScale } from 'utils/decimals'

type Balance = Fraction
export type Balances = Record<string, Balance>

interface UseBalancesResult extends Pick<UseContractReadResult, 'error' | 'refetch'> {
  data?: Balances
  loading: boolean
}

type UseBalancesToken = Pick<Token, 'address' | 'camelCased' | 'decimals'>

export default function useBalances(tokens: UseBalancesToken[]): UseBalancesResult {
  const { address: accountAddress } = useAccount()

  const res = useContractRead({
    abi: compiledMulticall, // call is not send if abi is undefined
    address: accountAddress ? MULTICALL_ADDRESS : undefined,
    functionName: 'aggregate',
    watch: true,
    args: [
      tokens.map(
        (token): CallStruct => ({
          to: token.address,
          selector: token.camelCased ? BALANCE_OF_CAMEL_SELECTOR : BALANCE_OF_SELECTOR,
          calldata: [accountAddress ?? ''],
        })
      ),
    ],
  }) as UseContractReadResult & { data?: [bigint, [bigint, bigint][]] }

  const data = useMemo(() => {
    if (!res.data) return undefined

    return res.data[1].reduce<Record<string, Fraction>>((acc, balance, index) => {
      const token = tokens[index]
      acc[token.address] = new Fraction(
        uint256.uint256ToBN({ low: balance[0], high: balance[1] }).toString(),
        decimalsScale(token.decimals)
      )

      return acc
    }, {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res.data?.[0].toString()])

  return { data, loading: res.fetchStatus === 'fetching', error: res.error, refetch: res.refetch }
}

import { TOKENS_LIST } from 'constants/tokens'
import { Balances } from 'hooks/useBalances'
import useWindowSize from 'hooks/useWindowSize'
import { useMemo } from 'react'
import styled from 'styled-components'

import Slot, { SLOT_WIDTH } from './Slots'

const MAX_COLS = 7
const GAP = 4
const X_PADDING = 16
const MIN_SLOTS = MAX_COLS + 1

const StyledInventory = styled.div<{ width: number; cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols}, ${SLOT_WIDTH}px);
  gap: ${GAP}px;
  width: ${({ width }) => width}px;
  position: relative;
`

interface InventoryProps extends React.HTMLAttributes<HTMLDivElement> {
  balances: Balances
}

export default function Inventory({ balances }: InventoryProps) {
  // window size
  const { width: windowWidth } = useWindowSize()

  const cols = useMemo(
    () => (windowWidth ? Math.min(Math.floor((windowWidth - X_PADDING * 2) / (SLOT_WIDTH + GAP)), MAX_COLS) : 0),
    [windowWidth]
  )

  const width = useMemo(() => cols * (SLOT_WIDTH + GAP) - GAP, [cols])

  const filteredTokenList = useMemo(
    () => TOKENS_LIST.filter((token) => +(balances[token.address]?.toFixed(2) ?? 0)),
    [balances]
  )

  const emptySlotsCount = useMemo(
    () => (cols ? Math.ceil(MIN_SLOTS / cols) * cols - filteredTokenList.length : 0),
    [cols, filteredTokenList.length]
  )

  return (
    <StyledInventory width={width} cols={cols}>
      {filteredTokenList.map((token) => (
        <Slot
          key={token.address}
          token={token}
          balance={Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(
            +balances[token.address].toFixed(2)
          )}
        />
      ))}

      {Array(emptySlotsCount)
        .fill(0)
        .map((_, index) => (
          <Slot key={index} />
        ))}
    </StyledInventory>
  )
}

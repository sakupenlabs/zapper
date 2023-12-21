import slotActive from 'assets/slot.active.svg'
import slot from 'assets/slot.svg'
import { Row } from 'components/Flex'
import { Token, tokensList } from 'constants/tokens'
import { Balances } from 'hooks/useBalances'
import useWindowSize from 'hooks/useWindowSize'
import { useMemo } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'

const MAX_COLS = 7
const SLOT_WIDTH = 94
const GAP = 4
const X_PADDING = 16
const MIN_SLOTS = 12

const StyledInventory = styled.div<{ width: number; cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols}, ${SLOT_WIDTH}px);
  gap: ${GAP}px;
  width: ${({ width }) => width}px;
  position: relative;
`

const Slot = styled(Row)`
  width: ${SLOT_WIDTH}px;
  height: ${SLOT_WIDTH}px;
  position: relative;
  position: relative;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 16px;
  cursor: pointer;
  -webkit-touch-callout: none; /* Safari */
  -webkit-user-select: none; /* Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;

  &::after {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';
    position: absolute;
    background-image: url('${slot}');
    background-position: center;
    background-size: cover;
  }

  &:hover::after {
    background-image: url('${slotActive}');
  }
`

const CoinsIconContainer = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
`

const Balance = styled(ThemedText.BodyPrimary)`
  position: absolute;
  bottom: 4px;
  right: 8px;
  text-shadow: 1px 1px black, -1px -1px black, -1px 1px black, 1px -1px black;
`

interface Inventory extends React.HTMLAttributes<HTMLDivElement> {
  balances: Balances
  selectToken: (token: Token | null) => void
}

export default function Inventory({ balances, selectToken }: Inventory) {
  // window size
  const { width: windowWidth } = useWindowSize()

  const cols = useMemo(
    () => (windowWidth ? Math.min(Math.floor((windowWidth - X_PADDING * 2) / (SLOT_WIDTH + GAP)), MAX_COLS) : 0),
    [windowWidth]
  )

  const width = useMemo(() => cols * (SLOT_WIDTH + GAP) - GAP + X_PADDING * 2, [cols])

  const filteredTokenList = useMemo(
    () => tokensList.filter((token) => +(balances[token.address]?.toFixed(2) ?? 0)),
    [balances]
  )

  const emptySlotsCount = useMemo(
    () => (cols ? Math.ceil(MIN_SLOTS / cols) * cols - filteredTokenList.length : 0),
    [cols, filteredTokenList.length]
  )

  return (
    <StyledInventory width={width} cols={cols}>
      {filteredTokenList.map((token) => (
        <Slot key={token.address} onMouseEnter={() => selectToken(token)} onMouseLeave={() => selectToken(null)}>
          <CoinsIconContainer>{token.getIcon()}</CoinsIconContainer>
          <Balance>
            {Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(
              +balances[token.address].toFixed(2)
            )}
          </Balance>
        </Slot>
      ))}

      {Array(emptySlotsCount)
        .fill(0)
        .map((_, index) => (
          <Slot key={index} />
        ))}
    </StyledInventory>
  )
}

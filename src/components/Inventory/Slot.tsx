import { Fraction } from '@uniswap/sdk-core'
import slotActive from 'assets/slot.active.svg'
import slot from 'assets/slot.svg'
import { Row } from 'components/Flex'
import { Token } from 'constants/tokens'
import useToken from 'hooks/useToken'
import { useMemo } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'

export const SLOT_WIDTH = 94

const StyledSlot = styled(Row)<{ disabled: boolean }>`
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

  ${({ disabled = false }) => disabled && 'opacity: 0.3;'}

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
  margin-bottom: 8px;
`

const Balance = styled(ThemedText.BodyPrimary)`
  position: absolute;
  bottom: 4px;
  right: 8px;
  text-shadow: 1px 1px black, -1px -1px black, -1px 1px black, 1px -1px black;
`

interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  token?: Token
  balance?: Fraction
  disabled?: boolean
}

export default function Slot({ token, balance, ...props }: SlotProps) {
  const { selectToken, deselectToken } = useToken()

  const parsedBalance = useMemo(() => {
    if (!balance) return ''

    const numBalance = +balance.toFixed(2)

    if (numBalance) {
      return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(numBalance)
    }

    return '>0.01'
  }, [balance])

  return (
    <StyledSlot
      onMouseEnter={token ? () => selectToken(token) : undefined}
      onMouseLeave={token ? deselectToken : undefined}
      {...props}
    >
      {!!token && (
        <>
          <CoinsIconContainer>{token.getIcon()}</CoinsIconContainer>
          <Balance>{parsedBalance}</Balance>
        </>
      )}
    </StyledSlot>
  )
}

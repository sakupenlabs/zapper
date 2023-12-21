import { Row } from 'components/Flex'
import { HTMLAttributes } from 'react'
import { styled } from 'styled-components'

const StyledToggle = styled(Row)`
  gap: 16px;
  align-items: flex-end;
`

const Option = styled.div<{ selected: boolean }>`
  border-width: 3px 3px 10px 3px;
  border-style: solid;
  border-color: ${({ theme }) => theme.neutral1};
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.neutral1};
  padding: 6px 8px;
  width: 70px;
  text-align: center;
  cursor: pointer;

  ${({ theme, selected }) =>
    selected &&
    `
      border-width: 3px;
      border-color: ${theme.accent1};
    `}
`

interface ToggleProps extends HTMLAttributes<HTMLDivElement> {
  options: string[]
  selectedOption: number
  selectOption: (option: number) => void
}

export default function Toggle({ options, selectedOption, selectOption, ...props }: ToggleProps) {
  return (
    <StyledToggle {...props}>
      {options.map((option, index) => (
        <Option key={option} onClick={() => selectOption(index)} selected={selectedOption == index}>
          {option}
        </Option>
      ))}
    </StyledToggle>
  )
}

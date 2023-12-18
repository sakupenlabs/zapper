import styled from 'styled-components'

const StyledOverlay = styled.div`
  opacity: 0.7;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  background: ${({ theme }) => theme.black};
  z-index: 1040;
`

interface OverlayProps {
  onClick: () => void
}

export default function Overlay({ onClick }: OverlayProps) {
  return <StyledOverlay onClick={onClick} />
}

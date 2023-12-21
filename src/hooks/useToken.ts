import { useBoundStore } from 'state'

export default function useToken() {
  return useBoundStore((state) => ({
    selectedToken: state.selectedToken,
    selectToken: state.selectToken,
    deselectToken: state.deselectToken,
  }))
}

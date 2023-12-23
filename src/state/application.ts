import { ETH, Token } from 'constants/tokens'
import { StateCreator } from 'zustand'

import { StoreState } from './index'

export enum ModalType {
  WALLET_CONNECT,
  L2_WALLET_OVERVIEW,
}

export type ApplicationSlice = State & Actions

interface State {
  modal: ModalType | null
  selectedToken: Token | null
  disabledTokenAddresses: Record<Token['address'], boolean>
}

interface Actions {
  isModalOpened: (modal: ModalType) => boolean
  openModal: (modal: ModalType) => void
  closeModals: () => void
  toggleModal: (modal: ModalType) => void

  selectToken: (token: Token) => void
  deselectToken: () => void

  toggleTokenAddress: (tokenAddress: Token['address']) => void
}

export const createApplicationSlice: StateCreator<StoreState, [['zustand/immer', never]], [], ApplicationSlice> = (
  set,
  get
) => ({
  modal: null,
  selectedToken: null,
  disabledTokenAddresses: { [ETH.address]: true },

  isModalOpened: (modal: ModalType) => get().modal === modal,
  openModal: (modal: ModalType) => set({ modal }),
  closeModals: () => set({ modal: null }),
  toggleModal: (modal: ModalType) => set((state) => ({ modal: modal === state.modal ? null : modal })),

  selectToken: (token: Token) => set({ selectedToken: token }),
  deselectToken: () => set({ selectedToken: null }),

  toggleTokenAddress: (tokenAddress: Token['address']) =>
    set((state) => ({
      disabledTokenAddresses: {
        ...state.disabledTokenAddresses,
        [tokenAddress]: !state.disabledTokenAddresses[tokenAddress],
      },
    })),
})

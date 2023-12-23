import { CoinsIcon } from 'components/Icons/Coins'
import { EtherIcon } from 'components/Icons/Ether'
import { OwlIcon } from 'components/Icons/Owl'
import { StarkPEPEIcon } from 'components/Icons/StarkPEPE'

export interface Token {
  address: string
  symbol: string
  decimals: number
  camelCased?: boolean
  getIcon: () => JSX.Element
}

export const ETH: Token = {
  address: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  symbol: 'ETH',
  decimals: 18,
  camelCased: true,
  getIcon: () => <EtherIcon />,
}

export const TOKENS_LIST: Token[] = [
  ETH,
  {
    address: '0x06f15ec4b6ff0b7f7a216c4b2ccdefc96cbf114d6242292ca82971592f62273b',
    symbol: 'SPEPE',
    decimals: 18,
    getIcon: () => <StarkPEPEIcon />,
  },
  {
    address: '0x3a6ec0b0ea7a1903329d5dec4bb574ecb4d6fdc206664e1c61eeded8158ab40',
    symbol: 'BLACK',
    decimals: 18,
    getIcon: () => <CoinsIcon color="#000000" />,
  },
  {
    address: '0x79337c58d486aec3f2c5648271345d7c54657a158d88a1e3bd3521129c7cc94',
    symbol: 'POWNI',
    decimals: 18,
    getIcon: () => <CoinsIcon color="#FFC71A" />,
  },
  {
    address: '0x62e09aedf6ac5718cf1a088eb5702ba6b98244399b4422cd2bc75ba7797e961',
    symbol: 'SKDOGE',
    decimals: 18,
    camelCased: true,
    getIcon: () => <CoinsIcon color="#0b0c4f" />,
  },
]

export const OWL: Token = {
  address: '0x39877a272619050ab8b0e3e0a19b58d076fc2ce84da1dc73b699590e629f2b8',
  symbol: 'OWL',
  decimals: 18,
  getIcon: () => <OwlIcon />,
}

import { CoinsIcon } from 'components/Icons/Coins'
import { EtherIcon } from 'components/Icons/Ether'
import { OwlIcon } from 'components/Icons/Owl'

export const TOKENS_LIST = [
  {
    address: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    symbol: 'ETH',
    decimals: 18,
    camelCased: true,
    getIcon: () => <EtherIcon />,
  },
  {
    address: '0x06f15ec4b6ff0b7f7a216c4b2ccdefc96cbf114d6242292ca82971592f62273b',
    symbol: 'SPEPE',
    decimals: 18,
    getIcon: () => <CoinsIcon color="#7EC242" />,
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
]

export const OWL: Token = {
  address: '0x39877a272619050ab8b0e3e0a19b58d076fc2ce84da1dc73b699590e629f2b8',
  symbol: 'OWL',
  decimals: 18,
  getIcon: () => <OwlIcon />,
}

export type Token = (typeof TOKENS_LIST)[number]

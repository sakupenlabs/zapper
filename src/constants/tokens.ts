export const tokensList = [
  {
    address: '0x06f15ec4b6ff0b7f7a216c4b2ccdefc96cbf114d6242292ca82971592f62273b',
    symbol: 'SPEPE',
    decimals: 18,
  },
  {
    address: '0x3a6ec0b0ea7a1903329d5dec4bb574ecb4d6fdc206664e1c61eeded8158ab40',
    symbol: 'BLACK',
    decimals: 18,
  },
]

export type Token = (typeof tokensList)[number]

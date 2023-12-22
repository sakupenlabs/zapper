import Multicall from 'contracts/Multicall.json'
import { json } from 'starknet'

export const MULTICALL_ADDRESS = '0x01a33330996310a1e3fa1df5b16c1e07f0491fdd20c441126e02613b948f0225'

export const compiledMulticall = json.parse(JSON.stringify(Multicall.abi))

// AMMs

// export const AVNU_ROUTER = '0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f'

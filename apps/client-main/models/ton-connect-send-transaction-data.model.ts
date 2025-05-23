import type { CHAIN } from '@tonconnect/protocol'

export interface TonConnectSendTransactionData {
  from: string
  network: CHAIN
  valid_until: number
  messages: {
    address: string
    amount: string
    payload: string | undefined
    stateInit: string | undefined
  }[]
}

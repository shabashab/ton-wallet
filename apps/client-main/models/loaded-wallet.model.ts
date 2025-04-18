import { Address } from '@ton/core'

export interface LoadedWallet {
  address: Address
  publicKey: string
  encryptedPrivateKey: ArrayBuffer
}

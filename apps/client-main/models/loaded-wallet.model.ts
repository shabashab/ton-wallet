export interface LoadedWallet {
  index: number

  publicKey: Buffer
  encryptedSecretKey: string
}

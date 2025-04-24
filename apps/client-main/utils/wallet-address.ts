import { WalletContractV5R1 } from '@ton/ton'

export const calculateWalletAddress = (publicKey: Buffer) => {
  const contract = WalletContractV5R1.create({
    publicKey,
    workchain: 0,
  })

  return contract.address
}

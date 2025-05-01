import { Address } from '@ton/core'

export type FungibleAssetIdentifier =
  | {
      type: 'ton'
    }
  | {
      type: 'jetton'
      contractAddress: Address
    }

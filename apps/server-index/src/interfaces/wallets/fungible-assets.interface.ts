export type FungibleAssetType = WalletFungibleAsset['type']

export interface WalletFungibleAssets {
  statistics: WalletFungleAssetsStatistics
  assets: WalletFungibleAsset[]
}

export interface WalletFungleAssetsStatistics {
  totalUsd: number
}

export interface WalletFungibleAssetBase {
  meta: WalletFungibleAssetMeta

  balance: number
  balanceRaw: string

  balanceUsd: number | undefined
  priceUsd: number | undefined
}

export type WalletFungibleAsset =
  | WalletFungibleAssetTon
  | WalletFungibleAssetJetton

export interface WalletFungibleAssetMeta {
  symbol: string
  displayName: string
  imageUrl?: string

  decimals: number
}

export interface WalletFungibleAssetTon extends WalletFungibleAssetBase {
  type: 'ton'
}

export interface WalletFungibleAssetJetton extends WalletFungibleAssetBase {
  type: 'jetton'

  contractAddress: string
  walletAddress: string
}

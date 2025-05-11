import {
  WalletFungibleAssetBase,
  WalletFungibleAssetJetton,
  WalletFungibleAssetMeta,
  WalletFungibleAssets,
  WalletFungibleAssetTon,
  WalletFungleAssetsStatistics,
} from '@interfaces/wallets/fungible-assets.interface'
import { defineDto } from './_utils'
import { z } from 'zod'

const walletFungibleAssetsStatisticsDto = defineDto(
  z.object({
    totalUsd: z.number(),
  }),
  (walletFungibleAssetsStatistics: WalletFungleAssetsStatistics) => ({
    totalUsd: walletFungibleAssetsStatistics.totalUsd,
  })
)

const walletFungibleAssetMetaDto = defineDto(
  z.object({
    symbol: z.string(),
    displayName: z.string(),
    imageUrl: z.string().optional(),
    decimals: z.number(),
  }),
  (walletFungibleAssetMeta: WalletFungibleAssetMeta) => ({
    symbol: walletFungibleAssetMeta.symbol,
    displayName: walletFungibleAssetMeta.displayName,
    imageUrl: walletFungibleAssetMeta.imageUrl,
    decimals: walletFungibleAssetMeta.decimals,
  })
)

const walletFungibleAssetBaseDto = defineDto(
  z.object({
    balance: z.number(),
    balanceRaw: z.string(),
    balanceUsd: z.number().optional(),
    priceUsd: z.number().optional(),
    meta: walletFungibleAssetMetaDto.schema,
  }),
  (walletFungibleAssetBase: WalletFungibleAssetBase) => ({
    balance: walletFungibleAssetBase.balance,
    balanceRaw: walletFungibleAssetBase.balanceRaw,
    balanceUsd: walletFungibleAssetBase.balanceUsd,
    priceUsd: walletFungibleAssetBase.priceUsd,
    meta: walletFungibleAssetMetaDto(walletFungibleAssetBase.meta),
  })
)

const walletFungibleAssetTonDto = defineDto(
  walletFungibleAssetBaseDto.schema.extend({
    type: z.literal('ton'),
  }),
  (walletFungibleAssetTon: WalletFungibleAssetTon) => ({
    ...walletFungibleAssetBaseDto(walletFungibleAssetTon),
    type: walletFungibleAssetTon.type,
  })
)

const walletFungibleAssetJettonDto = defineDto(
  walletFungibleAssetBaseDto.schema.extend({
    type: z.literal('jetton'),
    contractAddress: z.string(),
    walletAddress: z.string(),
  }),
  (walletFungibleAssetJetton: WalletFungibleAssetJetton) => ({
    ...walletFungibleAssetBaseDto(walletFungibleAssetJetton),
    type: walletFungibleAssetJetton.type,
    contractAddress: walletFungibleAssetJetton.contractAddress,
    walletAddress: walletFungibleAssetJetton.walletAddress,
  })
)

const walletFungibleAssetDto = defineDto(
  z.union([
    walletFungibleAssetTonDto.schema,
    walletFungibleAssetJettonDto.schema,
  ]),
  (walletFungibleAsset: WalletFungibleAssetTon | WalletFungibleAssetJetton) => {
    return walletFungibleAsset.type === 'ton'
      ? walletFungibleAssetTonDto(walletFungibleAsset)
      : walletFungibleAssetJettonDto(walletFungibleAsset)
  }
)

export const walletFungibleAssetsDto = defineDto(
  z.object({
    statistics: walletFungibleAssetsStatisticsDto.schema,
    assets: walletFungibleAssetDto.schema.array(),
  }),
  (walletFungibleAssets: WalletFungibleAssets) => ({
    statistics: walletFungibleAssetsStatisticsDto(
      walletFungibleAssets.statistics
    ),
    assets: walletFungibleAssets.assets.map((asset) =>
      walletFungibleAssetDto(asset)
    ),
  })
)

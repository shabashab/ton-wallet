import { WalletFungibleAssets } from '@interfaces/wallets/fungible-assets.interface'
import { defineProvider } from '@mikrokit/di'
import { Address } from '@ton/core'
import { FungibleAssetsService } from './fungible-assets.service'
import { NetworkType } from '@interfaces/network-type.type'

export const WalletsService = defineProvider(async (injector) => {
  const fungibleAssetsService = await injector.inject(FungibleAssetsService)

  const getWalletFungibleAssetsByAddressString = async (
    walletAddress: string,
    network: NetworkType
  ): Promise<WalletFungibleAssets> => {
    const address = Address.parse(walletAddress)

    return await fungibleAssetsService.getWalletFungibleAssetsByAddress(
      address,
      network
    )
  }

  return {
    getWalletFungibleAssetsByAddressString,
  }
}, 'WalletsService')

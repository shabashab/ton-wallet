import {
  WalletFungibleAsset,
  WalletFungibleAssetJetton,
  WalletFungibleAssetMeta,
  WalletFungibleAssets,
} from '@interfaces/wallets/fungible-assets.interface'
import { defineProvider } from '@mikrokit/di'
import { Address, fromNano } from '@ton/core'
import { BlockchainIndexerService } from './blockchain-indexer.service'
import { NetworkType } from '@interfaces/network-type.type'
import { FungibleAssetsPricesService } from './fungible-assets-prices.service'
import { TonClientService } from './ton-client.service'
import { Decimal } from 'decimal.js'

const DEFAULT_DECIMALS = 9

const TON_META: WalletFungibleAssetMeta = {
  symbol: 'TON',
  displayName: 'TON',
  imageUrl:
    'https://asset.ston.fi/img/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/ee9fb21d17bc8d75c2a5f7b5f5f62d2bacec6b128f58b63cb841e98f7b74c4fc',
  decimals: 9,
}

export const FungibleAssetsService = defineProvider(async (injector) => {
  const blockchainIndexerService = await injector.inject(
    BlockchainIndexerService
  )
  const fungibleAssetsPricesService = await injector.inject(
    FungibleAssetsPricesService
  )
  const tonClientService = await injector.inject(TonClientService)

  const getWalletFungibleAssetsByAddress = async (
    walletAddress: Address,
    network: NetworkType
  ): Promise<WalletFungibleAssets> => {
    const [walletJettonsResponse, tonBalance] = await Promise.all([
      blockchainIndexerService.getUserJettonsByAddress(walletAddress, network),
      tonClientService.getWalletTonBalance(walletAddress, network),
    ])

    const prices =
      await fungibleAssetsPricesService.getFungibleAssetsPricesByIdentifiersAndNetworkType(
        [
          {
            type: 'ton',
          },
          ...walletJettonsResponse.jetton_wallets.map((jetton) => ({
            type: 'jetton' as const,
            contractAddress: Address.parse(jetton.jetton),
          })),
        ],
        network
      )

    const tonPrice = prices.find((price) => price.type === 'ton')
    const tonBalanceRaw = tonBalance.toString()
    const tonBalanceString = fromNano(tonBalanceRaw)
    const tonBalanceNumber = Number.parseFloat(tonBalanceString)

    const assets: WalletFungibleAsset[] = [
      {
        type: 'ton',
        balanceRaw: tonBalance.toString(),
        balance: tonBalanceNumber,
        priceUsd: tonPrice ? Number.parseFloat(tonPrice.price) : undefined,
        balanceUsd: tonPrice
          ? new Decimal(tonBalanceString).mul(tonPrice.price).toNumber()
          : undefined,
        meta: TON_META,
      },
      ...walletJettonsResponse.jetton_wallets.flatMap((wallet) => {
        const meta =
          walletJettonsResponse.metadata[wallet.jetton]?.token_info[0]
        const parsedAddress = Address.parse(wallet.jetton)
        const userFriendlyAddress = parsedAddress.toString()

        if (!meta) {
          return []
        }

        const balanceDecimal = new Decimal(wallet.balance).div(
          new Decimal(10).pow(meta.extra.decimals ?? DEFAULT_DECIMALS)
        )

        const price = prices.find(
          (price) =>
            price.type === 'jetton' &&
            price.contractAddress &&
            Address.parse(price.contractAddress).equals(parsedAddress)
        )

        return {
          type: 'jetton',
          contractAddress: userFriendlyAddress,
          balanceRaw: wallet.balance,
          balance: balanceDecimal.toNumber(),
          balanceUsd: price
            ? balanceDecimal.mul(price.price).toNumber()
            : undefined,
          priceUsd: price ? Number.parseFloat(price.price) : undefined,
          meta: {
            symbol: meta.symbol,
            displayName: meta.name,
            imageUrl: meta.image,
            decimals: meta.extra.decimals
              ? Number.parseInt(meta.extra.decimals)
              : DEFAULT_DECIMALS,
          },
        } satisfies WalletFungibleAssetJetton
      }),
    ]

    // eslint-disable-next-line unicorn/no-array-reduce
    const totalBalanceUsd = assets.reduce((accumulator, asset) => {
      if (asset.balanceUsd) {
        accumulator += asset.balanceUsd
      }

      return accumulator
    }, 0)

    return {
      statistics: {
        totalUsd: totalBalanceUsd,
      },
      assets,
    }
  }

  return {
    getWalletFungibleAssetsByAddress,
  }
}, 'FungibleAssetsService')

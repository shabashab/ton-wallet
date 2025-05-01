import { defineProvider } from '@mikrokit/di'
import { StonApiService } from './ston-api.service'
import { NetworkType } from '@interfaces/network-type.type'
import { AssetPriceSelect } from '@database/schema'
import { AssetsPricesRepository } from '@database/repositories/assets-prices.repository'
import { FungibleAssetIdentifier } from './types/fungible-assets-prices/fungible-asset-identifier.type'
import { Address } from '@ton/core'

export const FungibleAssetsPricesService = defineProvider(async (injector) => {
  const assetsPricesRepository = await injector.inject(AssetsPricesRepository)
  const stonApiService = await injector.inject(StonApiService)

  const getFungibleAssetsPricesByIdentifiersAndNetworkType = async (
    identifiers: FungibleAssetIdentifier[],
    networkType: NetworkType
  ): Promise<AssetPriceSelect[]> => {
    // Getting prices for testnet is not supported
    // as there is not ston.fi API for testnet
    // (there isn't actually a public ston.fi protocol deployment on testnet)
    if (networkType === 'testnet') {
      return []
    }

    const pricesPromises: Promise<
      AssetPriceSelect | AssetPriceSelect[] | undefined
    >[] = []

    if (identifiers.some((identifier) => identifier.type === 'ton')) {
      pricesPromises.push(getTonPriceByNetworkType(networkType))
    }

    if (identifiers.some((identifier) => identifier.type === 'jetton')) {
      const jettonsAddresses = identifiers
        .filter((identifier) => identifier.type === 'jetton')
        .map((identifier) => identifier.contractAddress)

      pricesPromises.push(
        getJettonsPricesByContractAddressesAndNetworkType(
          jettonsAddresses,
          networkType
        )
      )
    }

    const resolvedPrices = await Promise.all(pricesPromises)
    const resultPrices = resolvedPrices.flat().filter((value) => !!value)

    return resultPrices
  }

  const getJettonsPricesByContractAddressesAndNetworkType = async (
    addresses: Address[],
    networkType: NetworkType
  ): Promise<AssetPriceSelect[]> => {
    const addressesStrings = addresses.map((address) => address.toString())

    const savedJettonsAssetsPrices =
      await assetsPricesRepository.findValidAssetsPricesByContractAddressesAndNetworkType(
        addressesStrings,
        networkType
      )

    const nonSavedJettonsAddresses = addresses.filter(
      (address) =>
        !savedJettonsAssetsPrices.some((price) =>
          address.equals(Address.parse(price.contractAddress!))
        )
    )

    const nonSavedJettonsPriceData =
      await stonApiService.getTokenPricesByContractAddresses(
        nonSavedJettonsAddresses
      )

    const nonSavedJettonsPrices = nonSavedJettonsPriceData.flatMap((price) => {
      if (!price.dexPriceUsd) {
        return []
      }

      return [
        {
          address: price.contractAddress,
          price: price.dexPriceUsd,
        },
      ]
    })

    const jettonsPrices = await assetsPricesRepository.createJettonPrices(
      nonSavedJettonsPrices,
      networkType
    )

    return [...savedJettonsAssetsPrices, ...jettonsPrices]
  }

  const getTonPriceByNetworkType = async (
    networkType: NetworkType
  ): Promise<AssetPriceSelect | undefined> => {
    // Getting prices for testnet is not supported
    // as there is not ston.fi API for testnet
    // (there isn't actually a public ston.fi protocol deployment on testnet)
    if (networkType === 'testnet') {
      return undefined
    }

    const savedTonPrice =
      await assetsPricesRepository.findValidTonPriceByNetworkType(networkType)

    if (savedTonPrice) {
      return savedTonPrice
    }

    const tonData = await stonApiService.getTonPrice()

    if (!tonData.dexPriceUsd) {
      return undefined
    }

    const createdPrice = await assetsPricesRepository.createTonPrice(
      tonData.dexPriceUsd,
      networkType
    )

    return createdPrice
  }

  return {
    getFungibleAssetsPricesByIdentifiersAndNetworkType,
  }
}, 'FungibleAssetsPricesService')

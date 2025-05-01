import { defineProvider } from '@mikrokit/di'
import { StonApiClient } from '@ston-fi/api'
import { Address } from '@ton/core'

const TON_ADDRESS = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'

/**
 * This service provides wrappers for ston.fi api.
 */
export const StonApiService = defineProvider(async () => {
  const apiClient = new StonApiClient()

  const getTokenPricesByContractAddresses = async (addresses: Address[]) => {
    const tokenAddresses = addresses.map((address) => address.toString())

    return await apiClient.queryAssets({
      condition: '',
      unconditionalAssets: tokenAddresses,
    })
  }

  const getTonPrice = async () => {
    const tonPriceResponse = await apiClient.queryAssets({
      condition: '',
      unconditionalAssets: [TON_ADDRESS],
    })

    const tonPrice = tonPriceResponse[0]

    if (!tonPrice) {
      throw new Error('Failed to get TON price. Unexpected response.')
    }

    return tonPrice
  }

  return {
    getTokenPricesByContractAddresses,
    getTonPrice,
  }
}, 'StonApiService')

import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'
import { Address } from '@ton/core'
import axios, { AxiosInstance } from 'axios'
import { IndexerWalletJettonsResponse } from './types/blockchain-indexer/wallet-jettons-response.interface'
import { NetworkType } from '@interfaces/network-type.type'

/**
 * Wrapper around TonCenter Indexer API.
 * @see https://toncenter.com/api/v3/index.html
 */
export const BlockchainIndexerService = defineProvider(async (injector) => {
  const config = await injector.inject(Config)

  const mainetIndexerAxiosInstance = axios.create({
    baseURL: config.TONCENTER_INDEXER_API_URL,
    headers: {
      'X-API-Key': config.TONCENTER_API_TOKEN,
    },
  })

  const testnetIndexerAxiosInstance = axios.create({
    baseURL: config.TESTNET_TONCENTER_INDEXER_API_URL,
    headers: {
      'X-API-Key': config.TESTNET_TONCENTER_API_TOKEN,
    },
  })

  const getIndexerAxiosInstanceByNetworkType = (
    networkType: NetworkType
  ): AxiosInstance => {
    if (networkType === 'mainnet') {
      return mainetIndexerAxiosInstance
    }

    return testnetIndexerAxiosInstance
  }

  const getUserJettonsByAddress = async (
    address: Address,
    networkType: NetworkType
  ): Promise<IndexerWalletJettonsResponse> => {
    const indexerAxios = getIndexerAxiosInstanceByNetworkType(networkType)

    const response = await indexerAxios.get('/api/v3/jetton/wallets', {
      params: {
        owner_address: address.toString(),
      },
    })

    return response.data as unknown as IndexerWalletJettonsResponse
  }

  return {
    getUserJettonsByAddress,
  }
}, 'BlockchainIndexerService')

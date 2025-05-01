import { Config } from '@config'
import { NetworkType } from '@interfaces/network-type.type'
import { defineProvider } from '@mikrokit/di'
import { Address, TonClient } from '@ton/ton'

export const TonClientService = defineProvider(async (injector) => {
  const config = await injector.inject(Config)

  const testnetTonClient = new TonClient({
    endpoint: config.TESTNET_TON_RPC_URL,
    apiKey: config.TESTNET_TON_RPC_API_KEY,
  })

  const mainnetTonClient = new TonClient({
    endpoint: config.TON_RPC_URL,
    apiKey: config.TON_RPC_API_KEY,
  })

  const getTonClientByNetworkType = (networkType: NetworkType) => {
    if (networkType === 'mainnet') {
      return mainnetTonClient
    }

    return testnetTonClient
  }

  const getWalletTonBalance = async (
    address: Address,
    networkType: NetworkType
  ) => {
    const tonClient = getTonClientByNetworkType(networkType)

    const balance = await tonClient.getBalance(address)

    return balance
  }

  return {
    getWalletTonBalance,
  }
}, 'TonClientService')

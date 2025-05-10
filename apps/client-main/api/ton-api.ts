import { TonApiClient } from '@ton-api/client'

export const useTonApi = () => {
  const networkStore = useNetworkStore()

  const tonApiClient = computed(() => {
    const baseUrl =
      networkStore.currentNetwork === 'mainnet'
        ? 'https://tonapi.io'
        : 'https://testnet.tonapi.io'

    return new TonApiClient({
      baseUrl,
    })
  })

  return tonApiClient
}

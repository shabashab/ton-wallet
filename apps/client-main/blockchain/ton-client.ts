import { TonClient } from '@ton/ton'

export const useTonClient = () => {
  const networkStore = useNetworkStore()

  const tonClient = computed(() => {
    const baseUrl =
      networkStore.currentNetwork === 'mainnet'
        ? 'https://toncenter.com'
        : 'https://testnet.toncenter.com'

    return new TonClient({
      endpoint: `${baseUrl}/api/v2/jsonRPC`,
    })
  })

  return tonClient
}

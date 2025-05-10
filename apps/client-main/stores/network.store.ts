import type { NetworkType } from '~/models/network-type.model'

export const useNetworkStore = defineStore('network', () => {
  const activeWalletStore = useActiveWalletStore()
  const transactionsStore = useTransactionsStore()

  const currentNetwork = ref<NetworkType>('mainnet')

  const updateCurrentNetwork = async (networkType: NetworkType) => {
    currentNetwork.value = networkType
    await activeWalletStore.reloadWalletData()
    transactionsStore.resetTransactions()
  }

  return {
    currentNetwork: readonly(currentNetwork),

    updateCurrentNetwork,
  }
})

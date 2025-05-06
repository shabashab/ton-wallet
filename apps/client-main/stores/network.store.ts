import type { NetworkType } from '~/models/network-type.model'

export const useNetworkStore = defineStore('network', () => {
  const currentNetwork = ref<NetworkType>('mainnet')

  const updateCurrentNetwork = (networkType: NetworkType) => {
    currentNetwork.value = networkType
  }

  return {
    currentNetwork: readonly(currentNetwork),

    updateCurrentNetwork,
  }
})

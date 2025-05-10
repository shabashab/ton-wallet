import type { Address } from '@ton/core'
import { useServerIndexApi } from '~/api/server-index'
import type { LoadedWallet } from '~/models/loaded-wallet.model'
import type { ServerIndexWalletFungibleAssets } from '~/models/server-index-wallet-fungible-assets.model'
import { calculateWalletAddress } from '~/utils/wallet-address'

export const useActiveWalletStore = defineStore('active-wallet', () => {
  const serverIndexApi = useServerIndexApi()
  const networkStore = useNetworkStore()

  const activeWallet = ref<LoadedWallet>()
  const activeWalletAddress = ref<Address>()
  const activeWalletFungibleAssets = ref<ServerIndexWalletFungibleAssets>()

  const setActiveWallet = async (wallet: LoadedWallet) => {
    activeWallet.value = wallet
    activeWalletAddress.value = calculateWalletAddress(wallet.publicKey)
    activeWalletFungibleAssets.value = undefined

    await reloadWalletData()
  }

  const fetchActiveWalletFungibleAssets = async () => {
    if (!activeWalletAddress.value) {
      return
    }

    const result = await serverIndexApi.wallets.getWalletFungibleAssets.execute(
      {
        walletAddress: activeWalletAddress.value.toString(),
        networkType: networkStore.currentNetwork,
      }
    )

    if (!result.success) {
      return
    }

    activeWalletFungibleAssets.value = result.output
  }

  const reloadWalletData = async () => {
    await fetchActiveWalletFungibleAssets()
  }

  const activeWalletAddressString = computed(() => {
    return activeWalletAddress.value?.toString()
  })

  const activeWalletTonBalance = computed(() => {
    if (!activeWalletFungibleAssets.value) {
      return 0
    }

    return activeWalletFungibleAssets.value.assets.find(
      (asset) => asset.type === 'ton'
    )?.balance
  })

  return {
    activeWallet,
    activeWalletAddress,
    activeWalletAddressString,
    activeWalletFungibleAssets,
    activeWalletTonBalance,

    setActiveWallet,
    reloadWalletData,
  }
})

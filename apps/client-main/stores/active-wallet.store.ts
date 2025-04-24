import type { Address } from '@ton/core'
import type { LoadedWallet } from '~/models/loaded-wallet.model'
import { calculateWalletAddress } from '~/utils/wallet-address'

export const useActiveWalletStore = defineStore('active-wallet', () => {
  const activeWallet = ref<LoadedWallet>()
  const activeWalletAddress = ref<Address>()

  const setActiveWallet = async (wallet: LoadedWallet) => {
    activeWallet.value = wallet
    activeWalletAddress.value = calculateWalletAddress(wallet.publicKey)
  }

  return {
    activeWallet,
    activeWalletAddress,
    setActiveWallet,
  }
})

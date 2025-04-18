import { type LoadedWallet } from '~/models/loaded-wallet.model'

export const useWalletsStore = defineStore('wallets', () => {
  const walletsStorage = useWalletsStorage()

  const loadedWallets = ref<LoadedWallet[]>([])

  const loadCloudStorageWallets = async () => {
    loadedWallets.value = await walletsStorage.loadWallets()
  }

  return {
    loadedWallets,
    loadCloudStorageWallets,
  }
})

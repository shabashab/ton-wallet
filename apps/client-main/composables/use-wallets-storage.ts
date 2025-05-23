import { WalletLoadingError } from '~/errors/wallet-loading.error'
import type { LoadedWallet } from '~/models/loaded-wallet.model'

const WALLETS_CHUNKS_COUNT_CLOUD_STORAGE_KEY = 'wallet-chunks'
const WALLETS_CLOUD_STORAGE_KEY_PREFIX = 'wallets'

const CHUNK_WALLET_PARTS_SEPARATOR = ':'

export const useWalletsStorage = () => {
  const stringifyWallet = (wallet: LoadedWallet): string => {
    const walletParts: string[] = [
      `${wallet.index}`,
      wallet.publicKey.toString('base64'),
      wallet.encryptedSecretKey,
    ]

    return walletParts.join(CHUNK_WALLET_PARTS_SEPARATOR)
  }

  const parseWallet = (walletRaw: string): LoadedWallet => {
    const walletParts = walletRaw.split(CHUNK_WALLET_PARTS_SEPARATOR)

    if (walletParts.length !== 3) {
      throw new WalletLoadingError(`Unexpected wallet data ${walletRaw}`)
    }

    const [indexRaw, publicKeyRaw, encryptedSecretKey] = walletParts

    const index = Number.parseInt(indexRaw)
    const publicKey = Buffer.from(publicKeyRaw, 'base64')

    return {
      index,
      encryptedSecretKey,
      publicKey,
    }
  }

  const { save, load } = useChunkedCloudStorage({
    serialize: stringifyWallet,
    deserialize: parseWallet,
    countStorageKey: WALLETS_CHUNKS_COUNT_CLOUD_STORAGE_KEY,
    itemsStorageKeyPrefix: WALLETS_CLOUD_STORAGE_KEY_PREFIX,
  })

  return {
    saveWallets: save,
    loadWallets: load,
  }
}

import { WalletLoadingError } from '~/errors/wallet-loading.error'
import type { LoadedWallet } from '~/models/loaded-wallet.model'
import { cluster } from 'radash'

const WALLETS_CHUNKS_COUNT_CLOUD_STORAGE_KEY = 'wallet-chunks'
const WALLETS_CLOUD_STORAGE_KEY_PREFIX = 'wallets'
const WALLETS_CHUNK_SIZE = 10

const CHUNK_WALLETS_SEPARATOR = ';'
const CHUNK_WALLET_PARTS_SEPARATOR = ':'

export const useWalletsStorage = () => {
  const cloudStorage = useCloudStorage()

  const loadWallets = async (): Promise<LoadedWallet[]> => {
    const walletsChunksCount = await loadWalletsChunksCount()

    if (walletsChunksCount === 0) {
      return []
    }

    const walletChunkNames = Array.from(
      { length: walletsChunksCount },
      (_, index) => createWalletChunkNameByIndex(index)
    )

    const walletChunksData = await cloudStorage.getItems(walletChunkNames)

    const wallets: LoadedWallet[] = []

    for (const chunkName of walletChunkNames) {
      const chunk = walletChunksData[chunkName]

      if (!chunk) {
        console.warn(`Unexpected empty chunk at ${chunkName}`)
        continue
      }

      wallets.push(...parseWalletsChunk(chunk))
    }

    return wallets
  }

  const saveWallets = async (loadedWallets: LoadedWallet[]) => {
    const chunks = cluster(loadedWallets, WALLETS_CHUNK_SIZE)

    const stringifiedChunks = chunks.map((chunk) =>
      stringifyWalletsChunk(chunk)
    )

    const preExistingChunksCount = await loadWalletsChunksCount()

    if (
      preExistingChunksCount > 0 &&
      preExistingChunksCount > stringifiedChunks.length
    ) {
      const walletChunkNames = Array.from(
        { length: preExistingChunksCount - stringifiedChunks.length },
        (_, index) =>
          createWalletChunkNameByIndex(stringifiedChunks.length + index)
      )

      await cloudStorage.removeItems(walletChunkNames)
    }

    await cloudStorage.setItem(
      WALLETS_CHUNKS_COUNT_CLOUD_STORAGE_KEY,
      `${stringifiedChunks.length}`
    )

    for (const [index, stringifiedChunk] of stringifiedChunks.entries()) {
      const key = createWalletChunkNameByIndex(index)
      await cloudStorage.setItem(key, stringifiedChunk)
    }
  }

  const stringifyWalletsChunk = (wallets: LoadedWallet[]) => {
    const stringifiedWallets = wallets.map((wallet) => stringifyWallet(wallet))
    return stringifiedWallets.join(CHUNK_WALLETS_SEPARATOR)
  }

  const stringifyWallet = (wallet: LoadedWallet): string => {
    const walletParts: string[] = [
      `${wallet.index}`,
      wallet.publicKey.toString('base64'),
      wallet.encryptedSecretKey,
    ]

    return walletParts.join(CHUNK_WALLET_PARTS_SEPARATOR)
  }

  const parseWalletsChunk = (chunk: string): LoadedWallet[] => {
    const resultWallets: LoadedWallet[] = []

    const walletsRaw = chunk.split(CHUNK_WALLETS_SEPARATOR)

    for (const walletRaw of walletsRaw) {
      const wallet = parseWallet(walletRaw)
      resultWallets.push(wallet)
    }

    return resultWallets
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

  const loadWalletsChunksCount = async (): Promise<number> => {
    const walletChunksCountRaw = await cloudStorage.getItem(
      WALLETS_CHUNKS_COUNT_CLOUD_STORAGE_KEY
    )

    if (!walletChunksCountRaw) {
      return 0
    }

    const walletChunksCount = Number.parseInt(walletChunksCountRaw)

    if (Number.isNaN(walletChunksCount)) {
      return 0
    }

    return walletChunksCount
  }

  const createWalletChunkNameByIndex = (index: number) => {
    return `${WALLETS_CLOUD_STORAGE_KEY_PREFIX}--${index}`
  }

  return {
    loadWallets,
    saveWallets,
  }
}

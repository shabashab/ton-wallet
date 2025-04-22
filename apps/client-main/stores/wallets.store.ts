import { type LoadedWallet } from '~/models/loaded-wallet.model'
import {
  deriveEd25519Path,
  keyPairFromSeed,
  mnemonicToHDSeed,
} from '@ton/crypto'

import AES from 'crypto-js/aes'
import SHA256 from 'crypto-js/sha256'

const LAST_WALLET_INDEX_CLOUD_STORAGE_KEY = 'last-wallet-index'

export const useWalletsStore = defineStore('wallets', () => {
  const cloudStorage = useCloudStorage()
  const walletsStorage = useWalletsStorage()

  const mnemonicsStore = useMnemonicsStore()

  const loadedWallets = ref<LoadedWallet[]>([])

  const loadCloudStorageWallets = async () => {
    loadedWallets.value = await walletsStorage.loadWallets()
  }

  const createNextWalletFromMnemonics = async (password: string) => {
    if (loadedWallets.value.length === 0) {
      await loadCloudStorageWallets()
    }

    const currentWalletIndex = await getNextWalletIndex()
    await incrementWalletIndexCounter()

    const wallet = await createWalletByIndex(currentWalletIndex, password)

    loadedWallets.value.push(wallet)

    await walletsStorage.saveWallets(loadedWallets.value)
  }

  const createWalletByIndex = async (
    index: number,
    password: string
  ): Promise<LoadedWallet> => {
    const mnemonics = await mnemonicsStore.getMnemonicsWithPassword(password)

    if (!mnemonics) {
      throw new Error('No mnemonics was configured')
    }

    const mnemonicsWords = mnemonics.split(' ')

    const hdSeed = await mnemonicToHDSeed(mnemonicsWords)
    const derivedWalletSeed = await deriveEd25519Path(hdSeed, [
      122,
      12,
      24,
      index,
    ])

    const keypair = keyPairFromSeed(derivedWalletSeed)

    return {
      index,
      publicKey: keypair.publicKey,
      encryptedSecretKey: encryptSecretKey(keypair.secretKey, password),
    }
  }

  const encryptSecretKey = (secretKey: Buffer, password: string): string => {
    const secretKeyBase64 = secretKey.toString('base64')

    const passwordDigest = SHA256(password)
    const encryptedSecretKey = AES.encrypt(secretKeyBase64, passwordDigest, {
      iv: SHA256(passwordDigest),
    }).toString()

    return encryptedSecretKey
  }

  const getCloudStorageLastWalletIndex = async (): Promise<
    number | undefined
  > => {
    const lastWalletIndexRaw = await cloudStorage.getItem(
      LAST_WALLET_INDEX_CLOUD_STORAGE_KEY
    )

    if (!lastWalletIndexRaw) {
      return undefined
    }

    const lastWalletIndex = Number.parseInt(lastWalletIndexRaw)

    if (Number.isNaN(lastWalletIndex)) {
      return undefined
    }

    return lastWalletIndex
  }

  const setCloudStorageLastWalletIndex = async (index: number) => {
    await cloudStorage.setItem(LAST_WALLET_INDEX_CLOUD_STORAGE_KEY, `${index}`)
  }

  const getNextWalletIndex = async () => {
    const lastIndex = await getCloudStorageLastWalletIndex()

    return (lastIndex ?? 0) + 1
  }

  const incrementWalletIndexCounter = async () => {
    const lastIndex = await getCloudStorageLastWalletIndex()
    await setCloudStorageLastWalletIndex((lastIndex ?? 0) + 1)
  }

  return {
    loadedWallets,
    loadCloudStorageWallets,
    generateNextWalletWithMnemonics: createNextWalletFromMnemonics,
  }
})

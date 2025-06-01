import { type LoadedWallet } from '~/models/loaded-wallet.model'
import {
  deriveEd25519Path,
  keyPairFromSeed,
  mnemonicToHDSeed,
} from '@ton/crypto'
import { cbc as aes256cbc } from '@noble/ciphers/aes'
import { sha256 } from '@noble/hashes/sha2'
import { pbkdf2Async } from '@noble/hashes/pbkdf2'
import { randomBytes } from 'tweetnacl'

const LAST_WALLET_INDEX_CLOUD_STORAGE_KEY = 'last-wallet-index'
const WALLETS_PBKDF2_SALT_CLOUD_STORAGE_KEY = 'wallets-salt'
const WALLETS_AES256_IV_CLOUD_STORAGE_KEY = 'wallets-iv'
const WALLETS_PBKDF2_ITERATIONS_COUNT = 1000

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

    return wallet
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
      encryptedSecretKey: await encryptSecretKey(keypair.secretKey, password),
    }
  }

  const encryptSecretKey = async (secretKey: Buffer, password: string) => {
    const cipher = await createAesCipher(password)

    const encryptedPasswordBuffer = Buffer.from(cipher.encrypt(secretKey))
    return encryptedPasswordBuffer.toString('base64')
  }

  const decryptSecretKey = async (secretKey: string, password: string) => {
    const cipher = await createAesCipher(password)
    const encryptedBuffer = Buffer.from(secretKey, 'base64')

    const decryptedBuffer = Buffer.from(cipher.decrypt(encryptedBuffer))

    return decryptedBuffer
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

  const getOrCreatePbkdf2Salt = async () => {
    const value = await cloudStorage.getItem(
      WALLETS_PBKDF2_SALT_CLOUD_STORAGE_KEY
    )

    if (value) {
      return Buffer.from(value, 'base64')
    }

    const randomSalt = Buffer.from(randomBytes(32))

    await cloudStorage.setItem(
      WALLETS_PBKDF2_SALT_CLOUD_STORAGE_KEY,
      randomSalt.toString('base64')
    )

    return randomSalt
  }

  const getOrCreateAes256Iv = async () => {
    const value = await cloudStorage.getItem(
      WALLETS_AES256_IV_CLOUD_STORAGE_KEY
    )

    if (value) {
      return Buffer.from(value, 'base64')
    }

    const randomIv = Buffer.from(randomBytes(16))

    await cloudStorage.setItem(
      WALLETS_AES256_IV_CLOUD_STORAGE_KEY,
      randomIv.toString('base64')
    )

    return randomIv
  }

  const createAesCipher = async (password: string) => {
    const salt = await getOrCreatePbkdf2Salt()
    const derivedKey = await pbkdf2Async(sha256, password, salt, {
      c: WALLETS_PBKDF2_ITERATIONS_COUNT,
      dkLen: 32,
    })

    const iv = await getOrCreateAes256Iv()

    return aes256cbc(derivedKey, iv)
  }

  return {
    loadedWallets,
    loadCloudStorageWallets,
    generateNextWalletWithMnemonics: createNextWalletFromMnemonics,
    decryptSecretKey,
  }
})

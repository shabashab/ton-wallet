import { cbc as aes256cbc } from '@noble/ciphers/aes'
import { pbkdf2Async } from '@noble/hashes/pbkdf2'
import { sha256 } from '@noble/hashes/sha2'
import { randomBytes } from 'tweetnacl'

const MNEMONICS_CLOUD_STORAGE_KEY = 'mnemonics'
const MNEMONICS_PBKDF2_SALT_CLOUD_STORAGE_KEY = 'mnemonics-salt'
const MNEMONICS_AES256_IV_CLOUD_STORAGE_KEY = 'mnemonics-iv'
const MNEMONICS_PBKDF2_ITERATIONS_COUNT = 1000

export const useMnemonicsStore = defineStore('mnemonics', () => {
  const cloudStorage = useCloudStorage()

  const saveMnemonicsWithPassword = async (
    mnemonics: string,
    password: string
  ) => {
    const savedMnemonics = await getCloudStorageMnemonics()

    if (savedMnemonics) {
      throw new Error(
        'Mnemonics is already saved. Re-writing mnemonics is probably an error'
      )
    }

    const encryptedMnemonics = await encryptMnemonicsWithPassword(
      mnemonics,
      password
    )

    await setCloudStorageEncryptedMnemonics(encryptedMnemonics)
  }

  const getMnemonicsWithPassword = async (password: string) => {
    const mnemonics = await getCloudStorageMnemonics()

    if (!mnemonics) {
      return
    }

    return decryptMnemonicsWithPassword(mnemonics, password)
  }

  const getCloudStorageMnemonics = async () => {
    return await cloudStorage.getItem(MNEMONICS_CLOUD_STORAGE_KEY)
  }

  const getOrCreatePbkdf2Salt = async () => {
    const value = await cloudStorage.getItem(
      MNEMONICS_PBKDF2_SALT_CLOUD_STORAGE_KEY
    )

    if (value) {
      return Buffer.from(value, 'base64')
    }

    const randomSalt = Buffer.from(randomBytes(32))

    await cloudStorage.setItem(
      MNEMONICS_PBKDF2_SALT_CLOUD_STORAGE_KEY,
      randomSalt.toString('base64')
    )

    return randomSalt
  }

  const getOrCreateAes256Iv = async () => {
    const value = await cloudStorage.getItem(
      MNEMONICS_AES256_IV_CLOUD_STORAGE_KEY
    )

    if (value) {
      return Buffer.from(value, 'base64')
    }

    const randomIv = Buffer.from(randomBytes(16))

    await cloudStorage.setItem(
      MNEMONICS_AES256_IV_CLOUD_STORAGE_KEY,
      randomIv.toString('base64')
    )

    return randomIv
  }

  const createAesCipher = async (password: string) => {
    const salt = await getOrCreatePbkdf2Salt()
    const derivedKey = await pbkdf2Async(sha256, password, salt, {
      c: MNEMONICS_PBKDF2_ITERATIONS_COUNT,
      dkLen: 32,
    })

    const iv = await getOrCreateAes256Iv()

    return aes256cbc(derivedKey, iv)
  }

  const setCloudStorageEncryptedMnemonics = async (mnemonics: string) => {
    await cloudStorage.setItem(MNEMONICS_CLOUD_STORAGE_KEY, mnemonics)
  }

  const encryptMnemonicsWithPassword = async (
    mnemonics: string,
    password: string
  ) => {
    const aesCipher = await createAesCipher(password)

    const mnemonicsBuffer = Buffer.from(mnemonics, 'ascii')
    const encryptedMnemonics = aesCipher.encrypt(mnemonicsBuffer)

    return Buffer.from(encryptedMnemonics).toString('base64')
  }

  const decryptMnemonicsWithPassword = async (
    encryptedMnemonics: string,
    password: string
  ) => {
    const aesCipher = await createAesCipher(password)
    const mnemonicsBuffer = Buffer.from(encryptedMnemonics, 'base64')

    const decryptedMnemonicsBuffer = Buffer.from(
      aesCipher.decrypt(mnemonicsBuffer)
    )

    return decryptedMnemonicsBuffer.toString('ascii')
  }

  return {
    saveMnemonicsWithPassword,
    getMnemonicsWithPassword,
  }
})

import AES from 'crypto-js/aes'
import SHA256 from 'crypto-js/sha256'

const MNEMONICS_CLOUD_STORAGE_KEY = 'mnemonics'

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

    const encryptedMnemonics = encryptMnemonicsWithPassword(mnemonics, password)

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

  const setCloudStorageEncryptedMnemonics = async (mnemonics: string) => {
    await cloudStorage.setItem(MNEMONICS_CLOUD_STORAGE_KEY, mnemonics)
  }

  const encryptMnemonicsWithPassword = (
    mnemonics: string,
    password: string
  ) => {
    const passwordDigest = SHA256(password)
    const encryptedMnemonics = AES.encrypt(mnemonics, passwordDigest, {
      iv: SHA256(passwordDigest),
    })
    return encryptedMnemonics.toString()
  }

  const decryptMnemonicsWithPassword = (
    encryptedMnemonics: string,
    password: string
  ) => {
    const passwordDigest = SHA256(password)
    const decryptedMnemonics = AES.decrypt(encryptedMnemonics, passwordDigest, {
      iv: SHA256(passwordDigest),
    }).toString()
    return decryptedMnemonics
  }

  return {
    saveMnemonicsWithPassword,
    getMnemonicsWithPassword,
  }
})

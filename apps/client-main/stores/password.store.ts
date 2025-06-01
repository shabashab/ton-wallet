import { pbkdf2Async } from '@noble/hashes/pbkdf2'
import { sha512 } from '@noble/hashes/sha2'
import { randomBytes } from 'tweetnacl'

const PASSWORD_HASH_CLOUD_STORAGE_KEY = 'password-hash'
const PASSWORD_HASH_SALT_CLOUD_STORAGE_KEY = 'password-hash-salt'
const PASSWORD_HASH_PBKDF2_ITERATIONS_COUNT = 1000

export const usePasswordStore = defineStore('password', () => {
  const cloudStorage = useCloudStorage()

  const getOrCreatePbkdf2Salt = async () => {
    const value = await cloudStorage.getItem(
      PASSWORD_HASH_SALT_CLOUD_STORAGE_KEY
    )

    if (value) {
      return Buffer.from(value, 'base64')
    }

    const randomSalt = Buffer.from(randomBytes(32))

    await cloudStorage.setItem(
      PASSWORD_HASH_SALT_CLOUD_STORAGE_KEY,
      randomSalt.toString('base64')
    )

    return randomSalt
  }

  const savePasswordHash = async (password: string) => {
    const savedPasswordHash = await getCloudStoragePasswordHash()

    if (savedPasswordHash) {
      throw new Error(
        'Password hash is already saved. Re-writing password hash is probably an error'
      )
    }

    const hash = await createPasswordHash(password)
    await cloudStorage.setItem(PASSWORD_HASH_CLOUD_STORAGE_KEY, hash)
  }

  const verifyPassword = async (password: string) => {
    const savedPasswordHash = await getCloudStoragePasswordHash()

    if (!savedPasswordHash) {
      throw new Error("Password hasn't been set up")
    }

    const passwordHash = await createPasswordHash(password)

    return passwordHash === savedPasswordHash
  }

  const getCloudStoragePasswordHash = async () => {
    return await cloudStorage.getItem(PASSWORD_HASH_CLOUD_STORAGE_KEY)
  }

  const createPasswordHash = async (password: string) => {
    const salt = await getOrCreatePbkdf2Salt()

    const hash = await pbkdf2Async(sha512, password, salt, {
      c: PASSWORD_HASH_PBKDF2_ITERATIONS_COUNT,
      dkLen: 1024,
    })

    const hashString = Buffer.from(hash).toString('base64')

    return hashString
  }

  return {
    verifyPassword,
    savePasswordHash,
  }
})

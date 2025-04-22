const PASSWORD_HASH_CLOUD_STORAGE_KEY = 'password-hash'

export const usePasswordStore = defineStore('password', () => {
  const cloudStorage = useCloudStorage()

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
    const textEncoder = new TextEncoder()
    const encodedText = textEncoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText)
    return arrayBufferToBase64(hashBuffer)
  }

  return {
    verifyPassword,
    savePasswordHash,
  }
})

export const useDataDeletionStore = defineStore('data-deletion', () => {
  const cloudStorage = useCloudStorage()

  const deleteAllUserData = async () => {
    const keys = await cloudStorage.getKeys()
    await cloudStorage.removeItems(keys)
  }

  return {
    deleteAllUserData,
  }
})

import { CloudStorageError } from '~/errors/cloud-storage.error'

export const useCloudStorage = () => {
  const twa = useTwa()

  const getItem = (key: string): Promise<string | undefined> => {
    return new Promise<string | undefined>((resolve, reject) => {
      twa.CloudStorage.getItem(key, (error, result) => {
        if (error) {
          reject(new CloudStorageError(error))
          return
        }

        if (typeof result === 'string' && result.length === 0) {
          // eslint-disable-next-line unicorn/no-useless-undefined
          resolve(undefined)
          return
        }
        resolve(result)
      })
    })
  }

  const getItems = (
    keys: string[]
  ): Promise<Record<string, string | undefined>> => {
    return new Promise<Record<string, string | undefined>>(
      (resolve, reject) => {
        twa.CloudStorage.getItems(keys, (error, result) => {
          if (error) {
            reject(new CloudStorageError(error))
            return
          }

          if (!result) {
            resolve(
              Object.fromEntries(
                keys.map((key) => [key, undefined as string | undefined])
              )
            )
            return
          }

          const resultObject: Record<string, string | undefined> = {}

          for (const resultKey in result) {
            resultObject[resultKey] =
              typeof result[resultKey] === 'string' &&
              result[resultKey].length > 0
                ? result[resultKey]
                : undefined
          }

          resolve(resultObject)
        })
      }
    )
  }

  const removeItems = (keys: string[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      twa.CloudStorage.removeItems(keys, (error) => {
        if (error) {
          reject(new CloudStorageError(error))
          return
        }

        resolve()
      })
    })
  }

  const setItem = (key: string, value: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      twa.CloudStorage.setItem(key, value, (error) => {
        if (error) {
          reject(new CloudStorageError(error))
          return
        }

        resolve()
      })
    })
  }

  return {
    getItem,
    getItems,
    setItem,
    removeItems,
  }
}

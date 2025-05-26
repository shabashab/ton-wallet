const CHUNK_ITEMS_SEPARATOR = ';'
const CLOUD_STORAGE_ITEM_SIZE_LIMIT = 4096

export const useChunkedCloudStorage = <T>(options: {
  serialize: (value: T) => string
  deserialize: (value: string) => T
  countStorageKey: string
  itemsStorageKeyPrefix: string
}) => {
  const cloudStorage = useCloudStorage()

  const load = async (): Promise<T[]> => {
    const chunksCount = await loadChunksCount()

    if (chunksCount === 0) {
      return []
    }

    const chunkNames = Array.from({ length: chunksCount }, (_, index) =>
      createChunkNameByIndex(index)
    )

    const walletChunksData = await cloudStorage.getItems(chunkNames)

    const items: T[] = []

    for (const chunkName of chunkNames) {
      const chunk = walletChunksData[chunkName]

      if (!chunk) {
        console.warn(`Unexpected empty chunk at ${chunkName}`)
        continue
      }

      items.push(...parseItemsChunk(chunk))
    }

    return items
  }

  const save = async (items: T[]) => {
    const serializedItems = items.map((item) => options.serialize(item))

    let currentChunkIndex = 0
    const chunks: string[] = []

    for (const serializedItem of serializedItems) {
      if (serializedItem.length > CLOUD_STORAGE_ITEM_SIZE_LIMIT) {
        throw new Error(
          'Cannor save item which serializes to string that exceeds length of 4096'
        )
      }

      const currentChunk = chunks[currentChunkIndex]
      const temporaryUpdatedCurrentChunk = currentChunk
        ? currentChunk + CHUNK_ITEMS_SEPARATOR + serializedItem
        : serializedItem

      if (
        temporaryUpdatedCurrentChunk.length <= CLOUD_STORAGE_ITEM_SIZE_LIMIT
      ) {
        chunks[currentChunkIndex] = temporaryUpdatedCurrentChunk
        continue
      }

      chunks.push(serializedItem)
      currentChunkIndex++
    }

    console.log('chunks', chunks)
    for (const chunk of chunks) {
      console.log('chunk', chunk)
      console.log('chunk length', chunk.length)
    }

    const preExistingChunksCount = await loadChunksCount()

    if (preExistingChunksCount > 0 && preExistingChunksCount > chunks.length) {
      const walletChunkNames = Array.from(
        { length: preExistingChunksCount - chunks.length },
        (_, index) => createChunkNameByIndex(chunks.length + index)
      )

      await cloudStorage.removeItems(walletChunkNames)
    }

    await cloudStorage.setItem(options.countStorageKey, `${chunks.length}`)

    for (const [index, stringifiedChunk] of chunks.entries()) {
      const key = createChunkNameByIndex(index)
      await cloudStorage.setItem(key, stringifiedChunk)
    }
  }

  const parseItemsChunk = (chunk: string): T[] => {
    const resultItems: T[] = []

    const itemsRaw = chunk.split(CHUNK_ITEMS_SEPARATOR)

    for (const itemRaw of itemsRaw) {
      const item = options.deserialize(itemRaw)
      resultItems.push(item)
    }

    return resultItems
  }

  const loadChunksCount = async (): Promise<number> => {
    const chunksCountRaw = await cloudStorage.getItem(options.countStorageKey)

    if (!chunksCountRaw) {
      return 0
    }

    const chunksCount = Number.parseInt(chunksCountRaw)

    if (Number.isNaN(chunksCount)) {
      return 0
    }

    return chunksCount
  }

  const createChunkNameByIndex = (index: number) => {
    return `${options.itemsStorageKeyPrefix}--${index}`
  }

  return {
    load,
    save,
  }
}

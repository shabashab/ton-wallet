import type { TonConnectSession } from '~/models/ton-connect-session.model'

const SESSION_PARTS_SEPARATOR = ':'
const SESSIONS_CHUNKS_COUNT_CLOUD_STORAGE_KEY = 'tc-sessions-count'
const SESSIONS_CLOUD_STORAGE_KEY_PREFIX = 'tc-sessions'

export const useTcSessionsStorage = () => {
  const stringifySession = (session: TonConnectSession): string => {
    const sessionParts: string[] = [
      encodeURIComponent(session.appName),
      encodeURIComponent(session.appUrl),
      session.appClientId,
      session.ownClientId,
      session.privateKey,
    ]

    return sessionParts.join(SESSION_PARTS_SEPARATOR)
  }

  const parseSession = (sessionRaw: string): TonConnectSession => {
    const sessionParts = sessionRaw.split(SESSION_PARTS_SEPARATOR)

    if (sessionParts.length !== 5) {
      throw new Error(`Unexpected ton connect session data data ${sessionRaw}`)
    }

    const [appName, appUrl, appClientId, ownClientId, privateKey] = sessionParts

    return {
      appName: decodeURIComponent(appName),
      appUrl: decodeURIComponent(appUrl),
      appClientId,
      ownClientId,
      privateKey,
    }
  }

  const { save, load } = useChunkedCloudStorage({
    serialize: stringifySession,
    deserialize: parseSession,
    countStorageKey: SESSIONS_CHUNKS_COUNT_CLOUD_STORAGE_KEY,
    itemsStorageKeyPrefix: SESSIONS_CLOUD_STORAGE_KEY_PREFIX,
  })

  return {
    saveSessions: save,
    loadSessions: load,
  }
}

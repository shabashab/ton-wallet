import {
  Address,
  Cell,
  internal,
  loadStateInit,
  WalletContractV5R1,
  type MessageRelaxed,
} from '@ton/ton'
import {
  CHAIN,
  SessionCrypto,
  type ConnectEventSuccess,
  type ConnectItemReply,
  type ConnectRequest,
  type TonAddressItemReply,
  type TonProofItem,
  type TonProofItemReply,
  type AppRequest,
  type RpcRequests,
  SEND_TRANSACTION_ERROR_CODES,
  type SendTransactionRpcResponse,
} from '@tonconnect/protocol'
import { diff } from 'radash'
import type { TonConnectManifest } from '~/models/ton-connect-manifest.model'
import type { TonConnectSession } from '~/models/ton-connect-session.model'
import { Int64LE } from 'int64-buffer'
import nacl from 'tweetnacl'
import type { TonConnectSendTransactionData } from '~/models/ton-connect-send-transaction-data.model'

type AnyRequest = AppRequest<keyof RpcRequests>

const LAST_EVENT_ID_CLOUD_STORAGE_KEY = 'tc-last-event-id'

export const useTonConnectStore = defineStore('ton-connect', () => {
  const activeWalletStore = useActiveWalletStore()
  const networkStore = useNetworkStore()
  const sessionsStorage = useTcSessionsStorage()
  const runtimeConfig = useRuntimeConfig()
  const cloudStorage = useCloudStorage()
  const sendTransaction = useTransactionSend()

  let activeBridgeEventSource: EventSource | undefined

  const currentlyConnectingApp = ref<{
    request: ConnectRequest
    manifest: TonConnectManifest
    id: string
  }>()
  const tonConnectSessions = ref<TonConnectSession[]>([])
  const lastEventId = ref<string>()

  const handleQrCodeUrl = async (urlString: string) => {
    const url = new URL(urlString)

    if (url.protocol !== 'tc:') {
      throw new Error('invalid qr code protocol')
    }

    const id = url.searchParams.get('id')
    const r = url.searchParams.get('r')

    if (!id || !r) {
      throw new Error('parameter id or parameter or does not exist')
    }

    const connectRequest = JSON.parse(r) as ConnectRequest

    const manifestUrl = connectRequest.manifestUrl

    const manifestResponse = await fetch(manifestUrl)

    if (manifestResponse.status !== 200) {
      throw new Error('Could not read manifest')
    }

    const manifestParseResult = await tryCatch(
      manifestResponse.json() as Promise<TonConnectManifest>
    )

    if (!manifestParseResult.ok) {
      throw new Error('invalid manifest format. could not parse')
    }

    const manifest = manifestParseResult.data

    currentlyConnectingApp.value = {
      manifest,
      request: connectRequest,
      id,
    }
  }

  const reopenSseBridgeConnection = () => {
    if (
      activeBridgeEventSource &&
      activeBridgeEventSource.readyState !== activeBridgeEventSource.CLOSED
    ) {
      activeBridgeEventSource.close()
    }

    const eventSourceURL = new URL(`${runtimeConfig.public.bridgeUrl}/events`)

    const clientIds = tonConnectSessions.value
      .map((session) => session.ownClientId)
      .join(',')

    if (clientIds.length === 0) {
      // SSE connection cannot be created with no client_ids and it is not needed actually
      return
    }

    eventSourceURL.searchParams.set('client_id', clientIds)

    if (lastEventId.value) {
      eventSourceURL.searchParams.set('last_event_id', lastEventId.value)
    }

    activeBridgeEventSource = new EventSource(eventSourceURL)

    activeBridgeEventSource.addEventListener('message', (event) => {
      handleEventSourceMessage(event).catch((error: unknown) => {
        console.error(
          'Error happened when handling event source message',
          event,
          error
        )
      })
    })
  }

  const handleEventSourceMessage = async (event: MessageEvent) => {
    if (event.type !== 'message') {
      return
    }

    lastEventId.value = event.lastEventId
    await synchronizeLastEventId()

    const data = JSON.parse(event.data as string) as {
      from: string
      message: string
    }

    const { session, sessionCrypto } = getSessionByAppId(data.from)

    const decryptedMessage = sessionCrypto.decrypt(
      Buffer.from(data.message, 'base64'),
      Buffer.from(session.appClientId, 'hex')
    )

    const parsedDecryptedMessage = JSON.parse(decryptedMessage) as AnyRequest

    await handleRequest(data.from, parsedDecryptedMessage)
  }

  const handleRequest = async (from: string, request: AnyRequest) => {
    console.log('request', from, request)

    if (request.method === 'disconnect') {
      await handleDisconnectRequest(from)
    }

    if (request.method === 'sendTransaction') {
      await handleSendTransactionRequest(from, request)
    }
  }

  const handleSendTransactionRequest = async (
    from: string,
    request: AppRequest<'sendTransaction'>
  ) => {
    const sendTransactionDataString = request.params[0]
    const sendTransactionData = JSON.parse(
      sendTransactionDataString
    ) as TonConnectSendTransactionData

    if (Date.now() > sendTransactionData.valid_until) {
      throw new Error('Cannot handle sendTransaction. Date.now() > valid_until')
    }

    if (!activeWalletStore.activeWalletAddress) {
      throw new Error(
        'Cannot handle sendTransaction. No active wallet address available'
      )
    }

    if (!sendTransactionData.from) {
      throw new Error('Cannot handle sendTransaction. from is not specified')
    }

    if (
      !Address.parse(sendTransactionData.from).equals(
        activeWalletStore.activeWalletAddress
      )
    ) {
      throw new Error(
        'Cannot handle sendTransaction. From address is not the same as current address'
      )
    }

    if (
      sendTransactionData.network !==
      (networkStore.currentNetwork === 'mainnet'
        ? CHAIN.MAINNET
        : CHAIN.TESTNET)
    ) {
      throw new Error(
        'Cannot handle sendTransaction. Network is not the same as current selected network'
      )
    }

    const messages: MessageRelaxed[] = sendTransactionData.messages.map(
      (transaction) =>
        internal({
          to: Address.parse(transaction.address),
          value: BigInt(transaction.amount),
          body: transaction.payload
            ? Cell.fromBase64(transaction.payload)
            : undefined,
          init: transaction.stateInit
            ? loadStateInit(Cell.fromBase64(transaction.stateInit).asSlice())
            : undefined,
        })
    )

    const { session, sessionCrypto } = getSessionByAppId(from)

    const transactionBoc = await sendTransaction({
      message: messages,
    })

    const message: SendTransactionRpcResponse = transactionBoc
      ? {
          id: request.id,
          result: transactionBoc,
        }
      : {
          id: request.id,
          error: {
            code: SEND_TRANSACTION_ERROR_CODES.USER_REJECTS_ERROR,
            message: 'User has rejected transaction confirmation',
          },
        }

    const encryptedMessage = sessionCrypto.encrypt(
      JSON.stringify(message),
      Buffer.from(session.appClientId, 'hex')
    )

    await sendBridgeMessage(session, encryptedMessage)
  }

  const handleDisconnectRequest = async (from: string) => {
    const sessionIndex = tonConnectSessions.value.findIndex(
      (item) => item.appClientId === from
    )

    if (sessionIndex === -1) {
      throw new Error('Cannot disconnect session. Session not found')
    }

    tonConnectSessions.value = [
      ...tonConnectSessions.value.slice(0, sessionIndex),
      ...tonConnectSessions.value.slice(sessionIndex + 1),
    ]
    await synchronizeTonConnect()
  }

  const loadSessions = async () => {
    const loadedSessions = await sessionsStorage.loadSessions()
    const mergedSessions: TonConnectSession[] = []

    for (const loadedSession of loadedSessions) {
      const existingSession = tonConnectSessions.value.find(
        (session) => session.ownClientId === loadedSession.ownClientId
      )

      if (existingSession) {
        mergedSessions.push(existingSession)
      } else {
        mergedSessions.push(loadedSession)
      }
    }

    tonConnectSessions.value = mergedSessions
  }

  const saveSessions = async () => {
    await sessionsStorage.saveSessions(tonConnectSessions.value)
  }

  const synchronizeLastEventId = async () => {
    const remoteLastEventId = await cloudStorage.getItem(
      LAST_EVENT_ID_CLOUD_STORAGE_KEY
    )

    if (!remoteLastEventId) {
      if (lastEventId.value) {
        await cloudStorage.setItem(
          LAST_EVENT_ID_CLOUD_STORAGE_KEY,
          lastEventId.value
        )
      }

      return
    }

    lastEventId.value ??= remoteLastEventId

    if (BigInt(remoteLastEventId) > BigInt(lastEventId.value)) {
      lastEventId.value = remoteLastEventId
    } else {
      await cloudStorage.setItem(
        LAST_EVENT_ID_CLOUD_STORAGE_KEY,
        lastEventId.value
      )
    }
  }

  /**
   * Synchronization includes: sesions, last event id, reopening event source if needed
   */
  const synchronizeTonConnect = async () => {
    await synchronizeLastEventId()

    const previouslyLoadedSessionClientIds = tonConnectSessions.value.map(
      (session) => session.ownClientId
    )

    await loadSessions()

    const currentlyLoadedSessionClientIds = tonConnectSessions.value.map(
      (session) => session.ownClientId
    )

    // It would mean that our update actually changed client ids
    if (
      previouslyLoadedSessionClientIds.length !==
        currentlyLoadedSessionClientIds.length ||
      diff(previouslyLoadedSessionClientIds, currentlyLoadedSessionClientIds)
        .length > 0
    ) {
      reopenSseBridgeConnection()
    }

    await saveSessions()
  }

  const acceptConnection = async (password: string) => {
    if (!currentlyConnectingApp.value) {
      return
    }

    const session = new SessionCrypto()

    const replies: ConnectItemReply[] = []

    for (const item of currentlyConnectingApp.value.request.items) {
      if (item.name === 'ton_addr') {
        replies.push(handleTonAddressConnectItem())
      }

      if (item.name === 'ton_proof') {
        replies.push(
          await handleTonProofConnectItem(
            item,
            currentlyConnectingApp.value.manifest,
            password
          )
        )
      }
    }

    const connectEventSuccess: ConnectEventSuccess = {
      event: 'connect',
      id: Date.now(),
      payload: {
        items: replies,
        device: {
          appName: 'TON Wallet',
          appVersion: '0.0.1',
          features: ['SendTransaction'],
          maxProtocolVersion: 2,
          platform: 'browser',
        },
      },
    }

    const message = session.encrypt(
      JSON.stringify(connectEventSuccess),
      Buffer.from(currentlyConnectingApp.value.id, 'hex')
    )

    const stringifiedSession = session.stringifyKeypair()

    const tonConnectSession: TonConnectSession = {
      appClientId: currentlyConnectingApp.value.id,
      appName: currentlyConnectingApp.value.manifest.name,
      appUrl: currentlyConnectingApp.value.manifest.url,
      ownClientId: stringifiedSession.publicKey,
      privateKey: stringifiedSession.secretKey,
    }

    tonConnectSessions.value.push(tonConnectSession)
    await saveSessions()
    reopenSseBridgeConnection()

    await sendBridgeMessage(tonConnectSession, message)

    currentlyConnectingApp.value = undefined
  }

  const handleTonAddressConnectItem = (): TonAddressItemReply => {
    if (
      !activeWalletStore.activeWalletAddress ||
      !activeWalletStore.activeWallet
    ) {
      throw new Error('Cannot handle ton connect item. No active address')
    }

    return {
      name: 'ton_addr',
      address: activeWalletStore.activeWalletAddress.toRawString(),
      network:
        networkStore.currentNetwork === 'mainnet'
          ? CHAIN.MAINNET
          : CHAIN.TESTNET,
      publicKey: activeWalletStore.activeWallet.publicKey.toString('hex'),
      walletStateInit: WalletContractV5R1.create({
        publicKey: activeWalletStore.activeWallet.publicKey,
        workchain: 0,
      })
        .init.data.toBoc({ idx: true, crc32: true })
        .toString('base64'),
    }
  }

  const handleTonProofConnectItem = async (
    tonProofItem: TonProofItem,
    manifest: TonConnectManifest,
    password: string
  ): Promise<Promise<TonProofItemReply>> => {
    if (
      !activeWalletStore.activeWalletAddress ||
      !activeWalletStore.activeWallet
    ) {
      throw new Error('Cannot handle ton connect item. No active address')
    }

    const manifestURL = new URL(manifest.url)
    const domain = manifestURL.hostname
    const domainBuffer = Buffer.from(domain)
    const timestamp = Date.now() / 1000

    const timestampBuffer = new Int64LE(timestamp).toBuffer()

    const domainLengthBuffer = Buffer.allocUnsafe(4)
    domainLengthBuffer.writeInt32LE(domainBuffer.byteLength)

    const addressString = activeWalletStore.activeWalletAddress.toRawString()

    const [addressWorkchain, addressHash] = addressString.split(':')

    const addressWorkchainBuffer = Buffer.allocUnsafe(4)
    addressWorkchainBuffer.writeInt32BE(Number(addressWorkchain))

    const addressBuffer = Buffer.concat([
      addressWorkchainBuffer,
      Buffer.from(addressHash, 'hex'),
    ])

    const messageBuffer = Buffer.concat([
      Buffer.from('ton-proof-item-v2/'),
      addressBuffer,
      domainLengthBuffer,
      domainBuffer,
      timestampBuffer,
      Buffer.from(tonProofItem.payload),
    ])

    const messageHash = await sha256(messageBuffer)

    const bufferToSign = Buffer.concat([
      Buffer.from('ffff', 'hex'),
      Buffer.from('ton-connect', 'utf8'),
      Buffer.from(messageHash),
    ])

    const secretKey = decryptSecretKey(
      activeWalletStore.activeWallet.encryptedSecretKey,
      password
    )

    const signature = nacl.sign.detached(
      Buffer.from(await sha256(bufferToSign)),
      secretKey
    )

    const signatureBase64 = Buffer.from(signature).toString('base64')

    return {
      name: 'ton_proof',
      proof: {
        timestamp,
        domain: {
          lengthBytes: domainBuffer.byteLength,
          value: domain,
        },
        payload: tonProofItem.payload,
        signature: signatureBase64,
      },
    }
  }

  const sendBridgeMessage = async (
    tonConnectSession: TonConnectSession,
    message: Uint8Array
  ) => {
    const url = new URL(`${runtimeConfig.public.bridgeUrl}/message`)

    url.searchParams.set('client_id', tonConnectSession.ownClientId)
    url.searchParams.set('to', tonConnectSession.appClientId)
    url.searchParams.set('ttl', '300')

    const response = await tryCatch(
      fetch(url, {
        method: 'POST',
        body: Buffer.from(message).toString('base64'),
      })
    )

    if (!response.ok) {
      throw new Error('Failed to send message to bridge', {
        cause: response.error,
      })
    }
  }

  const getSessionByAppId = (appId: string) => {
    const session = tonConnectSessions.value.find(
      (item) => item.appClientId === appId
    )

    if (!session) {
      throw new Error('unknown app id')
    }

    const crypto = new SessionCrypto({
      publicKey: session.ownClientId,
      secretKey: session.privateKey,
    })

    return {
      session,
      sessionCrypto: crypto,
    }
  }

  const rejectConnection = () => {
    currentlyConnectingApp.value = undefined
  }

  return {
    currentlyConnectingApp: readonly(currentlyConnectingApp),

    synchronizeTonConnect,

    handleQrCodeUrl,
    acceptConnection,
    rejectConnection,
  }
})

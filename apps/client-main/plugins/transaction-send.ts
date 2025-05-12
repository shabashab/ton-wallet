import type { SendTransactionData } from '~/types/send-transaction-data.type'

export default defineNuxtPlugin((nuxtApp) => {
  let awaitingCallback: ((value: string | undefined) => void) | undefined
  const currentSigningMessage = ref<SendTransactionData>()

  const submitSendResult = (result: string | undefined) => {
    currentSigningMessage.value = undefined

    if (awaitingCallback) {
      awaitingCallback(result)
      awaitingCallback = undefined
    }
  }

  const trySignAndSendTransaction = (
    sendData: SendTransactionData
  ): Promise<string | undefined> => {
    currentSigningMessage.value = sendData

    if (awaitingCallback) {
      throw new Error('Another transaction is already being signed')
    }

    return new Promise<string | undefined>((resolve) => {
      awaitingCallback = (value) => {
        resolve(value)
      }
    })
  }

  const provide: TransactionSendInjection = {
    currentSigningMessage,
    submitSendResult,
    trySignAndSendTransaction,
  }

  nuxtApp.vueApp.provide(transactionSendInjectionSymbol, provide)
})

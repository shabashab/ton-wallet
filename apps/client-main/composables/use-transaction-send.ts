import type { SendTransactionData } from '~/types/send-transaction-data.type'

export interface TransactionSendInjection {
  currentSigningMessage: Ref<SendTransactionData | undefined>
  submitSendResult: (result: string | undefined) => void
  trySignAndSendTransaction: (
    sendData: SendTransactionData
  ) => Promise<string | undefined>
}

export const transactionSendInjectionSymbol = Symbol()

export const useTransactionSend =
  (): TransactionSendInjection['trySignAndSendTransaction'] => {
    const injection = inject<TransactionSendInjection>(
      transactionSendInjectionSymbol
    )

    if (!injection) {
      throw new Error('Failed not inject transaction sending context. Terminal')
    }

    return (...parameters) => injection.trySignAndSendTransaction(...parameters)
  }

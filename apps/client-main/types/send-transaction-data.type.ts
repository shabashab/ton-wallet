import type { MessageRelaxed } from '@ton/core'

export interface SendTransactionData {
  message: MessageRelaxed | MessageRelaxed[]
}

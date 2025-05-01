import { Address } from '@ton/core'
import { z } from 'zod'

export const zTonAddress = z.string().refine(
  (value) => {
    try {
      Address.parse(value)
      return true
    } catch {
      return false
    }
  },
  { message: 'Wallet address should be a valid TON address' }
)

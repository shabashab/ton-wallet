import { pgEnum } from 'drizzle-orm/pg-core'

// This should be kept in sync with NetworkType declared
// in @interfaces/network-type.type.ts
export const networkType = pgEnum('network_type', ['mainnet', 'testnet'])

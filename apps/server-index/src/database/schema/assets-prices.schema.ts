import { Uuid } from '@utils'
import { decimal, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { primaryUuid, timestamps } from './_utils'
import { networkType } from './network-type.enum'

export type AssetPriceId = Uuid<'assets_prices'>

export const assetPriceType = pgEnum('asset_price_type', ['jetton', 'ton'])

export const assetsPrices = pgTable('assets_prices', {
  id: primaryUuid<AssetPriceId>(),

  type: assetPriceType().notNull(),
  contractAddress: text('contract_address'),
  networkType: networkType().notNull(),

  price: decimal().notNull(),

  validUntil: timestamp({
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }).notNull(),

  ...timestamps,
})

export type AssetPriceSelect = typeof assetsPrices.$inferSelect

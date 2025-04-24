import { Uuid } from '@utils'
import { integer, pgTable } from 'drizzle-orm/pg-core'
import { primaryUuid, timestamps } from './_utils'

export type UserId = Uuid<'users'>

export const users = pgTable('users', {
  id: primaryUuid<UserId>(),

  telegramId: integer().notNull(),

  ...timestamps,
})

export type UserSelect = typeof users.$inferSelect

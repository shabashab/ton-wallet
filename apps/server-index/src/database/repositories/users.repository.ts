import { eq } from 'drizzle-orm'
import { defineRepository } from './_utils'
import { UserId, users } from '@database/schema'

export const UsersRepository = defineRepository(async (db) => {
  const findUserByTelegramId = async (telegramId: number) => {
    const user = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
    })

    return user
  }

  const findUserById = async (id: UserId) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    return user
  }

  const createUserByTelegramId = async (telegramId: number) => {
    const [createdUser] = await db
      .insert(users)
      .values({
        telegramId,
      })
      .returning()

    if (!createdUser) {
      throw new Error('Failed to create user')
    }

    return createdUser
  }

  return {
    findUserByTelegramId,
    createUserByTelegramId,
    findUserById,
  }
}, 'UsersRepository')

import { UsersRepository } from '@database/repositories/users.repository'
import { defineProvider } from '@mikrokit/di'

export const UsersService = defineProvider(async (injector) => {
  const usersRepository = await injector.inject(UsersRepository)

  const findOrCreateUserByTelegramId = async (telegramId: number) => {
    const existingUser = await usersRepository.findUserByTelegramId(telegramId)

    if (existingUser) {
      return existingUser
    }

    const createdUser = await usersRepository.createUserByTelegramId(telegramId)

    return createdUser
  }

  return {
    findOrCreateUserByTelegramId,
    findUserById: usersRepository.findUserById,
  }
}, 'UsersService')

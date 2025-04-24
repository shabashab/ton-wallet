import { defineProvider } from '@mikrokit/di'
import { UsersService } from './users.service'
import { UserSelect } from '@database/schema'
import { JwtPayload } from '@interfaces/auth/jwt-payload.interface'
import jwt from 'jsonwebtoken'
import { Config } from '@config'

export const AuthService = defineProvider(async (injector) => {
  const config = await injector.inject(Config)
  const usersService = await injector.inject(UsersService)

  const authenticateUserByTelegramId = async (telegramId: number) => {
    const user = await usersService.findOrCreateUserByTelegramId(telegramId)
    const jwtPayload = createJwtPayloadByUser(user)

    const token = jwt.sign(jwtPayload, config.JWT_SECRET)

    return { token }
  }

  const authenticateUserByToken = async (
    token: string
  ): Promise<UserSelect | undefined> => {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload
      const user = await usersService.findUserById(decoded.sub)

      return user
    } catch {
      return
    }
  }

  const createJwtPayloadByUser = (user: UserSelect): JwtPayload => {
    return {
      sub: user.id,
    }
  }

  return {
    authenticateUserByTelegramId,
    authenticateUserByToken,
  }
}, 'AuthService')

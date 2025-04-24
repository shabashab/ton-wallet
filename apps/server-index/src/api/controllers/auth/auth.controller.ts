import { TelegramService } from '@services/telegram.service'
import { defineController } from '../_utils'

import { iamResponseDto } from './defs/get-iam.def'
import { loginRequestSchema, loginResponseDto } from './defs/login.def'

import { AuthService } from '@services/auth.service'
import { BadRequestException } from '@api/exceptions/bad-request.exception'

export const AuthController = defineController('/auth', async (r, injector) => {
  const telegramService = await injector.inject(TelegramService)
  const authService = await injector.inject(AuthService)

  r.auth.get(
    '/iam',
    {
      docs: {
        tags: ['auth'],
        summary: 'Get current user',
      },
      response: iamResponseDto.schema,
    },
    async (request) => {
      return iamResponseDto(request.user)
    }
  )

  r.public.post(
    '/login',
    {
      docs: {
        tags: ['auth'],
        description: 'Authenticate user by telegram init data',
      },
      request: {
        body: loginRequestSchema,
      },
      response: loginResponseDto.schema,
    },
    async ({ body }) => {
      const initData = telegramService.validateTelegramWebAppInitDataOrThrow(
        body.initData
      )

      if (!initData.user?.id) {
        throw new BadRequestException('init_data_shoud_contain_user_id')
      }

      const { token } = await authService.authenticateUserByTelegramId(
        initData.user.id
      )

      return loginResponseDto(token)
    }
  )
})

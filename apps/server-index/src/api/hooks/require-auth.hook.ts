/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineProvider } from '@mikrokit/di'
import { onRequestMetaHookHandler } from 'fastify/types/hooks'
import { UnauthorizedException } from '../exceptions/unauthorized.exception'

import { asUuid } from '@utils'
import { AuthService } from '@services/auth.service'

type RequireAuthMiddlewareFactory = () => onRequestMetaHookHandler

export const RequireAuthHook = defineProvider<RequireAuthMiddlewareFactory>(
  async (injector) => {
    const authService = await injector.inject(AuthService)

    return () => async (request, reply) => {
      const authHeader = request.headers.authorization

      if (!authHeader) {
        throw new UnauthorizedException('no_auth_header_provided')
      }

      const authHeaderParts = authHeader.split(' ')

      if (authHeaderParts.length !== 2) {
        throw new UnauthorizedException('invalid_auth_header')
      }

      if (authHeaderParts[0] !== 'Bearer') {
        throw new UnauthorizedException('invalid_auth_scheme')
      }

      const token = authHeaderParts[1]

      if (!token) {
        throw new UnauthorizedException('no_token_provided')
      }

      const authenticatedUser = await authService.authenticateUserByToken(token)

      if (!authenticatedUser) {
        throw new UnauthorizedException('invalid_token')
      }

      request.user = authenticatedUser
    }
  }
)

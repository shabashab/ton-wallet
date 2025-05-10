import 'zod-openapi/extend'
import { defineProvider } from '@mikrokit/di'
import Fastify from 'fastify'

import { Logger } from '@core/logger'
import { Controller } from './controllers/_utils'

import { ZodSchemaCompiler } from './core/zod.schema-compiler'
import { ZodSerializerCompiler } from './core/zod.serializer-compiler'
import { HttpExceptionErrorHandler } from './core/http-exception.error-handler'
import { SwaggerPlugin } from './plugins/swagger.plugin'

import { UserSelect } from '@database/schema'
import { Config } from '@config'

import cors from '@fastify/cors'

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserSelect | null
  }
}

export const Server = defineProvider(async (injector) => {
  const config = await injector.inject(Config)

  const logger = await injector.inject(Logger)

  const zodSchemaCompiler = await injector.inject(ZodSchemaCompiler)
  const zodSerializerCompiler = await injector.inject(ZodSerializerCompiler)
  const httpExceptionErrorHandler = await injector.inject(
    HttpExceptionErrorHandler
  )

  const swaggerPlugin = await injector.inject(SwaggerPlugin)

  const controllers = await injector.inject(Controller)

  const fastify = await Fastify({
    loggerInstance: logger,
  })

  fastify.register(cors, {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })

  fastify.setValidatorCompiler(zodSchemaCompiler)
  fastify.setSerializerCompiler(zodSerializerCompiler)
  fastify.setErrorHandler(httpExceptionErrorHandler)

  if (config.ENABLE_SWAGGER) {
    await fastify.register(swaggerPlugin)

    logger.info(
      `Documentation is available at http://localhost:${config.PORT}/documentation`
    )
  }

  for (const controller of controllers) {
    await fastify.register(controller.plugin, { prefix: controller.prefix })
  }

  await fastify.ready()

  return fastify
})

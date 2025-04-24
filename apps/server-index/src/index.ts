import { createContainer } from '@mikrokit/di'

import { Server } from './api/server'
import { Logger } from '@core/logger'
import { Config } from '@config'

import { apiModule } from './api'
import { coreModule } from '@core'
import { servicesModule } from './services'
import { databaseModule } from './database'

import { seedDatabase } from '@database/seeder'

const container = createContainer()
  .import(coreModule)
  .import(databaseModule)
  .import(servicesModule)
  .import(apiModule)

  .provide(Config)

const bootstrap = async () => {
  if (process.argv.includes('--seed')) {
    await seedDatabase(
      container,
      process.env['NODE_ENV'] === 'production' ? 'production' : 'development'
    )
    process.exitCode = 0
    return
  }

  const logger = await container.inject(Logger)

  logger.info('Starting server...')

  const server = await container.inject(Server)
  const config = await container.inject(Config)

  await server.listen({
    port: config.PORT,
    host: '0.0.0.0',
  })
}

void bootstrap()

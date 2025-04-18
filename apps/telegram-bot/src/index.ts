import { createContainer } from '@mikrokit/di'

import { Config } from '@config'

import { coreModule } from '@core'
import { telegramModule } from './telegram'
import { TelegramBot } from './telegram/bot'

const container = createContainer()
  .import(coreModule)
  .import(telegramModule)
  .provide(Config)

const bootstrap = async () => {
  const bot = await container.inject(TelegramBot)

  await bot.start()
}

void bootstrap()

import { createModule } from '@mikrokit/di'
import { TelegramBot } from './bot'
import { handlersModule } from './handlers'

export const telegramModule = createModule()
  .import(handlersModule)
  .provide(TelegramBot)

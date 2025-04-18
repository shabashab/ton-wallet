import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'
import { Bot } from 'grammy'
import { telegramHandlerConfiguratorToken } from './handlers/_utils'

export const TelegramBot = defineProvider(async (injector) => {
  const config = await injector.inject(Config)
  const handlerConfigurators = await injector.inject(
    telegramHandlerConfiguratorToken
  )

  const bot = new Bot(config.TELEGRAM_BOT_TOKEN, {
    client: {
      environment:
        config.TELEGRAM_ENVIRONMENT === 'development' ? 'test' : 'prod',
    },
  })

  for (const configurator of handlerConfigurators) {
    await configurator(bot)
  }

  return bot
}, 'TelegramBot')

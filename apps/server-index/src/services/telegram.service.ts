import { BadRequestException } from '@api/exceptions/bad-request.exception'
import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'
import { parse, validate } from '@telegram-apps/init-data-node'

export const TelegramService = defineProvider(async (injector) => {
  const config = await injector.inject(Config)

  const validateTelegramWebAppInitDataOrThrow = (initData: string) => {
    try {
      validate(initData, config.TELEGRAM_BOT_TOKEN)

      return parse(initData)
    } catch {
      throw new BadRequestException('invalid_telegram_init_data')
    }
  }

  return {
    validateTelegramWebAppInitDataOrThrow,
  }
}, 'TelegramService')

import { Config } from '@config'
import { defineTelegramHandler } from './_utils'
import { Bot } from 'grammy'

export const StartTelegramHandler = defineTelegramHandler(async (injector) => {
  const config = await injector.inject(Config)

  return (bot: Bot) => {
    bot.command('start', async (context) => {
      await context.reply(
        'Hello! In order to open TON Wallet, please click the button below.',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Open TON Wallet',
                  web_app: {
                    url: config.TELEGRAM_MINI_APP_URL,
                  },
                },
              ],
            ],
          },
        }
      )
    })
  }
})
